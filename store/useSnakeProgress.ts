import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SnakeVariant, getRandomSnakeVariant } from '@/constants/snakeVariants';

export interface Snake {
  id: string; // Unique snake ID
  name: string; // Snake name
  variant: string; // Variant ID
  variantName: string; // Variant display name
  segments: number; // Current segments (length)
  maxSegments: number; // Max length
  createdAt: string; // Creation time
  completedAt?: string; // Completion time
  emoji: string; // Emoji representation
  theme: 'daily' | 'festival'; // Theme
  festival?: string; // Festival name if applicable
  rarity: 'common' | 'rare' | 'epic' | 'legendary'; // Rarity
}

export interface SnakeProgress {
  currentSnake: Snake | null; // Currently raising snake
  snakeCollection: Snake[]; // Completed snakes collection
  loginStreak: number; // Consecutive login days
  lastLoginDate: string; // Last login date (YYYY-MM-DD)
  weekNumber: number; // Current week number
  canReset: boolean; // Can reset this week
  lastResetWeek: number; // Last reset week number
  showLoginReward: boolean; // Whether to show login reward modal
  unlockedVariants: string[]; // Unlocked snake variant IDs
  totalSnakesRaised: number; // Total number of snakes raised
}

interface SnakeStore extends SnakeProgress {
  // Actions
  initializeSnake: () => void;
  growSnake: (reason: 'login' | 'study' | 'checkin') => boolean;
  completeSnake: () => void;
  resetSnake: (variantId?: string) => void;
  checkLogin: () => boolean; // Returns true if new login
  updateLoginStreak: () => void;
  checkWeekReset: () => boolean;
  dismissLoginReward: () => void;
  unlockVariant: (variantId: string) => void;
  getWeekNumber: (date?: Date) => number;
}

const MAX_SEGMENTS = 30; // Maximum snake length
const INITIAL_SEGMENTS = 3; // Starting length

// Generate unique ID
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Get week number from date
const getWeekNumberFromDate = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

// Create new snake
const createNewSnake = (variantId?: string): Snake => {
  const variant = variantId
    ? (require('@/constants/snakeVariants').SNAKE_VARIANTS as SnakeVariant[]).find(v => v.id === variantId)
    : getRandomSnakeVariant();

  if (!variant) {
    throw new Error('Snake variant not found');
  }

  return {
    id: generateId(),
    name: variant.name,
    variant: variant.id,
    variantName: variant.name,
    segments: INITIAL_SEGMENTS,
    maxSegments: MAX_SEGMENTS,
    createdAt: new Date().toISOString(),
    emoji: variant.emoji,
    theme: variant.theme,
    festival: variant.festival,
    rarity: variant.rarity,
  };
};

export const useSnakeProgress = create<SnakeStore>()(
  persist(
    (set, get) => ({
      currentSnake: null,
      snakeCollection: [],
      loginStreak: 0,
      lastLoginDate: '',
      weekNumber: getWeekNumberFromDate(new Date()),
      canReset: false,
      lastResetWeek: getWeekNumberFromDate(new Date()),
      showLoginReward: false,
      unlockedVariants: [],
      totalSnakesRaised: 0,

      initializeSnake: () => {
        const state = get();
        if (!state.currentSnake) {
          const newSnake = createNewSnake();
          set({ currentSnake: newSnake });
        }
      },

      growSnake: (reason: 'login' | 'study' | 'checkin') => {
        const state = get();
        const snake = state.currentSnake;

        if (!snake) {
          return false;
        }

        if (snake.segments >= snake.maxSegments) {
          // Snake already completed
          return false;
        }

        // Determine growth amount based on reason
        let growth = 1;
        if (reason === 'study') {
          growth = Math.floor(Math.random() * 3) + 1; // 1-3 segments
        } else if (reason === 'checkin' && state.loginStreak > 0) {
          // Bonus for consecutive check-ins
          growth = 1 + Math.min(Math.floor(state.loginStreak / 3), 2);
        }

        const newSegments = Math.min(snake.segments + growth, snake.maxSegments);
        const isComplete = newSegments >= snake.maxSegments;

        const updatedSnake: Snake = {
          ...snake,
          segments: newSegments,
          ...(isComplete ? { completedAt: new Date().toISOString() } : {}),
        };

        set({ currentSnake: updatedSnake });

        // If complete, move to collection
        if (isComplete) {
          const collection = [...state.snakeCollection, updatedSnake];
          set({
            snakeCollection: collection,
            currentSnake: null,
            totalSnakesRaised: state.totalSnakesRaised + 1,
          });
        }

        return true;
      },

      completeSnake: () => {
        const state = get();
        const snake = state.currentSnake;

        if (!snake || snake.segments >= snake.maxSegments) {
          return;
        }

        const completedSnake: Snake = {
          ...snake,
          segments: snake.maxSegments,
          completedAt: new Date().toISOString(),
        };

        set({
          snakeCollection: [...state.snakeCollection, completedSnake],
          currentSnake: null,
          totalSnakesRaised: state.totalSnakesRaised + 1,
        });
      },

      resetSnake: (variantId?: string) => {
        const state = get();
        const currentWeek = getWeekNumberFromDate(new Date());

        const newSnake = createNewSnake(variantId);

        set({
          currentSnake: newSnake,
          lastResetWeek: currentWeek,
          canReset: false,
          showLoginReward: false,
        });
      },

      checkLogin: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        const isNewLogin = state.lastLoginDate !== today;

        if (isNewLogin) {
          set({ lastLoginDate: today, showLoginReward: true });
        }

        return isNewLogin;
      },

      updateLoginStreak: () => {
        const state = get();
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        const todayStr = today.toISOString().split('T')[0];

        if (state.lastLoginDate === todayStr) {
          // Already logged in today
          return;
        }

        if (state.lastLoginDate === yesterdayStr) {
          // Consecutive day
          set({ loginStreak: state.loginStreak + 1 });
        } else if (state.lastLoginDate !== todayStr) {
          // Streak broken or first login
          set({ loginStreak: 1 });
        }

        set({ lastLoginDate: todayStr });
      },

      checkWeekReset: () => {
        const state = get();
        const currentWeek = getWeekNumberFromDate(new Date());

        // Allow reset if it's been a week since last reset
        if (currentWeek > state.lastResetWeek) {
          set({ canReset: true });
          return true;
        }

        return false;
      },

      dismissLoginReward: () => {
        set({ showLoginReward: false });
      },

      unlockVariant: (variantId: string) => {
        const state = get();
        if (!state.unlockedVariants.includes(variantId)) {
          set({ unlockedVariants: [...state.unlockedVariants, variantId] });
        }
      },

      getWeekNumber: (date: Date = new Date()) => {
        return getWeekNumberFromDate(date);
      },
    }),
    {
      name: 'snake-progress-storage',
    }
  )
);
