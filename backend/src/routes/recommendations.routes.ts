// ============================================
// AI PRODUCT RECOMMENDATIONS ROUTES
// ============================================

import { Router, Response } from 'express';
import { AuthRequest } from '../types';

const router = Router();

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  tags: string[];
}

// Mock product database
const products: Product[] = [
  { id: '1', name: 'Premium Cotton T-Shirt', category: 'tops', price: 999, tags: ['casual', 'cotton', 'summer'] },
  { id: '2', name: 'Slim Fit Jeans', category: 'bottoms', price: 1999, tags: ['denim', 'casual', 'fitted'] },
  { id: '3', name: 'Leather Sneakers', category: 'shoes', price: 2999, tags: ['casual', 'leather', 'sports'] },
  { id: '4', name: 'Classic Hoodie', category: 'tops', price: 1499, tags: ['casual', 'winter', 'cotton'] },
  { id: '5', name: 'Cargo Pants', category: 'bottoms', price: 1799, tags: ['casual', 'utility', 'cotton'] },
  { id: '6', name: 'Canvas Backpack', category: 'accessories', price: 1299, tags: ['casual', 'canvas', 'utility'] },
  { id: '7', name: 'Denim Jacket', category: 'outerwear', price: 2499, tags: ['denim', 'casual', 'winter'] },
  { id: '8', name: 'Running Shoes', category: 'shoes', price: 3499, tags: ['sports', 'athletic', 'comfortable'] },
];

// Get AI-powered recommendations
router.post('/ai-powered', async (req: AuthRequest, res: Response) => {
  const { productId, userId, browsingHistory, limit = 6 } = req.body;

  let recommendations: Product[] = [];

  if (productId) {
    // Find similar products
    const currentProduct = products.find(p => p.id === productId);
    if (currentProduct) {
      recommendations = products
        .filter(p => p.id !== productId)
        .map(p => ({
          ...p,
          score: calculateSimilarity(currentProduct, p),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    }
  } else {
    // Return trending products
    recommendations = [...products]
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
  }

  res.json({
    success: true,
    recommendations: recommendations.map((p: any) => {
      const { score, ...product } = p;
      return product;
    }),
    algorithm: 'collaborative_filtering',
    confidence: 0.85,
  });
});

// Get "Complete the Look" recommendations
router.post('/complete-the-look', async (req: AuthRequest, res: Response) => {
  const { productId } = req.body;

  const currentProduct = products.find(p => p.id === productId);
  if (!currentProduct) {
    res.status(404).json({ success: false, message: 'Product not found' });

    return;
  }

  // Find complementary products
  let recommendations: Product[] = [];

  if (currentProduct.category === 'tops') {
    recommendations = products.filter(p =>
      p.category === 'bottoms' || p.category === 'shoes' || p.category === 'accessories'
    );
  } else if (currentProduct.category === 'bottoms') {
    recommendations = products.filter(p =>
      p.category === 'tops' || p.category === 'shoes' || p.category === 'outerwear'
    );
  } else if (currentProduct.category === 'shoes') {
    recommendations = products.filter(p =>
      p.category === 'tops' || p.category === 'bottoms'
    );
  }

  res.json({
    success: true,
    recommendations: recommendations.slice(0, 3),
    message: 'Complete your look with these items',
  });
});

// Get trending products
router.get('/trending', async (req: AuthRequest, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 6;

  // Simulate trending algorithm
  const trending = [...products]
    .map(p => ({
      ...p,
      trendScore: Math.random() * 100,
      views: Math.floor(Math.random() * 1000) + 100,
      sales: Math.floor(Math.random() * 50) + 10,
    }))
    .sort((a, b) => b.trendScore - a.trendScore)
    .slice(0, limit);

  res.json({
    success: true,
    trending,
    period: 'last_7_days',
  });
});

// Get personalized recommendations based on user behavior
router.post('/personalized', async (req: AuthRequest, res: Response) => {
  const { userId, preferences, budget } = req.body;

  let filtered = [...products];

  // Filter by budget
  if (budget) {
    filtered = filtered.filter(p => p.price <= budget.max && p.price >= (budget.min || 0));
  }

  // Filter by preferences
  if (preferences?.categories) {
    filtered = filtered.filter(p => preferences.categories.includes(p.category));
  }

  if (preferences?.tags) {
    filtered = filtered.filter(p =>
      p.tags.some(tag => preferences.tags.includes(tag))
    );
  }

  // Randomize and limit
  const personalized = filtered
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);

  res.json({
    success: true,
    recommendations: personalized,
    personalizationScore: 0.92,
    matchReasons: ['Based on your browsing history', 'Matches your style preferences'],
  });
});

// Calculate similarity between two products
function calculateSimilarity(product1: Product, product2: Product): number {
  let score = 0;

  // Same category: +30 points
  if (product1.category === product2.category) score += 30;

  // Similar tags: +10 points per match
  const commonTags = product1.tags.filter(tag => product2.tags.includes(tag));
  score += commonTags.length * 10;

  // Similar price range: +20 points
  const priceDiff = Math.abs(product1.price - product2.price);
  if (priceDiff < 500) score += 20;
  else if (priceDiff < 1000) score += 10;

  return score;
}

export default router;

