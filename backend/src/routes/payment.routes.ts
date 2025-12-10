// ============================================
// PAYMENT ROUTES
// ============================================

import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { paymentLimiter } from '../middleware/rateLimit.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { z } from 'zod';
import express from 'express';

const router = Router();

// Validation schemas
const createPaymentSchema = z.object({
  orderId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().default('INR'),
});

const verifyRazorpaySchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  orderId: z.string().uuid(),
});

const refundSchema = z.object({
  transactionId: z.string(),
  amount: z.number().positive().optional(),
  reason: z.string().optional(),
});

// Webhook route (NO auth, raw body needed)
router.post('/webhook/stripe', express.raw({ type: 'application/json' }), paymentController.stripeWebhook);

// Protected routes
router.use(authenticate);
router.use(paymentLimiter);

router.post('/stripe/create-intent', validateBody(createPaymentSchema), paymentController.createStripePayment);
router.post('/razorpay/create-order', validateBody(createPaymentSchema), paymentController.createRazorpayOrder);
router.post('/razorpay/verify', validateBody(verifyRazorpaySchema), paymentController.verifyRazorpayPayment);

// Admin only
router.post('/refund', requireAdmin, validateBody(refundSchema), paymentController.refundPayment);

export default router;

