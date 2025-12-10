"use strict";
// ============================================
// EXPRESS APPLICATION SETUP
// ============================================
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cors_1 = require("cors");
const helmet_1 = require("helmet");
const cookie_parser_1 = require("cookie-parser");
const env_1 = require("./config/env");
const logger_1 = require("./config/logger");
const error_middleware_1 = require("./middleware/error.middleware");
const rateLimit_middleware_1 = require("./middleware/rateLimit.middleware");
// Import routes
const auth_routes_1 = require("./routes/auth.routes");
const product_routes_1 = require("./routes/product.routes");
const cart_routes_1 = require("./routes/cart.routes");
const order_routes_1 = require("./routes/order.routes");
const user_routes_1 = require("./routes/user.routes");
const admin_routes_1 = require("./routes/admin.routes");
const payment_routes_1 = require("./routes/payment.routes");
const upload_routes_1 = require("./routes/upload.routes");
const review_routes_1 = require("./routes/review.routes");
const wishlist_routes_1 = require("./routes/wishlist.routes");
const coupon_routes_1 = require("./routes/coupon.routes");
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
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: env_1.config.isProduction ? undefined : false,
}));
// CORS configuration
app.use((0, cors_1.default)({
    origin: env_1.config.clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
// Request logging in development
if (env_1.config.isDevelopment) {
    app.use((_req, _res, next) => {
        logger_1.logger.info(`${_req.method} ${_req.path}`);
        next();
    });
}
// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        environment: env_1.config.nodeEnv,
        timestamp: new Date().toISOString(),
    });
});
// API routes with rate limiting
app.use('/api', rateLimit_middleware_1.apiLimiter);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/products', product_routes_1.default);
app.use('/api/cart', cart_routes_1.default);
app.use('/api/orders', order_routes_1.default);
app.use('/api/user', user_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/payment', payment_routes_1.default);
app.use('/api/upload', upload_routes_1.default);
app.use('/api/reviews', review_routes_1.default);
app.use('/api/wishlist', wishlist_routes_1.default);
app.use('/api/coupons', coupon_routes_1.default);
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
app.use(error_middleware_1.notFoundHandler);
// Error handler (must be last)
app.use(error_middleware_1.errorHandler);
exports.default = app;
