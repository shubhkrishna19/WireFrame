import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { Order, OrderStatus } from '../data/orderTypes';
import { useToast } from '../components/Toast';

interface OrderHistoryProps {
  orders: Order[];
  onOrderUpdate?: () => void;
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: '#F59E0B',
  confirmed: '#3B82F6',
  processing: '#8B5CF6',
  shipped: '#10B981',
  delivered: '#059669',
  cancelled: '#EF4444',
  refunded: '#6B7280',
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export const OrderHistory: React.FC<OrderHistoryProps> = ({ orders, onOrderUpdate }) => {
  const { theme } = useTheme();
  const { formatPrice } = useCurrency();
  const toast = useToast();
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');

  const toggleOrder = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const handleCancelOrder = (order: Order) => {
    if (!window.confirm(`Are you sure you want to cancel order ${order.orderNumber}?`)) {
      return;
    }

    if (order.status === 'delivered' || order.status === 'shipped') {
      toast.warning('Cannot cancel order that has already been shipped');
      return;
    }

    if (order.status === 'cancelled') {
      toast.info('Order is already cancelled');
      return;
    }

    try {
      const allOrders = JSON.parse(localStorage.getItem('bluewud_orders') || '[]') as Order[];
      const orderIndex = allOrders.findIndex(o => o._id === order._id);
      
      if (orderIndex !== -1) {
        allOrders[orderIndex] = {
          ...allOrders[orderIndex],
          status: 'cancelled',
          cancelledAt: Date.now(),
          cancelledReason: 'Cancelled by customer',
          updatedAt: Date.now(),
        };
        localStorage.setItem('bluewud_orders', JSON.stringify(allOrders));
        toast.success('Order cancelled successfully');
        onOrderUpdate?.();
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order. Please try again.');
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const getStatusBadgeStyle = (status: OrderStatus) => ({
    backgroundColor: `${STATUS_COLORS[status]}20`,
    color: STATUS_COLORS[status],
    borderColor: `${STATUS_COLORS[status]}60`,
  });

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: theme.colors.textTertiary }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h3 
          className="text-xl font-bold mb-2"
          style={{ color: theme.colors.textPrimary }}
        >
          No Orders Yet
        </h3>
        <p 
          className="mb-6"
          style={{ color: theme.colors.textSecondary }}
        >
          Start shopping to see your orders here
        </p>
        <Link
          to="/products"
          className="inline-block px-8 py-3 font-bold uppercase tracking-wider transition-all shadow-elegant transform hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${theme.colors.buttonPrimary} 0%, ${theme.colors.buttonSecondary} 100%)`,
            color: '#FFFFFF',
          }}
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilterStatus('all')}
          className="px-6 py-2 text-sm font-bold uppercase tracking-wider border-2 transition-all"
          style={{
            backgroundColor: filterStatus === 'all' ? theme.colors.buttonPrimary : theme.colors.cardBackground,
            color: filterStatus === 'all' ? '#FFFFFF' : theme.colors.textPrimary,
            borderColor: filterStatus === 'all' ? theme.colors.buttonPrimary : theme.colors.borderPrimary,
          }}
        >
          All ({orders.length})
        </button>
        {Object.entries(STATUS_LABELS).map(([status, label]) => {
          const count = orders.filter(o => o.status === status).length;
          if (count === 0) return null;
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status as OrderStatus)}
              className="px-6 py-2 text-sm font-bold uppercase tracking-wider border-2 transition-all"
              style={{
                backgroundColor: filterStatus === status ? STATUS_COLORS[status as OrderStatus] : theme.colors.cardBackground,
                color: filterStatus === status ? '#FFFFFF' : STATUS_COLORS[status as OrderStatus],
                borderColor: STATUS_COLORS[status as OrderStatus],
              }}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="border-2 rounded-creative shadow-card overflow-hidden"
            style={{
              backgroundColor: theme.colors.cardBackground,
              borderColor: theme.colors.borderPrimary,
            }}
          >
            {/* Order Header */}
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 
                      className="text-lg font-black"
                      style={{ color: theme.colors.textPrimary }}
                    >
                      Order {order.orderNumber}
                    </h3>
                    <span
                      className="px-3 py-1 text-xs font-bold uppercase tracking-wider border-2 rounded-creative"
                      style={getStatusBadgeStyle(order.status)}
                    >
                      {STATUS_LABELS[order.status]}
                    </span>
                  </div>
                  <p 
                    className="text-sm mb-1"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  {order.trackingNumber && (
                    <p 
                      className="text-sm"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      Tracking: <span className="font-semibold">{order.trackingNumber}</span>
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p 
                    className="text-xl font-black mb-1"
                    style={{ color: theme.colors.textPrimary }}
                  >
                    {formatPrice(order.total)}
                  </p>
                  <p 
                    className="text-sm"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={() => toggleOrder(order._id)}
                  className="px-4 py-2 text-sm font-bold uppercase tracking-wider border-2 transition-all"
                  style={{
                    backgroundColor: theme.colors.backgroundTertiary,
                    color: theme.colors.textPrimary,
                    borderColor: theme.colors.borderPrimary,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.backgroundTertiary;
                  }}
                >
                  {expandedOrders.has(order._id) ? 'Hide Details' : 'View Details'}
                </button>
                {order.status !== 'cancelled' && 
                 order.status !== 'delivered' && 
                 order.status !== 'shipped' && (
                  <button
                    onClick={() => handleCancelOrder(order)}
                    className="px-4 py-2 text-sm font-bold uppercase tracking-wider border-2 transition-all"
                    style={{
                      backgroundColor: 'transparent',
                      color: '#EF4444',
                      borderColor: '#EF4444',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#EF444420';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Cancel Order
                  </button>
                )}
                {order.status === 'delivered' && (
                  <Link
                    to={`/products/${order.items[0]?.productSlug || ''}`}
                    className="px-4 py-2 text-sm font-bold uppercase tracking-wider border-2 transition-all inline-block"
                    style={{
                      backgroundColor: 'transparent',
                      color: theme.colors.buttonPrimary,
                      borderColor: theme.colors.buttonPrimary,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${theme.colors.buttonPrimary}20`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Buy Again
                  </Link>
                )}
              </div>
            </div>

            {/* Expanded Order Details */}
            {expandedOrders.has(order._id) && (
              <div 
                className="border-t-2 p-6"
                style={{ borderColor: theme.colors.borderPrimary }}
              >
                {/* Order Items */}
                <div className="mb-6">
                  <h4 
                    className="text-lg font-bold mb-4"
                    style={{ color: theme.colors.textPrimary }}
                  >
                    Order Items
                  </h4>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div 
                        key={index}
                        className="flex gap-4 p-4 border-2 rounded-creative"
                        style={{
                          backgroundColor: theme.colors.backgroundSecondary,
                          borderColor: theme.colors.borderPrimary,
                        }}
                      >
                        {item.productImage && (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-20 h-20 object-cover rounded-creative"
                            loading="lazy"
                          />
                        )}
                        <div className="flex-1">
                          <h5 
                            className="font-bold mb-1"
                            style={{ color: theme.colors.textPrimary }}
                          >
                            {item.productName}
                          </h5>
                          <p 
                            className="text-sm mb-2"
                            style={{ color: theme.colors.textSecondary }}
                          >
                            {item.color} â€¢ Size: {item.size} â€¢ Qty: {item.quantity}
                          </p>
                          <p 
                            className="font-bold"
                            style={{ color: theme.colors.textPrimary }}
                          >
                            {formatPrice(item.subtotal)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="mb-6">
                  <h4 
                    className="text-lg font-bold mb-2"
                    style={{ color: theme.colors.textPrimary }}
                  >
                    Shipping Address
                  </h4>
                  <p 
                    className="text-sm"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    {order.shippingAddress.name && `${order.shippingAddress.name}, `}
                    {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    {order.shippingAddress.country && `, ${order.shippingAddress.country}`}
                  </p>
                </div>

                {/* Order Summary */}
                <div 
                  className="border-t-2 pt-4"
                  style={{ borderColor: theme.colors.borderPrimary }}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: theme.colors.textSecondary }}>Subtotal:</span>
                      <span style={{ color: theme.colors.textPrimary }}>{formatPrice(order.subtotal)}</span>
                    </div>
                    {order.shipping > 0 && (
                      <div className="flex justify-between text-sm">
                        <span style={{ color: theme.colors.textSecondary }}>Shipping:</span>
                        <span style={{ color: theme.colors.textPrimary }}>{formatPrice(order.shipping)}</span>
                      </div>
                    )}
                    {order.tax > 0 && (
                      <div className="flex justify-between text-sm">
                        <span style={{ color: theme.colors.textSecondary }}>Tax:</span>
                        <span style={{ color: theme.colors.textPrimary }}>{formatPrice(order.tax)}</span>
                      </div>
                    )}
                    {order.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span style={{ color: theme.colors.textSecondary }}>Discount:</span>
                        <span style={{ color: '#10B981' }}>-{formatPrice(order.discount)}</span>
                      </div>
                    )}
                    <div 
                      className="flex justify-between pt-2 border-t-2"
                      style={{ 
                        borderColor: theme.colors.borderPrimary,
                      }}
                    >
                      <span 
                        className="text-lg font-bold"
                        style={{ color: theme.colors.textPrimary }}
                      >
                        Total:
                      </span>
                      <span 
                        className="text-lg font-black"
                        style={{ color: theme.colors.textPrimary }}
                      >
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="mt-4 pt-4 border-t-2" style={{ borderColor: theme.colors.borderPrimary }}>
                  <p className="text-sm">
                    <span style={{ color: theme.colors.textSecondary }}>Payment Method: </span>
                    <span style={{ color: theme.colors.textPrimary }}>
                      {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod.toUpperCase()}
                    </span>
                  </p>
                  <p className="text-sm mt-1">
                    <span style={{ color: theme.colors.textSecondary }}>Payment Status: </span>
                    <span style={{ color: order.paymentStatus === 'paid' ? '#10B981' : theme.colors.textPrimary }}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p style={{ color: theme.colors.textSecondary }}>
            No orders found with status "{STATUS_LABELS[filterStatus as OrderStatus] || 'All'}"
          </p>
        </div>
      )}
    </div>
  );
};


