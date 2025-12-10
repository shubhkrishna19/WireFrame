import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  BarChart3,
} from 'lucide-react';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  activeUsers: number;
  conversionRate: number;
  averageOrderValue: number;
  cartAbandonmentRate: number;
  topProducts: { name: string; sales: number; revenue: number }[];
  revenueByDay: { day: string; revenue: number }[];
}

export default function AdvancedAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockData: AnalyticsData = {
        totalRevenue: 45678.9,
        totalOrders: 234,
        activeUsers: 1543,
        conversionRate: 3.4,
        averageOrderValue: 195.2,
        cartAbandonmentRate: 68.5,
        topProducts: [
          { name: 'Premium Leather Jacket', sales: 45, revenue: 8991 },
          { name: 'Designer Jeans', sales: 67, revenue: 5360 },
          { name: 'Classic T-Shirt', sales: 123, revenue: 3690 },
          { name: 'Summer Dress', sales: 56, revenue: 4480 },
          { name: 'Sport Sneakers', sales: 89, revenue: 8010 },
        ],
        revenueByDay: [
          { day: 'Mon', revenue: 5234 },
          { day: 'Tue', revenue: 6123 },
          { day: 'Wed', revenue: 7456 },
          { day: 'Thu', revenue: 5890 },
          { day: 'Fri', revenue: 8234 },
          { day: 'Sat', revenue: 9876 },
          { day: 'Sun', revenue: 7234 },
        ],
      };

      setAnalytics(mockData);
      setLoading(false);
    };
    fetchAnalytics();
  }, [timeRange]);

  if (loading || !analytics) {
    return (
      <div className="py-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      icon: DollarSign,
      label: 'Total Revenue',
      value: `$${analytics.totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      positive: true,
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: ShoppingCart,
      label: 'Total Orders',
      value: analytics.totalOrders.toString(),
      change: '+8.3%',
      positive: true,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      icon: Users,
      label: 'Active Users',
      value: analytics.activeUsers.toLocaleString(),
      change: '+23.1%',
      positive: true,
      color: 'from-purple-500 to-pink-600',
    },
    {
      icon: TrendingUp,
      label: 'Conversion Rate',
      value: `${analytics.conversionRate}%`,
      change: '+1.2%',
      positive: true,
      color: 'from-orange-500 to-red-600',
    },
  ];

  const maxRevenue = Math.max(...analytics.revenueByDay.map((d) => d.revenue));

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Analytics Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Business intelligence and insights
            </p>
          </div>
          {/* Time Range Selector */}
          <div className="flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-md">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-md font-medium transition-all ${timeRange === range
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-sm font-semibold ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </motion.div>
            );
          })}
        </div>
        {/* Revenue Chart */}
        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Overview</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Daily revenue for the week</p>
              </div>
            </div>
            <div className="space-y-3">
              {analytics.revenueByDay.map((day, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="w-12 text-sm font-medium text-gray-600 dark:text-gray-400">{day.day}</span>
                  <div className="flex-1 relative h-10 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(day.revenue / maxRevenue) * 100}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-end pr-3"
                    >
                      <span className="text-white text-sm font-semibold">${day.revenue.toLocaleString()}</span>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Products</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Best sellers this period</p>
              </div>
            </div>
            <div className="space-y-4">
              {analytics.topProducts.map((product, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{product.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{product.sales} sold</p>
                    </div>
                  </div>
                  <span className="font-bold text-green-600 dark:text-green-400">${product.revenue.toLocaleString()}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        {/* Additional Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid md:grid-cols-3 gap-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <DollarSign className="w-8 h-8 text-blue-500" />
              <h4 className="font-semibold text-gray-900 dark:text-white">Avg Order Value</h4>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">${analytics.averageOrderValue.toFixed(2)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Per transaction</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <ShoppingCart className="w-8 h-8 text-orange-500" />
              <h4 className="font-semibold text-gray-900 dark:text-white">Cart Abandonment</h4>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.cartAbandonmentRate}%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Of all carts</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <h4 className="font-semibold text-gray-900 dark:text-white">Growth Rate</h4>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">+12.5%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Month over month</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
