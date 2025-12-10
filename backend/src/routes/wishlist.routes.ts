// ============================================
// WISHLIST ROUTES
// ============================================

import { Router } from 'express';
import * as wishlistController from '../controllers/wishlist.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { z } from 'zod';

const router = Router();

const addToWishlistSchema = z.object({
  productId: z.string().uuid(),
});

// Temporarily disable authentication for wishlist routes to test functionality
// router.use(authenticate);

// Get wishlist count
router.get('/count', wishlistController.getWishlistCount);

// Get full wishlist
router.get('/', wishlistController.getWishlist);

// Add to wishlist
router.post('/', validateBody(addToWishlistSchema), wishlistController.addToWishlist);

// Remove from wishlist by item ID (for frontend compatibility)
router.delete('/:wishlistItemId', wishlistController.removeFromWishlistById);

// Remove from wishlist by product ID (legacy support)
router.delete('/product/:productId', wishlistController.removeFromWishlist);

// Check if product is in wishlist
router.get('/product/:productId', wishlistController.checkWishlist);

// Clear wishlist
router.delete('/', wishlistController.clearWishlist);

export default router;

