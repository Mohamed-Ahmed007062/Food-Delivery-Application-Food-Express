import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  totalReviews?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  totalReviews,
  size = 'sm',
}) => {
  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <div className="flex items-center space-x-1">
      <div className="flex items-center text-amber-500">
        <Star className={`${iconSize} fill-amber-500`} />
      </div>
      <span className="text-xs font-bold font-mono text-foreground">
        {rating > 0 ? rating.toFixed(1) : 'New'}
      </span>
      {totalReviews !== undefined && (
        <span className="text-xs text-muted-foreground">({totalReviews})</span>
      )}
    </div>
  );
};
