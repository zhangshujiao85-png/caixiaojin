"use client";

import { useLearningProgress } from "@/store/useLearningProgress";
import { Lock, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export function AchievementBadge() {
  const { achievements } = useLearningProgress();
  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;

  return (
    <div className="bg-gradient-to-br from-macaron-yellow/20 to-macaron-peach/20 rounded-3xl p-6 border-2 border-macaron-yellow/30">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-macaron-pink" />
        <h3 className="font-bold text-gray-800 font-cute">成就勋章</h3>
        <span className="ml-auto text-sm text-gray-600">
          {unlockedCount}/{achievements.length}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={cn(
              "relative rounded-2xl p-4 transition-all",
              achievement.unlockedAt
                ? "bg-white shadow-md"
                : "bg-white/50 grayscale opacity-60"
            )}
          >
            <div className="text-3xl mb-2">{achievement.icon}</div>
            <p className="font-semibold text-gray-800 text-sm mb-1">
              {achievement.title}
            </p>
            <p className="text-xs text-gray-600">{achievement.description}</p>

            {!achievement.unlockedAt && (
              <div className="absolute top-2 right-2">
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
            )}

            {achievement.unlockedAt && (
              <div className="absolute -top-1 -right-1">
                <div className="w-6 h-6 rounded-full bg-macaron-green flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
