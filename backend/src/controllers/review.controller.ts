// ============================================
// REVIEW CONTROLLER
// ============================================

import { Response } from 'express';
import { AuthRequest } from '../types';
import * as reviewService from '../services/review.service';
import { sendSuccess, sendError } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';

// Create Review
export const createReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'Not authenticated', 401);
    return;
  }

  const { product_id, rating, title, comment, images } = req.body;

  const review = await reviewService.createReview(
    req.user.id,
    product_id,
    rating,
    title,
    comment,
    images
  );

  sendSuccess(res, review, 'Review created successfully', 201);
});

// Get Product Reviews
export const getProductReviews = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const sort = (req.query.sort as string) || 'recent';

  const result = await reviewService.getProductReviews(productId, page, limit, sort);

  sendSuccess(res, result, 'Reviews fetched successfully');
});

// Update Review
export const updateReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'Not authenticated', 401);
    return;
  }

  const { reviewId } = req.params;
  const { rating, title, comment } = req.body;

  const review = await reviewService.updateReview(reviewId, req.user.id, rating, title, comment);

  sendSuccess(res, review, 'Review updated successfully');
});

// Delete Review
export const deleteReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'Not authenticated', 401);
    return;
  }

  const { reviewId } = req.params;
  await reviewService.deleteReview(reviewId, req.user.id);

  sendSuccess(res, null, 'Review deleted successfully');
});

// Mark Review as Helpful
export const markHelpful = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'Not authenticated', 401);
    return;
  }

  const { reviewId } = req.params;
  await reviewService.markReviewHelpful(reviewId, req.user.id);

  sendSuccess(res, null, 'Review marked as helpful');
});

export default {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  markHelpful,
};
