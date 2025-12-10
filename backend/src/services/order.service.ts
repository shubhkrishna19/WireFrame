// ============================================
// ORDER SERVICE
// ============================================

import { query, transaction } from '../config/database';
import { Order, OrderWithItems, OrderStatus, CreateOrderInput, OrderFilters, PaginationParams } from '../types';
import { AppError } from '../middleware/error.middleware';

// Generate order number
const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${timestamp}-${random}`;
};

// Create order
export const createOrder = async (userId: string, orderData: CreateOrderInput): Promise<OrderWithItems> => {
  return transaction(async (client) => {
    const { items, shipping_address, billing_address, payment_method, coupon_code } = orderData;

    // Calculate totals
    let subtotal = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const productResult = await client.query(
        'SELECT id, name, price, thumbnail_url, stock FROM products WHERE id = ? AND is_active = true',
        [item.product_id]
      );

      if (productResult.rows.length === 0) {
        throw new AppError(`Product ${item.product_id} not found`, 404);
      }

      const product = productResult.rows[0];

      if (product.stock < item.quantity) {
        throw new AppError(`Insufficient stock for ${product.name}`, 400);
      }

      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        product_image: product.thumbnail_url,
        quantity: item.quantity,
        unit_price: product.price,
        subtotal: itemSubtotal,
        selected_size: item.selected_size,
        selected_color: item.selected_color,
        variant_id: item.variant_id,
      });
    }

    // Calculate shipping
    const shipping = subtotal >= 1500 ? 0 : 100;
    const tax = 0; // Implement tax calculation if needed
    const discount = 0; // Implement coupon logic if needed
    const total = subtotal + shipping + tax - discount;

    // Create order
    const orderNumber = generateOrderNumber();
    const orderResult = await client.query<Order>(
      `INSERT INTO orders (
        order_number, user_id, status, payment_status, payment_method,
        subtotal, shipping, tax, discount, total, currency,
        shipping_address, billing_address, created_at, updated_at
      ) VALUES (?, ?, 'pending', 'pending', ?, ?, ?, ?, ?, ?, 'INR', ?, ?, datetime('now'), datetime('now'))
      RETURNING *`,
      [
        orderNumber, userId, payment_method,
        subtotal, shipping, tax, discount, total,
        JSON.stringify(shipping_address),
        billing_address ? JSON.stringify(billing_address) : null
      ]
    );

    const order = orderResult.rows[0];

    // Create order items
    for (const item of orderItems) {
      await client.query(
        `INSERT INTO order_items (
          order_id, product_id, variant_id, product_name, product_image,
          quantity, unit_price, subtotal, selected_size, selected_color, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
        [
          order.id, item.product_id, item.variant_id, item.product_name, item.product_image,
          item.quantity, item.unit_price, item.subtotal, item.selected_size, item.selected_color
        ]
      );

      // Update product stock
      await client.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Clear user's cart
    await client.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);

    return { ...order, items: orderItems };
  });
};

// Get user orders
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const result = await query<Order>(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
};

// Get order by ID
export const getOrderById = async (orderId: string, userId: string): Promise<OrderWithItems | null> => {
  const orderResult = await query<Order>(
    'SELECT * FROM orders WHERE id = ? AND user_id = ?',
    [orderId, userId]
  );

  if (orderResult.rows.length === 0) return null;

  const order = orderResult.rows[0];

  const itemsResult = await query(
    'SELECT * FROM order_items WHERE order_id = ?',
    [orderId]
  );

  return { ...order, items: itemsResult.rows };
};

// Cancel order
export const cancelOrder = async (orderId: string, userId: string): Promise<Order> => {
  const result = await query<Order>(
    `UPDATE orders SET status = 'cancelled', updated_at = datetime('now') 
     WHERE id = ? AND user_id = ? AND status IN ('pending', 'confirmed')
     RETURNING *`,
    [orderId, userId]
  );

  if (result.rows.length === 0) {
    throw new AppError('Order cannot be cancelled', 400);
  }

  return result.rows[0];
};

// Get all orders (admin)
export const getAllOrders = async (filters: OrderFilters, pagination: PaginationParams): Promise<any> => {
  const { page = 1, limit = 20 } = pagination;
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  if (filters.status) {
    params.push(filters.status);
    conditions.push(`status = $${paramIndex++}`);
  }

  if (filters.payment_status) {
    params.push(filters.payment_status);
    conditions.push(`payment_status = $${paramIndex++}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await query(
    `SELECT COUNT(*) FROM orders ${whereClause}`,
    params
  );
  const total = parseInt(countResult.rows[0].count, 10);

  params.push(limit, offset);
  const ordersResult = await query<Order>(
    `SELECT * FROM orders ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
    params
  );

  return {
    data: ordersResult.rows,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  };
};

// Update order status
export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<Order> => {
  const result = await query<Order>(
    `UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ? RETURNING *`,
    [status, orderId]
  );

  if (result.rows.length === 0) {
    throw new AppError('Order not found', 404);
  }

  return result.rows[0];
};

// Create guest order (no user authentication required)
export const createGuestOrder = async (
  guestEmail: string,
  guestSessionId: string,
  orderData: CreateOrderInput
): Promise<OrderWithItems> => {
  return transaction(async (client) => {
    const { items, shipping_address, billing_address, payment_method } = orderData;

    // Calculate totals
    let subtotal = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const productResult = await client.query(
        'SELECT id, name, price, thumbnail_url, stock FROM products WHERE id = ? AND is_active = true',
        [item.product_id]
      );

      if (productResult.rows.length === 0) {
        throw new AppError(`Product ${item.product_id} not found`, 404);
      }

      const product = productResult.rows[0];

      if (product.stock < item.quantity) {
        throw new AppError(`Insufficient stock for ${product.name}`, 400);
      }

      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        product_image: product.thumbnail_url,
        quantity: item.quantity,
        unit_price: product.price,
        subtotal: itemSubtotal,
        selected_size: item.selected_size,
        selected_color: item.selected_color,
        variant_id: item.variant_id,
      });
    }

    // Calculate shipping
    const shipping = subtotal >= 1500 ? 0 : 100;
    const tax = 0;
    const discount = 0;
    const total = subtotal + shipping + tax - discount;

    // Create order with guest fields
    const orderNumber = generateOrderNumber();
    const orderResult = await client.query<Order>(
      `INSERT INTO orders (
        order_number, user_id, guest_email, guest_session_id, status, payment_status, payment_method,
        subtotal, shipping, tax, discount, total, currency,
        shipping_address, billing_address, created_at, updated_at
      ) VALUES (?, NULL, ?, ?, 'pending', 'pending', ?, ?, ?, ?, ?, ?, 'INR', ?, ?, datetime('now'), datetime('now'))
      RETURNING *`,
      [
        orderNumber, guestEmail, guestSessionId, payment_method,
        subtotal, shipping, tax, discount, total,
        JSON.stringify(shipping_address),
        billing_address ? JSON.stringify(billing_address) : null
      ]
    );

    const order = orderResult.rows[0];

    // Create order items
    for (const item of orderItems) {
      await client.query(
        `INSERT INTO order_items (
          order_id, product_id, variant_id, product_name, product_image,
          quantity, unit_price, subtotal, selected_size, selected_color, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
        [
          order.id, item.product_id, item.variant_id, item.product_name, item.product_image,
          item.quantity, item.unit_price, item.subtotal, item.selected_size, item.selected_color
        ]
      );

      // Update product stock
      await client.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    return { ...order, items: orderItems };
  });
};

// Link guest orders to user account (called after registration/login)
export const linkGuestOrdersToUser = async (
  guestEmail: string,
  userId: string
): Promise<number> => {
  const result = await query(
    `UPDATE orders 
     SET user_id = ?, guest_email = NULL, guest_session_id = NULL, updated_at = datetime('now')
     WHERE guest_email = ? AND user_id IS NULL`,
    [userId, guestEmail]
  );

  return result.rowCount || 0;
};

// Get orders by guest session
export const getGuestOrders = async (guestSessionId: string): Promise<Order[]> => {
  const result = await query<Order>(
    `SELECT * FROM orders 
     WHERE guest_session_id = ? 
     ORDER BY created_at DESC`,
    [guestSessionId]
  );

  return result.rows;
};

