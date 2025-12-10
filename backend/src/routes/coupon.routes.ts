// ============================================
// COUPON ROUTES
// ============================================

import { Router } from 'express';
import * as couponController from '../controllers/coupon.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { z } from 'zod';

const router = Router();

const validateCouponSchema = z.object({
  code: z.string().min(3).max(20),
  cart_total: z.number().positive(),
});

const createCouponSchema = z.object({
  code: z.string().min(3).max(20),
  type: z.enum(['percentage', 'fixed']),
  value: z.number().positive(),
  min_order_value: z.number().positive().optional(),
  max_discount: z.number().positive().optional(),
  usage_limit: z.number().int().positive().optional(),
  valid_from: z.string().datetime().optional(),
  valid_until: z.string().datetime().optional(),
});

// Public routes
router.get('/active', couponController.getActiveCoupons);

// Customer routes
router.post('/validate', authenticate, validateBody(validateCouponSchema), couponController.validateCoupon);

// Admin routes
router.get('/all', authenticate, requireAdmin, couponController.getAllCoupons);
router.post('/', authenticate, requireAdmin, validateBody(createCouponSchema), couponController.createCoupon);
router.put('/:id', authenticate, requireAdmin, couponController.updateCoupon);
router.delete('/:id', authenticate, requireAdmin, couponController.deleteCoupon);

export default router;

