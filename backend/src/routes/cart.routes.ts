// ============================================
// CART ROUTES
// ============================================

import { Router } from 'express';
import * as cartController from '../controllers/cart.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateParams, commonSchemas } from '../middleware/validation.middleware';
import { z } from 'zod';

const router = Router();

// Validation schemas
const addToCartSchema = z.object({
  product_id: z.string().uuid('Invalid product ID'),
  variant_id: z.string().uuid().optional(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  selected_size: z.string().optional(),
  selected_color: z.string().optional(),
});

const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

// All cart routes require authentication
router.use(authenticate);

router.get('/', cartController.getCart);
router.post('/items', validateBody(addToCartSchema), cartController.addToCart);
router.put('/items/:id', validateParams(commonSchemas.uuid), validateBody(updateCartItemSchema), cartController.updateCartItem);
router.delete('/items/:id', validateParams(commonSchemas.uuid), cartController.removeCartItem);
router.delete('/', cartController.clearCart);

export default router;

