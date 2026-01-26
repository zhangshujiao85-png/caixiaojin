'use client';

import React from 'react';

interface SnakeTailProps {
  color: string;
  size?: number;
  accessories?: string[];
}

export const SnakeTail: React.FC<SnakeTailProps> = ({
  color,
  size = 35,
  accessories = [],
}) => {
  return (
    <div
      className="snake-tail relative"
      style={{
        width: `${size}px`,
        height: `${size * 0.7}px`,
        backgroundColor: color,
        borderRadius: '20% 20% 50% 50%',
        boxShadow: `0 3px 10px ${color}40`,
        animation: 'tailWag 2s ease-in-out infinite',
        transformOrigin: 'top center',
      }}
    >
      {/* Tail tip decoration */}
      {accessories.includes('甜甜圈') && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-sm">🍩</div>
      )}
      {accessories.includes('红包') && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-sm">🧧</div>
      )}
      {accessories.includes('清新水滴') && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs">💧</div>
      )}
      {accessories.includes('奶滴装饰') && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs">🥛</div>
      )}
      {accessories.includes('梦幻光环') && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-sm animate-pulse">✨</div>
      )}
      {accessories.includes('雨滴') && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs">💧</div>
      )}
      {accessories.includes('花朵') && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-sm">🌼</div>
      )}
      {accessories.includes('阳光') && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-sm animate-spin">☀️</div>
      )}
      {accessories.includes('贝壳') && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs">🐚</div>
      )}
      {accessories.includes('粉色爱心') && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-sm animate-bounce">💗</div>
      )}
      {accessories.includes('福字') && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-sm">🧨</div>
      )}
      {accessories.includes('爱心箭') && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-sm">💘</div>
      )}
      {accessories.includes('巧克力') && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-sm">🍫</div>
      )}
      {accessories.includes('幽灵') && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-sm">👻</div>
      )}
      {accessories.includes('雪花') && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-sm animate-spin">❄️</div>
      )}
      {accessories.includes('艾草') && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-sm">🌿</div>
      )}
      {accessories.includes('兔子') && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-sm">🐰</div>
      )}
      {accessories.includes('桂花') && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs">🌼</div>
      )}
      {accessories.includes('彩带') && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-sm">🎊</div>
      )}
      {accessories.includes('春联') && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs">📜</div>
      )}

      <style jsx>{`
        @keyframes tailWag {
          0%, 100% {
            transform: rotate(-8deg);
          }
          50% {
            transform: rotate(8deg);
          }
        }
        .animate-spin {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default SnakeTail;
