// ============================================
// WISHLIST SERVICE
// ============================================

import { query } from '../config/database';
import { AppError } from '../middleware/error.middleware';

// Add to Wishlist
export const addToWishlist = async (userId: string, productId: string): Promise<void> => {
  // Check if product exists
  const productCheck = await query(
    `SELECT id FROM products WHERE id = ?`,
    [productId]
  );

  if (productCheck.rows.length === 0) {
    throw new AppError('Product not found', 404);
  }

  // Check if already in wishlist
  const existing = await query(
    `SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?`,
    [userId, productId]
  );

  if (existing.rows.length > 0) {
    throw new AppError('Product already in wishlist', 400);
  }

  await query(
    `INSERT INTO wishlist (user_id, product_id, created_at)
     VALUES (?, ?, datetime('now'))`,
    [userId, productId]
  );
};

// Remove from Wishlist
export const removeFromWishlist = async (userId: string, productId: string): Promise<void> => {
  const result = await query(
    `DELETE FROM wishlist WHERE user_id = ? AND product_id = ?`,
    [userId, productId]
  );

  if (result.rowCount === 0) {
    throw new AppError('Product not in wishlist', 404);
  }
};

// Remove from Wishlist by Item ID
export const removeFromWishlistById = async (userId: string, wishlistItemId: string): Promise<void> => {
  const result = await query(
    `DELETE FROM wishlist WHERE user_id = ? AND id = ?`,
    [userId, wishlistItemId]
  );

  if (result.rowCount === 0) {
    throw new AppError('Wishlist item not found', 404);
  }
};

// Get User Wishlist
export const getUserWishlist = async (userId: string): Promise<any[]> => {
  const result = await query(
    `SELECT
       w.id,
       w.created_at,
       p.id as product_id,
       p.name,
       p.slug,
       p.description,
       p.price,
       p.sale_price,
       p.images,
       p.stock_quantity,
       p.average_rating,
       p.is_active
     FROM wishlist w
     JOIN products p ON p.id = w.product_id
     WHERE w.user_id = ?
     ORDER BY w.created_at DESC`,
    [userId]
  );

  return result.rows;
};

// Check if in Wishlist
export const isInWishlist = async (userId: string, productId: string): Promise<boolean> => {
  const result = await query(
    `SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?`,
    [userId, productId]
  );

  return result.rows.length > 0;
};

// Get Wishlist Count
export const getWishlistCount = async (userId: string): Promise<number> => {
  const result = await query(
    `SELECT COUNT(*) as count FROM wishlist WHERE user_id = ?`,
    [userId]
  );

  return parseInt(result.rows[0].count);
};

// Clear Wishlist
export const clearWishlist = async (userId: string): Promise<void> => {
  await query(`DELETE FROM wishlist WHERE user_id = ?`, [userId]);
};

export default {
  addToWishlist,
  removeFromWishlist,
  removeFromWishlistById,
  getUserWishlist,
  isInWishlist,
  getWishlistCount,
  clearWishlist,
};
