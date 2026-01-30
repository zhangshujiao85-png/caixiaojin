import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ExpenseEntry {
  id: string;
  date: string;
  amount: number;
  category: string;
  note?: string;
}

interface ExpenseTrackerState {
  entries: ExpenseEntry[];
  customCategories: string[];
  addEntry: (entry: Omit<ExpenseEntry, 'id' | 'date'>) => void;
  deleteEntry: (id: string) => void;
  addCustomCategory: (category: string) => void;
  getTotalAmount: () => number;
  getCategoryTotal: (category: string) => number;
}

export const useExpenseTrackerStore = create<ExpenseTrackerState>()(
  persist(
    (set, get) => ({
      entries: [],
      customCategories: [],

      addEntry: (entry) => {
        const newEntry: ExpenseEntry = {
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

      addCustomCategory: (category) => {
        set((state) => ({
          customCategories: [...state.customCategories, category],
        }));
      },

      getTotalAmount: () => {
        return get().entries.reduce((sum, entry) => sum + entry.amount, 0);
      },

      getCategoryTotal: (category) => {
        return get().entries
          .filter((entry) => entry.category === category)
          .reduce((sum, entry) => sum + entry.amount, 0);
      },
    }),
    {
      name: 'expense-tracker-storage',
    }
  )
);
