// ============================================
// SOCIAL PROOF NOTIFICATIONS ROUTES
// ============================================

import { Router } from 'express';

const router = Router();

// In-memory storage for demo (use Redis in production)
interface SocialProofEvent {
  id: string;
  type: 'viewing' | 'purchase' | 'review' | 'wishlist';
  productId?: string;
  productName?: string;
  customerName?: string;
  location?: string;
  timestamp: Date;
  count?: number;
}

const events: SocialProofEvent[] = [];
const viewingCounts = new Map<string, number>();

// Generate mock events for demo
const generateMockEvents = () => {
  const names = ['Sarah', 'Mike', 'Emma', 'David', 'Lisa', 'John', 'Anna', 'Chris'];
  const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai'];
  const types: SocialProofEvent['type'][] = ['viewing', 'purchase', 'review', 'wishlist'];
  
  setInterval(() => {
    const type = types[Math.floor(Math.random() * types.length)];
    const event: SocialProofEvent = {
      id: `event-${Date.now()}`,
      type,
      timestamp: new Date(),
    };

    if (type === 'viewing') {
      const productId = `product-${Math.floor(Math.random() * 10) + 1}`;
      const count = Math.floor(Math.random() * 50) + 5;
      event.productId = productId;
      event.count = count;
      viewingCounts.set(productId, count);
    } else {
      event.productName = `Premium ${type === 'purchase' ? 'T-Shirt' : 'Jeans'}`;
      event.customerName = names[Math.floor(Math.random() * names.length)];
      event.location = locations[Math.floor(Math.random() * locations.length)];
    }

    events.push(event);
    if (events.length > 50) events.shift(); // Keep only latest 50
  }, 5000); // Every 5 seconds
};

// Start generating events
generateMockEvents();

// Get recent social proof events
router.get('/events', async (req, res)  => {
  const limit = parseInt(req.query.limit as string) || 10;
  const recentEvents = events.slice(-limit).reverse();
  
  res.json({
    success: true,
    events: recentEvents,
    total: events.length,
  });
});

// Get viewing count for a product
router.get('/viewing/:productId', async (req, res)  => {
  const { productId } = req.params;
  const count = viewingCounts.get(productId) || Math.floor(Math.random() * 20) + 3;
  
  res.json({
    success: true,
    productId,
    count,
    message: `${count} people viewing this product`,
  });
});

// Track a new event (from frontend)
router.post('/track', async (req, res)  => {
  const { type, productId, productName, customerName } = req.body;
  
  const event: SocialProofEvent = {
    id: `event-${Date.now()}`,
    type,
    productId,
    productName,
    customerName,
    timestamp: new Date(),
  };

  events.push(event);
  if (events.length > 100) events.shift();

  res.json({
    success: true,
    event,
    message: 'Event tracked successfully',
  });
});

export default router;

