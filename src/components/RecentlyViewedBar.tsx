import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { Product } from '../data/mockData';
import { getRecentlyViewed } from '../store/recentlyViewedStore';

export const RecentlyViewedBar: React.FC = () => {
    const { theme } = useTheme();
    const { formatPrice } = useCurrency();
    const [recentProducts, setRecentProducts] = useState<Product[]>([]);
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        loadRecentlyViewed();
        // Refresh when storage changes
        const handleStorageChange = () => loadRecentlyViewed();
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('recentlyViewedUpdated', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('recentlyViewedUpdated', handleStorageChange);
        };
    }, []);

    const loadRecentlyViewed = async () => {
        const products = await getRecentlyViewed();
        // Only show if we have at least 2 products (current page + others)
        if (products.length >= 2) {
            setRecentProducts(products.slice(0, 6)); // Show max 6 products
        } else {
            setRecentProducts([]);
        }
    };

    if (recentProducts.length === 0) {
        return null;
    }

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 shadow-2xl ${isMinimized ? 'translate-y-[calc(100%-3rem)]' : 'translate-y-0'
                }`}
            style={{
                backgroundColor: theme.colors.cardBackground,
                borderTop: `2px solid ${theme.colors.borderPrimary}`,
            }}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer"
                onClick={() => setIsMinimized(!isMinimized)}
            >
                <div className="flex items-center gap-3">
                    <svg
                        className="w-5 h-5"
                        style={{ color: theme.colors.textPrimary }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <h3
                        className="font-bold text-sm uppercase tracking-wider"
                        style={{ color: theme.colors.textPrimary }}
                    >
                        Recently Viewed ({recentProducts.length})
                    </h3>
                </div>
                <button
                    className="hover:opacity-70 transition-opacity"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMinimized(!isMinimized);
                    }}
                >
                    <svg
                        className={`w-5 h-5 transition-transform ${isMinimized ? 'rotate-180' : ''}`}
                        style={{ color: theme.colors.textSecondary }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {/* Products Carousel */}
            {!isMinimized && (
                <div className="overflow-x-auto scrollbar-thin pb-4 px-4">
                    <div className="flex gap-4 min-w-max">
                        {recentProducts.map((product) => (
                            <Link
                                key={product._id}
                                to={`/products/${product._id}`}
                                className="flex-shrink-0 w-40 group"
                            >
                                <div
                                    className="border-2 rounded-lg overflow-hidden transition-all hover:shadow-lg"
                                    style={{
                                        borderColor: theme.colors.borderPrimary,
                                        backgroundColor: theme.colors.backgroundSecondary,
                                    }}
                                >
                                    {/* Image */}
                                    <div className="relative aspect-square overflow-hidden">
                                        <img
                                            src={product.images?.[0] || product.thumbnail || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&h=400&fit=crop&auto=format'}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            loading="lazy"
                                        />

                                    </div>

                                    {/* Info */}
                                    <div className="p-3">
                                        <p
                                            className="text-sm font-semibold line-clamp-2 mb-1"
                                            style={{ color: theme.colors.textPrimary }}
                                        >
                                            {product.name}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <p
                                                className="text-lg font-bold"
                                                style={{ color: theme.colors.textPrimary }}
                                            >
                                                {formatPrice(product.price)}
                                            </p>
                                            {product.originalPrice && product.originalPrice > product.price && (
                                                <p
                                                    className="text-xs line-through"
                                                    style={{ color: theme.colors.textTertiary }}
                                                >
                                                    {formatPrice(product.originalPrice)}
                                                </p>
                                            )}
                                        </div>
                                        {product.rating && (
                                            <div className="flex items-center gap-1 mt-1">
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg
                                                            key={i}
                                                            className="w-3 h-3"
                                                            fill={i < Math.floor(product.rating || 0) ? '#F59E0B' : '#D1D5DB'}
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                                <span
                                                    className="text-xs"
                                                    style={{ color: theme.colors.textSecondary }}
                                                >
                                                    ({product.reviewCount || 0})
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Custom Scrollbar Styles */}
            <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          height: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: ${theme.colors.backgroundSecondary};
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: ${theme.colors.borderPrimary};
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: ${theme.colors.textSecondary};
        }
      `}</style>
        </div>
    );
};
