import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TreeHoleEntry {
  id: string;
  date: string;
  content: string;
  mood: "relief" | "sad" | "hopeful" | "confused";
  category: 'investment-failure' | 'anxiety' | 'other';
}

interface TreeHoleState {
  entries: TreeHoleEntry[];
  addEntry: (entry: Omit<TreeHoleEntry, 'id' | 'date'>) => void;
  deleteEntry: (id: string) => void;
  getEntriesByCategory: (category: TreeHoleEntry['category']) => TreeHoleEntry[];
}

export const useTreeHoleStore = create<TreeHoleState>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (entry) => {
        const newEntry: TreeHoleEntry = {
          ...entry,
          id: Date.now().toString(),
          date: new Date().toISOString(),
        };
        set((state) => ({
          entries: [newEntry, ...state.entries],
        }));
      },

      deleteEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        }));
      },

      getEntriesByCategory: (category) => {
        return get().entries.filter((entry) => entry.category === category);
      },
    }),
    {
      name: 'tree-hole-storage',
    }
  )
);
