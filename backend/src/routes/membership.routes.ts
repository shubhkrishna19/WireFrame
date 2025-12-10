// ============================================
// MEMBERSHIP TIERS ROUTES
// ============================================

import { Router } from 'express';

const router = Router();

interface MembershipTier {
  id: string;
  name: string;
  price: number;
  benefits: string[];
  color: string;
  popular: boolean;
}

const tiers: MembershipTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    benefits: [
      'Standard shipping (5-7 days)',
      'Basic customer support',
      'Access to sales',
      'Product reviews',
      'Wishlist feature',
    ],
    color: '#9CA3AF',
    popular: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 299,
    benefits: [
      'Free shipping on all orders',
      'Early access to sales (24hrs)',
      'Priority customer support',
      'Exclusive discounts (10%)',
      'Birthday special offer',
      'Easy returns (60 days)',
      'Style recommendations',
    ],
    color: '#10B981',
    popular: true,
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 599,
    benefits: [
      'Everything in Premium',
      'Personal stylist consultation',
      'VIP-only products',
      'Exclusive events invites',
      'Extra discounts (15%)',
      'Free alterations',
      'Concierge service',
      'Luxury packaging',
    ],
    color: '#F59E0B',
    popular: false,
  },
];

// Get all membership tiers
router.get('/tiers', async (req, res)  => {
  res.json({
    success: true,
    tiers,
  });
});

// Get user's current membership
router.get('/current/:userId', async (req, res)  => {
  // Mock user membership (replace with real DB query)
  const membership = {
    userId: req.params.userId,
    tierId: 'free',
    tierName: 'Free',
    since: new Date('2024-01-01'),
    expiresAt: null,
    autoRenew: false,
  };

  res.json({
    success: true,
    membership,
    tier: tiers.find(t => t.id === membership.tierId),
  });
});

// Upgrade membership
router.post('/upgrade', async (req, res)  => {
  const { userId, tierId, paymentMethod } = req.body;

  const tier = tiers.find(t => t.id === tierId);
  if (!tier) {
    res.status(404).json({
      success: false,
      message: 'Invalid tier',
    });

    return;
  }

  if (tier.price === 0) {
    res.status(400).json({
      success: false,
      message: 'Cannot upgrade to free tier',
    });

    return;
  }

  // Mock payment processing (integrate with Razorpay in production)
  const membership = {
    userId,
    tierId: tier.id,
    tierName: tier.name,
    since: new Date(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    autoRenew: true,
    paymentMethod,
  };

  res.json({
    success: true,
    message: `Successfully upgraded to ${tier.name}!`,
    membership,
    tier,
  });
});

// Cancel membership
router.post('/cancel', async (req, res)  => {
  const { userId } = req.body;

  res.json({
    success: true,
    message: 'Membership cancelled. Benefits active until expiry.',
  });
});

// Get membership benefits for a specific tier
router.get('/benefits/:tierId', async (req, res)  => {
  const tier = tiers.find(t => t.id === req.params.tierId);
  
  if (!tier) {
    res.status(404).json({
      success: false,
      message: 'Tier not found',
    });

    return;
  }

  res.json({
    success: true,
    tier,
    savings: tier.price * 12, // Annual savings estimate
  });
});

export default router;

