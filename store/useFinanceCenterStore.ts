import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ExpenseEntry {
  id: string;
  date: string;
  amount: number;
  category: string;
  note?: string;
}

export interface SavingExperiment {
  itemId: string;
  frequency: number;
}

export interface SavingItemSettings {
  itemId: string;
  price: number;
  frequencyMultiplier: number;
}

export interface CustomSavingItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  frequencyMultiplier: number;
}

export interface InvestmentSettings {
  monthlyAmount: number;
  years: number;
  expectedReturn: number;
}

interface FinanceCenterState {
  // Expense entries
  entries: ExpenseEntry[];
  customCategories: string[];

  // Saving experiments
  savingExperiments: SavingExperiment[];
  savingItemSettings: SavingItemSettings[];
  customSavingItems: CustomSavingItem[];

  // Investment settings
  investmentSettings: InvestmentSettings;

  // UI state
  showInvestmentView: boolean;

  // Actions
  addEntry: (entry: Omit<ExpenseEntry, 'id' | 'date'>) => void;
  deleteEntry: (id: string) => void;
  addCustomCategory: (category: string) => void;
  getTotalAmount: () => number;
  getCategoryTotal: (category: string) => number;

  // Saving experiments actions
  updateSavingExperiment: (itemId: string, frequency: number) => void;
  updateSavingItemSettings: (settings: SavingItemSettings) => void;
  getSavingItemSettings: (itemId: string) => SavingItemSettings | null;
  getTotalMonthlySavings: () => number;

  // Custom saving items actions
  addCustomSavingItem: (item: Omit<CustomSavingItem, 'id'>) => void;
  deleteCustomSavingItem: (id: string) => void;
  updateCustomSavingItem: (id: string, item: Partial<Omit<CustomSavingItem, 'id'>>) => void;

  // Investment actions
  updateInvestmentSettings: (settings: Partial<InvestmentSettings>) => void;
  calculateCompoundInterest: () => CompoundInterestResult;
  toggleInvestmentView: () => void;

  // Sync action
  syncSavingsToInvestment: () => void;
}

export interface CompoundInterestResult {
  monthlyAmount: number;
  years: number;
  expectedReturn: number;
  totalPrincipal: number;
  totalReturn: number;
  totalAmount: number;
  yearlyData: Array<{
    year: number;
    principal: number;
    return: number;
    total: number;
  }>;
}

function calculateCompoundInterest(
  monthlyAmount: number,
  years: number,
  expectedReturn: number
): CompoundInterestResult {
  const monthlyRate = expectedReturn / 12 / 100;
  const totalMonths = years * 12;

  // 定投复利公式: FV = PMT × [(1+r)^n - 1]/r × (1+r)
  const futureValue =
    monthlyAmount *
    ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
    (1 + monthlyRate);

  const totalPrincipal = monthlyAmount * totalMonths;
  const totalReturn = futureValue - totalPrincipal;
  const totalAmount = futureValue;

  // 计算年度数据
  const yearlyData: CompoundInterestResult['yearlyData'] = [];
  for (let year = 1; year <= years; year++) {
    const months = year * 12;
    const yearFutureValue =
      monthlyAmount *
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
      (1 + monthlyRate);
    const yearPrincipal = monthlyAmount * months;

    yearlyData.push({
      year,
      principal: yearPrincipal,
      return: yearFutureValue - yearPrincipal,
      total: yearFutureValue,
    });
  }

  return {
    monthlyAmount,
    years,
    expectedReturn,
    totalPrincipal,
    totalReturn,
    totalAmount,
    yearlyData,
  };
}

export const useFinanceCenterStore = create<FinanceCenterState>()(
  persist(
    (set, get) => ({
      // Initial state
      entries: [],
      customCategories: [],
      savingExperiments: [],
      savingItemSettings: [],
      customSavingItems: [],
      investmentSettings: {
        monthlyAmount: 1000,
        years: 5,
        expectedReturn: 5,
      },
      showInvestmentView: false,

      // Entry actions
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
        return get()
          .entries.filter((entry) => entry.category === category)
          .reduce((sum, entry) => sum + entry.amount, 0);
      },

      // Saving experiments actions
      updateSavingExperiment: (itemId, frequency) => {
        set((state) => {
          const existing = state.savingExperiments.find((e) => e.itemId === itemId);
          if (existing) {
            return {
              savingExperiments: state.savingExperiments.map((e) =>
                e.itemId === itemId ? { itemId, frequency } : e
              ),
            };
          }
          return {
            savingExperiments: [...state.savingExperiments, { itemId, frequency }],
          };
        });
      },

      updateSavingItemSettings: (settings) => {
        set((state) => {
          const existing = state.savingItemSettings.find((s) => s.itemId === settings.itemId);
          if (existing) {
            return {
              savingItemSettings: state.savingItemSettings.map((s) =>
                s.itemId === settings.itemId ? settings : s
              ),
            };
          }
          return {
            savingItemSettings: [...state.savingItemSettings, settings],
          };
        });
      },

      getSavingItemSettings: (itemId) => {
        const settings = get().savingItemSettings.find((s) => s.itemId === itemId);
        return settings || null;
      },

      getTotalMonthlySavings: () => {
        const experiments = get().savingExperiments;
        const customSettings = get().savingItemSettings;
        const customItems = get().customSavingItems;

        // Default item settings
        const defaultItems: Record<
          string,
          { price: number; frequencyMultiplier: number }
        > = {
          milktea: { price: 17, frequencyMultiplier: 30 },
          takeout: { price: 20, frequencyMultiplier: 4 },
          shopping: { price: 100, frequencyMultiplier: 1 },
          taxi: { price: 26, frequencyMultiplier: 4 },
          game: { price: 70, frequencyMultiplier: 1 },
        };

        let monthlySavings = 0;
        experiments.forEach((exp) => {
          // Check if it's a custom item
          const customItem = customItems.find((item) => item.id === exp.itemId);
          if (customItem && exp.frequency > 0) {
            monthlySavings += customItem.price * exp.frequency * customItem.frequencyMultiplier;
            return;
          }

          // Use custom settings if available, otherwise use defaults
          const customSetting = customSettings.find((s) => s.itemId === exp.itemId);
          const item = customSetting || defaultItems[exp.itemId];

          if (item && exp.frequency > 0) {
            monthlySavings += item.price * exp.frequency * item.frequencyMultiplier;
          }
        });

        return monthlySavings;
      },

      // Custom saving items actions
      addCustomSavingItem: (item) => {
        const newItem: CustomSavingItem = {
          ...item,
          id: `custom-${Date.now()}`,
        };
        set((state) => ({
          customSavingItems: [...state.customSavingItems, newItem],
        }));
      },

      deleteCustomSavingItem: (id) => {
        set((state) => ({
          customSavingItems: state.customSavingItems.filter((item) => item.id !== id),
          savingExperiments: state.savingExperiments.filter((exp) => exp.itemId !== id),
        }));
      },

      updateCustomSavingItem: (id, updates) => {
        set((state) => ({
          customSavingItems: state.customSavingItems.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },

      // Investment actions
      updateInvestmentSettings: (settings) => {
        set((state) => ({
          investmentSettings: { ...state.investmentSettings, ...settings },
        }));
      },

      calculateCompoundInterest: () => {
        const { investmentSettings } = get();
        return calculateCompoundInterest(
          investmentSettings.monthlyAmount,
          investmentSettings.years,
          investmentSettings.expectedReturn
        );
      },

      toggleInvestmentView: () => {
        set((state) => ({
          showInvestmentView: !state.showInvestmentView,
        }));
      },

      // Sync action
      syncSavingsToInvestment: () => {
        const monthlySavings = get().getTotalMonthlySavings();
        if (monthlySavings > 0) {
          set((state) => ({
            investmentSettings: {
              ...state.investmentSettings,
              monthlyAmount: Math.round(monthlySavings),
            },
          }));
        }
      },
    }),
    {
      name: 'finance-center-storage',
    }
  )
);
