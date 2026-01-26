import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  FundManager,
  UserRating,
  RatingHistory,
  FundProductType,
  SortByType,
} from "@/types/fundManager";
import { mockFundManagers } from "@/constants/fundManagers";

interface FundManagerStore {
  // 数据
  managers: FundManager[];
  userRatings: UserRating[];
  ratingHistory: RatingHistory[];

  // 筛选状态
  selectedType: FundProductType | "all";
  sortBy: SortByType;
  searchQuery: string;

  // Actions
  rateManager: (
    managerId: string,
    score: number,
    comment: string,
    ratingTags?: string[]
  ) => { success: boolean; message: string };
  updateManagerRating: (managerId: string) => void;
  filterManagers: () => FundManager[];
  getManagerById: (id: string) => FundManager | undefined;
  getUserRatingForManager: (managerId: string) => UserRating | undefined;
  canRate: (managerId: string) => { canRate: boolean; reason?: string };
  deleteRating: (ratingId: string) => void;
  getCommentsByManagerId: (managerId: string) => UserRating[];

  // 筛选Actions
  setSelectedType: (type: FundProductType | "all") => void;
  setSortBy: (sort: SortByType) => void;
  setSearchQuery: (query: string) => void;
}

// 生成当前用户ID
const getCurrentUserId = () => {
  let userId = localStorage.getItem("current-user-id");
  if (!userId) {
    userId = "user-" + Date.now();
    localStorage.setItem("current-user-id", userId);
  }
  return userId;
};

export const useFundManagerStore = create<FundManagerStore>()(
  persist(
    (set, get) => ({
      managers: mockFundManagers,
      userRatings: [],
      ratingHistory: [],
      selectedType: "all",
      sortBy: "rating",
      searchQuery: "",

      // 提交评分
      rateManager: (
        managerId: string,
        score: number,
        comment: string,
        ratingTags?: string[]
      ) => {
        // 检查是否可以评分
        const check = get().canRate(managerId);
        if (!check.canRate) {
          return { success: false, message: check.reason || "无法评分" };
        }

        const userId = getCurrentUserId();
        const now = new Date().toISOString();

        // 创建评分记录
        const newRating: UserRating = {
          id: "rating-" + Date.now(),
          managerId,
          userId,
          score,
          comment,
          ratingTags,
          createdAt: now,
          isAnonymous: false,
        };

        // 更新评分历史
        const existingHistory = get().ratingHistory.find((h) => h.userId === userId);
        if (existingHistory) {
          set({
            ratingHistory: get().ratingHistory.map((h) =>
              h.userId === userId
                ? {
                    ...h,
                    lastRatingTime: now,
                    ratingsCount: h.ratingsCount + 1,
                  }
                : h
            ),
          });
        } else {
          set({
            ratingHistory: [
              ...get().ratingHistory,
              { userId, lastRatingTime: now, ratingsCount: 1 },
            ],
          });
        }

        // 保存评分
        set({ userRatings: [...get().userRatings, newRating] });

        // 更新基金经理评分
        get().updateManagerRating(managerId);

        return { success: true, message: "评分成功！" };
      },

      // 更新基金经理平均分
      updateManagerRating: (managerId: string) => {
        const state = get();
        const manager = state.managers.find((m) => m.id === managerId);
        if (!manager) return;

        const ratings = state.userRatings.filter((r) => r.managerId === managerId);

        if (ratings.length === 0) return;

        // 计算新的平均分
        const totalScore = ratings.reduce((sum, r) => sum + r.score, 0);
        const averageRating = Math.round((totalScore / ratings.length) * 10) / 10;

        // 计算分数分布
        const distribution = {
          rating10: 0,
          rating9: 0,
          rating8: 0,
          rating7: 0,
          rating6: 0,
          rating5: 0,
          rating4: 0,
          rating3: 0,
          rating2: 0,
          rating1: 0,
        };

        ratings.forEach((r) => {
          const score = Math.floor(r.score);
          const key = `rating${score}` as keyof typeof distribution;
          distribution[key]++;
        });

        // 更新基金经理数据
        set({
          managers: state.managers.map((m) =>
            m.id === managerId
              ? {
                  ...m,
                  averageRating,
                  totalRatings: ratings.length,
                  ratingDistribution: distribution,
                  updatedAt: new Date().toISOString(),
                }
              : m
          ),
        });
      },

      // 筛选基金经理
      filterManagers: () => {
        const state = get();
        let filtered = [...state.managers];

        // 按类型筛选
        if (state.selectedType !== "all") {
          filtered = filtered.filter((m) => m.productType === state.selectedType);
        }

        // 按搜索关键词筛选
        if (state.searchQuery) {
          const query = state.searchQuery.toLowerCase();
          filtered = filtered.filter(
            (m) =>
              m.name.toLowerCase().includes(query) ||
              m.company.toLowerCase().includes(query)
          );
        }

        // 排序
        switch (state.sortBy) {
          case "rating":
            filtered.sort((a, b) => b.averageRating - a.averageRating);
            break;
          case "ratingsCount":
            filtered.sort((a, b) => b.totalRatings - a.totalRatings);
            break;
          case "experience":
            filtered.sort((a, b) => b.experienceYears - a.experienceYears);
            break;
          case "assets":
            filtered.sort((a, b) => b.totalAssets - a.totalAssets);
            break;
        }

        return filtered;
      },

      // 获取基金经理详情
      getManagerById: (id: string) => {
        return get().managers.find((m) => m.id === id);
      },

      // 获取用户对某基金经理的评分
      getUserRatingForManager: (managerId: string) => {
        const userId = getCurrentUserId();
        return get().userRatings.find(
          (r) => r.managerId === managerId && r.userId === userId
        );
      },

      // 检查是否可以评分
      canRate: (managerId: string) => {
        const state = get();
        const userId = getCurrentUserId();

        // 规则1：同一基金经理只能评一次
        const existingRating = state.userRatings.find(
          (r) => r.managerId === managerId && r.userId === userId
        );
        if (existingRating) {
          return { canRate: false, reason: "你已经评过分了~" };
        }

        // 规则2：24小时内评分不超过5次
        const history = state.ratingHistory.find((h) => h.userId === userId);
        if (history) {
          const now = new Date();
          const lastRating = new Date(history.lastRatingTime);
          const hoursDiff =
            (now.getTime() - lastRating.getTime()) / (1000 * 60 * 60);

          if (hoursDiff < 24 && history.ratingsCount >= 5) {
            const hoursRemaining = Math.ceil(24 - hoursDiff);
            return {
              canRate: false,
              reason: `今天评太多啦，${hoursRemaining}小时后再来吧~`,
            };
          }
        }

        return { canRate: true };
      },

      // 删除评分
      deleteRating: (ratingId: string) => {
        const state = get();
        const rating = state.userRatings.find((r) => r.id === ratingId);
        if (!rating) return;

        const userId = getCurrentUserId();
        if (rating.userId !== userId) return;

        // 删除评分
        set({
          userRatings: state.userRatings.filter((r) => r.id !== ratingId),
        });

        // 重新计算基金经理评分
        get().updateManagerRating(rating.managerId);
      },

      // 获取某基金经理的所有评论
      getCommentsByManagerId: (managerId: string) => {
        const state = get();
        return state.userRatings
          .filter((r) => r.managerId === managerId && r.comment.trim() !== "")
          .sort((a, b) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
      },

      // 设置筛选类型
      setSelectedType: (type: FundProductType | "all") => {
        set({ selectedType: type });
      },

      // 设置排序方式
      setSortBy: (sort: SortByType) => {
        set({ sortBy: sort });
      },

      // 设置搜索关键词
      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },
    }),
    {
      name: "fund-manager-storage",
    }
  )
);
