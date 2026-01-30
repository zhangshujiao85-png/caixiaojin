"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface DictionaryCardProps {
  onClick: () => void;
}

export function DictionaryCard({ onClick }: DictionaryCardProps) {
  return (
    <Card
      className="cursor-pointer border-2 border-macaron-blue/30 hover:border-macaron-blue/60 hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-macaron-blue/20 via-macaron-purple/20 to-macaron-pink/20 backdrop-blur-sm hover:scale-[1.02]"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* 左侧：图标和标题 */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-macaron-blue to-macaron-purple flex items-center justify-center text-2xl shadow-md">
              📖
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-base font-cute flex items-center gap-2">
                小白术语词典
                <BookOpen className="w-4 h-4 text-macaron-blue" />
              </h3>
              <p className="text-xs text-gray-600">
                理财术语大白话解释，搜索秒懂专业名词 ✨
              </p>
            </div>
          </div>

          {/* 右侧：搜索提示 */}
          <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full border-2 border-macaron-blue/20">
            <Search className="w-4 h-4 text-macaron-blue" />
            <span className="text-sm text-gray-600 font-cute">点击搜索</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
