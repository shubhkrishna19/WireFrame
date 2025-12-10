import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password'
  }
});

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

// Send abandoned cart email
export const sendAbandonedCartEmail = async (
  email: string,
  cartItems: CartItem[],
  discountCode?: string
) => {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const itemsHTML = cartItems.map(item => `
    <tr>
      <td style="padding: 10px;">
        <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
      </td>
      <td style="padding: 10px;">
        <strong>${item.name}</strong><br>
        Quantity: ${item.quantity}<br>
        ₹${item.price.toFixed(2)} each
      </td>
      <td style="padding: 10px; text-align: right;">
        ₹${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f8f9fa; padding: 30px; }
    .product-table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; border-radius: 8px; overflow: hidden; }
    .product-table td { border-bottom: 1px solid #e0e0e0; }
    .discount-code { background: #ffd700; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; border-radius: 8px; }
    .cta-button { display: inline-block; background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🛍️ Your Cart is Waiting!</h1>
      <p>Don't let your favorite items get away!</p>
    </div>
    <div class="content">
      <p>Hi there! 👋</p>
      <p>We noticed you left some amazing items in your cart. We've saved them for you!</p>
      
      <table class="product-table">
        <thead>
          <tr style="background: #f0f0f0;">
            <th style="padding: 10px; text-align: left;">Image</th>
            <th style="padding: 10px; text-align: left;">Product</th>
            <th style="padding: 10px; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
        <tfoot>
          <tr style="background: #f0f0f0; font-weight: bold;">
            <td colspan="2" style="padding: 15px; text-align: right;">Total:</td>
            <td style="padding: 15px; text-align: right;">₹${total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      ${discountCode ? `
        <div class="discount-code">
          🎉 Use code <span style="color: #667eea;">${discountCode}</span> for 10% OFF!
        </div>
      ` : ''}

      <center>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/cart" class="cta-button">
          Complete Your Purchase →
        </a>
      </center>

      <p style="margin-top: 30px; font-size: 14px; color: #666;">
        <strong>Why shop with us?</strong><br>
        ✓ Free shipping on orders over ₹999<br>
        ✓ Easy returns within 30 days<br>
        ✓ 100% authentic products<br>
        ✓ Secure payment options
      </p>
    </div>
    <div class="footer">
      <p>This email was sent because you added items to your cart at Mulary.</p>
      <p>If you didn't create this cart, you can safely ignore this email.</p>
      <p>&copy; 2025 Mulary. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  const mailOptions: EmailData = {
    to: email,
    subject: `${discountCode ? '🎁 Special Discount! ' : ''}Your Cart is Waiting - Complete Your Purchase`,
    html
  };

  return sendEmail(mailOptions);
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (
  email: string,
  orderData: any
) => {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f8f9fa; padding: 30px; }
    .order-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #667eea; }
    .cta-button { display: inline-block; background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Order Confirmed!</h1>
      <p>Thank you for your purchase</p>
    </div>
    <div class="content">
      <p>Hi ${orderData.customerName}! 🎉</p>
      <p>We're excited to let you know that your order has been confirmed!</p>
      
      <div class="order-box">
        <h3>Order Details</h3>
        <p><strong>Order Number:</strong> #${orderData.orderNumber}</p>
        <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Total:</strong> ₹${orderData.total.toFixed(2)}</p>
        <p><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
      </div>

      <p><strong>Shipping Address:</strong></p>
      <p>${orderData.shippingAddress}</p>

      <center>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/orders/${orderData.orderId}" class="cta-button">
          Track Your Order →
        </a>
      </center>

      <p style="margin-top: 30px; font-size: 14px; color: #666;">
        Your order will be delivered within 5-7 business days.<br>
        You'll receive a shipping confirmation email once your order is on its way.
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const mailOptions: EmailData = {
    to: email,
    subject: `Order Confirmed - #${orderData.orderNumber}`,
    html
  };

  return sendEmail(mailOptions);
};

// Send password reset email
export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string
) => {
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f8f9fa; padding: 30px; }
    .cta-button { display: inline-block; background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔑 Password Reset Request</h1>
    </div>
    <div class="content">
      <p>Hi there! 👋</p>
      <p>We received a request to reset your password for your Mulary account.</p>
      
      <center>
        <a href="${resetLink}" class="cta-button">
          Reset Your Password →
        </a>
      </center>

      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; background: white; padding: 10px; border-radius: 4px; font-family: monospace;">
        ${resetLink}
      </p>

      <div class="warning">
        <strong>⚠️ Security Notice:</strong><br>
        This link will expire in 1 hour for security reasons.<br>
        If you didn't request this reset, please ignore this email.
      </div>

      <p style="margin-top: 30px; font-size: 14px; color: #666;">
        For security reasons, we recommend choosing a strong password that you don't use anywhere else.
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const mailOptions: EmailData = {
    to: email,
    subject: 'Reset Your Password - Mulary',
    html
  };

  return sendEmail(mailOptions);
};

// Generic send email function
const sendEmail = async (mailOptions: EmailData): Promise<boolean> => {
  try {
    await transporter.sendMail({
      from: `"Mulary" <${process.env.SMTP_USER || 'noreply@mulary.com'}>`,
      ...mailOptions
    });
    console.log(`✅ Email sent successfully to ${mailOptions.to}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return false;
  }
};

// Test email configuration
export const testEmailConfig = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    console.log('✅ Email service is configured correctly');
    return true;
  } catch (error) {
    console.error('❌ Email service configuration error:', error);
    return false;
  }
};

export default {
  sendAbandonedCartEmail,
  sendOrderConfirmationEmail,
  sendPasswordResetEmail,
  testEmailConfig
};
