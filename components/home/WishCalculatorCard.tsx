"use client";

import { Sparkles, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WishCalculatorCardProps {
  onClick: () => void;
}

export function WishCalculatorCard({ onClick }: WishCalculatorCardProps) {
  return (
    <Card
      className="cursor-pointer border-2 border-macaron-blue/30 hover:border-macaron-blue/60 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-macaron-blue/20 via-macaron-cream to-macaron-green/20 backdrop-blur-sm hover:scale-105"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-macaron-blue to-macaron-green flex items-center justify-center text-3xl shadow-lg flex-shrink-0">
            ✨
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-800 text-lg font-cute">
                愿望计算器
              </h3>
              <Sparkles className="w-4 h-4 text-macaron-blue flex-shrink-0" />
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">
              画出你的梦想，我们帮你算算最佳实现路径 💫
            </p>
          </div>

          {/* Arrow indicator */}
          <div className="flex-shrink-0">
            <Target className="w-5 h-5 text-macaron-green" />
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-2 mt-3">
          <span className="text-xs bg-macaron-blue/20 text-macaron-blue px-2 py-1 rounded-full">
            梦想规划
          </span>
          <span className="text-xs bg-macaron-green/20 text-macaron-green px-2 py-1 rounded-full">
            目标追踪
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
