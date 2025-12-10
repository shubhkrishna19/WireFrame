import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../data/mockData';
import * as dataStore from '../store/dataStore';
import { useTheme } from '../contexts/ThemeContext';
import { useCurrency } from '../contexts/CurrencyContext';

interface SimilarProductsProps {
  product: Product;
  limit?: number;
}

export const SimilarProducts: React.FC<SimilarProductsProps> = ({ product, limit = 4 }) => {
  const { theme } = useTheme();
  const { formatPrice } = useCurrency();
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);


  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {

        const products = await dataStore.getProducts({ categoryId: product.categoryId });
        const filtered = products
          .filter(p => p._id !== product._id && p.isActive)
          .slice(0, limit);
        setSimilarProducts(filtered);
      } catch (error) {
        console.error('Error fetching similar products:', error);
        setSimilarProducts([]);
      } finally {

      }
    };

    fetchSimilarProducts();
  }, [product.categoryId, product._id, limit]);

  if (similarProducts.length === 0) {
    return null;
  }

  return (
    <div
      className="mt-16 border-2 rounded-creative shadow-card p-8"
      style={{
        backgroundColor: theme.colors.cardBackground,
        borderColor: theme.colors.borderPrimary,
      }}
    >
      <h2
        className="text-3xl font-black mb-8"
        style={{ color: theme.colors.textPrimary }}
      >
        Similar Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {similarProducts.map((item) => (
          <Link
            key={item._id}
            to={`/products/${item.slug}`}
            className="group overflow-hidden border-2 rounded-creative transition-all transform hover:-translate-y-1"
            style={{
              backgroundColor: theme.colors.cardBackground,
              borderColor: theme.colors.borderPrimary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = theme.colors.buttonPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = theme.colors.borderPrimary;
            }}
          >
            {/* Product Image */}
            <div
              className="aspect-square overflow-hidden"
              style={{ backgroundColor: theme.colors.backgroundTertiary }}
            >
              <img
                src={item.thumbnail}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop&auto=format';
                }}
              />
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3
                className="font-bold mb-2 line-clamp-2 transition-colors"
                style={{
                  color: theme.colors.textPrimary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.colors.buttonPrimary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = theme.colors.textPrimary;
                }}
              >
                {item.name}
              </h3>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span
                  className="text-lg font-black"
                  style={{ color: theme.colors.textPrimary }}
                >
                  {formatPrice(item.price)}
                </span>
                {item.originalPrice && item.originalPrice > item.price && (
                  <span
                    className="text-sm line-through"
                    style={{ color: theme.colors.textTertiary }}
                  >
                    {formatPrice(item.originalPrice)}
                  </span>
                )}
                {item.discountPercentage && item.discountPercentage > 0 && (
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: '#EF444420',
                      color: '#EF4444'
                    }}
                  >
                    -{item.discountPercentage}%
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
