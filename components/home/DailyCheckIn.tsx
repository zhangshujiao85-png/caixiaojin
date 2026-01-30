"use client";

import { useState } from "react";
import { Gift, Calendar, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDailyCheckInStore } from "@/store/useDailyCheckInStore";
import { DailyCheckInModal } from "./DailyCheckInModal";

interface DailyCheckInProps {
  onCheckIn?: (points: number) => void;
}

export function DailyCheckIn({ onCheckIn }: DailyCheckInProps) {
  const { checkInStreak, hasCheckedToday } = useDailyCheckInStore();
  const [open, setOpen] = useState(false);

  const checkedToday = hasCheckedToday();

  const handleCheckIn = (points: number) => {
    if (onCheckIn) {
      onCheckIn(points);
    }
  };

  return (
    <>
      <Card
        className="bg-gradient-to-br from-macaron-pink/20 to-macaron-purple/20 border-2 border-macaron-pink/30 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-3">
            {/* Icon */}
            <div className="relative">
              {checkedToday ? (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-macaron-green to-macaron-blue flex items-center justify-center shadow-lg animate-pulse-slow">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-macaron-pink to-macaron-purple flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: "2s" }}>
                  <Gift className="w-8 h-8 text-white" />
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-800 font-cute">
              每日签到
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600">
              {checkedToday ? "今日已签到 ✨" : "点击签到领取奖励 🌸"}
            </p>

            {/* Streak Info */}
            {checkInStreak > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full border border-macaron-pink/20">
                <Calendar className="w-4 h-4 text-macaron-pink" />
                <span className="text-sm font-medium text-gray-700">
                  已连续签到 <span className="text-macaron-purple font-bold">{checkInStreak}</span> 天
                </span>
              </div>
            )}

            {/* Button */}
            <button
              className={`w-full py-2 rounded-full font-cute font-bold text-sm transition-all duration-300 ${
                checkedToday
                  ? "bg-gray-200 text-gray-500 cursor-default"
                  : "bg-gradient-to-r from-macaron-pink to-macaron-purple text-white hover:shadow-lg"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
              }}
            >
              {checkedToday ? "已完成" : "立即签到"}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <DailyCheckInModal open={open} onOpenChange={setOpen} />
    </>
  );
}
