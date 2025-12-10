// ============================================
// PRODUCT REVIEW SERVICE
// ============================================

import { query } from '../config/database';
import { AppError } from '../middleware/error.middleware';
import { logger } from '../config/logger';

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string;
  comment: string;
  is_verified_purchase: boolean;
  helpful_count: number;
  images?: string[];
  created_at: Date;
}

// Create Review
export const createReview = async (
  userId: string,
  productId: string,
  rating: number,
  title: string,
  comment: string,
  images?: string[]
): Promise<Review> => {
  // Check if user purchased this product
  const purchaseCheck = await query(
    `SELECT COUNT(*) as count FROM order_items oi
     JOIN orders o ON o.id = oi.order_id
     WHERE o.user_id = ? AND oi.product_id = ? AND o.status = 'delivered'`,
    [userId, productId]
  );

  const isVerifiedPurchase = parseInt(purchaseCheck.rows[0].count) > 0;

  // Check if user already reviewed
  const existingReview = await query(
    `SELECT id FROM reviews WHERE user_id = ? AND product_id = ?`,
    [userId, productId]
  );

  if (existingReview.rows.length > 0) {
    throw new AppError('You have already reviewed this product', 400);
  }

  const result = await query(
    `INSERT INTO reviews (product_id, user_id, rating, title, comment, is_verified_purchase, images, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
     RETURNING *`,
    [productId, userId, rating, title, comment, isVerifiedPurchase, JSON.stringify(images || [])]
  );

  // Update product average rating
  await updateProductRating(productId);

  logger.info(`Review created for product ${productId} by user ${userId}`);
  return result.rows[0];
};

// Get Product Reviews
export const getProductReviews = async (
  productId: string,
  page: number = 1,
  limit: number = 10,
  sort: string = 'recent'
): Promise<{ reviews: any[]; total: number; averageRating: number; ratingDistribution: any }> => {
  const offset = (page - 1) * limit;

  let orderBy = 'r.created_at DESC';
  if (sort === 'helpful') orderBy = 'r.helpful_count DESC, r.created_at DESC';
  if (sort === 'rating_high') orderBy = 'r.rating DESC, r.created_at DESC';
  if (sort === 'rating_low') orderBy = 'r.rating ASC, r.created_at DESC';

  const result = await query(
    `SELECT r.*, u.name as user_name, u.avatar_url
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     WHERE r.product_id = ?
     ORDER BY ${orderBy}
     LIMIT ? OFFSET ?`,
    [productId, limit, offset]
  );

  const countResult = await query(
    `SELECT COUNT(*) as total FROM reviews WHERE product_id = ?`,
    [productId]
  );

  // Get rating stats
  const statsResult = await query(
    `SELECT 
       AVG(rating)::numeric(3,2) as avg_rating,
       COUNT(*) FILTER (WHERE rating = 5) as five_star,
       COUNT(*) FILTER (WHERE rating = 4) as four_star,
       COUNT(*) FILTER (WHERE rating = 3) as three_star,
       COUNT(*) FILTER (WHERE rating = 2) as two_star,
       COUNT(*) FILTER (WHERE rating = 1) as one_star
     FROM reviews WHERE product_id = ?`,
    [productId]
  );

  const stats = statsResult.rows[0];

  return {
    reviews: result.rows,
    total: parseInt(countResult.rows[0].total),
    averageRating: parseFloat(stats.avg_rating) || 0,
    ratingDistribution: {
      5: parseInt(stats.five_star),
      4: parseInt(stats.four_star),
      3: parseInt(stats.three_star),
      2: parseInt(stats.two_star),
      1: parseInt(stats.one_star),
    },
  };
};

// Update Review
export const updateReview = async (
  reviewId: string,
  userId: string,
  rating: number,
  title: string,
  comment: string
): Promise<Review> => {
  const result = await query(
    `UPDATE reviews 
     SET rating = ?, title = ?, comment = ?, updated_at = datetime('now')
     WHERE id = ? AND user_id = ?
     RETURNING *`,
    [rating, title, comment, reviewId, userId]
  );

  if (result.rows.length === 0) {
    throw new AppError('Review not found or unauthorized', 404);
  }

  // Update product rating
  await updateProductRating(result.rows[0].product_id);

  return result.rows[0];
};

// Delete Review
export const deleteReview = async (reviewId: string, userId: string): Promise<void> => {
  const result = await query(
    `DELETE FROM reviews WHERE id = ? AND user_id = ? RETURNING product_id`,
    [reviewId, userId]
  );

  if (result.rows.length === 0) {
    throw new AppError('Review not found or unauthorized', 404);
  }

  // Update product rating
  await updateProductRating(result.rows[0].product_id);
};

// Mark Review as Helpful
export const markReviewHelpful = async (reviewId: string, userId: string): Promise<void> => {
  // Check if already marked
  const existing = await query(
    `SELECT id FROM review_helpful WHERE review_id = ? AND user_id = ?`,
    [reviewId, userId]
  );

  if (existing.rows.length > 0) {
    throw new AppError('You have already marked this review as helpful', 400);
  }

  await query(
    `INSERT INTO review_helpful (review_id, user_id) VALUES (?, ?)`,
    [reviewId, userId]
  );

  await query(
    `UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = ?`,
    [reviewId]
  );
};

// Update Product Average Rating
const updateProductRating = async (productId: string): Promise<void> => {
  await query(
    `UPDATE products p
     SET average_rating = (
       SELECT AVG(rating)::numeric(3,2)
       FROM reviews
       WHERE product_id = p.id
     ),
     review_count = (
       SELECT COUNT(*)
       FROM reviews
       WHERE product_id = p.id
     )
     WHERE p.id = ?`,
    [productId]
  );
};

export default {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  markReviewHelpful,
};
