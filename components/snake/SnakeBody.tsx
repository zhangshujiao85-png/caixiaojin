'use client';

import React from 'react';
import { SnakeSegment } from './SnakeSegment';

interface SnakeBodyProps {
  colors: string[];
  segments: number;
  size?: number;
}

export const SnakeBody: React.FC<SnakeBodyProps> = ({
  colors,
  segments,
  size = 40,
}) => {
  // Generate color gradient for body segments
  const getSegmentColor = (index: number): string => {
    if (colors.length === 1) return colors[0];
    const colorIndex = Math.floor((index / segments) * colors.length);
    return colors[Math.min(colorIndex, colors.length - 1)];
  };

  return (
    <div className="flex flex-col items-center gap-1">
      {Array.from({ length: segments }).map((_, index) => (
        <SnakeSegment
          key={index}
          color={getSegmentColor(index)}
          size={size}
          index={index}
          type="body"
        />
      ))}
    </div>
  );
};

export default SnakeBody;
