import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'product-grid' | 'product-detail' | 'page';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'page',
  count = 1
}) => {
  if (variant === 'product-grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-neutral-900/50 rounded-lg overflow-hidden"
          >
            {/* Image skeleton */}
            <div className="aspect-square bg-neutral-800"></div>

            {/* Content skeleton */}
            <div className="p-4 space-y-3">
              <div className="h-4 bg-neutral-800 rounded w-3/4"></div>
              <div className="h-4 bg-neutral-800 rounded w-1/2"></div>
              <div className="flex gap-2 mt-4">
                <div className="h-8 bg-neutral-800 rounded w-20"></div>
                <div className="h-8 bg-neutral-800 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'product-detail') {
    return (
      <div className="animate-pulse max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image skeleton */}
          <div className="space-y-4">
            <div className="aspect-square bg-neutral-800 rounded-lg"></div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-neutral-800 rounded"></div>
              ))}
            </div>
          </div>

          {/* Info skeleton */}
          <div className="space-y-6">
            <div className="h-8 bg-neutral-800 rounded w-3/4"></div>
            <div className="h-6 bg-neutral-800 rounded w-1/2"></div>
            <div className="h-12 bg-neutral-800 rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-neutral-800 rounded"></div>
              <div className="h-4 bg-neutral-800 rounded"></div>
              <div className="h-4 bg-neutral-800 rounded w-5/6"></div>
            </div>
            <div className="flex gap-4">
              <div className="h-12 bg-neutral-800 rounded flex-1"></div>
              <div className="h-12 bg-neutral-800 rounded flex-1"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default page skeleton
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-neutral-600 border-t-blue-500 mb-4"></div>
        <p className="text-neutral-400 text-lg">Loading...</p>
      </div>
    </div>
  );
};

// Product card skeleton for grids
export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
      {/* Image */}
      <div className="aspect-square bg-neutral-800"></div>

      {/* Color swatches */}
      <div className="px-3 py-2 flex gap-1.5 justify-center border-b border-neutral-800">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-5 h-5 rounded-full bg-neutral-700"></div>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="h-4 bg-neutral-800 rounded w-full"></div>
        <div className="h-4 bg-neutral-800 rounded w-2/3"></div>
        <div className="h-6 bg-neutral-800 rounded w-1/3 mt-2"></div>
        <div className="flex items-center gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-4 h-4 bg-neutral-800 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
};
