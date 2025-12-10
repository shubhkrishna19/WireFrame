import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useCurrency } from '../contexts/CurrencyContext';

import { useToast } from '../components/Toast';

interface Notification {
  id: string;
  type: 'price_drop' | 'restock' | 'recommendation' | 'wishlist' | 'cart_reminder' | 'flash_sale' | 'loyalty';
  title: string;
  message: string;
  productId?: string;
  productName?: string;
  oldPrice?: number;
  newPrice?: number;
  discountPercentage?: number;
  imageUrl?: string;
  actionUrl?: string;
  actionText?: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationSettings {
  priceAlerts: boolean;
  restockAlerts: boolean;
  recommendations: boolean;
  flashSales: boolean;
  cartReminders: boolean;
  wishlistUpdates: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export const SmartNotifications: React.FC = () => {
  const { theme } = useTheme();
  const { formatPrice } = useCurrency();

  const toast = useToast();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    priceAlerts: true,
    restockAlerts: true,
    recommendations: true,
    flashSales: true,
    cartReminders: false,
    wishlistUpdates: true,
    emailNotifications: true,
    pushNotifications: false,
  });
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'price' | 'restock' | 'promo'>('all');
  const [showSettings, setShowSettings] = useState(false);

  // Mock notifications data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: 'notif-1',
        type: 'price_drop',
        title: 'Price Drop Alert! ðŸŽ‰',
        message: 'Premium Merino Wool T-Shirt is now â‚¹2,999 (was â‚¹3,999)',
        productId: 'prod-1',
        productName: 'Premium Merino Wool T-Shirt',
        oldPrice: 3999,
        newPrice: 2999,
        discountPercentage: 25,
        imageUrl: 'https://placehold.co/200x200/2D3748/4A5568?text=MERINO+TSHIRT&font=playfair',
        actionUrl: '/products/premium-merino-wool-t-shirt',
        actionText: 'Shop Now',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
        priority: 'high',
      },
      {
        id: 'notif-2',
        type: 'restock',
        title: 'Back in Stock! ðŸ“¦',
        message: 'Slim Fit Denim Jeans are back in stock. Limited quantities available.',
        productId: 'prod-3',
        productName: 'Slim Fit Denim Jeans',
        imageUrl: 'https://placehold.co/200x200/1A365D/2D3748?text=SLIM+JEANS&font=playfair',
        actionUrl: '/products/slim-fit-denim-jeans',
        actionText: 'View Product',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
        priority: 'medium',
      },
      {
        id: 'notif-3',
        type: 'recommendation',
        title: 'You Might Like This ðŸ‘•',
        message: 'Based on your recent purchases, check out our Bamboo Cotton T-Shirt',
        productId: 'prod-8',
        productName: 'Bamboo Cotton Blend T-Shirt',
        imageUrl: 'https://placehold.co/200x200/68D391/2F855A?text=BAMBOO+TSHIRT&font=playfair',
        actionUrl: '/products/bamboo-cotton-blend-t-shirt',
        actionText: 'View Product',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        read: true,
        priority: 'low',
      },
      {
        id: 'notif-4',
        type: 'flash_sale',
        title: 'âš¡ Flash Sale: 50% Off!',
        message: 'Limited time offer on all hoodies. Ends in 2 hours!',
        actionUrl: '/products?category=hoodies&sale=true',
        actionText: 'Shop Sale',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        read: false,
        priority: 'high',
      },
      {
        id: 'notif-5',
        type: 'loyalty',
        title: 'Congratulations! ðŸŽŠ',
        message: 'You\'ve earned 50 loyalty points from your recent purchase. Total points: 250',
        actionUrl: '/profile/loyalty',
        actionText: 'View Rewards',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
        priority: 'medium',
      },
      {
        id: 'notif-6',
        type: 'cart_reminder',
        title: 'Don\'t Forget Your Cart ðŸ›’',
        message: 'You have 3 items waiting in your cart. Complete your purchase now!',
        actionUrl: '/cart',
        actionText: 'View Cart',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        read: true,
        priority: 'medium',
      },
    ];

    setNotifications(mockNotifications);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'price_drop':
        return 'ðŸ’°';
      case 'restock':
        return 'ðŸ“¦';
      case 'recommendation':
        return 'ðŸ’¡';
      case 'flash_sale':
        return 'âš¡';
      case 'loyalty':
        return 'ðŸŽ';
      case 'cart_reminder':
        return 'ðŸ›’';
      case 'wishlist':
        return 'â¤ï¸';
      default:
        return 'ðŸ””';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return theme.colors.brandPrimary;
      case 'medium':
        return theme.colors.stateWarning;
      case 'low':
        return theme.colors.stateSuccess;
      default:
        return theme.colors.textSecondary;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    toast.success('Notification deleted');
  };

  const filteredNotifications = notifications.filter(notif => {
    switch (activeTab) {
      case 'unread':
        return !notif.read;
      case 'price':
        return notif.type === 'price_drop';
      case 'restock':
        return notif.type === 'restock';
      case 'promo':
        return ['flash_sale', 'loyalty'].includes(notif.type);
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const updateSettings = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast.success('Settings updated');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-black"
            style={{ color: theme.colors.textPrimary }}
          >
            Smart Notifications ðŸ””
          </h1>
          <p
            className="text-lg mt-2"
            style={{ color: theme.colors.textSecondary }}
          >
            Stay updated with personalized alerts and offers
          </p>
        </div>
        <div className="flex items-center gap-4">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors hover:opacity-80"
              style={{
                backgroundColor: theme.colors.buttonPrimary,
                color: '#FFFFFF',
              }}
            >
              Mark All Read ({unreadCount})
            </button>
          )}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 rounded-full transition-colors hover:opacity-80"
            style={{
              backgroundColor: theme.colors.backgroundSecondary,
              color: theme.colors.textPrimary,
            }}
            aria-label="Notification settings"
            title="Notification settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div
          className="border-2 rounded-creative p-6"
          style={{
            backgroundColor: theme.colors.cardBackground,
            borderColor: theme.colors.borderPrimary,
          }}
        >
          <h2
            className="text-xl font-bold mb-4"
            style={{ color: theme.colors.textPrimary }}
          >
            Notification Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3
                className="font-semibold"
                style={{ color: theme.colors.textPrimary }}
              >
                Notification Types
              </h3>
              {Object.entries(settings).slice(0, 6).map(([key, value]) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => updateSettings(key as keyof NotificationSettings, e.target.checked)}
                    className="rounded"
                    style={{
                      accentColor: theme.colors.buttonPrimary,
                    }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>
            <div className="space-y-4">
              <h3
                className="font-semibold"
                style={{ color: theme.colors.textPrimary }}
              >
                Delivery Methods
              </h3>
              {Object.entries(settings).slice(6).map(([key, value]) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => updateSettings(key as keyof NotificationSettings, e.target.checked)}
                    className="rounded"
                    style={{
                      accentColor: theme.colors.buttonPrimary,
                    }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b-2 pb-4" style={{ borderColor: theme.colors.borderPrimary }}>
        {[
          { key: 'all', label: 'All', count: notifications.length },
          { key: 'unread', label: 'Unread', count: unreadCount },
          { key: 'price', label: 'Price Drops', count: notifications.filter(n => n.type === 'price_drop').length },
          { key: 'restock', label: 'Restocks', count: notifications.filter(n => n.type === 'restock').length },
          { key: 'promo', label: 'Promotions', count: notifications.filter(n => ['flash_sale', 'loyalty'].includes(n.type)).length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${activeTab === tab.key ? 'scale-105' : 'hover:scale-105'
              }`}
            style={{
              backgroundColor: activeTab === tab.key
                ? theme.colors.buttonPrimary
                : theme.colors.backgroundSecondary,
              color: activeTab === tab.key
                ? '#FFFFFF'
                : theme.colors.textPrimary,
              border: `1px solid ${theme.colors.borderPrimary}`,
            }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div
            className="text-center py-12 px-6 rounded-2xl"
            style={{
              backgroundColor: theme.colors.backgroundSecondary,
              border: `2px solid ${theme.colors.borderPrimary}`,
            }}
          >
            <div className="text-6xl mb-4">ðŸ””</div>
            <h3
              className="text-xl font-bold mb-2"
              style={{ color: theme.colors.textPrimary }}
            >
              {activeTab === 'unread' ? 'No unread notifications' : 'No notifications found'}
            </h3>
            <p
              className="text-sm"
              style={{ color: theme.colors.textSecondary }}
            >
              {activeTab === 'unread'
                ? 'You\'re all caught up!'
                : `No ${activeTab} notifications at the moment.`
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`border-2 rounded-creative p-4 transition-all hover:shadow-card ${!notification.read ? 'border-l-4' : ''
                }`}
              style={{
                backgroundColor: theme.colors.cardBackground,
                borderColor: !notification.read
                  ? getPriorityColor(notification.priority)
                  : theme.colors.borderPrimary,
                borderLeftColor: !notification.read
                  ? getPriorityColor(notification.priority)
                  : theme.colors.borderPrimary,
              }}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="text-2xl flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3
                        className="font-bold text-lg"
                        style={{ color: theme.colors.textPrimary }}
                      >
                        {notification.title}
                      </h3>
                      <p
                        className="text-sm mt-1"
                        style={{ color: theme.colors.textSecondary }}
                      >
                        {notification.message}
                      </p>
                    </div>

                    {/* Product Image (if applicable) */}
                    {notification.imageUrl && (
                      <img
                        src={notification.imageUrl}
                        alt={notification.productName}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                  </div>

                  {/* Price Info (for price drops) */}
                  {notification.type === 'price_drop' && notification.oldPrice && notification.newPrice && (
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="text-lg font-bold"
                        style={{ color: theme.colors.stateSuccess }}
                      >
                        {formatPrice(notification.newPrice)}
                      </span>
                      <span
                        className="text-sm line-through"
                        style={{ color: theme.colors.textTertiary }}
                      >
                        {formatPrice(notification.oldPrice)}
                      </span>
                      <span
                        className="px-2 py-1 text-xs font-bold rounded-full"
                        style={{
                          backgroundColor: theme.colors.brandPrimary,
                          color: '#FFFFFF',
                        }}
                      >
                        -{notification.discountPercentage}% OFF
                      </span>
                    </div>
                  )}

                  {/* Action Button */}
                  {notification.actionUrl && notification.actionText && (
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => {
                          markAsRead(notification.id);
                          // In real app, navigate to actionUrl
                          toast.success(`Navigating to ${notification.actionText}`);
                        }}
                        className="px-4 py-2 font-semibold rounded-lg transition-all hover:scale-105"
                        style={{
                          backgroundColor: theme.colors.buttonPrimary,
                          color: '#FFFFFF',
                        }}
                      >
                        {notification.actionText}
                      </button>

                      <div className="flex items-center gap-3">
                        <span
                          className="text-xs"
                          style={{ color: theme.colors.textTertiary }}
                        >
                          {formatTimeAgo(notification.timestamp)}
                        </span>

                        {!notification.read && (
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: getPriorityColor(notification.priority) }}
                          />
                        )}

                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                          aria-label="Delete notification"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div
        className="border-2 rounded-creative p-6"
        style={{
          backgroundColor: theme.colors.cardBackground,
          borderColor: theme.colors.borderPrimary,
        }}
      >
        <h2
          className="text-xl font-bold mb-4"
          style={{ color: theme.colors.textPrimary }}
        >
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            className="p-4 rounded-lg border-2 transition-all hover:scale-105 text-center"
            style={{
              backgroundColor: theme.colors.backgroundSecondary,
              borderColor: theme.colors.borderPrimary,
            }}
          >
            <div className="text-2xl mb-2">ðŸ’°</div>
            <div
              className="font-semibold"
              style={{ color: theme.colors.textPrimary }}
            >
              Price Alerts
            </div>
            <div
              className="text-sm"
              style={{ color: theme.colors.textSecondary }}
            >
              Get notified when prices drop
            </div>
          </button>

          <button
            className="p-4 rounded-lg border-2 transition-all hover:scale-105 text-center"
            style={{
              backgroundColor: theme.colors.backgroundSecondary,
              borderColor: theme.colors.borderPrimary,
            }}
          >
            <div className="text-2xl mb-2">ðŸ“¦</div>
            <div
              className="font-semibold"
              style={{ color: theme.colors.textPrimary }}
            >
              Restock Alerts
            </div>
            <div
              className="text-sm"
              style={{ color: theme.colors.textSecondary }}
            >
              Know when items are back in stock
            </div>
          </button>

          <button
            className="p-4 rounded-lg border-2 transition-all hover:scale-105 text-center"
            style={{
              backgroundColor: theme.colors.backgroundSecondary,
              borderColor: theme.colors.borderPrimary,
            }}
          >
            <div className="text-2xl mb-2">ðŸŽ</div>
            <div
              className="font-semibold"
              style={{ color: theme.colors.textPrimary }}
            >
              Exclusive Deals
            </div>
            <div
              className="text-sm"
              style={{ color: theme.colors.textSecondary }}
            >
              Access member-only offers
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

