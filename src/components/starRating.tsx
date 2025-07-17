'use client';

import { useState } from 'react';

interface StarRatingProps {
  initialRating: number;
  onRate: (rating: number, e?: React.MouseEvent) => void;
  interactive?: boolean;
}

export default function StarRating({ initialRating, onRate, interactive = true }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex space-x-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const value = i + 1;
        const isFilled = hovered ? value <= hovered : value <= initialRating;

        return (
          <button
            key={value}
            onClick={(e) => interactive && onRate(value, e)}
            onMouseEnter={() => interactive && setHovered(value)}
            onMouseLeave={() => interactive && setHovered(null)}
            className={`text-xl transition-transform ${isFilled ? 'text-yellow-500' : 'text-gray-300'} ${
              interactive ? 'hover:scale-110' : ''
            }`}
          >
            {isFilled ? '★' : '☆'}
          </button>
        );
      })}
    </div>
  );
}
