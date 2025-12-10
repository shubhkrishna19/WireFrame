// ============================================
// PAYMENT CONTROLLER
// ============================================

import { Response, Request } from 'express';
import { AuthRequest } from '../types';
import * as paymentService from '../services/payment.service';
import { sendSuccess, sendError } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';
import { logger } from '../config/logger';

// Create Stripe Payment Intent
export const createStripePayment = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) sendError(res, 'Not authenticated', 401);
  
  const { orderId, amount, currency } = req.body;
  const result = await paymentService.createStripePaymentIntent(amount, currency, orderId);
  
  sendSuccess(res, result, 'Payment intent created');
});

// Create Razorpay Order
export const createRazorpayOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) sendError(res, 'Not authenticated', 401);
  
  const { orderId, amount, currency } = req.body;
  const result = await paymentService.createRazorpayOrder(amount, currency, orderId);
  
  sendSuccess(res, result, 'Razorpay order created');
});

// Verify Razorpay Payment
export const verifyRazorpayPayment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
  
  const isValid = await paymentService.verifyRazorpayPayment(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );

  if (isValid) {
    await paymentService.handleSuccessfulPayment(orderId, razorpay_payment_id, 'razorpay');
    sendSuccess(res, { verified: true }, 'Payment verified successfully');
  } else {
    await paymentService.handleFailedPayment(orderId, razorpay_payment_id, 'Signature verification failed');
    sendError(res, 'Payment verification failed', 400);
  }
});

// Stripe Webhook Handler
export const stripeWebhook = asyncHandler(async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;
  
  try {
    const event = await paymentService.verifyStripeWebhook(req.body, signature);

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as any;
        await paymentService.handleSuccessfulPayment(
          paymentIntent.metadata.orderId,
          paymentIntent.id,
          'stripe'
        );
        break;

      case 'payment_intent.payment_failed':
        const failedIntent = event.data.object as any;
        await paymentService.handleFailedPayment(
          failedIntent.metadata.orderId,
          failedIntent.id,
          failedIntent.last_payment_error?.message
        );
        break;

      default:
        logger.info(`Unhandled Stripe event: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    logger.error('Stripe webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

// Refund Payment (Admin)
export const refundPayment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { transactionId, amount, reason } = req.body;
  
  await paymentService.refundPayment(transactionId, amount, reason);
  
  sendSuccess(res, null, 'Refund processed successfully');
});

export default {
  createStripePayment,
  createRazorpayOrder,
  verifyRazorpayPayment,
  stripeWebhook,
  refundPayment,
};
