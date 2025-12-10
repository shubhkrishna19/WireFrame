// Email service for sending notifications
import { logger } from './logger';

export interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  template?: 'order-confirmation' | 'order-shipped' | 'order-delivered' | 'order-cancelled' | 'password-reset';
  data?: Record<string, any>;
}

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Mock email sending service
 * Simulates email sending for MVP - logs to console
 */
export const sendEmail = async (options: EmailOptions): Promise<EmailResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    // Validate email
    if (!options.to || !options.to.includes('@')) {
      return {
        success: false,
        error: 'INVALID_EMAIL',
      };
    }

    // Generate mock message ID
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Log email (in production, this would actually send via email service)
    logger.log('📧 Email sent:', {
      to: options.to,
      subject: options.subject,
      template: options.template,
      messageId,
    });

    // In production, you would call your email service here:
    // await emailService.send({
    //   to: options.to,
    //   subject: options.subject,
    //   html: options.html || generateTemplate(options.template, options.data),
    // });

    return {
      success: true,
      messageId,
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: 'EMAIL_SEND_FAILED',
    };
  }
};

/**
 * Send order confirmation email
 */
export const sendOrderConfirmation = async (
  email: string,
  orderData: {
    orderNumber: string;
    orderId: string;
    total: number;
    items: Array<{ name: string; quantity: number; price: number }>;
    shippingAddress: {
      name: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
  }
): Promise<EmailResponse> => {
  return sendEmail({
    to: email,
    subject: `Order Confirmation - ${orderData.orderNumber}`,
    template: 'order-confirmation',
    data: orderData,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Order Confirmed!</h1>
        <p>Thank you for your order. Your order number is <strong>${orderData.orderNumber}</strong>.</p>
        <h2>Order Summary</h2>
        <ul>
          ${orderData.items.map(item => `<li>${item.name} x ${item.quantity} - ₹${item.price * item.quantity}</li>`).join('')}
        </ul>
        <p><strong>Total: ₹${orderData.total}</strong></p>
        <h2>Shipping Address</h2>
        <p>
          ${orderData.shippingAddress.name}<br>
          ${orderData.shippingAddress.street}<br>
          ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.zipCode}
        </p>
      </div>
    `,
  });
};

/**
 * Send order status update email
 */
export const sendOrderStatusUpdate = async (
  email: string,
  orderData: {
    orderNumber: string;
    status: string;
    trackingNumber?: string;
  }
): Promise<EmailResponse> => {
  const statusMessages: Record<string, string> = {
    processing: 'Your order is being processed',
    shipped: 'Your order has been shipped',
    delivered: 'Your order has been delivered',
    cancelled: 'Your order has been cancelled',
  };

  return sendEmail({
    to: email,
    subject: `Order Update - ${orderData.orderNumber}`,
    template: orderData.status as any,
    data: orderData,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>${statusMessages[orderData.status] || 'Order Status Update'}</h1>
        <p>Your order <strong>${orderData.orderNumber}</strong> status has been updated to <strong>${orderData.status}</strong>.</p>
        ${orderData.trackingNumber ? `<p>Tracking Number: <strong>${orderData.trackingNumber}</strong></p>` : ''}
      </div>
    `,
  });
};

