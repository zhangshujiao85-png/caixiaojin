"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import { FundManager, FundProductTypeLabels } from "@/types/fundManager";
import { RatingDisplay } from "./RatingDisplay";
import { cn } from "@/lib/utils";

interface ManagerCardProps {
  manager: FundManager;
}

export function ManagerCard({ manager }: ManagerCardProps) {
  const router = useRouter();

  // 获取头像首字母
  const getInitial = (name: string) => {
    return name.charAt(0);
  };

  // 获取头像颜色
  const getAvatarColor = (index: number) => {
    const colors = [
      "from-macaron-pink to-macaron-purple",
      "from-macaron-blue to-macaron-green",
      "from-macaron-yellow to-macaron-orange",
      "from-macaron-purple to-macaron-pink",
      "from-macaron-green to-macaron-blue",
    ];
    return colors[index % colors.length];
  };

  return (
    <Card
      className="border-macaron-pink/20 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
      onClick={() => router.push(`/community/fund-manager-rating/${manager.id}`)}
    >
      <div className="p-5">
        {/* 头部：头像 + 评分 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-14 h-14 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-xl font-bold shadow-md"
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
              {getInitial(manager.name)}
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">
                {manager.name}
              </h3>
              <p className="text-sm text-gray-500">{manager.company}</p>
            </div>
          </div>
          <RatingDisplay rating={manager.averageRating} totalRatings={manager.totalRatings} size="sm" />
        </div>

        {/* 标签区域 */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className="bg-macaron-pink/20 text-macaron-pink hover:bg-macaron-pink/30 border-none">
            {FundProductTypeLabels[manager.productType]}
          </Badge>
          <Badge className="bg-macaron-blue/20 text-macaron-blue hover:bg-macaron-blue/30 border-none">
            {manager.experienceYears}年经验
          </Badge>
          {manager.achievements.slice(0, 2).map((achievement) => (
            <Badge
              key={achievement}
              className="bg-macaron-yellow/20 text-macaron-yellow hover:bg-macaron-yellow/30 border-none flex items-center gap-1"
            >
              <Award className="w-3 h-3" />
              {achievement}
            </Badge>
          ))}
        </div>

        {/* 简介和代表基金 */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {manager.biography}
          </p>
          <p className="text-xs text-gray-500">
            代表基金: {manager.representativeFund}
          </p>
        </div>

        {/* 底部：管理规模 + 查看详情 */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="text-sm">
            <span className="text-gray-500">管理规模:</span>
            <span className="font-bold text-macaron-green ml-1">
              {manager.totalAssets >= 1000
                ? (manager.totalAssets / 1000).toFixed(1) + "千亿"
                : manager.totalAssets + "亿"}
            </span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="text-macaron-pink hover:text-macaron-pink/80 hover:bg-macaron-pink/10 p-0 h-auto"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/community/fund-manager-rating/${manager.id}`);
            }}
          >
            查看详情
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
