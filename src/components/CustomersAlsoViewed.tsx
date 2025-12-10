import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { Product } from '../data/mockData';
import { Link } from 'react-router-dom';

interface CustomersAlsoViewedProps {
    products: Product[];
}

export const CustomersAlsoViewed: React.FC<CustomersAlsoViewedProps> = ({ products }) => {
    const { theme } = useTheme();
    const { formatPrice } = useCurrency();

    if (products.length === 0) return null;

    return (
        <div className="my-12">
            <h2
                className="text-2xl font-black uppercase tracking-wider mb-6"
                style={{ color: theme.colors.textPrimary }}
            >
                👥 Customers Also Viewed
            </h2>

            {/* Horizontal Scroll Container */}
            <div className="overflow-x-auto scrollbar-thin pb-4">
                <div className="flex gap-4 min-w-max">
                    {products.slice(0, 6).map((product) => (
                        <Link
                            key={product._id}
                            to={`/products/${product._id}`}
                            className="flex-shrink-0 w-64 group"
                        >
                            <div
                                className="border-2 rounded-lg overflow-hidden transition-all hover:shadow-xl"
                                style={{
                                    borderColor: theme.colors.borderPrimary,
                                    backgroundColor: theme.colors.cardBackground,
                                }}
                            >
                                {/* Product Image */}
                                <div className="relative aspect-square overflow-hidden">
                                    <img
                                        src={product.thumbnail || product.images?.[0] || 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=600&h=600&fit=crop&auto=format'}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        loading="lazy"
                                    />

                                </div>

                                {/* Product Info */}
                                <div className="p-4">
                                    <h3
                                        className="font-bold text-sm mb-2 line-clamp-2 h-10"
                                        style={{ color: theme.colors.textPrimary }}
                                    >
                                        {product.name}
                                    </h3>

                                    {/* Rating */}
                                    {product.rating && (
                                        <div className="flex items-center gap-1 mb-2">
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
                                            <span className="text-xs" style={{ color: theme.colors.textSecondary }}>
                                                ({product.reviewCount || 0})
                                            </span>
                                        </div>
                                    )}

                                    {/* Price */}
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-lg font-black" style={{ color: theme.colors.buttonPrimary }}>
                                            {formatPrice(product.price)}
                                        </p>
                                        {product.originalPrice && product.originalPrice > product.price && (
                                            <p className="text-sm line-through" style={{ color: theme.colors.textTertiary }}>
                                                {formatPrice(product.originalPrice)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

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
