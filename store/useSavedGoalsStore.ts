import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SavedGoal {
  id: string;
  name: string;
  targetAmount: number;
  years: number;
  monthlyInvestment: number;
  createdAt: string;
  category?: 'travel' | 'education' | 'housing' | 'emergency' | 'freedom' | 'custom' | 'lifestyle';
}

interface SavedGoalsState {
  savedGoals: SavedGoal[];
  addGoal: (goal: Omit<SavedGoal, 'id' | 'createdAt'>) => void;
  deleteGoal: (id: string) => void;
  getGoalById: (id: string) => SavedGoal | undefined;
  clearAllGoals: () => void;
}

export const useSavedGoalsStore = create<SavedGoalsState>()(
  persist(
    (set, get) => ({
      savedGoals: [],

      addGoal: (goal) => {
        const newGoal: SavedGoal = {
          ...goal,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          savedGoals: [...state.savedGoals, newGoal],
        }));
      },

      deleteGoal: (id) => {
        set((state) => ({
          savedGoals: state.savedGoals.filter((goal) => goal.id !== id),
        }));
      },

      getGoalById: (id) => {
        return get().savedGoals.find((goal) => goal.id === id);
      },

      clearAllGoals: () => {
        set({ savedGoals: [] });
      },
    }),
    {
      name: 'saved-goals-storage',
    }
  )
);
