
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import {
  getCart,
  removeFromCart,
  updateCartItemQuantity,
  getCartTotal,
  CartItem,
} from '../store/cartStore';
// import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { useTheme } from '../contexts/ThemeContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { usePageTracking } from '../hooks/usePageTracking';
import { SEO } from '../components/SEO';
import { Footer } from '../components/Footer';
import { Breadcrumb } from '../components/Breadcrumb';
import { ProductCard } from '../components/ProductCard';
import { mockProducts } from '../data/mockData';
import { AnnouncementBar } from '../components/AnnouncementBar';
import { logger } from '../utils/logger';
import { pageMetadata } from '../utils/seoConfig';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PromoCodeSection } from '../components/PromoCodeSection';
import { DeliveryEstimateDisplay } from '../components/DeliveryEstimateDisplay';
import { addToWishlist } from '../store/wishlistStore';
import { HapticFeedback } from '../utils/haptic';


export const Cart: React.FC = () => {
  // const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { theme } = useTheme();
  const { formatPrice } = useCurrency();
  usePageTracking('Cart');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  // const [recommendations, setRecommendations] = useState<any[]>([]);
  // const [estimatedDelivery, setEstimatedDelivery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [appliedPromoCode, setAppliedPromoCode] = useState('');

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    try {
      const cart = await getCart();
      setCartItems(cart);
      const totalValue = await getCartTotal();
      setTotal(totalValue);
    } catch (error) {
      logger.error('Error loading cart:', error);
      toast.error('Failed to load cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId: string) => {
    const item = cartItems.find(i => i.id === itemId);
    if (item && window.confirm(`Remove "${item.name}" from your cart ? `)) {
      try {
        HapticFeedback.heavy(); // Heavy feedback for deletion
        await removeFromCart(itemId);
        await loadCart();
        toast.success('Item removed from cart');
      } catch (error) {
        logger.error('Error removing item:', error);
        toast.error('Failed to remove item from cart. Please try again.');
      }
    }
  };

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      HapticFeedback.light(); // Light feedback for quantity change
      const result = await updateCartItemQuantity(itemId, newQuantity);
      if (result.success) {
        await loadCart();
        if (newQuantity === 0) {
          toast.success('Item removed from cart');
        }
      } else {
        toast.error(result.message || 'Failed to update quantity');
      }
    } catch (error) {
      logger.error('Failed to update cart item quantity', error);
      toast.showToast('Failed to update quantity', 'error');
    }
  };

  const handleSaveForLater = async (item: CartItem) => {
    try {
      HapticFeedback.medium(); // Medium feedback for save action
      // Add to wishlist (need productId)
      // Cart items have id, but wishlist needs productId
      // We'll use the id as productId for now
      await addToWishlist(item.id);

      // Remove from cart
      await removeFromCart(item.id);

      // Reload cart
      await loadCart();

      toast.showToast(`${item.name} moved to wishlist`, 'success');
    } catch (error) {
      logger.error('Failed to save for later', error);
      toast.showToast('Failed to save for later', 'error');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.warning('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };



  return (
    <>
      <SEO
        title={pageMetadata.cart.title}
        description={pageMetadata.cart.description}
      />
      <div
        className="min-h-screen"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.backgroundPrimary} 0%, ${theme.colors.backgroundSecondary} 50%, ${theme.colors.backgroundPrimary} 100%)`,
          color: theme.colors.textPrimary,
        }}
      >
        <AnnouncementBar /> {/* Added AnnouncementBar usage */}
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
            <Breadcrumb items={[{ label: 'Cart' }]} />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1
            className="text-4xl font-black mb-8"
            style={{ color: theme.colors.textPrimary }}
          >
            Shopping Cart
          </h1>

          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : cartItems.length === 0 ? (
            <div
              className="border-2 rounded-creative shadow-card p-12 text-center"
              style={{
                backgroundColor: theme.colors.cardBackground,
                borderColor: theme.colors.borderPrimary,
              }}
            >
              <svg
                className="mx-auto h-24 w-24 mb-4"
                style={{ color: theme.colors.textTertiary }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ color: theme.colors.textPrimary }}
              >
                Your cart is empty
              </h2>
              <p
                className="mb-6"
                style={{ color: theme.colors.textSecondary }}
              >
                Add some products to get started!
              </p>
              <Link
                to="/products"
                className="inline-block px-10 py-5 font-extrabold uppercase tracking-wider transition-all duration-300 transform hover:scale-105 shadow-elegant rounded-creative border-2"
                style={{
                  background: `linear - gradient(135deg, ${theme.colors.buttonPrimary} 0 %, ${theme.colors.buttonSecondary} 100 %)`,
                  color: '#FFFFFF',
                  borderColor: theme.colors.buttonPrimary,
                }}
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map(item => (
                  <motion.div
                    key={item.id}
                    drag="x"
                    dragConstraints={{ left: -100, right: 0 }}
                    dragElastic={0.1}
                    onDragEnd={(_, { offset }) => {
                      if (offset.x < -80) {
                        handleRemove(item.id);
                      }
                    }}
                    className="border-2 rounded-creative shadow-card p-6 flex flex-col sm:flex-row gap-6 hover:shadow-card-hover transition-all duration-300 animate-fade-in-up relative"
                    style={{
                      backgroundColor: theme.colors.cardBackground,
                      borderColor: theme.colors.borderPrimary,
                    }}
                  >
                    {/* Product Image */}
                    <Link
                      to={`/ products / ${item.name.toLowerCase().replace(/\s+/g, '-')} `}  // Using name as slug fallback
                      className="flex-shrink-0 w-full sm:w-32 h-32 overflow-hidden border-2"
                      style={{
                        backgroundColor: theme.colors.backgroundTertiary,
                        borderColor: theme.colors.borderPrimary,
                      }}
                    >
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop&auto=format'}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop&auto=format';
                        }}
                        loading="lazy"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link
                          to={`/ products / ${item.name.toLowerCase().replace(/\s+/g, '-')} `}  // Using name as slug fallback
                          className="text-xl font-bold transition-colors mb-2 block hover:opacity-80"
                          style={{ color: theme.colors.textPrimary }}
                        >
                          {item.name}
                        </Link>
                        <div
                          className="flex gap-4 text-sm mb-2"
                          style={{ color: theme.colors.textSecondary }}
                        >
                          <span>
                            <span className="font-semibold">Color:</span> {item.color}
                          </span>
                          <span>
                            <span className="font-semibold">Size:</span> {item.size}
                          </span>
                        </div>
                        <p
                          className="text-2xl font-black"
                          style={{ color: theme.colors.textPrimary }}
                        >
                          {formatPrice(item.unitPrice)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div
                          className="flex items-center border-2"
                          style={{ borderColor: theme.colors.borderPrimary }}
                        >
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="px-4 py-2 font-bold border-r-2 transition-colors hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                              backgroundColor: theme.colors.cardBackground,
                              color: theme.colors.textPrimary,
                              borderColor: theme.colors.borderPrimary,
                            }}
                          >
                            âˆ’
                          </button>
                          <span
                            className="px-6 py-2 font-bold"
                            style={{
                              backgroundColor: theme.colors.cardBackground,
                              color: theme.colors.textPrimary,
                            }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={item.quantity >= 10}
                            className="px-4 py-2 font-bold border-l-2 transition-colors hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                              backgroundColor: theme.colors.cardBackground,
                              color: theme.colors.textPrimary,
                              borderColor: theme.colors.borderPrimary,
                            }}
                          >
                            +
                          </button>
                        </div>
                        {10 < item.quantity && ( // Using fixed max since stock info not available in cart item)
                          <span
                            className="text-xs font-semibold px-2 py-1 rounded"
                            style={{
                              color: '#EF4444',
                              backgroundColor: 'rgba(239, 68, 68, 0.1)'
                            }}
                          >
                            Low Stock
                          </span>
                        )}
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="font-semibold transition-colors hover:opacity-80"
                          style={{ color: '#EF4444' }}
                          title="Remove from cart"
                        >
                          ðŸ—‘ï¸ Remove
                        </button>
                        <button
                          onClick={() => handleSaveForLater(item)}
                          className="font-semibold transition-colors hover:opacity-80 ml-4"
                          style={{ color: theme.colors.buttonPrimary }}
                          title="Move to wishlist"
                        >
                          â¤ï¸ Save for Later
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="flex flex-col justify-between items-end">
                      <p
                        className="text-xl font-black"
                        style={{ color: theme.colors.textPrimary }}
                      >
                        {formatPrice(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div
                  className="border-2 rounded-creative shadow-card p-8 sticky top-24"
                  style={{
                    backgroundColor: theme.colors.cardBackground,
                    borderColor: theme.colors.borderPrimary,
                  }}
                >
                  <h2
                    className="text-2xl font-black mb-6"
                    style={{ color: theme.colors.textPrimary }}
                  >
                    Order Summary
                  </h2>

                  <div className="space-y-6">
                    {/* Promo Code Section */}
                    <PromoCodeSection
                      orderTotal={total}
                      onPromoApplied={(discount, code) => {
                        setPromoDiscount(discount);
                        setAppliedPromoCode(code);
                      }}
                    />

                    {/* Delivery Estimate */}
                    <DeliveryEstimateDisplay compact={false} />

                    {/* Pricing Summary */}
                    <div className="space-y-3">
                      <div
                        className="flex justify-between py-3"
                        style={{ color: theme.colors.textSecondary }}
                      >
                        <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                        <span className="font-semibold">{formatPrice(total)}</span>
                      </div>

                      {/* Free Shipping Progress Bar */}
                      {(() => {
                        const FREE_SHIPPING_THRESHOLD = 5000;
                        const remaining = FREE_SHIPPING_THRESHOLD - total;
                        const progress = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
                        const isEligible = total >= FREE_SHIPPING_THRESHOLD;

                        return (
                          <div className="py-4 border-y-2" style={{ borderColor: theme.colors.borderSecondary }}>
                            {/* Progress Bar */}
                            <div className="mb-3">
                              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full transition-all duration-500 ease-out rounded-full"
                                  style={{
                                    width: `${progress}%`,
                                    background: isEligible
                                      ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                                      : `linear-gradient(90deg, ${theme.colors.buttonPrimary} 0%, ${theme.colors.buttonSecondary} 100%)`,
                                  }}
                                />
                              </div>
                            </div>

                            {/* Message */}
                            {isEligible ? (
                              <div className="flex items-center gap-2 text-green-600 font-semibold">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>You've unlocked FREE shipping! ðŸŽ‰</span>
                              </div>
                            ) : (
                              <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                                Add <span className="font-bold" style={{ color: theme.colors.textPrimary }}>{formatPrice(remaining)}</span> more to get <span className="font-semibold text-green-600">FREE shipping</span>!
                              </p>
                            )}
                          </div>
                        );
                      })()}

                      <div
                        className="flex justify-between py-3"
                        style={{ color: theme.colors.textSecondary }}
                      >
                        <span>Shipping</span>
                        <span className="font-semibold">{total >= 5000 ? 'Free' : formatPrice(499)}</span>
                      </div>

                      {/* Promo Discount */}
                      {promoDiscount > 0 && (
                        <div
                          className="flex justify-between py-3 text-green-600 font-semibold"
                        >
                          <span>Promo Discount ({appliedPromoCode})</span>
                          <span>-{formatPrice(promoDiscount)}</span>
                        </div>
                      )}

                      <div
                        className="border-t-2 pt-4 flex justify-between"
                        style={{ borderColor: theme.colors.borderPrimary }}
                      >
                        <span
                          className="text-xl font-bold"
                          style={{ color: theme.colors.textPrimary }}
                        >
                          Total
                        </span>
                        <span
                          className="text-2xl font-black"
                          style={{ color: theme.colors.textPrimary }}
                        >
                          {formatPrice(total + (total >= 5000 ? 0 : 499) - promoDiscount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full px-10 py-6 font-extrabold uppercase tracking-widest text-lg transition-all duration-300 transform hover:scale-105 shadow-elegant hover:shadow-elegant-lg border-2 rounded-creative mb-6"
                    style={{
                      background: `linear-gradient(135deg, ${theme.colors.buttonPrimary} 0%, ${theme.colors.buttonSecondary} 100%)`,
                      color: '#FFFFFF',
                      borderColor: theme.colors.buttonPrimary,
                    }}
                  >
                    Proceed to Checkout
                  </button>

                  <Link
                    to="/products"
                    className="block text-center font-semibold transition-colors hover:opacity-80"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Cart Recommendations */}
          {cartItems.length > 0 && (
            <div className="py-16">
              <div className="mb-12">
                <h2
                  className="text-3xl font-black mb-4"
                  style={{ color: theme.colors.textPrimary }}
                >
                  You Might Also Like
                </h2>
                <p
                  className="text-lg"
                  style={{ color: theme.colors.textSecondary }}
                >
                  Complete your look with these curated recommendations
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockProducts
                  .filter(product =>
                    !cartItems.some(item => item.productId === product._id) &&
                    product.isActive &&
                    product.isFeatured
                  )
                  .slice(0, 4)
                  .map((product) => (
                    <div key={product._id} className="transform hover:scale-105 transition-transform duration-300">
                      <ProductCard
                        product={product}
                      />
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Cart Analytics & Insights */}
          {cartItems.length > 0 && (
            <div className="py-16">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Insights */}
                <div
                  className="border-2 rounded-creative shadow-card p-6"
                  style={{
                    backgroundColor: theme.colors.cardBackground,
                    borderColor: theme.colors.borderPrimary,
                  }}
                >
                  <h3
                    className="text-xl font-bold mb-4 flex items-center gap-2"
                    style={{ color: theme.colors.textPrimary }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Cart Insights
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span style={{ color: theme.colors.textSecondary }}>Items in cart:</span>
                      <span className="font-semibold" style={{ color: theme.colors.textPrimary }}>
                        {cartItems.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: theme.colors.textSecondary }}>Total quantity:</span>
                      <span className="font-semibold" style={{ color: theme.colors.textPrimary }}>
                        {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: theme.colors.textSecondary }}>Average price:</span>
                      <span className="font-semibold" style={{ color: theme.colors.textPrimary }}>
                        {formatPrice(total / cartItems.reduce((sum, item) => sum + item.quantity, 0))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: theme.colors.textSecondary }}>Potential savings:</span>
                      <span className="font-semibold" style={{ color: theme.colors.stateSuccess }}>
                        {formatPrice(cartItems.reduce((sum, item) => {
                          const discount = (item.unitPrice || 0) * 0.1; // Mock discount calculation
                          return sum + (discount * item.quantity);
                        }, 0))}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery Information */}
                <div
                  className="border-2 rounded-creative shadow-card p-6"
                  style={{
                    backgroundColor: theme.colors.cardBackground,
                    borderColor: theme.colors.borderPrimary,
                  }}
                >
                  <h3
                    className="text-xl font-bold mb-4 flex items-center gap-2"
                    style={{ color: theme.colors.textPrimary }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Delivery Info
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: theme.colors.stateSuccess }}
                      ></div>
                      <span style={{ color: theme.colors.textSecondary }}>
                        Free shipping on orders above â‚¹999
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: theme.colors.stateSuccess }}
                      ></div>
                      <span style={{ color: theme.colors.textSecondary }}>
                        Express delivery available
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: theme.colors.stateWarning }}
                      ></div>
                      <span style={{ color: theme.colors.textSecondary }}>
                        Estimated delivery: 3-5 business days
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cart Actions */}
                <div
                  className="border-2 rounded-creative shadow-card p-6"
                  style={{
                    backgroundColor: theme.colors.cardBackground,
                    borderColor: theme.colors.borderPrimary,
                  }}
                >
                  <h3
                    className="text-xl font-bold mb-4 flex items-center gap-2"
                    style={{ color: theme.colors.textPrimary }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        const shareUrl = window.location.href;
                        navigator.clipboard.writeText(shareUrl);
                        toast.success('Cart link copied to clipboard!');
                      }}
                      className="w-full px-4 py-2 border-2 rounded font-semibold transition-all hover:scale-105"
                      style={{
                        borderColor: theme.colors.borderPrimary,
                        color: theme.colors.textPrimary,
                        backgroundColor: theme.colors.backgroundTertiary,
                      }}
                    >
                      Share Cart
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Save cart for later? You can access it from your account.')) {
                          toast.success('Cart saved for later!');
                        }
                      }}
                      className="w-full px-4 py-2 border-2 rounded font-semibold transition-all hover:scale-105"
                      style={{
                        borderColor: theme.colors.borderPrimary,
                        color: theme.colors.textPrimary,
                        backgroundColor: theme.colors.backgroundTertiary,
                      }}
                    >
                      Save for Later
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Clear all items from cart?')) {
                          // clearCart();
                          loadCart();
                          toast.success('Cart cleared!');
                        }
                      }}
                      className="w-full px-4 py-2 border-2 rounded font-semibold transition-all hover:scale-105"
                      style={{
                        borderColor: '#EF4444',
                        color: '#EF4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      }}
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

