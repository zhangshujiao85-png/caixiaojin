"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Sparkles, Gift, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLearningProgress } from "@/store/useLearningProgress";

interface DailyCheckInProps {
  onCheckIn: (points: number) => void;
}

export function DailyCheckIn({ onCheckIn }: DailyCheckInProps) {
  const { totalPoints, todayPoints } = useLearningProgress();
  const [hasCheckedToday, setHasCheckedToday] = useState(false);
  const [consecutiveDays, setConsecutiveDays] = useState(3);
  const [isAnimating, setIsAnimating] = useState(false);
  const [checkInDates, setCheckInDates] = useState<Set<string>>(new Set());
  const [weekDates, setWeekDates] = useState<Date[]>([]);

  // 初始化：检查今天是否已签到，生成过去7天的日期
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const today = new Date().toDateString();
    const lastCheckIn = localStorage.getItem("lastCheckIn");
    setHasCheckedToday(lastCheckIn === today);

    // 生成过去7天的日期（包括今天），并按周一开始排序
    const dates: Date[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0); // 重置时间部分
      dates.push(date);
    }

    // 按周几排序：周一(1) -> 周日(0)
    dates.sort((a, b) => {
      const dayA = a.getDay() === 0 ? 7 : a.getDay();
      const dayB = b.getDay() === 0 ? 7 : b.getDay();
      return dayA - dayB;
    });

    setWeekDates(dates);

    // 从localStorage读取所有签到记录
    const allCheckIns = JSON.parse(localStorage.getItem("allCheckIns") || "[]") as string[];
    const checkInSet = new Set(allCheckIns.map((d: string) => new Date(d).toDateString())) as Set<string>;
    setCheckInDates(checkInSet);

    // 计算连续签到天数
    let consecutive = 0;
    const checkInDate = new Date();
    checkInDate.setHours(0, 0, 0, 0);

    while (true) {
      const dateStr = checkInDate.toDateString();
      if (checkInSet.has(dateStr)) {
        consecutive++;
        checkInDate.setDate(checkInDate.getDate() - 1);
      } else {
        break;
      }
    }

    if (consecutive > 0) {
      setConsecutiveDays(consecutive);
    }
  }, []);

  const handleCheckIn = () => {
    if (hasCheckedToday) return;

    const today = new Date().toDateString();
    const todayISO = new Date().toISOString();

    // 保存签到记录
    localStorage.setItem("lastCheckIn", today);

    // 保存所有签到记录
    const allCheckIns = JSON.parse(localStorage.getItem("allCheckIns") || "[]");
    allCheckIns.push(todayISO);
    localStorage.setItem("allCheckIns", JSON.stringify(allCheckIns));

    // 更新签到状态
    setHasCheckedToday(true);
    setIsAnimating(true);

    // 更新签到日期集合
    setCheckInDates(prev => new Set(prev).add(today));

    // 签到奖励
    const points = 10 + consecutiveDays * 2; // 基础10分 + 连续奖励
    onCheckIn(points);

    // 连续天数增加
    setTimeout(() => {
      setConsecutiveDays(prev => prev + 1);
      setIsAnimating(false);
    }, 500);
  };

  return (
    <Card className="border-2 border-macaron-yellow/30 bg-gradient-to-br from-macaron-yellow/10 to-macaron-peach/10 overflow-hidden">
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-macaron-pink" />
            <h3 className="font-bold text-gray-800 font-cute">每日签到</h3>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600">已连续签到</p>
            <p className="text-2xl font-bold text-macaron-pink font-cute">
              {consecutiveDays}
              <span className="text-sm">天</span>
            </p>
          </div>
        </div>

        {/* 签到奖励展示 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-macaron-purple" />
            <span className="text-sm text-gray-600">
              今日奖励: <span className="font-bold text-macaron-pink">+{10 + consecutiveDays * 2}</span> 积分
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-macaron-yellow" />
            <span className="text-xs text-gray-500">
              {consecutiveDays >= 7 && "🔥 签到达人！"}
              {consecutiveDays >= 30 && "⭐ 签到专家！"}
            </span>
          </div>
        </div>

        {/* 签到日历 - 最近7天 */}
        <div className="flex justify-between gap-1 md:gap-2 mb-4">
          {weekDates.map((date, i) => {
            const dayStr = date.toDateString();
            // 改为周一到周日的顺序
            const dayNames = ["一", "二", "三", "四", "五", "六", "日"];
            const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1; // 周日=6, 周一=0, ..., 周六=5
            const isToday = date.toDateString() === new Date().toDateString();
            const hasCheckedIn = checkInDates.has(dayStr);

            return (
              <div
                key={i}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                  isToday && "bg-macaron-pink text-white shadow-md",
                  !isToday && "bg-macaron-cream hover:bg-macaron-pink/10"
                )}
              >
                <span className={cn(
                  "text-xs font-medium",
                  isToday ? "text-white" : "text-gray-600"
                )}>
                  {dayNames[dayOfWeek]}
                </span>
                <span className={cn(
                  "text-lg font-bold",
                  isToday ? "text-white" : "text-gray-800"
                )}>
                  {date.getDate()}
                </span>
                <div className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-xs",
                  hasCheckedIn && "bg-macaron-green text-white",
                  !hasCheckedIn && !isToday && "bg-gray-200 text-gray-400",
                  !hasCheckedIn && isToday && "bg-white/50 text-white"
                )}>
                  {hasCheckedIn && "✓"}
                </div>
              </div>
            );
          })}
        </div>

        {/* 签到按钮 */}
        <Button
          onClick={handleCheckIn}
          disabled={hasCheckedToday}
          className={cn(
            "w-full font-cute font-bold transition-all duration-300",
            hasCheckedToday
              ? "bg-macaron-green hover:bg-macaron-green/90 text-white cursor-default"
              : "bg-gradient-to-r from-macaron-pink to-macaron-purple hover:from-macaron-pink/90 hover:to-macaron-purple/90 text-white hover:scale-105"
          )}
        >
          {hasCheckedToday ? (
            <span className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              今日已签到
            </span>
          ) : (
            <span className={cn(
              "flex items-center justify-center gap-2",
              isAnimating && "animate-pulse"
            )}>
              <Gift className="w-4 h-4" />
              立即签到
            </span>
          )}
        </Button>

        {/* 签到提示 */}
        {!hasCheckedToday && (
          <p className="text-xs text-gray-500 text-center mt-2">
            连续签到7天获得额外奖励哦~ 🎁
          </p>
        )}
      </div>
    </Card>
  );
}
