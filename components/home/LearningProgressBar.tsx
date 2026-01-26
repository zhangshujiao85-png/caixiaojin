"use client";

import { useLearningProgress } from "@/store/useLearningProgress";
import { Sparkles, TrendingUp, Award } from "lucide-react";
import { cn } from "@/lib/utils";

export function LearningProgressBar() {
  const { totalPoints, level, todayPoints, currentLevelProgress, skills } = useLearningProgress();

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 border-2 border-macaron-pink/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-macaron-pink to-macaron-purple flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-600">财富等级</p>
            <p className="text-xl font-bold font-cute text-gray-800">
              Lv.{level}
            </p>
          </div>
        </div>

        <div className="flex gap-4 text-center">
          <div className="bg-macaron-yellow/30 rounded-2xl px-4 py-2">
            <p className="text-xs text-gray-600 mb-1">总积分</p>
            <p className="text-lg font-bold text-gray-800 flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              {totalPoints}
            </p>
          </div>

          <div className="bg-macaron-green/30 rounded-2xl px-4 py-2">
            <p className="text-xs text-gray-600 mb-1">今日</p>
            <p className="text-lg font-bold text-gray-800">+{todayPoints}</p>
          </div>
        </div>
      </div>

      {/* 等级进度条 */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>升级进度</span>
          <span>{Math.round(currentLevelProgress)}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full bg-gradient-to-r from-macaron-pink via-macaron-purple to-macaron-blue",
              "transition-all duration-500"
            )}
            style={{ width: `${currentLevelProgress}%` }}
          />
        </div>
      </div>

      {/* 已获得技能 */}
      {skills.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Award className="w-4 h-4 text-macaron-pink" />
          <span className="text-sm text-gray-600">获得能力:</span>
          {skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full bg-macaron-pink/20 text-macaron-pink text-xs font-medium"
            >
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="text-xs text-gray-500">
              +{skills.length - 3} 更多
            </span>
          )}
        </div>
      )}
    </div>
  );
}
