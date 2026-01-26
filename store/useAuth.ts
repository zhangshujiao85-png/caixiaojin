import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  level: number;
  joinDate: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });

        try {
          // 模拟API调用
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // 模拟验证逻辑
          const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
          const user = storedUsers.find((u: any) => u.email === email && u.password === password);

          if (user) {
            const { password: _, ...userWithoutPassword } = user;
            set({
              user: userWithoutPassword,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          }

          set({ isLoading: false });
          return false;
        } catch (error) {
          set({ isLoading: false });
          return false;
        }
      },

      register: async (username: string, email: string, password: string) => {
        set({ isLoading: true });

        try {
          // 模拟API调用
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // 检查邮箱是否已存在
          const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
          const existingUser = storedUsers.find((u: any) => u.email === email);

          if (existingUser) {
            set({ isLoading: false });
            return false;
          }

          // 创建新用户
          const newUser = {
            id: Date.now().toString(),
            username,
            email,
            password,
            avatar: null,
            level: 1,
            joinDate: new Date().toISOString(),
          };

          storedUsers.push(newUser);
          localStorage.setItem("users", JSON.stringify(storedUsers));

          const { password: _, ...userWithoutPassword } = newUser;
          set({
            user: userWithoutPassword,
            isAuthenticated: true,
            isLoading: false,
          });

          return true;
        } catch (error) {
          set({ isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      updateProfile: (data: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
