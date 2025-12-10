import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { Footer } from '../components/Footer';
import { usePageTracking } from '../hooks/usePageTracking';
import { SEO } from '../components/SEO';
import { pageMetadata } from '../utils/seoConfig';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Order } from '../types/apiTypes';
import { orderService } from '../services/orderService';
import { getOrCreateGuestSession } from '../store/guestSessionStore';

export const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const { formatPrice } = useCurrency();
  usePageTracking('Order Confirmation');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      // 1. Try to get order from navigation state (passed from Checkout)
      if (location.state?.order) {
        setOrder(location.state.order);
        setLoading(false);
        return;
      }

      if (!orderId) {
        navigate('/');
        return;
      }

      try {
        let foundOrder: Order | null = null;

        if (isAuthenticated) {
          // 2. If authenticated, fetch from API
          try {
            foundOrder = await orderService.getOrderById(orderId);
          } catch (error) {
            console.error('Error fetching authenticated order:', error);
          }
        } else {
          // 3. If guest, fetch from guest session orders
          try {
            const session = getOrCreateGuestSession();
            const guestOrders = await orderService.getGuestSessionOrders(session.id);
            // The API returns Order[] but types might mismatch slightly, cast if needed
            // Assuming backend returns objects compatible with Order interface
            foundOrder = guestOrders.find((o: any) => o.id === orderId || o._id === orderId) as Order || null;
          } catch (error) {
            console.error('Error fetching guest order:', error);
          }
        }

        // 4. Fallback to local storage (legacy/dev only)
        if (!foundOrder) {
          const localOrders = JSON.parse(localStorage.getItem('bluewud_orders') || '[]');
          // Map legacy _id to id if needed
          foundOrder = localOrders.find((o: any) => (o._id === orderId || o.id === orderId)) as Order || null;
        }

        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          // Order not found or not authorized
          // Don't redirect immediately, maybe show not found message
          console.warn('Order not found');
        }
      } catch (error) {
        console.error('Error in fetchOrder:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, isAuthenticated, location.state, navigate]);

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <LoadingSpinner />
            <p style={{ color: theme.colors.textSecondary }}>Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div
        className="min-h-screen"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.backgroundPrimary} 0%, ${theme.colors.backgroundSecondary} 50%, ${theme.colors.backgroundPrimary} 100%)`,
          color: theme.colors.textPrimary,
        }}
      >
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
            <p className="mb-8" style={{ color: theme.colors.textSecondary }}>
              We couldn't find the order you're looking for.
            </p>
            <Link
              to="/"
              className="px-6 py-3 font-bold rounded-creative transition-colors"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.buttonPrimary} 0%, ${theme.colors.buttonSecondary} 100%)`,
                color: '#FFFFFF',
              }}
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={pageMetadata.orderConfirmation.title}
        description={pageMetadata.orderConfirmation.description}
      />
      <div
        className="min-h-screen"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.backgroundPrimary} 0%, ${theme.colors.backgroundSecondary} 50%, ${theme.colors.backgroundPrimary} 100%)`,
          color: theme.colors.textPrimary,
        }}
      >
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto">
            {/* Success Icon */}
            <div className="text-center mb-8">
              <div
                className="inline-flex items-center justify-center w-20 h-20 border-4 mb-4"
                style={{
                  backgroundColor: '#D1FAE5',
                  borderColor: '#10B981',
                }}
              >
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: '#10B981' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1
                className="text-4xl font-black mb-2"
                style={{ color: theme.colors.textPrimary }}
              >
                Order Placed Successfully!
              </h1>
              <p style={{ color: theme.colors.textSecondary }}>Thank you for your purchase</p>
            </div>

            {/* Order Details */}
            <div
              className="border-2 p-8 mb-6"
              style={{
                backgroundColor: theme.colors.cardBackground,
                borderColor: theme.colors.borderPrimary,
              }}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm mb-1" style={{ color: theme.colors.textSecondary }}>
                    Order Number
                  </p>
                  <p className="text-xl font-black" style={{ color: theme.colors.textPrimary }}>
                    {order.orderNumber || order.id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm mb-1" style={{ color: theme.colors.textSecondary }}>
                    Order Date
                  </p>
                  <p className="text-lg font-bold" style={{ color: theme.colors.textPrimary }}>
                    {new Date(Number(order.createdAt)).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div
                className="border-t-2 pt-6 mb-6"
                style={{ borderColor: theme.colors.borderPrimary }}
              >
                <h2
                  className="text-xl font-black mb-4"
                  style={{ color: theme.colors.textPrimary }}
                >
                  Order Items
                </h2>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div>
                        <p className="font-bold" style={{ color: theme.colors.textPrimary }}>
                          {item.name}
                        </p>
                        <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                          {item.color} â€¢ {item.size} â€¢ Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold" style={{ color: theme.colors.textPrimary }}>
                        {formatPrice(item.subtotal || (item.unitPrice * item.quantity))}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="border-t-2 pt-6 mb-6"
                style={{ borderColor: theme.colors.borderPrimary }}
              >
                <h2
                  className="text-xl font-black mb-4"
                  style={{ color: theme.colors.textPrimary }}
                >
                  Delivery Address
                </h2>
                <p style={{ color: theme.colors.textSecondary }}>
                  {order.shippingAddress?.name && `${order.shippingAddress.name}, `}
                  {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
              </div>

              <div
                className="border-t-2 pt-6"
                style={{ borderColor: theme.colors.borderPrimary }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-bold" style={{ color: theme.colors.textPrimary }}>
                    Total Amount
                  </span>
                  <span className="text-2xl font-black" style={{ color: theme.colors.textPrimary }}>
                    {formatPrice(order.total)}
                  </span>
                </div>
                <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                  Payment Method: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod?.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="flex-1 px-6 py-3 font-bold transition-colors border-2 text-center"
                style={{
                  backgroundColor: theme.colors.cardBackground,
                  color: theme.colors.textPrimary,
                  borderColor: theme.colors.borderPrimary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.backgroundTertiary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.cardBackground;
                }}
              >
                Continue Shopping
              </Link>
              {isAuthenticated && (
                <Link
                  to="/profile?tab=orders"
                  className="flex-1 px-6 py-3 font-bold transition-colors border-2 text-center"
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.buttonPrimary} 0%, ${theme.colors.buttonSecondary} 100%)`,
                    color: '#FFFFFF',
                    borderColor: theme.colors.buttonPrimary,
                  }}
                >
                  View Orders
                </Link>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

