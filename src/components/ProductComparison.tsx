import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { Product } from '../data/mockData';

interface ProductComparisonProps {
  products: Product[];
  onRemoveProduct: (productId: string) => void;
  onClearComparison: () => void;
}

export const ProductComparison: React.FC<ProductComparisonProps> = ({
  products,
  onRemoveProduct,
  onClearComparison
}) => {
  const { theme } = useTheme();
  const { formatPrice } = useCurrency();
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([
    'price', 'rating', 'brand', 'fabric', 'fit', 'care'
  ]);

  const attributes = [
    { key: 'price', label: 'Price', type: 'price' },
    { key: 'rating', label: 'Rating', type: 'rating' },
    { key: 'brand', label: 'Brand', type: 'text' },
    { key: 'fabric', label: 'Fabric', type: 'text' },
    { key: 'fit', label: 'Fit', type: 'text' },
    { key: 'care', label: 'Care Instructions', type: 'array' },
    { key: 'stock', label: 'Stock', type: 'number' },
    { key: 'colors', label: 'Colors', type: 'array' },
    { key: 'sizes', label: 'Sizes', type: 'array' },
  ];

  const getAttributeValue = (product: Product, attribute: any) => {
    const specs = product.specifications || {};

    switch (attribute.key) {
      case 'price':
        return formatPrice(product.price);
      case 'rating':
        return `${product.rating} (${product.reviewCount} reviews)`;
      case 'brand':
        return product.brand;
      case 'fabric':
        return specs.fabric || specs.fabricComposition || 'N/A';
      case 'fit':
        return specs.fit || product.fitType || 'N/A';
      case 'care':
        return specs.careInstructions || specs.care || ['N/A'];
      case 'stock':
        return product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Low Stock (${product.stock})` : 'Out of Stock';
      case 'colors':
        return product.colors;
      case 'sizes':
        return product.sizes;
      default:
        return 'N/A';
    }
  };

  const renderAttributeValue = (value: any, type: string) => {
    if (Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 3).map((item, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs rounded-full"
              style={{
                backgroundColor: theme.colors.backgroundTertiary,
                color: theme.colors.textSecondary,
              }}
            >
              {item}
            </span>
          ))}
          {value.length > 3 && (
            <span className="text-xs" style={{ color: theme.colors.textTertiary }}>
              +{value.length - 3} more
            </span>
          )}
        </div>
      );
    }

    if (type === 'rating') {
      const rating = parseFloat(value.split(' ')[0]);
      return (
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm" style={{ color: theme.colors.textSecondary }}>
            {value}
          </span>
        </div>
      );
    }

    return (
      <span style={{ color: theme.colors.textPrimary }}>
        {value}
      </span>
    );
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onClearComparison}
    >
      <div
        className="w-full max-w-7xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl"
        style={{
          backgroundColor: theme.colors.cardBackground,
          borderColor: theme.colors.borderPrimary,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b-2 flex items-center justify-between"
          style={{
            backgroundColor: theme.colors.backgroundSecondary,
            borderColor: theme.colors.borderPrimary,
          }}
        >
          <div>
            <h2
              className="text-2xl font-bold"
              style={{ color: theme.colors.textPrimary }}
            >
              Product Comparison
            </h2>
            <p
              className="text-sm"
              style={{ color: theme.colors.textSecondary }}
            >
              Compare {products.length} product{products.length > 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onClearComparison}
              className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors"
              style={{
                backgroundColor: theme.colors.buttonPrimary,
                color: '#FFFFFF',
              }}
            >
              Clear All
            </button>
            <button
              onClick={onClearComparison}
              className="p-2 rounded-full hover:opacity-80 transition-opacity"
              style={{ color: theme.colors.textSecondary }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">
          <table className="w-full">
            {/* Product Headers */}
            <thead>
              <tr>
                <th className="p-4 text-left font-semibold border-b-2" style={{ borderColor: theme.colors.borderPrimary }}>
                  <span style={{ color: theme.colors.textPrimary }}>Features</span>
                </th>
                {products.map((product) => (
                  <th key={product._id} className="p-4 text-center min-w-[250px] border-b-2" style={{ borderColor: theme.colors.borderPrimary }}>
                    <div className="relative">
                      <button
                        onClick={() => onRemoveProduct(product._id)}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                        style={{
                          backgroundColor: '#EF4444',
                          color: '#FFFFFF',
                        }}
                        title="Remove from comparison"
                      >
                        ×
                      </button>
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg mx-auto mb-2"
                      />
                      <h3
                        className="font-semibold text-sm mb-1"
                        style={{ color: theme.colors.textPrimary }}
                      >
                        {product.name}
                      </h3>
                      <p
                        className="text-lg font-bold mb-2"
                        style={{ color: theme.colors.textPrimary }}
                      >
                        {formatPrice(product.price)}
                      </p>
                      <button
                        className="w-full px-4 py-2 text-sm font-semibold rounded-lg transition-all hover:scale-105"
                        style={{
                          backgroundColor: theme.colors.buttonPrimary,
                          color: '#FFFFFF',
                        }}
                        aria-label={`Add ${product.name} to cart`}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Comparison Rows */}
            <tbody>
              {attributes
                .filter(attr => selectedAttributes.includes(attr.key))
                .map((attribute) => (
                <tr key={attribute.key}>
                  <td
                    className="p-4 font-semibold border-b"
                    style={{
                      borderColor: theme.colors.borderPrimary,
                      color: theme.colors.textPrimary,
                      backgroundColor: theme.colors.backgroundSecondary,
                    }}
                  >
                    {attribute.label}
                  </td>
                  {products.map((product) => (
                    <td
                      key={`${product._id}-${attribute.key}`}
                      className="p-4 text-center border-b"
                      style={{ borderColor: theme.colors.borderPrimary }}
                    >
                      {renderAttributeValue(getAttributeValue(product, attribute), attribute.type)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Attribute Filter */}
        <div
          className="px-6 py-4 border-t-2"
          style={{
            backgroundColor: theme.colors.backgroundSecondary,
            borderColor: theme.colors.borderPrimary,
          }}
        >
          <div className="flex items-center gap-4 flex-wrap">
            <span
              className="font-semibold"
              style={{ color: theme.colors.textPrimary }}
            >
              Compare by:
            </span>
            {attributes.map((attribute) => (
              <label key={attribute.key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedAttributes.includes(attribute.key)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedAttributes(prev => [...prev, attribute.key]);
                    } else {
                      setSelectedAttributes(prev => prev.filter(attr => attr !== attribute.key));
                    }
                  }}
                  className="rounded"
                  style={{
                    accentColor: theme.colors.buttonPrimary,
                  }}
                />
                <span
                  className="text-sm"
                  style={{ color: theme.colors.textSecondary }}
                >
                  {attribute.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
