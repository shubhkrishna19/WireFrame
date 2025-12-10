import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Heart, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  tags: string[];
}

interface AIRecommendationsProps {
  currentProduct?: Product;
  userHistory?: number[];
  type?: 'similar' | 'complete-look' | 'trending' | 'personalized';
}

export default function AIProductRecommendations({ 
  currentProduct, 
  userHistory = [],
  type = 'personalized'
}: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI-based recommendation engine
    const fetchRecommendations = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock recommendation logic based on type
      const mockProducts: Product[] = [
        { id: 101, name: 'Leather Jacket', price: 199.99, image: '/products/jacket.jpg', category: 'outerwear', tags: ['premium', 'winter'] },
        { id: 102, name: 'Slim Fit Jeans', price: 79.99, image: '/products/jeans.jpg', category: 'bottoms', tags: ['casual', 'denim'] },
        { id: 103, name: 'White Sneakers', price: 89.99, image: '/products/sneakers.jpg', category: 'footwear', tags: ['casual', 'comfort'] },
        { id: 104, name: 'Designer Watch', price: 299.99, image: '/products/watch.jpg', category: 'accessories', tags: ['luxury', 'premium'] },
        { id: 105, name: 'Cotton T-Shirt', price: 29.99, image: '/products/tshirt.jpg', category: 'tops', tags: ['basics', 'casual'] },
        { id: 106, name: 'Sunglasses', price: 149.99, image: '/products/sunglasses.jpg', category: 'accessories', tags: ['summer', 'fashion'] },
      ];

      let filtered = mockProducts;

      // AI-based filtering logic
      if (type === 'complete-look' && currentProduct) {
        // Complete the look - complementary items
        filtered = mockProducts.filter(p => 
          p.category !== currentProduct.category
        ).slice(0, 4);
      } else if (type === 'similar' && currentProduct) {
        // Similar items
        filtered = mockProducts.filter(p => 
          p.category === currentProduct.category
        ).slice(0, 4);
      } else if (type === 'trending') {
        // Trending items
        filtered = mockProducts.filter(p => 
          p.tags.includes('premium') || p.tags.includes('fashion')
        ).slice(0, 4);
      }

      setRecommendations(filtered);
      setLoading(false);
    };

    fetchRecommendations();
  }, [currentProduct, userHistory, type]);

  const getIcon = () => {
    switch (type) {
      case 'complete-look':
        return <Sparkles className="w-5 h-5" />;
      case 'trending':
        return <TrendingUp className="w-5 h-5" />;
      case 'similar':
        return <Heart className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'complete-look':
        return 'Complete The Look';
      case 'trending':
        return 'Trending Now';
      case 'similar':
        return 'Similar Items';
      default:
        return 'Recommended For You';
    }
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg text-white">
            {getIcon()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {getTitle()}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered recommendations just for you
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {recommendations.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link to={`/products/${product.id}`}>
                <div className="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                  <div className="aspect-square bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 group-hover:opacity-0 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <Sparkles className="w-12 h-12" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {product.name}
                    </h3>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
                      ${product.price}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {product.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
