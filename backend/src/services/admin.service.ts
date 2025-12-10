// ============================================
// ADMIN SERVICE
// ============================================

import { query } from '../config/database';
import { DashboardStats, PaginationParams } from '../types';

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const ordersResult = await query('SELECT COUNT(*), SUM(total) FROM orders WHERE status != \'cancelled\'');
  const customersResult = await query('SELECT COUNT(*) FROM users WHERE role = \'customer\'');
  const productsResult = await query('SELECT COUNT(*) FROM products WHERE is_active = true');
  
  const recentOrders = await query(
    `SELECT o.*, u.name as user_name, u.email as user_email 
     FROM orders o LEFT JOIN users u ON o.user_id = u.id 
     ORDER BY o.created_at DESC LIMIT 10`
  );
  
  const lowStockProducts = await query(
    'SELECT * FROM products WHERE is_active = true AND stock < 10 ORDER BY stock ASC LIMIT 10'
  );
  
  const topProducts = await query(
    'SELECT * FROM products WHERE is_active = true ORDER BY rating DESC, review_count DESC LIMIT 10'
  );

  return {
    totalOrders: parseInt(ordersResult.rows[0].count, 10),
    totalRevenue: parseFloat(ordersResult.rows[0].sum || '0'),
    totalCustomers: parseInt(customersResult.rows[0].count, 10),
    totalProducts: parseInt(productsResult.rows[0].count, 10),
    recentOrders: recentOrders.rows,
    lowStockProducts: lowStockProducts.rows,
    topProducts: topProducts.rows,
  };
};

export const getAllUsers = async (pagination: PaginationParams): Promise<any> => {
  const { page = 1, limit = 20 } = pagination;
  const offset = (page - 1) * limit;

  const countResult = await query('SELECT COUNT(*) FROM users');
  const usersResult = await query(
    'SELECT id, email, name, phone, role, email_verified, is_active, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [limit, offset]
  );

  return {
    data: usersResult.rows,
    pagination: {
      page,
      limit,
      total: parseInt(countResult.rows[0].count, 10),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count, 10) / limit),
    },
  };
};

export const getSalesReport = async (from?: string, to?: string): Promise<any> => {
  let dateCondition = '';
  const params: any[] = [];

  if (from && to) {
    dateCondition = 'WHERE created_at BETWEEN ? AND ?';
    params.push(from, to);
  }

  const salesResult = await query(
    `SELECT 
      DATE(created_at) as date,
      COUNT(*) as order_count,
      SUM(total) as revenue,
      AVG(total) as average_order_value
     FROM orders 
     ${dateCondition}
     GROUP BY DATE(created_at)
     ORDER BY date DESC`,
    params
  );

  return salesResult.rows;
};
