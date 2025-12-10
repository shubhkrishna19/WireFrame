import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { usePageTracking } from '../hooks/usePageTracking';
import { Navbar } from '../components/Navbar';
import { ProductForm } from '../components/ProductForm';
import { ThemeSettings } from '../components/ThemeSettings';
import * as dataStore from '../store/dataStore';
import { Product } from '../data/mockData';
import { Order, OrderStatus } from '../data/orderTypes';
import { useCurrency } from '../contexts/CurrencyContext';
import { useToast } from '../components/Toast';
import { sendOrderStatusUpdate } from '../utils/emailService';
import { SEO } from '../components/SEO';
import { pageMetadata } from '../utils/seoConfig';
import { LoadingSpinner } from '../components/LoadingSpinner';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  usePageTracking('Admin Dashboard');
  const [activeTab, setActiveTab] = useState<'products' | 'add-product' | 'edit-product' | 'orders' | 'theme'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const { formatPrice } = useCurrency();
  const toast = useToast();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await dataStore.getProducts({});
        setProducts(productsData);
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
      }
    };

    loadProducts();
    loadOrders();
    setLoading(false);
  }, []);

  const loadOrders = () => {
    try {
      const allOrders = JSON.parse(localStorage.getItem('bluewud_orders') || '[]') as Order[];
      setOrders(allOrders.sort((a, b) => b.createdAt - a.createdAt));
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus, trackingNumber?: string) => {
    try {
      const allOrders = JSON.parse(localStorage.getItem('bluewud_orders') || '[]') as Order[];
      const orderIndex = allOrders.findIndex(o => o._id === orderId);

      if (orderIndex === -1) {
        toast.error('Order not found');
        return;
      }

      const order = allOrders[orderIndex];
      const updatedOrder: Order = {
        ...order,
        status: newStatus,
        updatedAt: Date.now(),
        ...(trackingNumber && { trackingNumber }),
      };

      allOrders[orderIndex] = updatedOrder;
      localStorage.setItem('bluewud_orders', JSON.stringify(allOrders));
      loadOrders();

      // Send email notification (mock)
      const users = JSON.parse(localStorage.getItem('bluewud_users') || '[]');
      const user = users.find((u: any) => u._id === order.userId);
      if (user?.email) {
        await sendOrderStatusUpdate(user.email, {
          orderNumber: order.orderNumber,
          status: newStatus,
          trackingNumber,
        });
      }

      toast.success(`Order ${order.orderNumber} status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  // Double-check admin/editor access (redundant but safe)
  if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
    return (
      <div
        className="min-h-screen"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.backgroundPrimary} 0%, ${theme.colors.backgroundSecondary} 50%, ${theme.colors.backgroundPrimary} 100%)`,
          color: theme.colors.textPrimary,
        }}
      >
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div
            className="border-2 rounded-creative shadow-card p-12 max-w-md mx-auto"
            style={{
              backgroundColor: theme.colors.cardBackground,
              borderColor: theme.colors.borderPrimary,
            }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{
                backgroundColor: `${theme.colors.brandPrimary}30`,
              }}
            >
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: theme.colors.brandPrimary }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1
              className="text-3xl font-bold mb-4"
              style={{ color: theme.colors.textPrimary }}
            >
              Access Denied
            </h1>
            <p
              className="mb-6"
              style={{ color: theme.colors.textSecondary }}
            >
              You need admin privileges to access this page.
            </p>
            <a
              href="/"
              className="inline-block px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-creative font-extrabold uppercase tracking-wider hover:from-primary-700 hover:to-primary-800 transition-all shadow-elegant transform hover:scale-105"
            >
              Go to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  const handleProductAdded = async () => {
    // Refresh products list
    try {
      const productsData = await dataStore.getProducts({});
      setProducts(productsData);
    } catch (error) {
      console.error('Error refreshing products:', error);
    }
    setActiveTab('products');
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.backgroundPrimary} 0%, ${theme.colors.backgroundSecondary} 50%, ${theme.colors.backgroundPrimary} 100%)`,
        color: theme.colors.textPrimary,
      }}
    >
      <SEO
        title={pageMetadata.adminDashboard.title}
        description={pageMetadata.adminDashboard.description}
        noindex={true}
      />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-4xl font-bold mb-2"
                style={{ color: theme.colors.textPrimary }}
              >
                Admin Dashboard
              </h1>
              <p style={{ color: theme.colors.textSecondary }}>Manage products and inventory</p>
            </div>
            <div
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl"
              style={{
                backgroundColor: `${theme.colors.buttonPrimary}20`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: theme.colors.stateSuccess }}
              ></div>
              <span
                className="text-sm font-medium"
                style={{ color: theme.colors.buttonPrimary }}
              >
                Admin Mode
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="border-2 rounded-creative shadow-card overflow-hidden mb-6"
          style={{
            backgroundColor: theme.colors.cardBackground,
            borderColor: theme.colors.borderPrimary,
          }}
        >
          <div
            className="border-b-2"
            style={{
              backgroundColor: theme.colors.backgroundSecondary,
              borderColor: theme.colors.borderPrimary,
            }}
          >
            <nav className="flex">
              <button
                onClick={() => setActiveTab('products')}
                className="px-8 py-5 text-sm font-bold uppercase tracking-wider border-b-4 transition-all"
                style={{
                  borderColor: activeTab === 'products' ? theme.colors.buttonPrimary : 'transparent',
                  color: activeTab === 'products' ? theme.colors.textPrimary : theme.colors.textTertiary,
                  backgroundColor: activeTab === 'products' ? theme.colors.cardBackground : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'products') {
                    e.currentTarget.style.color = theme.colors.textSecondary;
                    e.currentTarget.style.backgroundColor = theme.colors.backgroundTertiary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'products') {
                    e.currentTarget.style.color = theme.colors.textTertiary;
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                All Products ({products.length})
              </button>
              <button
                onClick={() => {
                  setActiveTab('add-product');
                  setEditingProductId(null);
                }}
                className="px-8 py-5 text-sm font-bold uppercase tracking-wider border-b-4 transition-all"
                style={{
                  borderColor: activeTab === 'add-product' ? theme.colors.buttonPrimary : 'transparent',
                  color: activeTab === 'add-product' ? theme.colors.textPrimary : theme.colors.textTertiary,
                  backgroundColor: activeTab === 'add-product' ? theme.colors.cardBackground : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'add-product') {
                    e.currentTarget.style.color = theme.colors.textSecondary;
                    e.currentTarget.style.backgroundColor = theme.colors.backgroundTertiary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'add-product') {
                    e.currentTarget.style.color = theme.colors.textTertiary;
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                Add New Product
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className="px-8 py-5 text-sm font-bold uppercase tracking-wider border-b-4 transition-all"
                style={{
                  borderColor: activeTab === 'orders' ? theme.colors.buttonPrimary : 'transparent',
                  color: activeTab === 'orders' ? theme.colors.textPrimary : theme.colors.textTertiary,
                  backgroundColor: activeTab === 'orders' ? theme.colors.cardBackground : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'orders') {
                    e.currentTarget.style.color = theme.colors.textSecondary;
                    e.currentTarget.style.backgroundColor = theme.colors.backgroundTertiary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'orders') {
                    e.currentTarget.style.color = theme.colors.textTertiary;
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab('theme')}
                className="px-8 py-5 text-sm font-bold uppercase tracking-wider border-b-4 transition-all"
                style={{
                  borderColor: activeTab === 'theme' ? theme.colors.buttonPrimary : 'transparent',
                  color: activeTab === 'theme' ? theme.colors.textPrimary : theme.colors.textTertiary,
                  backgroundColor: activeTab === 'theme' ? theme.colors.cardBackground : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'theme') {
                    e.currentTarget.style.color = theme.colors.textSecondary;
                    e.currentTarget.style.backgroundColor = theme.colors.backgroundTertiary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'theme') {
                    e.currentTarget.style.color = theme.colors.textTertiary;
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                Theme & Colors
              </button>
            </nav>
          </div>

          <div className="p-6 lg:p-8">
            {activeTab === 'products' && (
              <div>
                {loading ? (
                  <div className="text-center py-12">
                    <LoadingSpinner />
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-12">
                    <svg
                      className="w-16 h-16 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: theme.colors.textTertiary }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p
                      className="text-lg mb-4"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      No products found.
                    </p>
                    <button
                      onClick={() => setActiveTab('add-product')}
                      className="px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${theme.colors.buttonPrimary} 0%, ${theme.colors.buttonSecondary} 100%)`,
                        color: '#FFFFFF',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.9';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                    >
                      Add Your First Product
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table
                      className="min-w-full divide-y"
                      style={{ borderColor: theme.colors.borderPrimary }}
                    >
                      <thead
                        className=""
                        style={{
                          background: `linear-gradient(to right, ${theme.colors.backgroundSecondary}, ${theme.colors.backgroundTertiary})`,
                        }}
                      >
                        <tr>
                          <th
                            className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
                            style={{ color: theme.colors.textPrimary }}
                          >
                            Product
                          </th>
                          <th
                            className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
                            style={{ color: theme.colors.textPrimary }}
                          >
                            SKU
                          </th>
                          <th
                            className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
                            style={{ color: theme.colors.textPrimary }}
                          >
                            Price
                          </th>
                          <th
                            className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
                            style={{ color: theme.colors.textPrimary }}
                          >
                            Stock
                          </th>
                          <th
                            className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
                            style={{ color: theme.colors.textPrimary }}
                          >
                            Status
                          </th>
                          <th
                            className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
                            style={{ color: theme.colors.textPrimary }}
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody
                        className="divide-y"
                        style={{
                          backgroundColor: theme.colors.cardBackground,
                          borderColor: theme.colors.borderPrimary,
                        }}
                      >
                        {products.map((product) => (
                          <tr
                            key={product._id}
                            className="transition-colors"
                            style={{
                              borderColor: theme.colors.borderPrimary,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = theme.colors.backgroundTertiary;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = theme.colors.cardBackground;
                            }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img
                                  src={product.thumbnail}
                                  alt={product.name}
                                  className="w-14 h-14 object-cover rounded-2xl mr-4 shadow-md"
                                  loading="lazy"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=112&h=112&fit=crop&auto=format';
                                  }}
                                />
                                <div>
                                  <div
                                    className="text-sm font-semibold"
                                    style={{ color: theme.colors.textPrimary }}
                                  >
                                    {product.name}
                                  </div>
                                  <div
                                    className="text-sm"
                                    style={{ color: theme.colors.textSecondary }}
                                  >
                                    {product.brand}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td
                              className="px-6 py-4 whitespace-nowrap text-sm font-mono"
                              style={{ color: theme.colors.textSecondary }}
                            >
                              {product.sku}
                            </td>
                            <td
                              className="px-6 py-4 whitespace-nowrap text-sm font-bold"
                              style={{ color: theme.colors.textPrimary }}
                            >
                              â‚¹{product.price}
                            </td>
                            <td
                              className="px-6 py-4 whitespace-nowrap text-sm"
                              style={{ color: theme.colors.textSecondary }}
                            >
                              {product.stock}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className="px-3 py-1.5 text-xs font-semibold rounded-full"
                                style={{
                                  backgroundColor: product.isActive
                                    ? `${theme.colors.stateSuccess}30`
                                    : `${theme.colors.brandPrimary}30`,
                                  color: product.isActive
                                    ? theme.colors.stateSuccess
                                    : theme.colors.brandPrimary,
                                }}
                              >
                                {product.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <a
                                href={`/products/${product.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mr-4 font-semibold transition-colors hover:opacity-80"
                                style={{ color: theme.colors.buttonPrimary }}
                              >
                                View
                              </a>
                              <button
                                onClick={() => {
                                  setActiveTab('edit-product');
                                  setEditingProductId(product._id);
                                }}
                                className="mr-4 font-semibold transition-colors hover:opacity-80"
                                style={{ color: theme.colors.buttonPrimary }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
                                    // For demo purposes, just remove from local state
                                    // In a real app, this would call an API
                                    setProducts(prev => prev.filter(p => p._id !== product._id));
                                    toast.success('Product deleted successfully');
                                  }
                                }}
                                className="font-semibold transition-colors hover:opacity-80"
                                style={{ color: '#EF4444' }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {(activeTab === 'add-product' || activeTab === 'edit-product') && (
              <div>
                <div className="mb-6">
                  <h2
                    className="text-2xl font-bold mb-2"
                    style={{ color: theme.colors.textPrimary }}
                  >
                    {activeTab === 'edit-product' ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <p style={{ color: theme.colors.textSecondary }}>
                    {activeTab === 'edit-product'
                      ? 'Update product details below.'
                      : 'Fill in all the details to create a new product listing.'}
                  </p>
                </div>
                <ProductForm
                  onProductAdded={handleProductAdded}
                  editingProductId={activeTab === 'edit-product' && editingProductId ? editingProductId : undefined}
                />
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <div className="mb-6">
                  <h2
                    className="text-2xl font-bold mb-2"
                    style={{ color: theme.colors.textPrimary }}
                  >
                    Order Management
                  </h2>
                  <p style={{ color: theme.colors.textSecondary }}>
                    View and manage all customer orders
                  </p>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <svg
                      className="w-16 h-16 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: theme.colors.textTertiary }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p
                      className="text-lg mb-4"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      No orders yet.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table
                      className="min-w-full divide-y"
                      style={{ borderColor: theme.colors.borderPrimary }}
                    >
                      <thead
                        className=""
                        style={{
                          background: `linear-gradient(to right, ${theme.colors.backgroundSecondary}, ${theme.colors.backgroundTertiary})`,
                        }}
                      >
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: theme.colors.textPrimary }}>Order #</th>
                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: theme.colors.textPrimary }}>Customer</th>
                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: theme.colors.textPrimary }}>Items</th>
                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: theme.colors.textPrimary }}>Total</th>
                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: theme.colors.textPrimary }}>Status</th>
                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: theme.colors.textPrimary }}>Payment</th>
                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: theme.colors.textPrimary }}>Date</th>
                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: theme.colors.textPrimary }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: theme.colors.borderPrimary }}>
                        {orders.map((order) => {
                          const users = JSON.parse(localStorage.getItem('bluewud_users') || '[]');
                          const customer = users.find((u: any) => u._id === order.userId);
                          const statusColors: Partial<Record<OrderStatus, string>> = {
                            pending: theme.colors.stateWarning,
                            processing: theme.colors.accentCool,
                            shipped: theme.colors.brandDark,
                            delivered: theme.colors.stateSuccess,
                            cancelled: theme.colors.brandPrimary,
                            refunded: theme.colors.textTertiary,
                          };
                          const statusColor = statusColors[order.status] || theme.colors.textSecondary;
                          return (
                            <tr key={order._id} className="hover:opacity-80 transition-opacity">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold" style={{ color: theme.colors.textPrimary }}>
                                {order.orderNumber}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.colors.textSecondary }}>
                                {customer?.name || 'Unknown'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.colors.textSecondary }}>
                                {order.items.length} item(s)
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold" style={{ color: theme.colors.textPrimary }}>
                                {formatPrice(order.total)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className="px-3 py-1 text-xs font-semibold uppercase rounded-full"
                                  style={{
                                    backgroundColor: `${statusColor}20`,
                                    color: statusColor,
                                  }}
                                >
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.colors.textSecondary }}>
                                {order.paymentMethod.toUpperCase()} - {order.paymentStatus}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.colors.textSecondary }}>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <select
                                  value={order.status}
                                  onChange={(e) => {
                                    const newStatus = e.target.value as OrderStatus;
                                    if (newStatus === 'shipped') {
                                      const tracking = prompt('Enter tracking number (optional):');
                                      updateOrderStatus(order._id, newStatus, tracking || undefined);
                                    } else {
                                      updateOrderStatus(order._id, newStatus);
                                    }
                                  }}
                                  className="px-3 py-1 rounded border-2 text-sm"
                                  aria-label={`Update order ${order.orderNumber} status`}
                                  title={`Update order ${order.orderNumber} status`}
                                  style={{
                                    backgroundColor: theme.colors.cardBackground,
                                    borderColor: theme.colors.borderPrimary,
                                    color: theme.colors.textPrimary,
                                  }}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="processing">Processing</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                  <option value="refunded">Refunded</option>
                                </select>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'theme' && (
              <ThemeSettings />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { AdminDashboard };
export default AdminDashboard;


