'use client';

import React from 'react';

interface SnakeSegmentProps {
  color: string;
  size?: number;
  delay?: number;
  index?: number;
  type?: 'body' | 'head' | 'tail';
}

export const SnakeSegment: React.FC<SnakeSegmentProps> = ({
  color,
  size = 40,
  delay = 0,
  index = 0,
  type = 'body',
}) => {
  return (
    <div
      className="snake-segment"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        borderRadius: type === 'body' ? '50%' : type === 'head' ? '40% 40% 35% 35%' : '50% 50% 40% 40%',
        animation: `snakeBreathe 2s ease-in-out infinite`,
        animationDelay: `${delay + index * 0.1}s`,
        boxShadow: `0 4px 12px ${color}40`,
        transition: 'all 0.3s ease',
        position: 'relative',
      }}
    >
      <style jsx>{`
        @keyframes snakeBreathe {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};

export default SnakeSegment;
