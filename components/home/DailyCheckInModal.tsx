"use client";

import { useState, useEffect } from "react";
import { X, Heart, Share2, Sparkles, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDailyCheckInStore } from "@/store/useDailyCheckInStore";
import { useLearningProgress } from "@/store/useLearningProgress";
import { DailyQuote } from "@/data/dailyQuotes";

interface DailyCheckInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// 纸屑组件
function Confetti() {
  const colors = [
    "bg-macaron-pink",
    "bg-macaron-purple",
    "bg-macaron-blue",
    "bg-macaron-green",
    "bg-macaron-yellow",
    "bg-macaron-peach",
  ];

  const confetti = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 2}s`,
    animationDuration: `${2 + Math.random() * 1}s`,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: `${8 + Math.random() * 8}px`,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {confetti.map((c) => (
        <div
          key={c.id}
          className={cn(
            "absolute top-0 rounded-full opacity-80",
            c.color,
            "animate-confetti-fall"
          )}
          style={{
            left: c.left,
            animationDelay: c.animationDelay,
            animationDuration: c.animationDuration,
            width: c.size,
            height: c.size,
          }}
        />
      ))}
    </div>
  );
}

export function DailyCheckInModal({ open, onOpenChange }: DailyCheckInModalProps) {
  const {
    checkIn,
    checkInStreak,
    toggleFavorite,
    favoriteQuotes,
    getTodayQuote,
    hasCheckedToday,
  } = useDailyCheckInStore();

  const { addPoints } = useLearningProgress();
  const [showConfetti, setShowConfetti] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  const todayQuote = getTodayQuote();
  const favorite = favoriteQuotes.includes(todayQuote.id);
  const checkedToday = hasCheckedToday();

  // 获取今日日期显示
  const getTodayDateDisplay = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
    const weekday = weekdays[today.getDay()];
    return `${month}月${date}日 星期${weekday}`;
  };

  // 计算今日奖励积分
  const getTodayPoints = () => {
    return 10 + checkInStreak * 2;
  };

  // 处理签到
  const handleCheckIn = () => {
    const result = checkIn();
    if (result.success) {
      setHasCheckedIn(true);
      setShowConfetti(true);
      addPoints(result.points, "签到奖励");

      // 2秒后隐藏纸屑
      setTimeout(() => {
        setShowConfetti(false);
      }, 2000);
    }
  };

  // 处理分享
  const handleShare = async () => {
    const text = `${todayQuote.emoji} ${todayQuote.quote}\n——${todayQuote.author}\n\n来自：小财进理财平台`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "每日一句",
          text: text,
        });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.log("分享失败:", err);
    }
  };

  // 处理关闭
  const handleClose = () => {
    onOpenChange(false);
    setShowConfetti(false);
    setHasCheckedIn(false);
  };

  // 当弹窗关闭时重置状态
  useEffect(() => {
    if (!open) {
      setHasCheckedIn(false);
      setShowConfetti(false);
    }
  }, [open]);

  // 添加纸屑动画样式
  useEffect(() => {
    if (open && !document.getElementById("confetti-styles")) {
      const style = document.createElement("style");
      style.id = "confetti-styles";
      style.textContent = `
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100%) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti-fall {
          animation: confetti-fall 2s ease-in forwards;
        }
      `;
      document.head.appendChild(style);
    }
  }, [open]);

  if (!open) return null;

  const isAlreadyChecked = checkedToday || hasCheckedIn;

  return (
    <>
      {/* 纸屑动画 */}
      {showConfetti && <Confetti />}

      {/* 弹窗遮罩 */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      >
        {/* 内容卡片 */}
        <div
          className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 标题色块 */}
          <div className="p-6 bg-gradient-to-r from-macaron-pink to-macaron-purple">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-sm mb-1">{getTodayDateDisplay()}</p>
                <h2 className="text-2xl font-bold text-white font-cute flex items-center gap-2">
                  {isAlreadyChecked ? (
                    <>
                      <Sparkles className="w-6 h-6" />
                      签到成功！🎉
                    </>
                  ) : (
                    <>
                      <Gift className="w-6 h-6" />
                      每日签到 🌷
                    </>
                  )}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 内容区域 */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-4">
            {/* 连续签到天数 */}
            <div className="p-4 bg-gradient-to-r from-macaron-pink/10 to-macaron-purple/10 rounded-2xl border-2 border-macaron-pink/20">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">已连续签到</p>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-macaron-pink to-macaron-purple font-cute">
                  {checkInStreak}
                  <span className="text-2xl text-macaron-purple">天</span>
                </p>
              </div>
            </div>

            {/* 每日一句卡片 */}
            <div className="bg-gradient-to-br from-macaron-cream to-macaron-pink/10 rounded-2xl p-6 border-2 border-macaron-pink/20 relative">
              {/* 收藏按钮 */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('收藏按钮点击', todayQuote.id, '当前收藏状态:', favorite);
                  toggleFavorite(todayQuote.id);
                }}
                className={cn(
                  "absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer hover:scale-110 active:scale-95 z-10",
                  favorite
                    ? "bg-gradient-to-br from-macaron-pink to-macaron-purple text-white"
                    : "bg-white/80 text-gray-400 hover:text-macaron-pink hover:bg-white"
                )}
              >
                <Heart
                  className={cn(
                    "w-5 h-5 transition-transform",
                    favorite && "fill-current scale-110"
                  )}
                />
              </button>

              {/* Emoji */}
              <div className="text-6xl mb-4 text-center animate-bounce" style={{ animationDuration: "2s" }}>
                {todayQuote.emoji}
              </div>

              {/* 句子内容 */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mb-4">
                <p className="text-xl md:text-2xl text-gray-800 font-cute text-center leading-relaxed">
                  "{todayQuote.quote}"
                </p>
              </div>

              {/* 作者/来源 */}
              <div className="text-right">
                <p className="text-sm text-gray-500">—— {todayQuote.author}</p>
              </div>

              {/* 标签 */}
              <div className="flex gap-2 mt-4 justify-center flex-wrap">
                <span className="text-xs bg-gradient-to-r from-macaron-pink/30 to-macaron-purple/30 text-macaron-pink px-3 py-1 rounded-full border border-macaron-pink/30">
                  🏷️ {todayQuote.category}
                </span>
                {todayQuote.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-macaron-purple/20 text-macaron-purple px-3 py-1 rounded-full border border-macaron-purple/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 签到按钮或分享按钮 */}
            {!isAlreadyChecked ? (
              <button
                onClick={handleCheckIn}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full",
                  "bg-gradient-to-r from-macaron-pink via-macaron-purple to-macaron-blue",
                  "hover:from-macaron-pink/90 hover:via-macaron-purple/90 hover:to-macaron-blue/90",
                  "text-white font-cute font-bold text-lg shadow-xl hover:shadow-2xl",
                  "transition-all duration-300 hover:scale-105"
                )}
              >
                <Gift className="w-6 h-6" />
                <span>立即签到 🌸</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleShare}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full",
                    "bg-gradient-to-r from-macaron-pink to-macaron-purple",
                    "hover:from-macaron-pink/90 hover:to-macaron-purple/90",
                    "text-white font-cute font-bold shadow-md hover:shadow-lg",
                    "transition-all duration-300 hover:scale-105"
                  )}
                >
                  {copied ? (
                    <>
                      <span>✓</span>
                      <span>已复制到剪贴板 ✨</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-5 h-5" />
                      <span>分享今日金句 💌</span>
                    </>
                  )}
                </button>

                {/* 温馨提示 */}
                <div className="p-3 bg-macaron-cream/50 rounded-xl border border-macaron-yellow/30 text-center">
                  <p className="text-xs text-gray-600">
                    💡 小贴士：点击右上角爱心可以收藏喜欢的句子哦~
                  </p>
                </div>
              </>
            )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
