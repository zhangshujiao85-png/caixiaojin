"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFundManagerStore } from "@/store/fundManagerStore";
import { RatingDisplay } from "@/components/community/fund-manager-rating/RatingDisplay";
import { RatingDialog } from "@/components/community/fund-manager-rating/RatingDialog";
import { RatingDistribution } from "@/components/community/fund-manager-rating/RatingDistribution";
import { CommentSection } from "@/components/community/fund-manager-rating/CommentSection";
import { FundProductTypeLabels } from "@/types/fundManager";
import { cn } from "@/lib/utils";

export default function FundManagerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const managers = useFundManagerStore((state) => state.managers);
  const userRatings = useFundManagerStore((state) => state.userRatings);
  const ratingHistory = useFundManagerStore((state) => state.ratingHistory);
  const deleteRating = useFundManagerStore((state) => state.deleteRating);

  const [showRatingDialog, setShowRatingDialog] = useState(false);

  // 当前用户ID
  const getCurrentUserId = () => {
    let userId = localStorage.getItem("current-user-id");
    if (!userId) {
      userId = "user-" + Date.now();
      localStorage.setItem("current-user-id", userId);
    }
    return userId;
  };

  const currentUserId = getCurrentUserId();

  // 获取基金经理
  const manager = useMemo(
    () => managers.find((m) => m.id === id),
    [managers, id]
  );

  // 获取用户评分
  const userRating = useMemo(
    () => userRatings.find((r) => r.managerId === id && r.userId === currentUserId),
    [userRatings, id, currentUserId]
  );

  // 获取评论
  const comments = useMemo(() => {
    return userRatings
      .filter((r) => r.managerId === id && r.comment.trim() !== "")
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [userRatings, id]);

  // 检查是否可以评分
  const canRateResult = useMemo(() => {
    // 规则1：同一基金经理只能评一次
    if (userRating) {
      return { canRate: false, reason: "你已经评过分了~" };
    }

    // 规则2：24小时内评分不超过5次
    const history = ratingHistory.find((h) => h.userId === currentUserId);
    if (history) {
      const now = new Date();
      const lastRating = new Date(history.lastRatingTime);
      const hoursDiff = (now.getTime() - lastRating.getTime()) / (1000 * 60 * 60);

      if (hoursDiff < 24 && history.ratingsCount >= 5) {
        const hoursRemaining = Math.ceil(24 - hoursDiff);
        return {
          canRate: false,
          reason: `今天评太多啦，${hoursRemaining}小时后再来吧~`,
        };
      }
    }

    return { canRate: true };
  }, [userRating, ratingHistory, currentUserId]);

  if (!manager) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-macaron-yellow/20 via-macaron-cream to-macaron-peach/20 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">未找到该基金经理</p>
            <Button onClick={() => router.back()}>返回</Button>
          </div>
        </div>
      </div>
    );
  }

  const handleDeleteComment = (ratingId: string) => {
    if (confirm("确定要删除这条评论吗？")) {
      deleteRating(ratingId);
      // Comments will be updated automatically through the useMemo
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-macaron-yellow/20 via-macaron-cream to-macaron-peach/20 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 返回按钮 */}
        <Link
          href="/community/fund-manager-rating"
          className="inline-flex items-center gap-2 text-macaron-pink hover:text-macaron-purple mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-cute">返回列表</span>
        </Link>

        {/* 基金经理信息卡片 */}
        <Card className="border-macaron-pink/20 overflow-hidden mb-6">
          <div className="p-6">
            {/* 头部：头像 + 基本信息 + 评分 */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
              <div
                className={cn(
                  "w-24 h-24 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-4xl font-bold shadow-lg flex-shrink-0"
                )}
                style={{
                  background: `linear-gradient(135deg, ${
                    ["#FFB6D9", "#A8E6CF", "#FFD93D", "#B4A7E4", "#FF9F9F"][
                      manager.id.length % 5
                    ]
                  }, ${
                    ["#E2A8BF", "#7ED3A8", "#FFC947", "#9D8EC4", "#E88787"][
                      manager.id.length % 5
                    ]
                  })`,
                }}
              >
                {manager.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 font-cute">
                  {manager.name}
                </h1>
                <p className="text-gray-600 mb-3">{manager.company}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-macaron-pink/20 text-macaron-pink hover:bg-macaron-pink/30 border-none">
                    {FundProductTypeLabels[manager.productType]}
                  </Badge>
                  <Badge className="bg-macaron-blue/20 text-macaron-blue hover:bg-macaron-blue/30 border-none">
                    {manager.experienceYears}年经验
                  </Badge>
                  <Badge className="bg-macaron-green/20 text-macaron-green hover:bg-macaron-green/30 border-none">
                    {manager.totalAssets >= 1000
                      ? (manager.totalAssets / 1000).toFixed(1) + "千亿"
                      : manager.totalAssets + "亿"}规模
                  </Badge>
                </div>
              </div>
              <RatingDisplay rating={manager.averageRating} totalRatings={manager.totalRatings} size="lg" />
            </div>

            {/* 简介 */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-2">简介</h3>
              <p className="text-gray-700 leading-relaxed">{manager.biography}</p>
            </div>

            {/* 成就 */}
            {manager.achievements.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-macaron-yellow" />
                  成就荣誉
                </h3>
                <div className="flex flex-wrap gap-2">
                  {manager.achievements.map((achievement) => (
                    <Badge
                      key={achievement}
                      className="bg-macaron-yellow/20 text-macaron-yellow hover:bg-macaron-yellow/30 border-none px-3 py-1"
                    >
                      {achievement}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* 代表基金 */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-macaron-blue" />
                代表基金
              </h3>
              <p className="text-gray-700">{manager.representativeFund}</p>
            </div>

            {/* 评分区域 */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">你的评分</h3>
                  {userRating ? (
                    <p className="text-sm text-gray-500">
                      你已经评过 <span className="font-bold text-macaron-pink">{userRating.score}</span> 分
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">还没评分哦</p>
                  )}
                </div>
                <Button
                  onClick={() => setShowRatingDialog(true)}
                  disabled={!canRateResult.canRate}
                  className="bg-macaron-pink hover:bg-macaron-pink/90 text-white gap-2"
                >
                  <Star className="w-4 h-4" />
                  {userRating ? "修改评分" : "为TA评分"}
                </Button>
              </div>
              {!canRateResult.canRate && !userRating && (
                <p className="text-sm text-macaron-pink">{canRateResult.reason}</p>
              )}
            </div>
          </div>
        </Card>

        {/* 评分分布 */}
        <Card className="border-macaron-pink/20 overflow-hidden mb-6">
          <div className="p-6">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">📊 评分分布</h3>
            <RatingDistribution distribution={manager.ratingDistribution} totalRatings={manager.totalRatings} />
          </div>
        </Card>

        {/* 评论区域 */}
        <Card className="border-macaron-pink/20 overflow-hidden">
          <div className="p-6">
            <CommentSection
              comments={comments}
              currentUserId={currentUserId}
              onDeleteComment={handleDeleteComment}
            />
          </div>
        </Card>
      </div>

      {/* 评分弹窗 */}
      <RatingDialog
        open={showRatingDialog}
        onOpenChange={setShowRatingDialog}
        managerId={manager.id}
        managerName={manager.name}
      />
    </div>
  );
}
