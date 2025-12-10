import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../data/mockData';
import { useCurrency } from '../contexts/CurrencyContext';
import { useCompare } from '../contexts/CompareContext';
import { toggleWishlist, isInWishlist } from '../store/wishlistStore';
import { analytics } from '../utils/analytics';
import { addToCart } from '../store/cartStore';
import { useToast } from './Toast';
import * as dataStore from '../store/dataStore';
import { useTheme } from '../contexts/ThemeContext';
import { logger } from '../utils/logger';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onAddToCart?: (productId: string) => void;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
  index = 0,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { formatPrice } = useCurrency();
  const { success, error: showError } = useToast();
  const { theme } = useTheme();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const isCompared = isInCompare(product._id);

  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const isIn = await isInWishlist(product._id);
        setIsWishlisted(isIn);
      } catch (error) {
        setIsWishlisted(false);
      }
    };

    checkWishlist();

    const handleWishlistUpdate = () => {
      checkWishlist();
    };
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);

    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, [product._id]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;
    setIsLoading(true);

    try {
      const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M';
      const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : 'Black';

      const fullProduct = await dataStore.getProductById(product._id);
      if (!fullProduct) {
        showError('Product not found');
        return;
      }

      const result = await addToCart(fullProduct, defaultSize, defaultColor, 1);

      if (result.success) {
        success(`${product.name} added to cart!`);
        analytics.addToCart(product._id, product.name, product.price, 1);
        analytics.buttonClick('Quick Add', 'Product Card', {
          product_id: product._id,
          product_name: product.name,
        });
      } else {
        showError(result.message || 'Failed to add to cart');
      }

      if (onAddToCart) {
        onAddToCart(product._id);
      }
    } catch (error) {
      logger.error('Error adding to cart:', error);
      showError('Failed to add to cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const optimisticState = !isWishlisted;
    setIsWishlisted(optimisticState);

    try {
      const newState = await toggleWishlist(product._id);

      if (newState !== optimisticState) {
        setIsWishlisted(newState);
      }

      analytics.buttonClick('Wishlist Toggle', 'Product Card', {
        product_id: product._id,
        product_name: product.name,
        action: newState ? 'added' : 'removed',
      });

      if (newState) {
        success(`${product.name} added to wishlist`);
      }
    } catch (error) {
      setIsWishlisted(!optimisticState);
      logger.error('Error toggling wishlist:', error);
      showError('Failed to update wishlist. Please try again.');
    }
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCompared) {
      removeFromCompare(product._id);
    } else {
      addToCompare(product);
    }
  };

  // Calculate discount percentage
  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Calculate rating average
  const averageRating = product.rating || 4;
  const reviewCount = product.reviewCount || 0;

  // Check if product is new (created within last 30 days)
  const isNew = product.createdAt ?
    (new Date().getTime() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24) < 30
    : false;

  // Check stock level
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  return (
    <div
      className="opacity-0 animate-fade-in-up"
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: 'forwards',
      }}
    >
      <Link
        to={`/products/${product.slug}`}
        className="block h-full group"
      >
        <div className="card card-elevated h-full flex flex-col transition-all-smooth hover-lift">
          {/* Image Container */}
          <div className="relative aspect-square bg-gray-100 overflow-hidden rounded-creative">
            <img
              src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=800&h=800&fit=crop&auto=format'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop&auto=format';
              }}
            />

            {/* Badges - Top Left */}
            <div className="absolute top-2 left-2 flex flex-col gap-2">
              {isNew && (
                <span className="badge badge-new">New</span>
              )}
              {discountPercentage > 0 && (
                <span className="badge badge-sale">Save {discountPercentage}%</span>
              )}
              {isLowStock && !isOutOfStock && (
                <span className="badge badge-stock-low">Only {product.stock} left!</span>
              )}
              {isOutOfStock && (
                <span className="badge" style={{ backgroundColor: '#6B7280' }}>Out of Stock</span>
              )}
            </div>

            {/* Action Buttons - Top Right Corner */}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {/* Wishlist Button */}
              <button
                onClick={handleWishlistToggle}
                className={`p-2.5 bg-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${isWishlisted ? 'text-red-500' : 'text-gray-400'
                  }`}
                title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
              >
                <svg className="w-5 h-5" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              {/* Compare Button */}
              <button
                onClick={handleCompareToggle}
                className={`p-2.5 bg-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${isCompared ? 'text-blue-500' : 'text-gray-400'
                  }`}
                title={isCompared ? 'Remove from comparison' : 'Add to comparison'}
                aria-label={isCompared ? `Remove ${product.name} from comparison` : `Add ${product.name} to comparison`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </button>
            </div>

            {/* Quick View Button - Top Left (on hover) */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onQuickView) {
                  onQuickView(product);
                }
              }}
              className="absolute top-2 left-2 p-2.5 bg-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 text-gray-700 hover:text-blue-600 opacity-0 group-hover:opacity-100"
              title="Quick View"
              aria-label={`Quick view ${product.name}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>

            {/* Quick Add Button - Bottom (Appears on Hover) */}
            <div className="absolute bottom-0 left-0 right-0 transform translate-y-full group-hover:translate-y-0 transition-all duration-300 ease-out">
              <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className={`w-full text-white py-3 px-4 font-bold uppercase tracking-wide transition-all ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:opacity-90'}`}
                style={{
                  backgroundColor: theme.colors.buttonPrimary,
                }}
                aria-label={`Quick add ${product.name} to cart`}
              >
                {isLoading ? 'Adding...' : 'Quick Add'}
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4 flex-1 flex flex-col">
            {/* Product Name */}
            <h3
              className="text-sm font-medium mb-1 line-clamp-2 group-hover:underline"
              style={{ color: theme.colors.textPrimary }}
              title={product.name}
            >
              {product.name}
            </h3>

            {/* Variant Description (if any) */}
            {product.brand && (
              <p className="text-xs mb-2" style={{ color: theme.colors.textTertiary }}>
                ({product.brand})
              </p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-3">
              {product.originalPrice && product.originalPrice > product.price ? (
                <>
                  <span className="text-xs line-through" style={{ color: theme.colors.textTertiary }}>
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-lg font-bold" style={{ color: theme.colors.textPrimary }}>
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold" style={{ color: theme.colors.textPrimary }}>
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-1.5 mb-3">
                {product.colors.slice(0, 3).map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border shadow-sm"
                    style={{
                      backgroundColor: color.toLowerCase(),
                      borderColor: theme.colors.borderPrimary
                    }}
                    title={color}
                  />
                ))}
                {product.colors.length > 3 && (
                  <span className="text-xs font-medium ml-1" style={{ color: theme.colors.textTertiary }}>
                    +{product.colors.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Rating & Reviews */}
            <div className="flex items-center gap-2 mt-auto">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(averageRating) ? 'fill-current' : 'fill-none'}`}
                    style={{ color: i < Math.floor(averageRating) ? '#FCD34D' : theme.colors.borderSecondary }}
                    stroke={i < Math.floor(averageRating) ? '#FCD34D' : theme.colors.borderSecondary}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                ))}
              </div>
              {reviewCount > 0 && (
                <span className="text-xs" style={{ color: theme.colors.textTertiary }}>
                  {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
