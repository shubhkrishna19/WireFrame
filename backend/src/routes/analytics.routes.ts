import { Router, Response } from 'express';
import { AuthRequest } from '../types';
import { query } from '../config/database';
import { logger } from '../config/logger';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Get dashboard overview
router.get('/dashboard', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const isAdmin = req.user?.role === 'admin';
    const userId = req.user?.id;

    // Base query - only show all data for admins, limit for regular users
    const baseQuery = isAdmin
      ? '' // Admins see all data
      : 'WHERE o.user_id = $1'; // Regular users see only their data

    const [revenue, orders, users, products] = await Promise.all([
      // Revenue data
      query(`
        SELECT 
          SUM(total) as total_revenue,
          SUM(CASE WHEN DATE(created_at) = CURRENT_DATE THEN total ELSE 0 END) as today_revenue,
          SUM(CASE WHEN DATE(created_at) >= CURRENT_DATE - INTERVAL '7 days' THEN total ELSE 0 END) as week_revenue,
          SUM(CASE WHEN DATE(created_at) >= CURRENT_DATE - INTERVAL '30 days' THEN total ELSE 0 END) as month_revenue
        FROM orders
        ${isAdmin ? '' : 'WHERE user_id = $1'}
      `, isAdmin ? [] : [userId]),

      // Order data
      query(`
        SELECT 
          COUNT(*) as total_orders,
          COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
          COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders
        FROM orders
        ${isAdmin ? '' : 'WHERE user_id = $1'}
      `, isAdmin ? [] : [userId]),

      // User data (for admins only)
      isAdmin
        ? query(`
          SELECT 
            COUNT(*) as total_users,
            COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as new_users,
            COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_users
          FROM users
        `)
        : Promise.resolve({ rows: [{ total_users: 0, new_users: 0, admin_users: 0 }] }),

      // Product data (for admins only)
      isAdmin
        ? query(`
          SELECT 
            COUNT(*) as total_products,
            COUNT(CASE WHEN is_active = true THEN 1 END) as active_products,
            COUNT(CASE WHEN stock < 10 THEN 1 END) as low_stock_products
          FROM products
        `)
        : Promise.resolve({ rows: [{ total_products: 0, active_products: 0, low_stock_products: 0 }] })
    ]);

    res.json({
      revenue: revenue.rows[0],
      orders: orders.rows[0],
      users: users.rows[0],
      products: products.rows[0],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get revenue analytics
router.get('/revenue/:period', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { period } = req.params;
    const isAdmin = req.user?.role === 'admin';
    const userId = req.user?.id;

    let dateFilter = '';
    let params: any[] = [];

    switch (period.toLowerCase()) {
      case 'today':
        dateFilter = "WHERE DATE(created_at) = CURRENT_DATE";
        break;
      case 'week':
        dateFilter = "WHERE DATE(created_at) >= CURRENT_DATE - INTERVAL '7 days'";
        break;
      case 'month':
        dateFilter = "WHERE DATE(created_at) >= CURRENT_DATE - INTERVAL '30 days'";
        break;
      case 'year':
        dateFilter = "WHERE DATE(created_at) >= CURRENT_DATE - INTERVAL '365 days'";
        break;
      default:
        res.status(400).json({ error: 'Invalid period. Use: today, week, month, year' });
        return;
    }

    if (!isAdmin) {
      dateFilter += ' AND user_id = $1';
      params = [userId];
    }

    const result = await query(`
      SELECT 
        DATE(created_at) as date,
        SUM(total) as daily_revenue,
        COUNT(*) as daily_orders,
        AVG(total) as average_order_value
      FROM orders
      ${dateFilter}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `, params);

    res.json({
      period,
      data: result.rows,
      total: result.rows.reduce((sum, row) => sum + parseFloat(row.daily_revenue || 0), 0)
    });
  } catch (error) {
    logger.error('Error fetching revenue data:', error);
    res.status(500).json({ error: 'Failed to fetch revenue data' });
  }
});

// Get top products
router.get('/products/top', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const isAdmin = req.user?.role === 'admin';
    const userId = req.user?.id;

    const dateRange = req.query.days ? `DATE(created_at) >= CURRENT_DATE - INTERVAL '${req.query.days} days'` : 'true';

    const whereClause = isAdmin
      ? `WHERE ${dateRange}`
      : `WHERE ${dateRange} AND o.user_id = $1`;

    const params = isAdmin ? [] : [userId];

    const result = await query(`
      SELECT 
        p.name,
        p.sku,
        SUM(oi.quantity) as total_sold,
        SUM(oi.subtotal) as total_revenue,
        AVG(p.rating) as avg_rating,
        p.thumbnail_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      ${whereClause}
      GROUP BY p.id, p.name, p.sku, p.thumbnail_url
      ORDER BY total_sold DESC
      LIMIT 10
    `, params);

    res.json({
      products: result.rows,
      topSelling: result.rows[0] || null
    });
  } catch (error) {
    logger.error('Error fetching top products:', error);
    res.status(500).json({ error: 'Failed to fetch top products' });
  }
});

// Get user analytics
router.get('/users/stats', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const isAdmin = req.user?.role === 'admin';

    if (!isAdmin) {
      res.status(403).json({ error: 'Admin access required for user analytics' });
      return;
    }

    const result = await query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as new_users_30_days,
        COUNT(CASE WHEN last_login >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as active_users_30_days,
        COUNT(CASE WHEN last_login >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as active_users_7_days
      FROM users
    `);

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
});

// Get conversion funnel
router.get('/conversion-funnel', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const isAdmin = req.user?.role === 'admin';
    const userId = req.user?.id;

    // This is a simplified conversion funnel
    // In a real app, you'd track more detailed user journey data
    const baseCondition = isAdmin ? '' : 'WHERE user_id = $1';
    const params = isAdmin ? [] : [userId];

    const [cartViews, checkouts, orders] = await Promise.all([
      query(`
        SELECT COUNT(DISTINCT user_id) as count
        FROM analytics_events 
        WHERE event_type = 'view_cart'
        ${isAdmin ? "AND DATE(created_at) >= CURRENT_DATE - INTERVAL '30 days'" : "AND user_id = $1 AND DATE(created_at) >= CURRENT_DATE - INTERVAL '30 days'"}
      `, params),
      query(`
        SELECT COUNT(DISTINCT user_id) as count
        FROM analytics_events 
        WHERE event_type = 'checkout_start'
        ${isAdmin ? "AND DATE(created_at) >= CURRENT_DATE - INTERVAL '30 days'" : "AND user_id = $1 AND DATE(created_at) >= CURRENT_DATE - INTERVAL '30 days'"}
      `, params),
      query(`
        SELECT COUNT(*) as count
        FROM orders
        WHERE status IN ('confirmed', 'processing', 'shipped', 'delivered')
        ${isAdmin ? "AND DATE(created_at) >= CURRENT_DATE - INTERVAL '30 days'" : "AND user_id = $1 AND DATE(created_at) >= CURRENT_DATE - INTERVAL '30 days'"}
      `, params)
    ]);

    const cartCount = parseInt(cartViews.rows[0]?.count || '0');
    const checkoutCount = parseInt(checkouts.rows[0]?.count || '0');
    const orderCount = parseInt(orders.rows[0]?.count || '0');

    res.json({
      steps: [
        { step: 'View Cart', count: cartCount, percentage: 100 },
        { step: 'Start Checkout', count: checkoutCount, percentage: cartCount > 0 ? Math.round((checkoutCount / cartCount) * 100) : 0 },
        { step: 'Complete Order', count: orderCount, percentage: checkoutCount > 0 ? Math.round((orderCount / checkoutCount) * 100) : 0 }
      ],
      totalUsers: cartCount,
      conversionRate: cartCount > 0 ? Math.round((orderCount / cartCount) * 100) : 0
    });
  } catch (error) {
    logger.error('Error fetching conversion funnel:', error);
    res.status(500).json({ error: 'Failed to fetch conversion funnel' });
  }
});

// Get real-time metrics
router.get('/real-time', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const isAdmin = req.user?.role === 'admin';

    if (!isAdmin) {
      res.status(403).json({ error: 'Admin access required for real-time metrics' });
      return;
    }

    const [activeUsers, newOrders, recentEvents] = await Promise.all([
      // Active users in last 5 minutes
      query(`
        SELECT COUNT(DISTINCT user_id) as count
        FROM analytics_events
        WHERE created_at >= NOW() - INTERVAL '5 minutes'
      `),
      // New orders in last 1 hour
      query(`
        SELECT COUNT(*) as count, SUM(total) as total_value
        FROM orders
        WHERE created_at >= NOW() - INTERVAL '1 hour'
      `),
      // Recent user activities
      query(`
        SELECT 
          ae.event_type,
          ae.event_data,
          ae.user_id,
          u.name,
          ae.created_at
        FROM analytics_events ae
        LEFT JOIN users u ON ae.user_id = u.id
        ORDER BY ae.created_at DESC
        LIMIT 10
      `)
    ]);

    res.json({
      activeUsers: parseInt(activeUsers.rows[0]?.count || '0'),
      newOrders: {
        count: parseInt(newOrders.rows[0]?.count || '0'),
        totalValue: parseFloat(newOrders.rows[0]?.total_value || '0')
      },
      recentEvents: recentEvents.rows,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error fetching real-time metrics:', error);
    res.status(500).json({ error: 'Failed to fetch real-time metrics' });
  }
});

// Get sales by category
router.get('/sales-by-category', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const isAdmin = req.user?.role === 'admin';
    const userId = req.user?.id;

    const dateRange = req.query.days ? `DATE(o.created_at) >= CURRENT_DATE - INTERVAL '${req.query.days} days'` : 'true';

    const whereClause = isAdmin
      ? `WHERE ${dateRange}`
      : `WHERE ${dateRange} AND o.user_id = $1`;

    const params = isAdmin ? [] : [userId];

    const result = await query(`
      SELECT 
        c.name as category_name,
        SUM(oi.quantity) as total_sold,
        SUM(oi.subtotal) as total_revenue,
        COUNT(DISTINCT o.id) as orders_count
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      JOIN orders o ON oi.order_id = o.id
      ${whereClause}
      GROUP BY c.id, c.name
      ORDER BY total_revenue DESC
    `, params);

    res.json({
      categories: result.rows
    });
  } catch (error) {
    logger.error('Error fetching sales by category:', error);
    res.status(500).json({ error: 'Failed to fetch sales by category' });
  }
});

export default router;
