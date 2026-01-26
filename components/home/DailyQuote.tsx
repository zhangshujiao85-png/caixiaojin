"use client";

import { Card } from "@/components/ui/card";
import { Sparkles, Share2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const dailyQuotes = [
  {
    quote: "复利的力量在于时间 ⏰",
    author: "悦投金句",
    emoji: "⏰",
  },
  {
    quote: "定投就像种树，最好的时间是十年前，其次是现在。",
    author: "理财谚语",
    emoji: "🌱",
  },
  {
    quote: "不要把所有鸡蛋放在一个篮子里，分散投资才能睡好觉。",
    author: "投资格言",
    emoji: "🥚",
  },
  {
    quote: "理财不是为了发财，而是为了更好地生活。",
    author: "生活智慧",
    emoji: "🌸",
  },
  {
    quote: "止损是投资中最难学会的一课，但也是最重要的一课。",
    author: "投资大师",
    emoji: "📚",
  },
];

export function DailyQuote() {
  const todayIndex = new Date().getDay() % dailyQuotes.length;
  const quote = dailyQuotes[todayIndex];
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const text = `${quote.emoji} ${quote.quote}\n——${quote.author}\n\n来自：小财进理财平台`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "每日金句",
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

  return (
    <Card className="border-2 border-macaron-blue/30 bg-gradient-to-br from-macaron-blue/10 to-macaron-green/10 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-macaron-yellow/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="p-4 md:p-6 relative">
        {/* 标题 */}
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-macaron-pink" />
          <h3 className="font-bold text-gray-800 font-cute">每日一签</h3>
        </div>

        {/* 金句内容 */}
        <div className={cn(
          "bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 mb-4 border-2 border-macaron-pink/20",
          "relative"
        )}>
          <div className="text-3xl md:text-4xl mb-3 text-center">{quote.emoji}</div>
          <p className="text-base md:text-lg text-gray-800 font-cute text-center leading-relaxed mb-2">
            "{quote.quote}"
          </p>
          <p className="text-sm text-gray-500 text-right">—— {quote.author}</p>
        </div>

        {/* 分享按钮 */}
        <div className="flex justify-center">
          <button
            onClick={handleShare}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
              "bg-gradient-to-r from-macaron-pink to-macaron-purple",
              "hover:from-macaron-pink/90 hover:to-macaron-purple/90",
              "text-white font-cute font-bold text-sm shadow-md hover:shadow-lg",
              "hover:scale-105"
            )}
          >
            {copied ? (
              <>
                <span>✓</span>
                <span>已复制</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>分享金句</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Card>
  );
}
