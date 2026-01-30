import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface EmotionalEntry {
  id: string;
  date: string;
  anxietyLevel: number;
  marketTrend: 'up' | 'down' | 'flat';
  feeling: string;
  action: string;
  mood: "anxious" | "calm" | "hopeful" | "regretful";
}

interface EmotionalLedgerState {
  entries: EmotionalEntry[];
  addEntry: (entry: Omit<EmotionalEntry, 'id' | 'date'>) => void;
  deleteEntry: (id: string) => void;
  getAllEntries: () => EmotionalEntry[];
  getAverageAnxiety: () => number;
}

export const useEmotionalLedgerStore = create<EmotionalLedgerState>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (entry) => {
        const newEntry: EmotionalEntry = {
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

      getAllEntries: () => {
        return get().entries;
      },

      getAverageAnxiety: () => {
        const entries = get().entries;
        if (entries.length === 0) return 0;
        const sum = entries.reduce((acc, entry) => acc + entry.anxietyLevel, 0);
        return Math.round(sum / entries.length);
      },
    }),
    {
      name: 'emotional-ledger-storage',
    }
  )
);
