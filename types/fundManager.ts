// 基金产品类型
export type FundProductType =
  | "stock"
  | "bond"
  | "mix"
  | "index"
  | "qdii"
  | "money"
  | "fof";

// 基金产品类型中文映射
export const FundProductTypeLabels: Record<FundProductType, string> = {
  stock: "股票型",
  bond: "债券型",
  mix: "混合型",
  index: "指数型",
  qdii: "QDII",
  money: "货币型",
  fof: "FOF",
};

// 评分分布
export interface RatingDistribution {
  rating10: number;
  rating9: number;
  rating8: number;
  rating7: number;
  rating6: number;
  rating5: number;
  rating4: number;
  rating3: number;
  rating2: number;
  rating1: number;
}

// 基金经理
export interface FundManager {
  id: string;
  name: string;
  company: string;
  productType: FundProductType;
  experienceYears: number;
  totalAssets: number;
  representativeFund: string;
  biography: string;
  achievements: string[];

  // 评分相关
  averageRating: number;
  totalRatings: number;
  ratingDistribution: RatingDistribution;

  createdAt: string;
  updatedAt: string;
}

// 用户评分
export interface UserRating {
  id: string;
  managerId: string;
  userId: string;
  score: number;
  comment: string;
  ratingTags?: string[];
  createdAt: string;
  isAnonymous: boolean;
}

// 评分历史
export interface RatingHistory {
  userId: string;
  lastRatingTime: string;
  ratingsCount: number;
}

// 排序类型
export type SortByType = "rating" | "ratingsCount" | "experience" | "assets";
