"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type DifficultyLevel = "all" | "beginner" | "intermediate" | "advanced" | "warning";

interface LevelFilterProps {
  activeLevel: DifficultyLevel;
  onChange: (level: DifficultyLevel) => void;
}

const levels = [
  { value: "all" as const, label: "✨ 全部", color: "bg-gray-200" },
  { value: "beginner" as const, label: "🌱 小白入门", color: "bg-macaron-green" },
  { value: "intermediate" as const, label: "💪 轻松上手", color: "bg-macaron-blue" },
  { value: "advanced" as const, label: "🚀 稳中进阶", color: "bg-macaron-purple" },
  { value: "warning" as const, label: "⚠️ 避坑指南", color: "bg-orange-200" },
];

export function LevelFilter({ activeLevel, onChange }: LevelFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {levels.map((level) => (
        <Button
          key={level.value}
          variant={activeLevel === level.value ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(level.value)}
          className={cn(
            "rounded-full font-cute",
            activeLevel === level.value
              ? "bg-macaron-pink hover:bg-macaron-pink/90 text-white"
              : "bg-white border-macaron-pink/30 hover:bg-macaron-pink/10"
          )}
        >
          {level.label}
        </Button>
      ))}
    </div>
  );
}
