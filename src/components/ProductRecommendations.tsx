import React, { useState, useEffect } from 'react';
import * as dataStore from '../store/dataStore';
import { useTheme } from '../contexts/ThemeContext';
import { ProductCard } from './ProductCard';
import { Product } from '../data/mockData';

interface ProductRecommendationsProps {
  productId: string;
  categoryId?: string;
  limit?: number;
  title?: string;
}

export const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  productId,
  categoryId,
  limit = 4,
  title = 'You May Also Like',
}) => {
  const { theme } = useTheme();
  const [recommendations, setRecommendations] = useState<Product[]>([]);


  useEffect(() => {
    const fetchRecommendations = async () => {
      try {

        const allProducts = await dataStore.getProducts({ priceMin: 0, priceMax: 100000 });
        const currentProduct = allProducts.find(p => p._id === productId);

        if (!currentProduct) {
          setRecommendations([]);
          return;
        }

        // Filter out current product
        const filtered = allProducts.filter(p => p._id !== productId && p.isActive);

        // Priority: Same category > Same tags > Same brand > Random
        const sameCategory = categoryId
          ? filtered.filter(p => p.categoryId === categoryId)
          : [];

        const sameTags = currentProduct.tags.length > 0
          ? filtered.filter(p =>
            p.tags.some(tag => currentProduct.tags.includes(tag))
          )
          : [];

        const sameBrand = filtered.filter(p => p.brand === currentProduct.brand);

        // Combine and deduplicate
        const combined = [
          ...sameCategory.slice(0, limit),
          ...sameTags.slice(0, limit),
          ...sameBrand.slice(0, limit),
          ...filtered.slice(0, limit),
        ];

        // Remove duplicates
        const unique = combined.filter((product, index, self) =>
          index === self.findIndex(p => p._id === product._id)
        );

        setRecommendations(unique.slice(0, limit));
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setRecommendations([]);
      } finally {

      }
    };

    fetchRecommendations();
  }, [productId, categoryId, limit]);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2
        className="text-3xl font-black mb-8 text-center"
        style={{ color: theme.colors.textPrimary }}
      >
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((product, index) => (
          <ProductCard
            key={product._id}
            product={product}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};
