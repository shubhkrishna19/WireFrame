import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCart, CartItem } from '../store/cartStore';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useCurrency } from '../contexts/CurrencyContext';

export const AbandonedCartRecovery: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const { formatPrice } = useCurrency();
  const [showBanner, setShowBanner] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadCart = async () => {
      const cart = await getCart();
      if (cart.length > 0) {
        // Check if cart was abandoned (items added more than 10 minutes ago)
        const abandonedItems = cart.filter(item => {
          const timeSinceAdded = Date.now() - item.addedAt;
          return timeSinceAdded > 10 * 60 * 1000; // 10 minutes
        });

        if (abandonedItems.length > 0) {
          setCartItems(cart);
          setShowBanner(true);
        }
      }
    };
    loadCart();
  }, [isAuthenticated]);

  if (!showBanner || cartItems.length === 0) {
    return null;
  }

  const total = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t-2 shadow-2xl animate-slide-in-up"
      style={{
        backgroundColor: theme.colors.cardBackground,
        borderColor: theme.colors.borderPrimary,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="text-2xl">🛒</div>
            <div>
              <p
                className="font-bold text-sm"
                style={{ color: theme.colors.textPrimary }}
              >
                You have {cartItems.length} item{cartItems.length > 1 ? 's' : ''} in your cart
              </p>
              <p
                className="text-xs"
                style={{ color: theme.colors.textSecondary }}
              >
                Complete your purchase - {formatPrice(total)} waiting for you!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowBanner(false)}
              className="px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ color: theme.colors.textSecondary }}
            >
              Dismiss
            </button>
            <Link
              to="/cart"
              className="px-6 py-2 text-sm font-bold uppercase tracking-wider transition-all hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.buttonPrimary} 0%, ${theme.colors.buttonSecondary} 100%)`,
                color: '#FFFFFF',
              }}
            >
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

