import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { ProductCard } from '../components/ProductCard';
import { getWishlist, removeFromWishlist } from '../store/wishlistStore';
import * as dataStore from '../store/dataStore';
import { Product } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Footer } from '../components/Footer';
import { usePageTracking } from '../hooks/usePageTracking';
import { SEO } from '../components/SEO';
import { pageMetadata } from '../utils/seoConfig';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Breadcrumb } from '../components/Breadcrumb';

export const Wishlist: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  usePageTracking('Wishlist');
  const navigate = useNavigate();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/wishlist');
      return;
    }
    loadWishlist();
  }, [isAuthenticated, navigate]);

  const loadWishlist = async () => {
    try {
      const wishlistIds = await getWishlist();
      const products = [];
      for (const id of wishlistIds) {
        const product = await dataStore.getProductById(id);
        if (product && product.isActive) {
          products.push(product);
        }
      }
      setWishlistProducts(products);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
      await loadWishlist();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <SEO
        title={pageMetadata.wishlist.title}
        description={pageMetadata.wishlist.description}
      />
      <div
        className="min-h-screen"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.backgroundPrimary} 0%, ${theme.colors.backgroundSecondary} 50%, ${theme.colors.backgroundPrimary} 100%)`,
          color: theme.colors.textPrimary,
        }}
      >
        <Navbar />

        {/* Breadcrumb */}
        <div
          className="border-b-2"
          style={{
            backgroundColor: theme.colors.backgroundSecondary,
            borderColor: theme.colors.borderPrimary,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Breadcrumb items={[{ label: 'Wishlist' }]} />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <h1
              className="text-4xl font-black"
              style={{ color: theme.colors.textPrimary }}
            >
              My Wishlist
            </h1>
            {wishlistProducts.length > 0 && (
              <span
                className="font-semibold"
                style={{ color: theme.colors.textSecondary }}
              >
                {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <LoadingSpinner />
            </div>
          ) : wishlistProducts.length === 0 ? (
            <div
              className="border-2 rounded-creative shadow-card p-12 text-center"
              style={{
                backgroundColor: theme.colors.cardBackground,
                borderColor: theme.colors.borderPrimary,
              }}
            >
              <svg
                className="mx-auto h-24 w-24 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: theme.colors.textTertiary }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ color: theme.colors.textPrimary }}
              >
                Your wishlist is empty
              </h2>
              <p
                className="mb-6"
                style={{ color: theme.colors.textSecondary }}
              >
                Start adding products you love!
              </p>
              <Link
                to="/products"
                className="inline-block px-8 py-4 font-extrabold uppercase tracking-wider rounded-creative transition-all shadow-elegant transform hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.buttonPrimary} 0%, ${theme.colors.buttonSecondary} 100%)`,
                  color: '#FFFFFF',
                }}
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistProducts.map((product, index) => (
                <div key={product._id} className="relative">
                  <ProductCard product={product} index={index} />
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="absolute top-2 right-2 border-2 p-2.5 rounded-creative shadow-card z-30 transition-all hover:scale-110 hover:shadow-card-hover"
                    style={{
                      backgroundColor: theme.colors.cardBackground,
                      borderColor: theme.colors.borderPrimary,
                    }}
                    title="Remove from wishlist"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      style={{ color: '#EF4444' }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

