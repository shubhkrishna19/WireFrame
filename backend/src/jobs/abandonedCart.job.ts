import cron from 'node-cron';
import { sendAbandonedCartEmail } from '../services/emailService';
import { logger } from '../config/logger';

// In-memory store for abandoned carts (replace with database in production)
interface AbandonedCart {
  id: string;
  email: string;
  cartItems: any[];
  createdAt: Date;
  emailSent: boolean;
  recovered: boolean;
}

// Using a global variable for now - in production, use Redis or database
const abandonedCarts: Map<string, AbandonedCart> = new Map();

// Add functions to access the abandoned carts from other parts of the app
export const getAbandonedCartsStore = () => abandonedCarts;

// Scheduled task to check for abandoned carts
export const startAbandonedCartJob = () => {
  // Schedule to run every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    logger.info('🔍 Checking for abandoned carts...');

    const carts = Array.from(abandonedCarts.values());
    const now = new Date();
    let emailsSent = 0;

    for (const cart of carts) {
      if (cart.emailSent || cart.recovered) continue;

      const hoursSinceCreation = (now.getTime() - cart.createdAt.getTime()) / (1000 * 60 * 60);

      // Send first email after 1 hour
      if (hoursSinceCreation >= 1 && hoursSinceCreation < 24) {
        const discountCode = `SAVE10-${Math.random().toString(36).substring(7).toUpperCase()}`;

        const success = await sendAbandonedCartEmail(
          cart.email,
          cart.cartItems,
          discountCode
        );

        if (success) {
          cart.emailSent = true;
          abandonedCarts.set(cart.id, cart);
          emailsSent++;
          logger.info(`✅ Sent 10% discount abandoned cart email to ${cart.email} for cart ${cart.id}`);
        } else {
          logger.error(`❌ Failed to send abandoned cart email to ${cart.email}`);
        }
      }

      // Send reminder after 24 hours with bigger discount
      else if (hoursSinceCreation >= 24 && hoursSinceCreation < 48 && !cart.emailSent) {
        const discountCode = `SAVE20-${Math.random().toString(36).substring(7).toUpperCase()}`;

        const success = await sendAbandonedCartEmail(
          cart.email,
          cart.cartItems,
          discountCode
        );

        if (success) {
          cart.emailSent = true;
          abandonedCarts.set(cart.id, cart);
          emailsSent++;
          logger.info(`✅ Sent 20% discount abandoned cart email to ${cart.email} for cart ${cart.id}`);
        } else {
          logger.error(`❌ Failed to send 20% discount abandoned cart email to ${cart.email}`);
        }
      }

      // Send final reminder after 48 hours with maximum discount
      else if (hoursSinceCreation >= 48 && !cart.emailSent) {
        const discountCode = `SAVE30-${Math.random().toString(36).substring(7).toUpperCase()}`;

        const success = await sendAbandonedCartEmail(
          cart.email,
          cart.cartItems,
          discountCode
        );

        if (success) {
          cart.emailSent = true;
          abandonedCarts.set(cart.id, cart);
          emailsSent++;
          logger.info(`✅ Sent 30% discount final abandoned cart email to ${cart.email} for cart ${cart.id}`);
        } else {
          logger.error(`❌ Failed to send 30% discount final abandoned cart email to ${cart.email}`);
        }
      }
    }

    if (emailsSent > 0) {
      logger.info(`✅ Sent ${emailsSent} abandoned cart emails`);
    } else {
      logger.info('✅ No abandoned carts to email');
    }
  });

  logger.info('⏰ Abandoned cart cron job scheduled to run every hour');
};

// Function to add/update an abandoned cart
export const addAbandonedCart = (cartId: string, email: string, cartItems: any[]) => {
  abandonedCarts.set(cartId, {
    id: cartId,
    email,
    cartItems,
    createdAt: new Date(),
    emailSent: false,
    recovered: false
  });
};

// Function to mark cart as recovered
export const markCartAsRecovered = (cartId: string) => {
  const cart = abandonedCarts.get(cartId);
  if (cart) {
    cart.recovered = true;
    abandonedCarts.set(cartId, cart);
    return true;
  }
  return false;
};

// Get abandoned cart statistics
export const getAbandonedCartStats = () => {
  const carts = Array.from(abandonedCarts.values());

  return {
    total: carts.length,
    emailsSent: carts.filter(c => c.emailSent).length,
    recovered: carts.filter(c => c.recovered).length,
    pending: carts.filter(c => !c.emailSent && !c.recovered).length,
    recoveryRate: carts.length > 0
      ? ((carts.filter(c => c.recovered).length / carts.length) * 100).toFixed(2) + '%'
      : '0%'
  };
};

// Get all abandoned carts
export const getAllAbandonedCarts = () => {
  return Array.from(abandonedCarts.values()).map(cart => ({
    id: cart.id,
    email: cart.email,
    itemCount: cart.cartItems.length,
    total: cart.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    createdAt: cart.createdAt,
    emailSent: cart.emailSent,
    recovered: cart.recovered
  }));
};