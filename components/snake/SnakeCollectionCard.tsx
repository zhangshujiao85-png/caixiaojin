'use client';

import React from 'react';
import { Snake } from '@/store/useSnakeProgress';
import { getRarityColor, getRarityStars } from '@/constants/snakeVariants';

interface SnakeCollectionCardProps {
  snake: Snake;
  onClick?: () => void;
}

export const SnakeCollectionCard: React.FC<SnakeCollectionCardProps> = ({
  snake,
  onClick,
}) => {
  const rarityColor = getRarityColor(snake.rarity);
  const stars = getRarityStars(snake.rarity);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getRarityLabel = (rarity: Snake['rarity']) => {
    const labels = {
      common: '普通',
      rare: '稀有',
      epic: '史诗',
      legendary: '传说',
    };
    return labels[rarity];
  };

  return (
    <div
      onClick={onClick}
      className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
      style={{
        borderWidth: '3px',
        borderStyle: 'solid',
        borderColor: rarityColor,
      }}
    >
      {/* Rarity stars */}
      <div className="absolute top-2 right-2 flex gap-0.5 z-10">
        {Array.from({ length: stars }).map((_, i) => (
          <span key={i} className="text-yellow-400 text-xs">⭐</span>
        ))}
      </div>

      {/* Snake emoji display */}
      <div className="relative h-32 bg-gradient-to-br from-macaron-cream/50 to-macaron-pink/20 flex items-center justify-center">
        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
          {snake.emoji.split('')[0]}
        </span>

        {/* Festival badge */}
        {snake.theme === 'festival' && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            {snake.festival}
          </div>
        )}

        {/* Rarity badge */}
        <div
          className="absolute bottom-2 left-2 text-white text-xs px-2 py-1 rounded-full font-medium"
          style={{ backgroundColor: rarityColor }}
        >
          {getRarityLabel(snake.rarity)}
        </div>
      </div>

      {/* Snake info */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-1">{snake.name}</h3>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{snake.segments}/{snake.maxSegments} 节</span>
          {snake.completedAt && (
            <span className="text-xs">{formatDate(snake.completedAt)}</span>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-macaron-pink to-macaron-purple rounded-full transition-all duration-500"
            style={{ width: `${(snake.segments / snake.maxSegments) * 100}%` }}
          />
        </div>
      </div>

      {/* Hover glow effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
        style={{ backgroundColor: rarityColor }}
      />
    </div>
  );
};

export default SnakeCollectionCard;
