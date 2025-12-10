// ============================================
// SPIN-THE-WHEEL GAMIFICATION ROUTES
// ============================================

import { Router, Response } from 'express';
import { AuthRequest } from '../types';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

interface SpinResult {
  id: string;
  userId?: string;
  email?: string;
  prize: string;
  discount: number;
  code: string;
  timestamp: Date;
  used: boolean;
}

const spinResults: SpinResult[] = [];
const userSpins = new Map<string, Date[]>(); // Track spins per user/email

// Prize configuration
const prizes = [
  { label: '5% OFF', discount: 5, weight: 30 },
  { label: '10% OFF', discount: 10, weight: 25 },
  { label: '15% OFF', discount: 15, weight: 20 },
  { label: '20% OFF', discount: 20, weight: 15 },
  { label: 'Free Shipping', discount: 0, weight: 8 },
  { label: 'Try Again', discount: 0, weight: 2 },
];

// Check if user can spin (once per day)
router.post('/check-eligibility', async (req: AuthRequest, res: Response) => {
  const { userId, email } = req.body;
  const identifier = userId || email;

  if (!identifier) {
    res.json({
      success: false,
      eligible: false,
      message: 'User ID or email required',
    });
    return;
  }

  const userSpinHistory = userSpins.get(identifier) || [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const spunToday = userSpinHistory.some(spin => {
    const spinDate = new Date(spin);
    spinDate.setHours(0, 0, 0, 0);
    return spinDate.getTime() === today.getTime();
  });

  res.json({
    success: true,
    eligible: !spunToday,
    message: spunToday ? 'You can spin again tomorrow!' : 'Ready to spin!',
    lastSpin: userSpinHistory[userSpinHistory.length - 1] || null,
  });
});

// Spin the wheel
router.post('/spin', async (req: AuthRequest, res: Response) => {
  const { userId, email, name } = req.body;
  const identifier = userId || email;

  if (!identifier) {
    res.status(400).json({
      success: false,
      message: 'User ID or email required',
    });
    return;
  }

  // Check eligibility
  const userSpinHistory = userSpins.get(identifier) || [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const spunToday = userSpinHistory.some(spin => {
    const spinDate = new Date(spin);
    spinDate.setHours(0, 0, 0, 0);
    return spinDate.getTime() === today.getTime();
  });

  if (spunToday) {
    res.status(429).json({
      success: false,
      message: 'You have already spun today. Come back tomorrow!',
    });
    return;
  }

  // Select a prize based on weighted random
  const prize = selectWeightedPrize();
  const code = generateCouponCode();

  const result: SpinResult = {
    id: uuidv4(),
    userId,
    email,
    prize: prize.label,
    discount: prize.discount,
    code: prize.discount > 0 ? code : '',
    timestamp: new Date(),
    used: false,
  };

  spinResults.push(result);

  // Update user spin history
  userSpinHistory.push(new Date());
  userSpins.set(identifier, userSpinHistory);

  res.json({
    success: true,
    result: {
      prize: result.prize,
      discount: result.discount,
      code: result.code,
      message: prize.discount > 0
        ? `Congratulations! You won ${prize.label}. Use code: ${code}`
        : prize.label === 'Free Shipping'
          ? 'You won free shipping on your next order!'
          : 'Better luck next time! Try again tomorrow.',
    },
  });
});

// Get user's spin history
router.get('/history/:identifier', async (req: AuthRequest, res: Response) => {
  const { identifier } = req.params;

  const history = spinResults.filter(r =>
    r.userId === identifier || r.email === identifier
  );

  res.json({
    success: true,
    history,
    totalSpins: history.length,
    totalWinnings: history.reduce((sum, r) => sum + r.discount, 0),
  });
});

// Validate and use a spin code
router.post('/validate-code', async (req: AuthRequest, res: Response) => {
  const { code } = req.body;

  const result = spinResults.find(r => r.code === code && !r.used);

  if (!result) {
    res.status(404).json({
      success: false,
      message: 'Invalid or already used code',
    });
    return;
  }

  // Check if code is expired (valid for 7 days)
  const expiryDate = new Date(result.timestamp);
  expiryDate.setDate(expiryDate.getDate() + 7);

  if (new Date() > expiryDate) {
    res.status(410).json({
      success: false,
      message: 'This code has expired',
    });
    return;
  }

  res.json({
    success: true,
    valid: true,
    discount: result.discount,
    prize: result.prize,
    expiresAt: expiryDate,
  });
});

// Mark code as used
router.post('/use-code', async (req: AuthRequest, res: Response) => {
  const { code } = req.body;

  const result = spinResults.find(r => r.code === code && !r.used);

  if (!result) {
    res.status(404).json({
      success: false,
      message: 'Invalid or already used code',
    });
    return;
  }

  result.used = true;

  res.json({
    success: true,
    message: 'Code applied successfully',
    discount: result.discount,
  });
});

// Helper functions
function selectWeightedPrize() {
  const totalWeight = prizes.reduce((sum, p) => sum + p.weight, 0);
  let random = Math.random() * totalWeight;

  for (const prize of prizes) {
    random -= prize.weight;
    if (random <= 0) return prize;
  }

  return prizes[0]; // Fallback
}

function generateCouponCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'SPIN';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default router;
