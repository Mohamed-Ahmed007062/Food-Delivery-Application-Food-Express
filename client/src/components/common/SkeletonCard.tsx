import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="flex flex-col rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden h-full">
      <div className="shimmer h-48 w-full" />
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div className="flex justify-between items-start gap-4">
          <div className="shimmer h-6 w-2/3 rounded" />
          <div className="shimmer h-6 w-12 rounded" />
        </div>
        <div className="shimmer h-4 w-full rounded" />
        <div className="shimmer h-4 w-4/5 rounded" />
        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex gap-2">
            <div className="shimmer h-8 w-16 rounded-full" />
            <div className="shimmer h-8 w-16 rounded-full" />
          </div>
          <div className="shimmer h-9 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export { SkeletonCard };
export const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);
export default SkeletonCard;
