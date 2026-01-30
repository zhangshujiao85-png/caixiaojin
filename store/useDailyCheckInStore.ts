import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DailyQuote, getTodayQuote } from "@/data/dailyQuotes";

export interface CheckInRecord {
  date: string; // ISO date string (YYYY-MM-DD)
  points: number;
  streak: number;
}

interface DailyCheckInState {
  // 签到状态
  lastCheckInDate: string | null;        // 最后签到日期 (YYYY-MM-DD)
  checkInStreak: number;                 // 连续签到天数
  totalCheckInDays: number;              // 总签到天数
  checkInHistory: CheckInRecord[];       // 签到历史记录

  // 句子收藏
  favoriteQuotes: string[];              // 收藏的句子ID列表

  // Actions
  checkIn: () => { success: boolean; points: number; streak: number };
  toggleFavorite: (quoteId: string) => void;
  isFavorite: (quoteId: string) => boolean;
  getTodayQuote: () => DailyQuote;
  hasCheckedToday: () => boolean;
  resetDaily: () => void;
}

const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const calculateStreak = (history: CheckInRecord[]): number => {
  if (history.length === 0) return 0;

  // 按日期排序（从新到旧）
  const sortedHistory = [...history].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // 检查最新记录是否是昨天或今天
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const latestDate = new Date(sortedHistory[0].date);
  const todayStr = getTodayDateString();
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  const yesterdayStr = `${year}-${month}-${day}`;

  // 如果最新记录不是昨天或今天，连续天数重置
  if (sortedHistory[0].date !== todayStr && sortedHistory[0].date !== yesterdayStr) {
    return 0;
  }

  // 计算连续天数
  let streak = 0;
  let checkDate = new Date(today);

  for (let i = 0; i < sortedHistory.length; i++) {
    const checkYear = checkDate.getFullYear();
    const checkMonth = String(checkDate.getMonth() + 1).padStart(2, '0');
    const checkDay = String(checkDate.getDate()).padStart(2, '0');
    const dateStr = `${checkYear}-${checkMonth}-${checkDay}`;
    const hasChecked = sortedHistory.some(record => record.date === dateStr);

    if (hasChecked) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

export const useDailyCheckInStore = create<DailyCheckInState>()(
  persist(
    (set, get) => ({
      // 初始状态
      lastCheckInDate: null,
      checkInStreak: 0,
      totalCheckInDays: 0,
      checkInHistory: [],
      favoriteQuotes: [],

      // 执行签到
      checkIn: () => {
        const state = get();
        const todayStr = getTodayDateString();

        // 检查今天是否已签到
        if (state.lastCheckInDate === todayStr) {
          return {
            success: false,
            points: 0,
            streak: state.checkInStreak,
          };
        }

        // 计算新的连续签到天数
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yYear = yesterday.getFullYear();
        const yMonth = String(yesterday.getMonth() + 1).padStart(2, '0');
        const yDay = String(yesterday.getDate()).padStart(2, '0');
        const yesterdayStr = `${yYear}-${yMonth}-${yDay}`;

        let newStreak = state.checkInStreak;
        if (state.lastCheckInDate !== yesterdayStr && state.lastCheckInDate !== todayStr) {
          // 如果昨天没有签到，连续天数重置为1
          newStreak = 1;
        } else {
          // 否则连续天数+1
          newStreak = state.checkInStreak + 1;
        }

        // 计算积分奖励（基础10分 + 连续奖励每天+2分）
        const points = 10 + (newStreak - 1) * 2;

        // 创建签到记录
        const newRecord: CheckInRecord = {
          date: todayStr,
          points,
          streak: newStreak,
        };

        // 更新状态
        set({
          lastCheckInDate: todayStr,
          checkInStreak: newStreak,
          totalCheckInDays: state.totalCheckInDays + 1,
          checkInHistory: [...state.checkInHistory, newRecord],
        });

        return {
          success: true,
          points,
          streak: newStreak,
        };
      },

      // 切换收藏状态
      toggleFavorite: (quoteId: string) => {
        const state = get();
        const favorites = state.favoriteQuotes.includes(quoteId)
          ? state.favoriteQuotes.filter((id) => id !== quoteId)
          : [...state.favoriteQuotes, quoteId];
        set({ favoriteQuotes: favorites });
      },

      // 检查是否已收藏
      isFavorite: (quoteId: string) => {
        return get().favoriteQuotes.includes(quoteId);
      },

      // 获取今日一句
      getTodayQuote: () => {
        return getTodayQuote();
      },

      // 检查今天是否已签到
      hasCheckedToday: () => {
        const state = get();
        const todayStr = getTodayDateString();
        return state.lastCheckInDate === todayStr;
      },

      // 重置每日状态（可选，用于测试或特殊场景）
      resetDaily: () => {
        // 这个方法暂不实现，因为签到状态不需要每日重置
        // 如果需要重置整个store，可以清除localStorage
      },
    }),
    {
      name: "daily-checkin-storage",
    }
  )
);
