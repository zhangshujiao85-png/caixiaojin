"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Trophy, Target, Award, Star, Sparkles } from "lucide-react";
import { CoinStack, MoneyBag, FundTree } from "@/components/illustrations";
import { useLearningProgress } from "@/store/useLearningProgress";
import { cn } from "@/lib/utils";

export function AchievementWall() {
  const { totalPoints, level, achievements } = useLearningProgress();
  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;

  const mockAchievements = [
    {
      id: "first_checkin",
      title: "初来乍到",
      description: "完成首次签到",
      icon: "🌱",
      unlocked: true,
    },
    {
      id: "checkin_7",
      title: "签到达人",
      description: "连续签到7天",
      icon: "🔥",
      unlocked: false,
    },
    {
      id: "first_learn",
      title: "学习新手",
      description: "完成第一篇学习",
      icon: "📚",
      unlocked: true,
    },
    {
      id: "learn_10",
      title: "知识达人",
      description: "学习10篇内容",
      icon: "💡",
      unlocked: false,
    },
    {
      id: "points_100",
      title: "积分先锋",
      description: "获得100积分",
      icon: "💎",
      unlocked: false,
    },
    {
      id: "level_3",
      title: "理财新手",
      description: "达到3级",
      icon: "⭐",
      unlocked: false,
    },
    {
      id: "quiz_master",
      title: "测验满分",
      description: "小测验全对",
      icon: "🎯",
      unlocked: false,
    },
    {
      id: "month_1",
      title: "坚持不懈",
      description: "坚持学习1个月",
      icon: "🏅",
      unlocked: false,
    },
  ];

  return (
    <Card className="border-2 border-macaron-purple/30 bg-gradient-to-br from-macaron-purple/10 to-macaron-blue/10">
      <div className="p-4 md:p-6">
        {/* 标题 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-macaron-pink" />
            <h3 className="font-bold text-gray-800 font-cute">成就墙</h3>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600">已解锁</p>
            <p className="text-xl font-bold text-macaron-purple font-cute">
              {unlockedCount}/8
            </p>
          </div>
        </div>

        {/* 成就徽章网格 */}
        <div className="grid grid-cols-4 gap-2 md:gap-3">
          {mockAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={cn(
                "relative rounded-xl p-2 md:p-3 text-center transition-all duration-300",
                achievement.unlocked
                  ? "bg-white shadow-md hover:shadow-lg cursor-pointer hover:scale-105"
                  : "bg-white/50 grayscale opacity-60"
              )}
            >
              {/* 徽章 */}
              <div className={cn(
                "text-2xl md:text-3xl mb-1 relative",
                achievement.unlocked && "animate-bounce",
                !achievement.unlocked && "opacity-40"
              )}
              style={{ animationDuration: "2s" }}
              >
                {achievement.icon}
              </div>

              {/* 未解锁锁定图标 */}
              {!achievement.unlocked && (
                <div className="absolute top-1 right-1">
                  <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-xs text-gray-500">🔒</span>
                  </div>
                </div>
              )}

              {/* 名称 */}
              <p className="text-xs font-semibold text-gray-800 hidden md:block leading-tight">
                {achievement.title}
              </p>

              {/* 描述 */}
              <p className="text-xs text-gray-500 hidden md:block leading-tight">
                {achievement.description}
              </p>
            </div>
          ))}
        </div>

        {/* 底部装饰插画 */}
        <div className="flex justify-center gap-2 mt-4">
          <div style={{ animationDuration: "2s" }} className="animate-bounce">
            <CoinStack size={30} />
          </div>
          <div style={{ animationDuration: "2.5s" }} className="animate-bounce">
            <MoneyBag size={30} />
          </div>
          <div style={{ animationDuration: "3s" }} className="animate-bounce">
            <FundTree size={30} />
          </div>
        </div>
      </div>
    </Card>
  );
}
