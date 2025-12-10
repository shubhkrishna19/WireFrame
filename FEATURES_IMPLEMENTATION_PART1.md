# 🌟 PREMIUM FEATURES - PART 1: Reviews & Wishlist

---

## 📁 REVIEWS SYSTEM

### File: src/types/reviews.ts

```typescript
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  verifiedPurchase: boolean;
  helpful: number;
  notHelpful: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  verifiedPurchasePercentage: number;
}
```

### File: src/features/reviews/components/ReviewStats.tsx

```typescript
import React from 'react';
import { Star } from 'lucide-react';
import { ReviewStats as ReviewStatsType } from '../../../types/reviews';

interface ReviewStatsProps {
  stats: ReviewStatsType;
}

export function ReviewStats({ stats }: ReviewStatsProps) {
  const { averageRating, totalReviews, ratingDistribution } = stats;

  const getRatingPercentage = (count: number) => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
      
      {/* Average Rating */}
      <div className="flex items-center gap-4 mb-6">
        <div>
          <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
          <div className="flex items-center gap-1 my-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(averageRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-gray-600">
            Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratingDistribution[rating as keyof typeof ratingDistribution];
          const percentage = getRatingPercentage(count);
          
          return (
            <div key={rating} className="flex items-center gap-2">
              <div className="flex items-center gap-1 w-16">
                <span className="text-sm">{rating}</span>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="w-12 text-sm text-right text-gray-600">
                {count}
              </div>
            </div>
          );
        })}
      </div>

      {/* Verified Purchase Badge */}
      {stats.verifiedPurchasePercentage > 0 && (
        <div className="mt-4 pt-4 border-t">
          <div className="text-sm text-gray-600">
            <span className="font-semibold">
              {stats.verifiedPurchasePercentage.toFixed(0)}%
            </span>{' '}
            of reviews are from verified purchases
          </div>
        </div>
      )}
    </div>
  );
}
```

### File: src/features/reviews/components/ReviewCard.tsx

```typescript
import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Flag, MoreVertical } from 'lucide-react';
import { Review } from '../../../types/reviews';
import { formatDistanceToNow } from 'date-fns';

interface ReviewCardProps {
  review: Review;
  onHelpful?: (reviewId: string) => void;
  onNotHelpful?: (reviewId: string) => void;
  onReport?: (reviewId: string) => void;
  onEdit?: (reviewId: string) => void;
  onDelete?: (reviewId: string) => void;
  isOwner?: boolean;
}

export function ReviewCard({
  review,
  onHelpful,
  onNotHelpful,
  onReport,
  onEdit,
  onDelete,
  isOwner = false,
}: ReviewCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [votedHelpful, setVotedHelpful] = useState(false);
  const [votedNotHelpful, setVotedNotHelpful] = useState(false);

  const handleHelpful = () => {
    if (!votedHelpful) {
      setVotedHelpful(true);
      setVotedNotHelpful(false);
      onHelpful?.(review.id);
    }
  };

  const handleNotHelpful = () => {
    if (!votedNotHelpful) {
      setVotedNotHelpful(true);
      setVotedHelpful(false);
      onNotHelpful?.(review.id);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
            {review.userAvatar ? (
              <img src={review.userAvatar} alt={review.userName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-semibold">
                {review.userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <div className="font-semibold">{review.userName}</div>
            <div className="text-sm text-gray-600">
              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
            </div>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg z-10">
              {isOwner ? (
                <>
                  <button
                    onClick={() => {
                      onEdit?.(review.id);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Edit Review
                  </button>
                  <button
                    onClick={() => {
                      onDelete?.(review.id);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-red-600"
                  >
                    Delete Review
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    onReport?.(review.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <Flag className="w-4 h-4 inline mr-2" />
                  Report Review
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < review.rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        {review.verifiedPurchase && (
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
            ✓ Verified Purchase
          </span>
        )}
      </div>

      {/* Title */}
      <h4 className="font-semibold mb-2">{review.title}</h4>

      {/* Comment */}
      <p className="text-gray-700 dark:text-gray-300 mb-4">{review.comment}</p>

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {review.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Review ${index + 1}`}
              className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-80"
            />
          ))}
        </div>
      )}

      {/* Helpful Buttons */}
      <div className="flex items-center gap-4 pt-4 border-t">
        <span className="text-sm text-gray-600">Was this helpful?</span>
        <div className="flex gap-2">
          <button
            onClick={handleHelpful}
            className={`flex items-center gap-1 px-3 py-1 rounded-full border ${
              votedHelpful
                ? 'bg-green-50 border-green-500 text-green-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{review.helpful + (votedHelpful ? 1 : 0)}</span>
          </button>
          <button
            onClick={handleNotHelpful}
            className={`flex items-center gap-1 px-3 py-1 rounded-full border ${
              votedNotHelpful
                ? 'bg-red-50 border-red-500 text-red-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
            <span>{review.notHelpful + (votedNotHelpful ? 1 : 0)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 📁 WISHLIST SYSTEM

### File: src/types/wishlist.ts

```typescript
export interface WishlistItem {
  id: string;
  productId: string;
  userId: string;
  addedAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice?: number;
    images: string[];
    inStock: boolean;
    rating?: number;
    reviewCount?: number;
  };
}
```

### File: src/features/wishlist/components/WishlistButton.tsx

```typescript
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface WishlistButtonProps {
  productId: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function WishlistButton({
  productId,
  size = 'md',
  showLabel = false,
  className = '',
}: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if product is in wishlist
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsInWishlist(wishlist.includes(productId));
  }, [productId]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      
      if (isInWishlist) {
        // Remove from wishlist
        const updated = wishlist.filter((id: string) => id !== productId);
        localStorage.setItem('wishlist', JSON.stringify(updated));
        setIsInWishlist(false);
      } else {
        // Add to wishlist
        wishlist.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={isLoading}
      className={`
        ${sizeClasses[size]}
        ${showLabel ? 'px-4 w-auto' : 'rounded-full'}
        flex items-center justify-center gap-2
        ${isInWishlist 
          ? 'bg-red-500 text-white hover:bg-red-600' 
          : 'bg-white hover:bg-gray-100'
        }
        border border-gray-300
        transition-all duration-200
        disabled:opacity-50
        ${className}
      `}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={`${iconSizes[size]} ${isInWishlist ? 'fill-current' : ''}`}
      />
      {showLabel && (
        <span className="text-sm font-medium">
          {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
        </span>
      )}
    </button>
  );
}
```

---

**CONTINUE TO PART 2 FOR MORE FEATURES...**

This includes:
- ✅ Reviews Stats Component
- ✅ Review Card Component
- ✅ Wishlist Button Component

Next parts will cover:
- Review Form
- Reviews List
- Wishlist Page
- Coupon System
- Loyalty Points
- And more!
