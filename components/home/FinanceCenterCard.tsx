"use client";

import { Wallet, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FinanceCenterCardProps {
  onClick: () => void;
}

export function FinanceCenterCard({ onClick }: FinanceCenterCardProps) {
  return (
    <div onClick={onClick} className="block">
      <Card className="cursor-pointer border-2 border-macaron-green/30 hover:border-macaron-green/60 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-macaron-green/20 via-macaron-cream to-macaron-blue/20 backdrop-blur-sm hover:scale-105 h-full">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-macaron-green to-macaron-blue flex items-center justify-center text-3xl shadow-lg flex-shrink-0">
              💰
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-800 text-lg font-cute">
                  钱钱小管家
                </h3>
                <TrendingUp className="w-4 h-4 text-macaron-green flex-shrink-0" />
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                记账本 + 省钱实验 + 投资模拟，轻松理财 ✨
              </p>
            </div>

            {/* Arrow indicator */}
            <div className="flex-shrink-0">
              <Wallet className="w-5 h-5 text-macaron-green" />
            </div>
          </div>

          {/* Tags */}
          <div className="flex gap-2 mt-3">
            <span className="text-xs bg-macaron-green/20 text-macaron-green px-2 py-1 rounded-full">
              记账本
            </span>
            <span className="text-xs bg-macaron-blue/20 text-macaron-blue px-2 py-1 rounded-full">
              省钱实验
            </span>
            <span className="text-xs bg-macaron-yellow/20 text-macaron-yellow px-2 py-1 rounded-full">
              投资模拟
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
