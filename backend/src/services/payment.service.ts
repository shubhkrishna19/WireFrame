// ============================================
// PAYMENT SERVICE (Stripe + Razorpay)
// ============================================

import Stripe from 'stripe';
import Razorpay from 'razorpay';
import { config } from '../config/env';
import { query } from '../config/database';
import { AppError } from '../middleware/error.middleware';
import { logger } from '../config/logger';

// Initialize Stripe (only if config values exist)
const stripe = config.payment.stripe.secretKey
  ? new Stripe(config.payment.stripe.secretKey, {
      apiVersion: '2023-10-16',
    })
  : null;

// Initialize Razorpay (only if config values exist)
const razorpay = config.payment.razorpay.keyId && config.payment.razorpay.keySecret
  ? new Razorpay({
      key_id: config.payment.razorpay.keyId,
      key_secret: config.payment.razorpay.keySecret,
    })
  : null;

// Create Stripe Payment Intent
export const createStripePaymentIntent = async (
  amount: number,
  currency: string = 'INR',
  orderId: string
): Promise<any> => {
  try {
    if (!stripe) {
      throw new AppError('Stripe is not configured', 500);
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses smallest currency unit
      currency: currency.toLowerCase(),
      metadata: {
        orderId,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Save transaction to database
    await query(
      `INSERT INTO payment_transactions (
        order_id, payment_method, transaction_id, amount, currency, status, provider_response, created_at
      ) VALUES (?, 'stripe', ?, ?, ?, 'pending', ?, datetime('now'))`,
      [orderId, paymentIntent.id, amount, currency, JSON.stringify(paymentIntent)]
    );

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error: any) {
    logger.error('Stripe payment intent creation failed:', error);
    throw new AppError(`Payment initialization failed: ${error.message}`, 500);
  }
};

// Create Razorpay Order
export const createRazorpayOrder = async (
  amount: number,
  currency: string = 'INR',
  orderId: string
): Promise<any> => {
  try {
    if (!razorpay) {
      throw new AppError('Razorpay is not configured', 500);
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Razorpay uses smallest currency unit
      currency,
      receipt: orderId,
      notes: {
        orderId,
      },
    });

    // Save transaction to database
    await query(
      `INSERT INTO payment_transactions (
        order_id, payment_method, transaction_id, amount, currency, status, provider_response, created_at
      ) VALUES (?, 'razorpay', ?, ?, ?, 'pending', ?, datetime('now'))`,
      [orderId, razorpayOrder.id, amount, currency, JSON.stringify(razorpayOrder)]
    );

    return {
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    };
  } catch (error: any) {
    logger.error('Razorpay order creation failed:', error);
    throw new AppError(`Payment initialization failed: ${error.message}`, 500);
  }
};

// Verify Stripe Webhook
export const verifyStripeWebhook = async (
  payload: string | Buffer,
  signature: string
): Promise<Stripe.Event> => {
  try {
    if (!stripe) {
      throw new AppError('Stripe is not configured', 500);
    }

    return stripe.webhooks.constructEvent(
      payload,
      signature,
      config.payment.stripe.webhookSecret || ''
    );
  } catch (error: any) {
    logger.error('Stripe webhook verification failed:', error);
    throw new AppError('Invalid webhook signature', 400);
  }
};

// Verify Razorpay Payment
export const verifyRazorpayPayment = async (
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> => {
  try {
    if (!razorpay) {
      logger.error('Razorpay is not configured');
      return false;
    }

    const crypto = require('crypto');
    const generatedSignature = crypto
      .createHmac('sha256', config.payment.razorpay.keySecret || '')
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    return generatedSignature === signature;
  } catch (error: any) {
    logger.error('Razorpay payment verification failed:', error);
    return false;
  }
};

// Handle Successful Payment
export const handleSuccessfulPayment = async (
  orderId: string,
  transactionId: string,
  paymentMethod: string
): Promise<void> => {
  try {
    // Update order status
    await query(
      `UPDATE orders SET 
        payment_status = 'completed',
        status = 'confirmed',
        updated_at = datetime('now')
       WHERE id = ?`,
      [orderId]
    );

    // Update payment transaction
    await query(
      `UPDATE payment_transactions SET
        status = 'completed',
        updated_at = datetime('now')
       WHERE order_id = ? AND transaction_id = ?`,
      [orderId, transactionId]
    );

    logger.info(`Payment successful for order ${orderId}`);
  } catch (error: any) {
    logger.error('Failed to update payment status:', error);
    throw error;
  }
};

// Handle Failed Payment
export const handleFailedPayment = async (
  orderId: string,
  transactionId: string,
  reason?: string
): Promise<void> => {
  try {
    // Update payment transaction
    await query(
      `UPDATE payment_transactions SET
        status = 'failed',
        failure_reason = ?,
        updated_at = datetime('now')
       WHERE order_id = ? AND transaction_id = ?`,
      [orderId, transactionId, reason || 'Payment failed']
    );

    logger.info(`Payment failed for order ${orderId}: ${reason}`);
  } catch (error: any) {
    logger.error('Failed to update payment failure:', error);
    throw error;
  }
};

// Refund Payment
export const refundPayment = async (
  transactionId: string,
  amount?: number,
  reason?: string
): Promise<void> => {
  try {
    // Get transaction details
    const result = await query(
      'SELECT * FROM payment_transactions WHERE transaction_id = ?',
      [transactionId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Transaction not found', 404);
    }

    const transaction = result.rows[0];

    if (transaction.payment_method === 'stripe') {
      if (!stripe) {
        throw new AppError('Stripe is not configured', 500);
      }
      await stripe.refunds.create({
        payment_intent: transactionId,
        amount: amount ? Math.round(amount * 100) : undefined,
        reason: reason as any,
      });
    } else if (transaction.payment_method === 'razorpay') {
      if (!razorpay) {
        throw new AppError('Razorpay is not configured', 500);
      }
      await razorpay.payments.refund(transactionId, {
        amount: amount ? Math.round(amount * 100) : undefined,
        notes: { reason: reason || 'Customer requested refund' },
      });
    }

    // Update order status
    await query(
      `UPDATE orders SET
        payment_status = 'refunded',
        status = 'refunded',
        updated_at = datetime('now')
       WHERE id = ?`,
      [transaction.order_id]
    );

    logger.info(`Refund processed for transaction ${transactionId}`);
  } catch (error: any) {
    logger.error('Refund failed:', error);
    throw new AppError(`Refund failed: ${error.message}`, 500);
  }
};

export default {
  createStripePaymentIntent,
  createRazorpayOrder,
  verifyStripeWebhook,
  verifyRazorpayPayment,
  handleSuccessfulPayment,
  handleFailedPayment,
  refundPayment,
};
