// ============================================
// REVIEW ROUTES
// ============================================

import { Router } from 'express';
import * as reviewController from '../controllers/review.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { z } from 'zod';

const router = Router();

const createReviewSchema = z.object({
  product_id: z.string().uuid(),
  rating: z.number().min(1).max(5),
  title: z.string().min(3).max(100),
  comment: z.string().min(10).max(1000),
  images: z.array(z.string().url()).optional(),
});

const updateReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(3).max(100),
  comment: z.string().min(10).max(1000),
});

// Public routes
router.get('/product/:productId', reviewController.getProductReviews);

// Protected routes
router.use(authenticate);
router.post('/', validateBody(createReviewSchema), reviewController.createReview);
router.put('/:reviewId', validateBody(updateReviewSchema), reviewController.updateReview);
router.delete('/:reviewId', reviewController.deleteReview);
router.post('/:reviewId/helpful', reviewController.markHelpful);

export default router;

