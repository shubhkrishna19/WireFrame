import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ShoppingBag } from 'lucide-react';

interface Notification {
  id: string;
  type: 'purchase' | 'viewing';
  message: string;
  timestamp: Date;
}

const mockNotifications = [
  { type: 'purchase', name: 'Sarah', product: 'Classic T-Shirt', time: '2 minutes ago' },
  { type: 'purchase', name: 'Michael', product: 'Premium Jeans', time: '5 minutes ago' },
  { type: 'purchase', name: 'Emily', product: 'Summer Dress', time: '8 minutes ago' },
  { type: 'purchase', name: 'James', product: 'Leather Jacket', time: '12 minutes ago' },
  { type: 'purchase', name: 'Lisa', product: 'Casual Sneakers', time: '15 minutes ago' },
];

export default function SocialProofNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentViewers, setCurrentViewers] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Simulate real-time viewer count
    const viewerInterval = setInterval(() => {
      setCurrentViewers(Math.floor(Math.random() * 30) + 10); // 10-40 viewers
    }, 5000);

    // Show purchase notifications randomly
    const notificationInterval = setInterval(() => {
      const randomNotif = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];

      const newNotification: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'purchase',
        message: `${randomNotif.name} just purchased ${randomNotif.product}`,
        timestamp: new Date(),
      };

      setNotifications(prev => [newNotification, ...prev.slice(0, 2)]);
      setVisible(true);

      // Hide after 5 seconds
      setTimeout(() => {
        setVisible(false);
      }, 5000);
    }, 15000); // Every 15 seconds

    return () => {
      clearInterval(viewerInterval);
      clearInterval(notificationInterval);
    };
  }, []);

  return (
    <>
      {/* Viewer Count Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-24 left-4 z-40 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
      >
        <Eye className="w-4 h-4 animate-pulse" />
        <span className="text-sm font-semibold">{currentViewers} people viewing</span>
      </motion.div>

      {/* Purchase Notifications */}
      <AnimatePresence>
        {visible && notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed bottom-4 left-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 max-w-sm"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {notifications[0].message}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Just now
                </p>
              </div>
              <button
                onClick={() => setVisible(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
