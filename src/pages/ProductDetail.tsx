import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Breadcrumb } from '../components/Breadcrumb';
import { DeliveryEstimateDisplay } from '../components/DeliveryEstimateDisplay';
import { ReviewsSection } from '../components/ReviewsSection';
import { SimilarProducts } from '../components/SimilarProducts';
import { ProductImageGallery } from '../components/ProductImageGallery';
import * as dataStore from '../store/dataStore';
import { Product } from '../data/mockData';
import { ProductCardSkeleton } from '../components/ProductCardSkeleton';
import { addToCart } from '../store/cartStore';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { analytics } from '../utils/analytics';
import { usePageTracking } from '../hooks/usePageTracking';
import { useToast } from '../components/Toast';
import { SEO } from '../components/SEO';
import { getProductMeta } from '../utils/seoConfig';
import { Footer } from '../components/Footer';
import { ProductRecommendations } from '../components/ProductRecommendations';
import { logger } from '../utils/logger';
import { addToRecentlyViewed } from '../store/recentlyViewedStore';
import { Lightbox } from '../components/Lightbox';
import { TrustSignals } from '../components/TrustSignals';
import { StockIndicator } from '../components/StockIndicator';
import { EnhancedPriceDisplay } from '../components/EnhancedPriceDisplay';
import { RatingDistribution } from '../components/RatingDistribution';

import { CustomersAlsoViewed } from '../components/CustomersAlsoViewed';
import { mockProducts } from '../data/mockData';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const { formatPrice } = useCurrency();
  const toast = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'specifications' | 'care' | 'reviews'>('specifications');
  const [showDescription, setShowDescription] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Track page view
  usePageTracking(product ? `Product: ${product.name}` : 'Product Detail');

  useEffect(() => {
    if (slug) {
      const fetchProduct = async () => {
        try {
          const foundProduct = await dataStore.getProductBySlug(slug);
          if (foundProduct) {
            setProduct(foundProduct);
            // Default to first option or empty if not available
            setSelectedColor(foundProduct.colors?.[0] || '');
            setSelectedSize(foundProduct.sizes?.[0] || 'Standard');

            // Track product view
            analytics.productView(foundProduct._id, foundProduct.name, foundProduct.categoryId);

            // Add to recently viewed
            addToRecentlyViewed(foundProduct);
          } else {
            navigate('/products');
          }
        } catch (error) {
          logger.error('Error fetching product:', error);
          navigate('/products');
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [slug, navigate]);

  // Sticky mobile bar on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Show sticky bar after scrolling past 400px
      setShowStickyBar(scrollPosition > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = async () => {
    if (!product || !selectedSize || !selectedColor) {
      toast.warning('Please select size and color');
      return;
    }
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (isAddingToCart) return; // Prevent multiple clicks
    setIsAddingToCart(true);

    try {
      const result = await addToCart(product, selectedSize, selectedColor, quantity);

      if (result.success) {
        // Track analytics
        analytics.addToCart(product._id, product.name, product.price, quantity);
        analytics.buttonClick('Add to Cart', 'Product Detail Page', {
          product_id: product._id,
          product_name: product.name,
          size: selectedSize,
          color: selectedColor,
          quantity,
        });

        toast.success(`Added ${quantity} item(s) to cart!`);
      } else {
        toast.error(result.message || 'Failed to add item to cart');
      }
    } catch (error) {
      logger.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product || !selectedSize || !selectedColor) {
      toast.warning('Please select size and color');
      return;
    }
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (isAddingToCart) return; // Prevent multiple clicks
    setIsAddingToCart(true);

    try {
      const result = await addToCart(product, selectedSize, selectedColor, quantity);

      if (result.success) {
        // Track analytics
        analytics.addToCart(product._id, product.name, product.price, quantity);
        analytics.buttonClick('Buy Now', 'Product Detail Page', {
          product_id: product._id,
          product_name: product.name,
          size: selectedSize,
          color: selectedColor,
          quantity,
        });
        analytics.beginCheckout({
          items: [{
            product_id: product._id,
            product_name: product.name,
            quantity: quantity,
            price: product.price,
          }],
          total: product.price * quantity,
          currency: 'INR',
        });

        navigate('/checkout');
      } else {
        toast.error(result.message || 'Failed to add item to cart');
      }
    } catch (error) {
      logger.error('Error adding to cart for buy now:', error);
      toast.error('Failed to add item to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half-fill">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path fill="url(#half-fill)" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          className="w-5 h-5 fill-current"
          viewBox="0 0 20 20"
          style={{ color: theme.colors.textTertiary }}
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    return stars;
  };

  if (loading) {
    return (
      <div
        className="min-h-screen"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.backgroundPrimary} 0%, ${theme.colors.backgroundSecondary} 50%, ${theme.colors.backgroundPrimary} 100%)`,
          color: theme.colors.textPrimary,
        }}
      >
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <ProductCardSkeleton />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <>
        <SEO
          title="Product Not Found | Bluewud"
          description="The product you're looking for could not be found."
          noindex={true}
        />
        <div
          className="min-h-screen"
          style={{
            background: `linear-gradient(135deg, ${theme.colors.backgroundPrimary} 0%, ${theme.colors.backgroundSecondary} 50%, ${theme.colors.backgroundPrimary} 100%)`,
            color: theme.colors.textPrimary,
          }}
        >
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 py-8 text-center">
            <h1
              className="text-2xl font-bold mb-4"
              style={{ color: theme.colors.textPrimary }}
            >
              Product not found
            </h1>
            <Link
              to="/products"
              className="transition-colors hover:opacity-80"
              style={{ color: theme.colors.buttonPrimary }}
            >
              Back to Products
            </Link>
          </div>
        </div>
      </>
    );
  }

  const specs = product.specifications || {};

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.backgroundPrimary} 0%, ${theme.colors.backgroundSecondary} 50%, ${theme.colors.backgroundPrimary} 100%)`,
        color: theme.colors.textPrimary,
      }}
    >
      <SEO
        title={getProductMeta(product.name, product.description, product.price).title}
        description={getProductMeta(product.name, product.description, product.price).description}
      />
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
          <Breadcrumb items={[
            { label: 'Products', path: '/products' },
            { label: product.name }
          ]} />
        </div>
      </div>

      {/* Hero Section - Abstract Background */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${theme.colors.backgroundSecondary}40 0%, transparent 50%, ${theme.colors.backgroundTertiary}30 100%)`,
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              <ProductImageGallery
                product={product}
                selectedColor={selectedColor}
                onImageClick={(index) => {
                  setCurrentImageIndex(index);
                  setIsLightboxOpen(true);
                }}
              />
            </div>

            {/* Product Info - Sharp Modern Card Design */}
            <div
              className="space-y-10 border-2 rounded-creative p-12 shadow-card"
              style={{
                backgroundColor: theme.colors.cardBackground,
                borderColor: theme.colors.borderPrimary,
              }}
            >
              {/* Brand & Name */}
              <div className="space-y-3">
                <p
                  className="text-xs font-bold uppercase tracking-[0.2em]"
                  style={{ color: theme.colors.buttonPrimary }}
                >
                  {product.brand}
                </p>
                <h1
                  className="text-5xl font-extrabold leading-tight"
                  style={{ color: theme.colors.textPrimary }}
                >
                  {product.name}
                </h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center">{renderStars(product.rating)}</div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    {product.rating} Â· {product.reviewCount} reviews
                  </span>
                  <Link
                    to="#reviews"
                    onClick={() => setActiveTab('reviews')}
                    className="text-sm font-medium underline transition-colors hover:opacity-80"
                    style={{ color: theme.colors.buttonPrimary }}
                  >
                    View all
                  </Link>
                </div>
              </div>

              {/* Enhanced Price Display */}
              <div
                className="pb-6 border-b"
                style={{ borderColor: theme.colors.borderPrimary }}
              >
                <EnhancedPriceDisplay
                  currentPrice={product.price}
                  originalPrice={product.originalPrice}
                  showSavings={true}
                />
              </div>

              {/* Stock Indicator & Urgency Triggers */}
              <div className="py-4">
                <StockIndicator
                  stock={product.stock || 5}
                  showViewCount={true}
                  showRecentSales={true}
                />
              </div>

              {/* Trust Signals */}
              <TrustSignals />

              {/* Key Features - Bullet Points */}
              <div className="space-y-3">
                <h3
                  className="text-sm font-bold uppercase tracking-wide"
                  style={{ color: theme.colors.textPrimary }}
                >
                  Key Features
                </h3>
                <ul className="space-y-2.5">
                  {product.specifications?.material && (
                    <li className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: theme.colors.buttonPrimary }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span style={{ color: theme.colors.textSecondary }}>
                        Material: {product.specifications.material}
                      </span>
                    </li>
                  )}
                  {product.specifications?.finish && (
                    <li className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: theme.colors.buttonPrimary }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span style={{ color: theme.colors.textSecondary }}>
                        Finish: {product.specifications.finish}
                      </span>
                    </li>
                  )}
                  {product.specifications?.style && (
                    <li className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: theme.colors.buttonPrimary }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span style={{ color: theme.colors.textSecondary }}>
                        Style: {product.specifications.style}
                      </span>
                    </li>
                  )}
                  {product.specifications?.room && (
                    <li className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: theme.colors.buttonPrimary }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span style={{ color: theme.colors.textSecondary }}>
                        Ideal for: {product.specifications.room}
                      </span>
                    </li>
                  )}
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: theme.colors.buttonPrimary }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span style={{ color: theme.colors.textSecondary }}>Free shipping on orders above â‚¹999</span>
                  </li>
                </ul>
              </div>

              {/* Description - Collapsible */}
              <div
                className="pt-4 border-t"
                style={{ borderColor: theme.colors.borderPrimary }}
              >
                <button
                  onClick={() => setShowDescription(!showDescription)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h3
                    className="text-sm font-bold uppercase tracking-wide"
                    style={{ color: theme.colors.textPrimary }}
                  >
                    Description
                  </h3>
                  <svg
                    className={`w-5 h-5 transition-transform ${showDescription ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showDescription && (
                  <p
                    className="mt-4 leading-relaxed"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    {product.description}
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: theme.colors.textPrimary }}
                >
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border-2 transition-all hover:opacity-80"
                    style={{
                      borderColor: theme.colors.borderPrimary,
                      backgroundColor: theme.colors.backgroundTertiary,
                      color: theme.colors.textPrimary,
                    }}
                  >
                    -
                  </button>
                  <span
                    className="w-16 text-center font-semibold"
                    style={{ color: theme.colors.textPrimary }}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 border-2 transition-all hover:opacity-80"
                    style={{
                      borderColor: theme.colors.borderPrimary,
                      backgroundColor: theme.colors.backgroundTertiary,
                      color: theme.colors.textPrimary,
                    }}
                  >
                    +
                  </button>
                  <span
                    className="text-sm"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    ({product.stock} available)
                  </span>
                </div>
              </div>

              {/* Delivery Estimate */}
              <DeliveryEstimateDisplay />

              {/* Action Buttons - Colorful Fashion CTAs */}
              <div className="flex flex-col gap-4 pt-8">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize || !selectedColor || product.stock === 0 || isAddingToCart}
                  className={`w-full px-10 py-6 font-extrabold text-xl uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-elegant hover:shadow-elegant-lg transform hover:scale-105 border-2 rounded-creative ${isAddingToCart ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  style={{
                    background: isAddingToCart
                      ? `linear-gradient(135deg, ${theme.colors.buttonSecondary} 0%, ${theme.colors.buttonPrimary} 100%)`
                      : `linear-gradient(135deg, ${theme.colors.buttonPrimary} 0%, ${theme.colors.buttonSecondary} 100%)`,
                    color: '#FFFFFF',
                    borderColor: `${theme.colors.buttonPrimary}80`,
                  }}
                >
                  {isAddingToCart ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Adding...
                    </div>
                  ) : (
                    'Add to Cart'
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!selectedSize || !selectedColor || product.stock === 0 || isAddingToCart}
                  className={`w-full px-10 py-6 font-extrabold text-xl uppercase tracking-widest border-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-elegant hover:shadow-elegant-lg transform hover:scale-105 rounded-creative ${isAddingToCart ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  style={{
                    background: isAddingToCart
                      ? `linear-gradient(135deg, ${theme.colors.brandDark} 0%, ${theme.colors.stateSuccess} 100%)`
                      : `linear-gradient(135deg, ${theme.colors.stateSuccess} 0%, ${theme.colors.brandDark} 100%)`,
                    color: '#FFFFFF',
                    borderColor: `${theme.colors.stateSuccess}80`,
                  }}
                >
                  {isAddingToCart ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    'Buy Now'
                  )}
                </button>
                {product.stock === 0 && (
                  <p
                    className="text-center text-sm font-semibold"
                    style={{ color: '#EF4444' }}
                  >
                    Out of Stock
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div
          className="border-2 rounded-creative shadow-card p-12"
          style={{
            backgroundColor: theme.colors.cardBackground,
            borderColor: theme.colors.borderPrimary,
          }}
        >
          <div
            className="pt-6 border-t space-y-3"
            style={{ borderColor: theme.colors.borderPrimary }}
          >
            <div className="flex items-center gap-2 text-sm">
              <span
                className="font-semibold"
                style={{ color: theme.colors.textPrimary }}
              >
                SKU:
              </span>
              <span style={{ color: theme.colors.textSecondary }}>{product.sku}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span
                className="font-semibold"
                style={{ color: theme.colors.textPrimary }}
              >
                Availability:
              </span>
              <span
                className="font-medium"
                style={{
                  color: product.stock > 0
                    ? theme.colors.stateSuccess
                    : theme.colors.brandPrimary,
                }}
              >
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            {specs.countryOfOrigin && (
              <div className="flex items-center gap-2 text-sm">
                <span
                  className="font-semibold"
                  style={{ color: theme.colors.textPrimary }}
                >
                  Made in:
                </span>
                <span style={{ color: theme.colors.textSecondary }}>
                  {specs.countryOfOrigin}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Specifications Tabs - Sharp Modern Design */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div
          className="border-2 rounded-creative shadow-card overflow-hidden"
          style={{
            backgroundColor: theme.colors.cardBackground,
            borderColor: theme.colors.borderPrimary,
          }}
        >
          {/* Tab Headers */}
          <div
            className="border-b"
            style={{
              backgroundColor: theme.colors.backgroundSecondary,
              borderColor: theme.colors.borderPrimary,
            }}
          >
            <nav className="flex">
              <button
                onClick={() => setActiveTab('specifications')}
                className="px-8 py-5 text-sm font-bold uppercase tracking-wider border-b-4 transition-all"
                style={{
                  borderColor: activeTab === 'specifications'
                    ? theme.colors.buttonPrimary
                    : 'transparent',
                  color: activeTab === 'specifications'
                    ? theme.colors.textPrimary
                    : theme.colors.textTertiary,
                  backgroundColor: activeTab === 'specifications'
                    ? theme.colors.cardBackground
                    : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'specifications') {
                    e.currentTarget.style.color = theme.colors.textSecondary;
                    e.currentTarget.style.backgroundColor = theme.colors.backgroundTertiary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'specifications') {
                    e.currentTarget.style.color = theme.colors.textTertiary;
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('care')}
                className="px-8 py-5 text-sm font-bold uppercase tracking-wider border-b-4 transition-all"
                style={{
                  borderColor: activeTab === 'care'
                    ? theme.colors.buttonPrimary
                    : 'transparent',
                  color: activeTab === 'care'
                    ? theme.colors.textPrimary
                    : theme.colors.textTertiary,
                  backgroundColor: activeTab === 'care'
                    ? theme.colors.cardBackground
                    : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'care') {
                    e.currentTarget.style.color = theme.colors.textSecondary;
                    e.currentTarget.style.backgroundColor = theme.colors.backgroundTertiary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'care') {
                    e.currentTarget.style.color = theme.colors.textTertiary;
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                Care Instructions
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className="px-8 py-5 text-sm font-bold uppercase tracking-wider border-b-4 transition-all"
                style={{
                  borderColor: activeTab === 'reviews'
                    ? theme.colors.buttonPrimary
                    : 'transparent',
                  color: activeTab === 'reviews'
                    ? theme.colors.textPrimary
                    : theme.colors.textTertiary,
                  backgroundColor: activeTab === 'reviews'
                    ? theme.colors.cardBackground
                    : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'reviews') {
                    e.currentTarget.style.color = theme.colors.textSecondary;
                    e.currentTarget.style.backgroundColor = theme.colors.backgroundTertiary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'reviews') {
                    e.currentTarget.style.color = theme.colors.textTertiary;
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                Reviews ({product.reviewCount})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General Specifications */}
                <div className="space-y-4">
                  <h3
                    className="text-lg font-semibold mb-4"
                    style={{ color: theme.colors.textPrimary }}
                  >
                    General Specifications
                  </h3>

                  {specs.material && (
                    <div>
                      <span
                        className="text-sm font-medium"
                        style={{ color: theme.colors.textSecondary }}
                      >
                        Material:
                      </span>
                      <span
                        className="ml-2 text-sm"
                        style={{ color: theme.colors.textPrimary }}
                      >
                        {specs.material}
                      </span>
                    </div>
                  )}

                  {specs.finish && (
                    <div>
                      <span
                        className="text-sm font-medium"
                        style={{ color: theme.colors.textSecondary }}
                      >
                        Finish:
                      </span>
                      <span
                        className="ml-2 text-sm"
                        style={{ color: theme.colors.textPrimary }}
                      >
                        {specs.finish}
                      </span>
                    </div>
                  )}

                  {specs.style && (
                    <div>
                      <span
                        className="text-sm font-medium"
                        style={{ color: theme.colors.textSecondary }}
                      >
                        Style:
                      </span>
                      <span
                        className="ml-2 text-sm"
                        style={{ color: theme.colors.textPrimary }}
                      >
                        {specs.style}
                      </span>
                    </div>
                  )}

                  {specs.room && (
                    <div>
                      <span
                        className="text-sm font-medium"
                        style={{ color: theme.colors.textSecondary }}
                      >
                        Room:
                      </span>
                      <span
                        className="ml-2 text-sm"
                        style={{ color: theme.colors.textPrimary }}
                      >
                        {specs.room}
                      </span>
                    </div>
                  )}

                  {specs.countryOfOrigin && (
                    <div>
                      <span
                        className="text-sm font-medium"
                        style={{ color: theme.colors.textSecondary }}
                      >
                        Country of Origin:
                      </span>
                      <span
                        className="ml-2 text-sm"
                        style={{ color: theme.colors.textPrimary }}
                      >
                        {specs.countryOfOrigin}
                      </span>
                    </div>
                  )}
                </div>

                {/* Dimensions & Additional Info */}
                <div className="space-y-4">
                  <h3
                    className="text-lg font-semibold mb-4"
                    style={{ color: theme.colors.textPrimary }}
                  >
                    Dimensions & Details
                  </h3>

                  {specs.dimensions && (
                    <div>
                      <span
                        className="text-sm font-medium"
                        style={{ color: theme.colors.textSecondary }}
                      >
                        Dimensions:
                      </span>
                      <div
                        className="ml-2 text-sm space-y-1"
                        style={{ color: theme.colors.textPrimary }}
                      >
                        {specs.dimensions.length && <div>Length: {specs.dimensions.length}</div>}
                        {specs.dimensions.width && <div>Width: {specs.dimensions.width}</div>}
                        {specs.dimensions.height && <div>Height: {specs.dimensions.height}</div>}
                      </div>
                    </div>
                  )}

                  {specs.weight && (
                    <div>
                      <span
                        className="text-sm font-medium"
                        style={{ color: theme.colors.textSecondary }}
                      >
                        Weight:
                      </span>
                      <span
                        className="ml-2 text-sm"
                        style={{ color: theme.colors.textPrimary }}
                      >
                        {specs.weight}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="space-y-4">
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: theme.colors.textPrimary }}
                >
                  Care Instructions
                </h3>
                {specs.care && Array.isArray(specs.care) && specs.care.length > 0 ? (
                  <ul className="space-y-2">
                    {specs.care.map((instruction, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <svg
                          className="w-5 h-5 mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          style={{ color: theme.colors.buttonPrimary }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span
                          className="text-sm"
                          style={{ color: theme.colors.textSecondary }}
                        >
                          {instruction}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p
                    className="text-sm"
                    style={{ color: theme.colors.textTertiary }}
                  >
                    Care instructions not available for this product.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                <RatingDistribution
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                />
                <ReviewsSection productId={product._id} productName={product.name} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Similar Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SimilarProducts product={product} />
        <ProductRecommendations
          productId={product._id}
          categoryId={product.categoryId}
          limit={4}
          title="Recommended for You"
        />
      </div>

      {/* Customers Also Viewed */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-200 pt-12">
        <CustomersAlsoViewed products={mockProducts.slice(0, 6)} />
      </div>

      {/* Sticky Mobile Add to Cart Bar */}
      {product && showStickyBar && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 lg:hidden shadow-2xl border-t transition-transform duration-300"
          style={{
            backgroundColor: theme.colors.backgroundPrimary,
            borderColor: theme.colors.borderSecondary,
            transform: showStickyBar ? 'translateY(0)' : 'translateY(100%)',
          }}
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="flex flex-col">
              <span className="text-sm font-semibold" style={{ color: theme.colors.textPrimary }}>
                {formatPrice(product.price * quantity)}
              </span>
              <span className="text-xs" style={{ color: theme.colors.textSecondary }}>
                {quantity} item{quantity > 1 ? 's' : ''}
              </span>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || !selectedSize || !selectedColor}
              className="btn btn-primary px-6 py-3 text-sm font-semibold shadow-lg flex-1 max-w-[200px]"
              style={{
                opacity: isAddingToCart || !selectedSize || !selectedColor ? 0.6 : 1,
              }}
            >
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={product.images || [product.thumbnail]}
        currentIndex={currentImageIndex}
        onNext={() => setCurrentImageIndex((prev) => (prev + 1) % (product.images?.length || 1))}
        onPrev={() => setCurrentImageIndex((prev) => (prev - 1 + (product.images?.length || 1)) % (product.images?.length || 1))}
        onSelect={(index) => setCurrentImageIndex(index)}
      />

      <Footer />
    </div>
  );
};


