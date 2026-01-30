"use client";

import { Gift, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDailyCheckInStore } from "@/store/useDailyCheckInStore";

interface DailyCheckInButtonProps {
  onClick: () => void;
}

export function DailyCheckInButton({ onClick }: DailyCheckInButtonProps) {
  const { checkInStreak, hasCheckedToday } = useDailyCheckInStore();
  const checkedToday = hasCheckedToday();

  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-8 right-8 z-50",
        "w-20 h-20 rounded-full shadow-2xl",
        "font-cute font-bold transition-all duration-300",
        "flex flex-col items-center justify-center gap-1",
        "hover:scale-110 active:scale-95",
        "animate-float",
        checkedToday
          ? "bg-gradient-to-br from-macaron-green to-macaron-blue text-white"
          : "bg-gradient-to-br from-macaron-pink to-macaron-purple text-white animate-pulse-slow"
      )}
      title={checkedToday ? "今日已签到" : "点击签到"}
    >
      {checkedToday ? (
        <>
          <CheckCircle2 className="w-8 h-8" />
          <span className="text-xs">{checkInStreak}天</span>
        </>
      ) : (
        <>
          <Gift className="w-8 h-8" />
          <span className="text-xs">签到</span>
        </>
      )}
    </button>
  );
}
