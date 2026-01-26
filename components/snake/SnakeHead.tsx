'use client';

import React, { useState, useEffect } from 'react';

interface SnakeHeadProps {
  color: string;
  size?: number;
  accessories?: string[];
}

export const SnakeHead: React.FC<SnakeHeadProps> = ({
  color,
  size = 50,
  accessories = [],
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const eye = document.getElementById('snake-eyes');
      if (eye) {
        const rect = eye.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / 20;
        const y = (e.clientY - rect.top - rect.height / 2) / 20;
        setMousePosition({ x: Math.max(-5, Math.min(5, x)), y: Math.max(-5, Math.min(5, y)) });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="snake-head relative"
      style={{
        width: `${size}px`,
        height: `${size * 0.9}px`,
        backgroundColor: color,
        borderRadius: '45% 45% 40% 40%',
        boxShadow: `0 6px 16px ${color}50`,
        animation: 'snakeHeadBounce 3s ease-in-out infinite',
      }}
    >
      {/* Eyes that follow mouse */}
      <div
        id="snake-eyes"
        className="absolute top-6 left-0 right-0 flex justify-center gap-3"
        style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
      >
        <div
          className="w-3 h-3 bg-white rounded-full shadow-inner"
          style={{ boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.3)' }}
        >
          <div
            className="w-2 h-2 bg-gray-800 rounded-full absolute top-0.5 left-0.5"
            style={{ transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)` }}
          />
        </div>
        <div
          className="w-3 h-3 bg-white rounded-full shadow-inner"
          style={{ boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.3)' }}
        >
          <div
            className="w-2 h-2 bg-gray-800 rounded-full absolute top-0.5 left-0.5"
            style={{ transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)` }}
          />
        </div>
      </div>

      {/* Blush */}
      <div className="absolute top-10 left-2 w-2 h-1 bg-pink-300 rounded-full opacity-60" />
      <div className="absolute top-10 right-2 w-2 h-1 bg-pink-300 rounded-full opacity-60" />

      {/* Mouth */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4 h-2 border-b-2 border-pink-400 rounded-b-full" />

      {/* Accessories */}
      {accessories.includes('小蝴蝶结') && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-xl">🎀</div>
      )}
      {accessories.includes('金币帽子') && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-lg">👑</div>
      )}
      {accessories.includes('叶子装饰') && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-lg">🍃</div>
      )}
      {accessories.includes('星星装饰') && (
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-lg animate-pulse">⭐</div>
      )}
      {accessories.includes('云朵') && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-xl">☁️</div>
      )}
      {accessories.includes('桃子装饰') && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-lg">🍑</div>
      )}
      {accessories.includes('柠檬片') && (
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-lg">🍋</div>
      )}
      {accessories.includes('灯笼') && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-lg animate-swing">🏮</div>
      )}
      {accessories.includes('樱花瓣') && (
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-lg">🌸</div>
      )}
      {accessories.includes('玫瑰') && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-lg">🌹</div>
      )}
      {accessories.includes('南瓜') && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl">🎃</div>
      )}
      {accessories.includes('铃铛') && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-lg animate-bounce">🔔</div>
      )}
      {accessories.includes('粽子') && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-lg">🍙</div>
      )}
      {accessories.includes('月亮') && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-xl">🌙</div>
      )}
      {accessories.includes('烟花') && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-lg">🎆</div>
      )}

      <style jsx>{`
        @keyframes snakeHeadBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        @keyframes swing {
          0%, 100% {
            transform: rotate(-5deg);
          }
          50% {
            transform: rotate(5deg);
          }
        }
        .animate-swing {
          animation: swing 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SnakeHead;
