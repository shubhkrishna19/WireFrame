// ============================================
// EMAIL SERVICE (Nodemailer)
// ============================================

import nodemailer from 'nodemailer';
import { config } from '../config/env';
import { logger } from '../config/logger';
import { query } from '../config/database';

// Create transporter
const transporter = nodemailer.createTransport({
  host: config.email.smtp.host,
  port: config.email.smtp.port,
  secure: config.email.smtp.secure,
  auth: {
    user: config.email.smtp.auth.user,
    pass: config.email.smtp.auth.pass,
  },
});

// Base email template
const getEmailTemplate = (content: string, title: string): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #4CAF50; }
    .logo { font-size: 28px; font-weight: bold; color: #4CAF50; }
    .content { padding: 30px 0; }
    .button { display: inline-block; padding: 12px 30px; background: #4CAF50; color: #fff !important; text-decoration: none; border-radius: 4px; margin: 20px 0; }
    .footer { text-align: center; padding-top: 20px; border-top: 1px solid #ddd; color: #777; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">MULARY</div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Mulary E-Commerce. All rights reserved.</p>
      <p>Questions? Contact us at ${config.email.from}</p>
    </div>
  </div>
</body>
</html>
  `;
};

// Send email
const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `"Mulary E-Commerce" <${config.email.from}>`,
      to,
      subject,
      html,
    });

    // Log to email queue
    await query(
      `INSERT INTO email_queue (to_email, subject, body, status, sent_at, created_at)
       VALUES (?, ?, ?, 'sent', datetime('now'), datetime('now'))`,
      [to, subject, html]
    );

    logger.info(`Email sent to ${to}: ${subject}`);
  } catch (error: any) {
    logger.error(`Failed to send email to ${to}:`, error);
    
    // Log failure
    await query(
      `INSERT INTO email_queue (to_email, subject, body, status, error_message, created_at)
       VALUES (?, ?, ?, 'failed', ?, datetime('now'))`,
      [to, subject, html, error.message]
    );

    throw error;
  }
};

// Welcome Email
export const sendWelcomeEmail = async (email: string, name: string): Promise<void> => {
  const content = `
    <h2>Welcome to Mulary, ${name}! 🎉</h2>
    <p>Thank you for joining us! We're excited to have you as part of our community.</p>
    <p>Discover our premium collection of sustainable, comfortable clothing designed for the modern lifestyle.</p>
    <a href="${config.clientUrl}/products" class="button">Start Shopping</a>
    <p>If you have any questions, feel free to reach out to our support team.</p>
  `;

  const html = getEmailTemplate(content, 'Welcome to Mulary');
  await sendEmail(email, 'Welcome to Mulary E-Commerce! 🎉', html);
};

// Email Verification
export const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
  const verificationUrl = `${config.clientUrl}/verify-email/${token}`;
  
  const content = `
    <h2>Verify Your Email Address</h2>
    <p>Thank you for registering with Mulary! Please verify your email address to complete your registration.</p>
    <a href="${verificationUrl}" class="button">Verify Email</a>
    <p>Or copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
    <p>This link will expire in 24 hours.</p>
  `;

  const html = getEmailTemplate(content, 'Verify Your Email');
  await sendEmail(email, 'Verify Your Email Address', html);
};

// Password Reset
export const sendPasswordResetEmail = async (email: string, token: string): Promise<void> => {
  const resetUrl = `${config.clientUrl}/reset-password/${token}`;
  
  const content = `
    <h2>Reset Your Password</h2>
    <p>We received a request to reset your password. Click the button below to create a new password.</p>
    <a href="${resetUrl}" class="button">Reset Password</a>
    <p>Or copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #666;">${resetUrl}</p>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  const html = getEmailTemplate(content, 'Reset Your Password');
  await sendEmail(email, 'Reset Your Password', html);
};

// Order Confirmation
export const sendOrderConfirmationEmail = async (
  email: string,
  orderNumber: string,
  items: any[],
  total: number
): Promise<void> => {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.product_name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.subtotal}</td>
    </tr>
  `).join('');

  const content = `
    <h2>Order Confirmed! 🎉</h2>
    <p>Thank you for your order. We've received your payment and are preparing your items for shipment.</p>
    <p><strong>Order Number:</strong> ${orderNumber}</p>
    
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <thead>
        <tr style="background: #f8f8f8;">
          <th style="padding: 10px; text-align: left;">Product</th>
          <th style="padding: 10px; text-align: center;">Quantity</th>
          <th style="padding: 10px; text-align: right;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding: 15px; text-align: right; font-weight: bold;">Total:</td>
          <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px;">₹${total}</td>
        </tr>
      </tfoot>
    </table>

    <a href="${config.clientUrl}/orders/${orderNumber}" class="button">Track Order</a>
    <p>We'll send you another email when your order ships.</p>
  `;

  const html = getEmailTemplate(content, 'Order Confirmed');
  await sendEmail(email, `Order Confirmed - ${orderNumber}`, html);
};

// Order Shipped
export const sendOrderShippedEmail = async (
  email: string,
  orderNumber: string,
  trackingNumber?: string
): Promise<void> => {
  const content = `
    <h2>Your Order Has Been Shipped! 📦</h2>
    <p>Great news! Your order <strong>${orderNumber}</strong> is on its way.</p>
    ${trackingNumber ? `<p><strong>Tracking Number:</strong> ${trackingNumber}</p>` : ''}
    <a href="${config.clientUrl}/orders/${orderNumber}" class="button">Track Shipment</a>
    <p>You should receive your order within 3-5 business days.</p>
  `;

  const html = getEmailTemplate(content, 'Order Shipped');
  await sendEmail(email, `Order Shipped - ${orderNumber}`, html);
};

// Order Delivered
export const sendOrderDeliveredEmail = async (
  email: string,
  orderNumber: string
): Promise<void> => {
  const content = `
    <h2>Your Order Has Been Delivered! 🎉</h2>
    <p>Your order <strong>${orderNumber}</strong> has been successfully delivered.</p>
    <p>We hope you love your new items! If you have any issues, please contact our support team.</p>
    <a href="${config.clientUrl}/orders/${orderNumber}/review" class="button">Leave a Review</a>
    <p>Thank you for shopping with Mulary!</p>
  `;

  const html = getEmailTemplate(content, 'Order Delivered');
  await sendEmail(email, `Order Delivered - ${orderNumber}`, html);
};

export default {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
  sendOrderShippedEmail,
  sendOrderDeliveredEmail,
};
