// ============================================
// EXPRESS APPLICATION SETUP
// ============================================

import express, { Application } from 'express';
console.log('APP INITIALIZED');
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config/env';
import { logger } from './config/logger';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { apiLimiter } from './middleware/rateLimit.middleware';

// Import routes
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
import paymentRoutes from './routes/payment.routes';
import uploadRoutes from './routes/upload.routes';
import reviewRoutes from './routes/review.routes';
import wishlistRoutes from './routes/wishlist.routes';
import couponRoutes from './routes/coupon.routes';
import categoryRoutes from './routes/category.routes';
import zohoWebhooks from './routes/zohoWebhooks';
import zohoTestRoutes from './routes/zohoTest.routes';

// ... imports ...

// API routes with rate limiting


// Premium Features Routes (temporarily disabled for basic functionality)
// import socialProofRoutes from './routes/socialProof.routes';
// import recommendationsRoutes from './routes/recommendations.routes';
// import gamificationRoutes from './routes/gamification.routes';
// import membershipRoutes from './routes/membership.routes';
// import abandonedCartRoutes from './routes/abandonedCart.routes';
// import bnplRoutes from './routes/bnpl.routes';
// import chatRoutes from './routes/chat.routes';
// import analyticsRoutes from './routes/analytics.routes';

// Create Express app
const app: Application = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: config.isProduction ? undefined : false,
}));

// CORS configuration
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request logging in development
if (config.isDevelopment) {
  app.use((_req, _res, next) => {
    logger.info(`${_req.method} ${_req.path}`);
    next();
  });
}

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// API routes with rate limiting
app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/coupons', couponRoutes);

// Zoho Integration Webhooks (no rate limiting for incoming webhooks)
app.use('/webhooks/zoho', zohoWebhooks);

// Zoho Test Endpoints (for development/testing)
app.use('/api/zoho', zohoTestRoutes);

// Premium Features Routes (temporarily disabled)
// app.use('/api/social-proof', socialProofRoutes);
// app.use('/api/recommendations', recommendationsRoutes);
// app.use('/api/gamification', gamificationRoutes);
// app.use('/api/membership', membershipRoutes);
// app.use('/api/abandoned-cart', abandonedCartRoutes);
// app.use('/api/bnpl', bnplRoutes);
// app.use('/api/chat', chatRoutes);
// app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app;
