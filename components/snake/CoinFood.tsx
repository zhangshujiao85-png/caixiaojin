'use client';

import React from 'react';

interface CoinFoodProps {
  size?: number;
  glowing?: boolean;
  bouncing?: boolean;
}

export const CoinFood: React.FC<CoinFoodProps> = ({
  size = 30,
  glowing = true,
  bouncing = true,
}) => {
  return (
    <div
      className="coin-food relative flex items-center justify-center"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        animation: bouncing ? 'coinBounce 1s ease-in-out infinite' : 'none',
      }}
    >
      {/* Outer glow */}
      {glowing && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,215,0,0.4) 0%, transparent 70%)',
            animation: 'glow 2s ease-in-out infinite',
          }}
        />
      )}

      {/* Coin body */}
      <div
        className="relative rounded-full flex items-center justify-center"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
          boxShadow: `
            0 4px 8px rgba(255, 165, 0, 0.4),
            inset 0 2px 4px rgba(255, 255, 255, 0.4),
            inset 0 -2px 4px rgba(0, 0, 0, 0.1)
          `,
          border: '2px solid #FFA500',
        }}
      >
        {/* ¥ symbol */}
        <span
          className="text-yellow-900 font-bold"
          style={{
            fontSize: `${size * 0.5}px`,
            textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)',
          }}
        >
          ¥
        </span>

        {/* Shine effect */}
        <div
          className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-60"
          style={{ width: `${size * 0.15}px`, height: `${size * 0.15}px` }}
        />
      </div>

      {/* Sparkles */}
      {glowing && (
        <>
          <span className="absolute -top-1 -right-1 text-yellow-300 text-xs animate-pulse">✦</span>
          <span className="absolute -bottom-1 -left-1 text-yellow-300 text-xs animate-pulse" style={{ animationDelay: '0.5s' }}>✦</span>
        </>
      )}

      <style jsx>{`
        @keyframes coinBounce {
          0%, 100% {
            transform: translateY(0) rotateY(0deg);
          }
          50% {
            transform: translateY(-10px) rotateY(180deg);
          }
        }
        @keyframes glow {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default CoinFood;
