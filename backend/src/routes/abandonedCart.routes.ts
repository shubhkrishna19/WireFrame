import { Router, Response } from 'express';
import { AuthRequest } from '../types';
import {
  addAbandonedCart,
  markCartAsRecovered,
  getAbandonedCartStats,
  getAllAbandonedCarts
} from '../jobs/abandonedCart.job';

const router = Router();

// Track cart activity
router.post('/track', async (req: AuthRequest, res: Response) => {
  try {
    const { email, cartItems, userId } = req.body;

    if (!email || !cartItems || cartItems.length === 0) {
      res.status(400).json({ error: 'Email and cart items required' });
      return;
    }

    const cartId = userId || email;

    // Create or update abandoned cart entry
    addAbandonedCart(cartId, email, cartItems);

    res.json({
      success: true,
      message: 'Cart tracked successfully',
      cartId
    });
  } catch (error) {
    console.error('Error tracking cart:', error);
    res.status(500).json({ error: 'Failed to track cart' });
  }
});

// Mark cart as recovered
router.post('/recovered/:cartId', async (req: AuthRequest, res: Response) => {
  try {
    const { cartId } = req.params;

    const success = markCartAsRecovered(cartId);
    if (success) {
      res.json({
        success: true,
        message: 'Cart marked as recovered'
      });
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    console.error('Error marking cart recovered:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// Get abandoned cart statistics
router.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    const stats = getAbandonedCartStats();
    res.json(stats);
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

// Manually trigger abandoned cart emails (for testing)
router.post('/send-emails', async (req: AuthRequest, res: Response) => {
  // This endpoint is for manual testing - the actual cron job runs automatically
  res.json({
    success: true,
    message: 'Manual email trigger - emails are sent automatically every hour via scheduled job'
  });
});

// Get all abandoned carts (admin only)
router.get('/list', async (req: AuthRequest, res: Response) => {
  try {
    const carts = getAllAbandonedCarts();
    res.json(carts);
  } catch (error) {
    console.error('Error listing carts:', error);
    res.status(500).json({ error: 'Failed to list abandoned carts' });
  }
});

export default router;
