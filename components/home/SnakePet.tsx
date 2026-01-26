'use client';

import React, { useEffect, useState } from 'react';
import { Snake } from '@/store/useSnakeProgress';
import { SNAKE_VARIANTS } from '@/constants/snakeVariants';
import { SnakeHead } from '@/components/snake/SnakeHead';
import { SnakeBody } from '@/components/snake/SnakeBody';
import { SnakeTail } from '@/components/snake/SnakeTail';
import { CoinFood } from '@/components/snake/CoinFood';
import { BookOpen, RotateCcw, Trophy } from 'lucide-react';

interface SnakePetProps {
  snake: Snake | null;
  onViewGallery: () => void;
  onReset: () => void;
  canReset: boolean;
}

export const SnakePet: React.FC<SnakePetProps> = ({
  snake,
  onViewGallery,
  onReset,
  canReset,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!snake) {
    return (
      <div className="bg-gradient-to-br from-macaron-pink/20 to-macaron-purple/20 rounded-3xl p-6 text-center">
        <p className="text-gray-600 mb-4">还没有小蛇哦～</p>
        <button
          onClick={onReset}
          className="px-6 py-3 bg-gradient-to-r from-macaron-pink to-macaron-purple text-white font-semibold rounded-2xl hover:shadow-lg transition-all duration-300"
        >
          领养一只小蛇 🐍
        </button>
      </div>
    );
  }

  const variant = SNAKE_VARIANTS.find((v) => v.id === snake.variant);
  const progress = (snake.segments / snake.maxSegments) * 100;
  const isComplete = snake.segments >= snake.maxSegments;

  // Generate S-shaped layout
  const generateSLayout = () => {
    const segments: React.ReactNode[] = [];
    const isLeft = true; // Starting direction

    // First part: curving right
    segments.push(
      <div key="head" className="relative flex justify-center mb-1">
        <SnakeHead color={variant?.colors.head || '#FFB5BA'} size={50} accessories={variant?.accessories} />
      </div>
    );

    // Body segments with alternating positions for S-shape
    const bodySegments = Math.max(0, snake.segments - 2);
    for (let i = 0; i < bodySegments; i++) {
      const offset = i % 3 === 0 ? 0 : i % 3 === 1 ? 20 : -20;
      segments.push(
        <div
          key={`body-${i}`}
          className="flex justify-center transition-all duration-500"
          style={{
            transform: `translateX(${offset}px)`,
            opacity: mounted ? 1 : 0,
            animation: `fadeIn 0.5s ease-out ${i * 0.1}s both`,
          }}
        >
          <SnakeSegment
            color={variant?.colors.body[i % variant?.colors.body.length] || '#FFB5BA'}
            size={40 - i * 0.5}
            index={i}
            type="body"
          />
        </div>
      );
    }

    // Tail
    segments.push(
      <div
        key="tail"
        className="flex justify-center mt-1"
        style={{
          opacity: mounted ? 1 : 0,
          animation: `fadeIn 0.5s ease-out ${bodySegments * 0.1}s both`,
        }}
      >
        <SnakeTail color={variant?.colors.tail || '#FFB5BA'} size={35} accessories={variant?.accessories} />
      </div>
    );

    return segments;
  };

  // Import SnakeSegment for use in this component
  const SnakeSegment = require('@/components/snake/SnakeSegment').SnakeSegment;

  return (
    <div className="bg-gradient-to-br from-macaron-cream to-macaron-pink/10 rounded-3xl p-6 shadow-lg relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-4 right-4 text-4xl opacity-20 animate-bounce">🐍</div>
      <div className="absolute bottom-4 left-4 text-3xl opacity-20">✨</div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{variant?.emoji.split('')[0] || '🐍'}</span>
          <div>
            <h3 className="font-bold text-gray-800">{snake.name}</h3>
            <p className="text-xs text-gray-500">{variant?.description}</p>
          </div>
        </div>
        <div className="flex gap-1">
          {variant?.rarity === 'legendary' && <span className="text-yellow-400">⭐</span>}
          {variant?.rarity === 'epic' && <span className="text-purple-400">💜</span>}
          {variant?.rarity === 'rare' && <span className="text-blue-400">💎</span>}
        </div>
      </div>

      {/* Snake display area */}
      <div className="bg-white/50 rounded-2xl p-6 mb-4 min-h-[300px] flex items-center justify-center relative overflow-hidden">
        {/* S-shaped snake */}
        <div className="flex flex-col items-center gap-1">
          {generateSLayout()}
        </div>

        {/* Food floating nearby */}
        {!isComplete && (
          <div className="absolute top-4 right-4 animate-float">
            <CoinFood size={30} />
          </div>
        )}

        {/* Complete badge */}
        {isComplete && (
          <div className="absolute top-4 right-4 bg-yellow-400 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
            完成！🎉
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>成长进度</span>
          <span className="font-semibold">
            {snake.segments} / {snake.maxSegments} 节
          </span>
        </div>
        <div className="h-3 bg-white rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isComplete
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                : 'bg-gradient-to-r from-macaron-pink to-macaron-purple'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Growth hints */}
      <div className="bg-white/60 rounded-xl p-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BookOpen className="w-4 h-4 text-macaron-pink" />
          <span>每日登录+1 | 完成学习+1~3 | 连续签到额外奖励</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onViewGallery}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-white border-2 border-macaron-purple text-macaron-purple font-semibold rounded-2xl hover:bg-macaron-purple hover:text-white transition-all duration-300"
        >
          <Trophy className="w-5 h-5" />
          查看所有蛇蛇
        </button>

        {canReset && (
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-white border-2 border-macaron-pink text-macaron-pink font-semibold rounded-2xl hover:bg-macaron-pink hover:text-white transition-all duration-300"
          >
            <RotateCcw className="w-5 h-5" />
            选择新蛇
          </button>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SnakePet;
