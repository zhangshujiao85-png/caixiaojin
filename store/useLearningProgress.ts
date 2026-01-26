import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LearningAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

export interface LearningStats {
  totalPoints: number;
  level: number;
  todayPoints: number;
  completedArticles: string[];
  skills: string[];
  achievements: LearningAchievement[];
  currentLevelProgress: number; // 0-100
  favoriteArticles: string[]; // 收藏的文章ID
}

interface LearningStore extends LearningStats {
  addPoints: (points: number, skill: string) => void;
  completeArticle: (articleId: string, points: number, skill: string) => void;
  resetDaily: () => void;
  toggleFavorite: (articleId: string) => void;
}

const LEVEL_THRESHOLDS = [0, 50, 150, 300, 500, 800, 1200, 1700, 2300, 3000];

const getLevelFromPoints = (points: number): number => {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (points >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
};

const getLevelProgress = (points: number): number => {
  const level = getLevelFromPoints(points);
  const currentLevelMin = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextLevelMin = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const range = nextLevelMin - currentLevelMin;
  const progress = points - currentLevelMin;
  return Math.min(100, Math.max(0, (progress / range) * 100));
};

export const useLearningProgress = create<LearningStore>()(
  persist(
    (set, get) => ({
      totalPoints: 0,
      level: 1,
      todayPoints: 0,
      completedArticles: [],
      skills: [],
      achievements: [
        { id: "first_learn", title: "初学者", description: "完成第一篇学习", icon: "🌱" },
        { id: "streak_3", title: "学习达人", description: "连续学习3天", icon: "🔥" },
        { id: "points_100", title: "积分先锋", description: "获得100积分", icon: "⭐" },
        { id: "level_3", title: "理财新手", description: "达到3级", icon: "💰" },
      ],
      currentLevelProgress: 0,
      favoriteArticles: [],

      addPoints: (points: number, skill: string) => {
        const state = get();
        const newPoints = state.totalPoints + points;
        const newTodayPoints = state.todayPoints + points;
        const newLevel = getLevelFromPoints(newPoints);
        const levelProgress = getLevelProgress(newPoints);

        const newSkills = [...new Set([...state.skills, skill])];

        set({
          totalPoints: newPoints,
          todayPoints: newTodayPoints,
          level: newLevel,
          currentLevelProgress: levelProgress,
          skills: newSkills,
        });
      },

      completeArticle: (articleId: string, points: number, skill: string) => {
        const state = get();
        if (state.completedArticles.includes(articleId)) return;

        const newCompleted = [...state.completedArticles, articleId];
        const newPoints = state.totalPoints + points;
        const newTodayPoints = state.todayPoints + points;
        const newLevel = getLevelFromPoints(newPoints);
        const levelProgress = getLevelProgress(newPoints);
        const newSkills = [...new Set([...state.skills, skill])];

        // 检查成就
        const achievements = state.achievements.map((a) => {
          if (a.id === "first_learn" && newCompleted.length === 1 && !a.unlockedAt) {
            return { ...a, unlockedAt: new Date() };
          }
          if (a.id === "points_100" && newPoints >= 100 && !a.unlockedAt) {
            return { ...a, unlockedAt: new Date() };
          }
          if (a.id === "level_3" && newLevel >= 3 && !a.unlockedAt) {
            return { ...a, unlockedAt: new Date() };
          }
          return a;
        });

        set({
          totalPoints: newPoints,
          todayPoints: newTodayPoints,
          level: newLevel,
          currentLevelProgress: levelProgress,
          completedArticles: newCompleted,
          skills: newSkills,
          achievements,
        });
      },

      resetDaily: () => {
        set({ todayPoints: 0 });
      },

      toggleFavorite: (articleId: string) => {
        const state = get();
        const favorites = state.favoriteArticles.includes(articleId)
          ? state.favoriteArticles.filter((id) => id !== articleId)
          : [...state.favoriteArticles, articleId];
        set({ favoriteArticles: favorites });
      },
    }),
    {
      name: "learning-progress-storage",
    }
  )
);
