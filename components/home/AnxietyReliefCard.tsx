"use client";

import { Sparkles, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AnxietyReliefCardProps {
  onClick: () => void;
}

export function AnxietyReliefCard({ onClick }: AnxietyReliefCardProps) {
  return (
    <Card
      className="cursor-pointer border-2 border-macaron-pink/30 hover:border-macaron-pink/60 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-macaron-pink/20 via-macaron-cream to-macaron-purple/20 backdrop-blur-sm hover:scale-105"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-macaron-pink to-macaron-purple flex items-center justify-center text-3xl shadow-lg flex-shrink-0">
            💊
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-800 text-lg font-cute">
                心理补丸
              </h3>
              <Sparkles className="w-4 h-4 text-macaron-purple flex-shrink-0" />
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">
              投资焦虑？财务压力？来颗补丸，把焦虑变知识 💫
            </p>
          </div>

          {/* Arrow indicator */}
          <div className="flex-shrink-0">
            <Heart className="w-5 h-5 text-macaron-pink" />
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-2 mt-3">
          <span className="text-xs bg-macaron-pink/20 text-macaron-pink px-2 py-1 rounded-full">
            心理按摩
          </span>
          <span className="text-xs bg-macaron-purple/20 text-macaron-purple px-2 py-1 rounded-full">
            情感陪伴
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
