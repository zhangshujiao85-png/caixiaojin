'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Trophy, Sparkles, BookOpen } from 'lucide-react';
import { Snake } from '@/store/useSnakeProgress';
import { SnakeCollectionCard } from '@/components/snake/SnakeCollectionCard';
import { cn } from '@/lib/utils';

interface SnakeGardenProps {
  snakeCollection: Snake[];
  currentSnake: Snake | null;
  onSnakeClick?: (snake: Snake) => void;
  onViewGallery?: () => void;
}

export const SnakeGarden: React.FC<SnakeGardenProps> = ({
  snakeCollection,
  currentSnake,
  onSnakeClick,
  onViewGallery,
}) => {
  const allSnakes = [...snakeCollection];
  if (currentSnake) {
    allSnakes.unshift(currentSnake);
  }

  const isEmpty = allSnakes.length === 0;

  return (
    <Card className="border-2 border-macaron-purple/30 bg-gradient-to-br from-macaron-purple/10 to-macaron-pink/10">
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-macaron-pink" />
            <h3 className="font-bold text-gray-800 font-cute">蛇蛇乐园</h3>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600">已收集</p>
            <p className="text-xl font-bold text-macaron-purple font-cute">
              {snakeCollection.length}
              {currentSnake && '+'}
            </p>
          </div>
        </div>

        {/* Empty state */}
        {isEmpty ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4 animate-bounce">🐍</div>
            <p className="text-gray-600 mb-2">还没有完成的小蛇哦～</p>
            <p className="text-sm text-gray-500">快去养一只可爱的小蛇吧！</p>
          </div>
        ) : (
          <>
            {/* Snake grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-3">
              {allSnakes.slice(0, 8).map((snake) => (
                <SnakeCollectionCard
                  key={snake.id}
                  snake={snake}
                  onClick={() => onSnakeClick?.(snake)}
                />
              ))}
            </div>

            {/* View all gallery button - always visible */}
            <button
              onClick={onViewGallery}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-macaron-pink/30 to-macaron-purple/30 hover:from-macaron-pink/40 hover:to-macaron-purple/40 text-macaron-purple font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mb-3"
            >
              <BookOpen className="w-4 h-4" />
              查看所有蛇蛇图鉴 📖
            </button>

            {/* View more collection button if needed */}
            {allSnakes.length > 8 && (
              <button
                onClick={() => {}}
                className="w-full py-2 px-4 bg-gradient-to-r from-macaron-pink/20 to-macaron-purple/20 hover:from-macaron-pink/30 hover:to-macaron-purple/30 text-macaron-purple text-sm font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                查看全部 {allSnakes.length} 只已收集小蛇
              </button>
            )}
          </>
        )}

        {/* Bottom decoration */}
        <div className="flex justify-center gap-2 mt-4">
          <span className="text-2xl animate-bounce" style={{ animationDuration: '2s' }}>🐍</span>
          <span className="text-2xl animate-bounce" style={{ animationDuration: '2.5s' }}>💕</span>
          <span className="text-2xl animate-bounce" style={{ animationDuration: '3s' }}>✨</span>
        </div>
      </div>
    </Card>
  );
};

export default SnakeGarden;
