import React, { useState, useEffect } from 'react';
import { Product } from '../data/mockData';
import { getRecentlyViewed } from '../store/recentlyViewedStore';
import { ProductCard } from './ProductCard';
import { useTheme } from '../contexts/ThemeContext';

export const RecentlyViewed: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const { theme } = useTheme();

    useEffect(() => {
        // Load initially
        setProducts(getRecentlyViewed());

        // Listen for updates
        const handleUpdate = () => {
            setProducts(getRecentlyViewed());
        };

        window.addEventListener('recentlyViewedUpdated', handleUpdate);
        return () => window.removeEventListener('recentlyViewedUpdated', handleUpdate);
    }, []);

    if (products.length === 0) return null;

    return (
        <div className="py-12" style={{ backgroundColor: theme.colors.backgroundSecondary }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="heading-secondary mb-2">Recently Viewed</h2>
                        <p className="body-text">Products you've been checking out</p>
                    </div>
                    {products.length > 0 && (
                        <span className="text-sm" style={{ color: theme.colors.textSecondary }}>
                            {products.length} item{products.length > 1 ? 's' : ''}
                        </span>
                    )}
                </div>

                {/* Horizontal scrollable grid on mobile, regular grid on desktop */}
                <div className="overflow-x-auto hide-scrollbar -mx-4 px-4 md:overflow-visible md:mx-0 md:px-0">
                    <div className="flex gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6">
                        {products.map((product, index) => (
                            <div
                                key={product._id}
                                className="flex-shrink-0 w-64 md:w-auto"
                            >
                                <ProductCard product={product} index={index} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    );
};
