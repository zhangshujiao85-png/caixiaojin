'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Snake } from '@/store/useSnakeProgress';
import { SNAKE_VARIANTS } from '@/constants/snakeVariants';
import { CoinFood } from '@/components/snake/CoinFood';
import { BookOpen, RotateCcw } from 'lucide-react';

interface ContinuousSnakeProps {
  snake: Snake | null;
  onReset: () => void;
  canReset: boolean;
}

// Snake body segment position
interface SegmentPosition {
  x: number;
  y: number;
}

export const ContinuousSnake: React.FC<ContinuousSnakeProps> = ({
  snake,
  onReset,
  canReset,
}) => {
  const [mounted, setMounted] = useState(false);
  const [snakePositions, setSnakePositions] = useState<SegmentPosition[]>([]);
  const [coinPosition, setCoinPosition] = useState({ x: 50, y: 50 });
  const [isEating, setIsEating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize snake positions in S-curve
  useEffect(() => {
    if (snake && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth - 60;
      const containerHeight = containerRef.current.offsetHeight - 60;

      // Generate S-curve positions based on snake length
      const positions: SegmentPosition[] = [];
      const segmentCount = snake.segments;

      for (let i = 0; i < segmentCount; i++) {
        const progress = i / (segmentCount - 1 || 1);
        const x = (containerWidth / 2) + Math.sin(progress * Math.PI * 2) * (containerWidth / 4);
        const y = (containerHeight / 4) + progress * (containerHeight / 2);
        positions.push({ x, y });
      }

      setSnakePositions(positions);

      // Random coin position
      setCoinPosition({
        x: 30 + Math.random() * 40,
        y: 20 + Math.random() * 60,
      });
    }
  }, [snake?.segments, snake?.id, mounted]);

  // Auto-move animation
  useEffect(() => {
    if (!snake || !mounted) return;

    let startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000; // seconds
      const t = elapsed * 0.5;

      const containerWidth = containerRef.current?.offsetWidth || 400;
      const containerHeight = containerRef.current?.offsetHeight || 300;

      // Update snake positions with wave motion
      setSnakePositions(prevPositions => {
        if (prevPositions.length === 0) return prevPositions;

        return prevPositions.map((pos, index) => {
          const progress = index / (prevPositions.length - 1 || 1);
          const offset = progress * Math.PI * 4;

          // Figure-8 motion
          const baseX = (containerWidth - 60) / 2;
          const baseY = (containerHeight - 60) / 2;

          const waveX = Math.sin(t + offset) * (containerWidth / 5);
          const waveY = Math.cos(t * 2 + offset) * (containerHeight / 6);

          return {
            x: baseX + waveX,
            y: baseY + waveY,
          };
        });
      });

      // Move coin slowly
      setCoinPosition(prev => ({
        x: Math.max(10, Math.min(80, prev.x + Math.sin(t * 0.5) * 0.3)),
        y: Math.max(10, Math.min(80, prev.y + Math.cos(t * 0.7) * 0.2)),
      }));

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [snake, mounted]);

  // Trigger eating animation when snake grows
  useEffect(() => {
    if (snake && snake.segments > 0) {
      setIsEating(true);
      setTimeout(() => setIsEating(false), 1000);
    }
  }, [snake?.segments]);

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

  // Get gradient colors for snake body
  const getGradientColors = () => {
    if (!variant) return ['#FFB5BA', '#FFC0CB'];
    return variant.colors.body;
  };

  const gradientColors = getGradientColors();

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

      {/* Snake display area - darker background for better contrast */}
      <div
        ref={containerRef}
        className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-2xl p-6 mb-4 h-[320px] relative overflow-hidden shadow-inner"
        style={{ minHeight: '320px' }}
      >
        {/* Stars background */}
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                width: `${2 + Math.random() * 3}px`,
                height: `${2 + Math.random() * 3}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Continuous snake body */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
          <defs>
            <linearGradient id={`snakeGradient-${snake.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              {gradientColors.map((color, i) => (
                <stop
                  key={i}
                  offset={`${(i / gradientColors.length) * 100}%`}
                  stopColor={color}
                />
              ))}
            </linearGradient>
            <filter id={`glow-${snake.id}`}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Snake body as continuous path */}
          {snakePositions.length > 1 && (
            <>
              {/* Main body */}
              <path
                d={generateSmoothPath(snakePositions, 20)}
                fill="none"
                stroke={`url(#snakeGradient-${snake.id})`}
                strokeWidth="24"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter={`url(#glow-${snake.id})`}
                style={{
                  transition: 'all 0.1s ease-out',
                }}
              />

              {/* Inner highlight */}
              <path
                d={generateSmoothPath(snakePositions, 20)}
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="translate(0, -4)"
              />

              {/* Snake head */}
              <circle
                cx={snakePositions[0]?.x || 50}
                cy={snakePositions[0]?.y || 50}
                r="18"
                fill={variant?.colors.head || '#FFB5BA'}
                filter={`url(#glow-${snake.id})`}
              />

              {/* Eyes */}
              <circle cx={snakePositions[0]?.x - 5 || 45} cy={snakePositions[0]?.y - 3 || 47} r="4" fill="white" />
              <circle cx={snakePositions[0]?.x + 5 || 55} cy={snakePositions[0]?.y - 3 || 47} r="4" fill="white" />
              <circle
                cx={snakePositions[0]?.x - 5 || 45}
                cy={snakePositions[0]?.y - 3 || 47}
                r="2"
                fill="black"
                className="animate-ping"
              />
              <circle
                cx={snakePositions[0]?.x + 5 || 55}
                cy={snakePositions[0]?.y - 3 || 47}
                r="2"
                fill="black"
                className="animate-ping"
              />

              {/* Blush */}
              <ellipse
                cx={snakePositions[0]?.x - 7 || 43}
                cy={snakePositions[0]?.y + 5 || 55}
                rx="3"
                ry="2"
                fill="rgba(255,150,150,0.5)"
              />
              <ellipse
                cx={snakePositions[0]?.x + 7 || 57}
                cy={snakePositions[0]?.y + 5 || 55}
                rx="3"
                ry="2"
                fill="rgba(255,150,150,0.5)"
              />
            </>
          )}
        </svg>

        {/* Coin that snake can eat */}
        {!isComplete && (
          <div
            className="absolute z-20 transition-all duration-300"
            style={{
              left: `${coinPosition.x}%`,
              top: `${coinPosition.y}%`,
              transform: isEating ? 'scale(0) rotate(360deg)' : 'scale(1)',
            }}
          >
            <CoinFood size={35} glowing={true} bouncing={true} />
          </div>
        )}

        {/* Eating animation particles */}
        {isEating && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute text-2xl animate-explosion"
                style={{
                  left: `${coinPosition.x}%`,
                  top: `${coinPosition.y}%`,
                  transform: `rotate(${i * 45}deg) translateX(${30 + Math.random() * 20}px)`,
                  animationDelay: `${i * 50}ms`,
                }}
              >
                {['✨', '⭐', '💫', '💕'][Math.floor(Math.random() * 4)]}
              </div>
            ))}
          </div>
        )}

        {/* Complete badge */}
        {isComplete && (
          <div className="absolute top-4 right-4 bg-yellow-400 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce z-20">
            完成！🎉
          </div>
        )}

        {/* Growth indicator */}
        {isEating && (
          <div className="absolute top-4 left-4 bg-green-400 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse z-20">
            +1 节 🎉
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
      <div className="grid grid-cols-1 gap-3">
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
        @keyframes explosion {
          0% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateX(50px) scale(0);
          }
        }
        .animate-explosion {
          animation: explosion 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

// Generate smooth S-curve path from points
function generateSmoothPath(points: SegmentPosition[], width: number): string {
  if (points.length < 2) return '';

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    const curr = points[i];
    path += ` L ${curr.x} ${curr.y}`;
  }

  return path;
}

export default ContinuousSnake;
