// ============================================
// CART SERVICE
// ============================================

import { query } from '../config/database';
import { CartItem, CartItemWithProduct } from '../types';
import { AppError } from '../middleware/error.middleware';

// Get user's cart with product details
export const getCart = async (userId: string): Promise<CartItemWithProduct[]> => {
  const result = await query<any>(
    `SELECT ci.*, p.name, p.price, p.thumbnail_url, p.stock, p.is_active
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.id
     WHERE ci.user_id = ?
     ORDER BY ci.created_at DESC`,
    [userId]
  );
  return result.rows;
};

// Add item to cart
export const addToCart = async (
  userId: string,
  productId: string,
  quantity: number = 1,
  selectedSize?: string,
  selectedColor?: string,
  variantId?: string
): Promise<CartItem> => {
  // Check if product exists and is active
  const productCheck = await query(
    'SELECT id, price, stock, is_active FROM products WHERE id = ?',
    [productId]
  );

  if (productCheck.rows.length === 0) {
    throw new AppError('Product not found', 404);
  }

  const product = productCheck.rows[0];

  if (!product.is_active) {
    throw new AppError('Product is not available', 400);
  }

  if (product.stock < quantity) {
    throw new AppError('Insufficient stock', 400);
  }

  // Check if item already exists in cart
  const existing = await query(
    `SELECT id, quantity FROM cart_items 
     WHERE user_id = ? AND product_id = ? 
     AND (selected_size = ? OR (selected_size IS NULL AND ? IS NULL))
     AND (selected_color = ? OR (selected_color IS NULL AND ? IS NULL))`,
    [userId, productId, selectedSize, selectedColor]
  );

  if (existing.rows.length > 0) {
    // Update existing item
    const newQuantity = existing.rows[0].quantity + quantity;
    const result = await query<CartItem>(
      `UPDATE cart_items SET quantity = ?, updated_at = datetime('now') WHERE id = ? RETURNING *`,
      [newQuantity, existing.rows[0].id]
    );
    return result.rows[0];
  }

  // Add new item
  const result = await query<CartItem>(
    `INSERT INTO cart_items (user_id, product_id, variant_id, quantity, selected_size, selected_color, price_at_add, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
     RETURNING *`,
    [userId, productId, variantId, quantity, selectedSize, selectedColor, product.price]
  );

  return result.rows[0];
};

// Update cart item quantity
export const updateCartItem = async (
  userId: string,
  itemId: string,
  quantity: number
): Promise<CartItem> => {
  if (quantity < 1) {
    throw new AppError('Quantity must be at least 1', 400);
  }

  // Check if item belongs to user
  const check = await query(
    'SELECT product_id FROM cart_items WHERE id = ? AND user_id = ?',
    [itemId, userId]
  );

  if (check.rows.length === 0) {
    throw new AppError('Cart item not found', 404);
  }

  // Check stock
  const productCheck = await query(
    'SELECT stock FROM products WHERE id = ?',
    [check.rows[0].product_id]
  );

  if (productCheck.rows[0].stock < quantity) {
    throw new AppError('Insufficient stock', 400);
  }

  const result = await query<CartItem>(
    `UPDATE cart_items SET quantity = ?, updated_at = datetime('now') WHERE id = ? RETURNING *`,
    [quantity, itemId]
  );

  return result.rows[0];
};

// Remove cart item
export const removeCartItem = async (userId: string, itemId: string): Promise<void> => {
  const result = await query(
    'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
    [itemId, userId]
  );

  if ((result.rowCount || 0) === 0) {
    throw new AppError('Cart item not found', 404);
  }
};

// Clear cart
export const clearCart = async (userId: string): Promise<void> => {
  await query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
};
