"use client";

import { useState, useEffect } from "react";
import { submitRating } from "@/components/submitRating";
import { getAverageRating } from "@/components/getAverageRating";

interface StarRatingProps {
  gameId: number;
  initialAverage: number;
  onVoteComplete?: () => void;
}

export function StarRating({ gameId, initialAverage, onVoteComplete }: StarRatingProps) {
  const [average, setAverage] = useState<number>(initialAverage ?? 0);
  const [voted, setVoted] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const handleVote = async (value: number) => {
    await submitRating(gameId, value);
    const updated = await getAverageRating(gameId);
    setAverage(updated);
    setVoted(true);
    onVoteComplete?.();
  };

  useEffect(() => {
  setAverage(initialAverage ?? 0);
}, [initialAverage]);

  return (
    <div className="flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
      <div className="flex space-x-1">
{Array.from({ length: 5 }).map((_, i) => {
  const star = i + 1;
  const filled = hovered !== null
    ? star <= hovered
    : star <= Math.round(average);

  return (
    <button
      key={star}
      type="button"
      className={`text-xl ${
        filled ? "text-yellow-500" : "text-gray-300"
      } transition-transform hover:scale-125`}
      disabled={voted}
      onMouseEnter={() => setHovered(star)}
      onMouseLeave={() => setHovered(null)}
      onClick={() => handleVote(star)}
    >
      ★
    </button>
  );
})}
      </div>
      <p className="text-sm text-gray-500 mt-1">
  Promedio: {typeof average === "number" ? average.toFixed(2) : "Sin calificación"} / 5
</p>
    </div>
  );
}
