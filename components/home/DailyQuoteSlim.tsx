'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const dailyQuotes = [
  {
    quote: '复利的力量在于时间，而不在于金额。小钱也能滚大雪球！',
    author: '爱因斯坦',
    emoji: '💰',
  },
  {
    quote: '定投就像种树，最好的时间是十年前，其次是现在。',
    author: '理财谚语',
    emoji: '🌱',
  },
  {
    quote: '不要把所有鸡蛋放在一个篮子里，分散投资才能睡好觉。',
    author: '投资格言',
    emoji: '🥚',
  },
  {
    quote: '理财不是为了发财，而是为了更好地生活。',
    author: '生活智慧',
    emoji: '🌸',
  },
  {
    quote: '止损是投资中最难学会的一课，但也是最重要的一课。',
    author: '投资大师',
    emoji: '📚',
  },
];

export const DailyQuoteSlim: React.FC = () => {
  const todayIndex = new Date().getDay() % dailyQuotes.length;
  const quote = dailyQuotes[todayIndex];
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const text = `${quote.emoji} ${quote.quote}\n——${quote.author}\n\n来自：小财进理财平台`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: '每日金句',
          text: text,
        });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.log('分享失败:', err);
    }
  };

  return (
    <Card className="border-2 border-macaron-blue/30 bg-gradient-to-r from-macaron-blue/10 to-macaron-green/10 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-20 h-20 bg-macaron-yellow/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

      <div className="p-3 relative flex items-center justify-between gap-3">
        {/* Left: Icon and Title */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Sparkles className="w-4 h-4 text-macaron-pink" />
          <span className="text-xl">{quote.emoji}</span>
        </div>

        {/* Center: Quote text */}
        <div className="flex-1 min-w-0 text-center">
          <p className="text-sm text-gray-800 font-medium truncate">
            "{quote.quote}"
          </p>
          <p className="text-xs text-gray-500 truncate">—— {quote.author}</p>
        </div>

        {/* Right: Share button */}
        <button
          onClick={handleShare}
          className={cn(
            'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300',
            'bg-gradient-to-r from-macaron-pink to-macaron-purple',
            'hover:from-macaron-pink/90 hover:to-macaron-purple/90',
            'text-white shadow-md hover:shadow-lg',
            'hover:scale-105'
          )}
          title={copied ? '已复制' : '分享金句'}
        >
          {copied ? (
            <span className="text-sm font-bold">✓</span>
          ) : (
            <Share2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </Card>
  );
};

export default DailyQuoteSlim;
