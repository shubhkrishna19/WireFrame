// Mock payment service for MVP
// In production, this would integrate with Razorpay, Stripe, or other payment gateways
import { logger } from './logger';

export interface PaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  paymentMethod: 'card' | 'upi' | 'wallet' | 'netbanking';
  customerDetails: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  paymentId?: string;
  error?: string;
  message?: string;
}

/**
 * Mock payment processing
 * Simulates payment gateway behavior for MVP
 */
export const processPayment = async (request: PaymentRequest): Promise<PaymentResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock validation
  if (request.amount <= 0) {
    return {
      success: false,
      error: 'INVALID_AMOUNT',
      message: 'Payment amount must be greater than 0',
    };
  }

  if (!request.customerDetails.email) {
    return {
      success: false,
      error: 'INVALID_CUSTOMER',
      message: 'Customer email is required',
    };
  }

  // Simulate payment failure (5% chance for demo purposes)
  const shouldFail = Math.random() < 0.05;
  if (shouldFail) {
    return {
      success: false,
      error: 'PAYMENT_FAILED',
      message: 'Payment could not be processed. Please try again or use a different payment method.',
    };
  }

  // Generate mock transaction ID
  const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const paymentId = `PAY${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  // Log payment (in production, this would be saved to database)
  logger.log('Payment processed:', {
    transactionId,
    paymentId,
    amount: request.amount,
    method: request.paymentMethod,
    orderId: request.orderId,
  });

  return {
    success: true,
    transactionId,
    paymentId,
    message: 'Payment processed successfully',
  };
};

/**
 * Verify payment status
 */
export const verifyPayment = async (transactionId: string): Promise<PaymentResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock verification - in production, this would check with payment gateway
  return {
    success: true,
    transactionId,
    message: 'Payment verified',
  };
};

