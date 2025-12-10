"use strict";
// ============================================
// MULARY BACKEND SERVER - ENTRY POINT
// ============================================
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const logger_1 = require("./config/logger");
const database_1 = require("./config/database");
const redis_1 = require("./config/redis");
const abandonedCart_job_1 = require("./jobs/abandonedCart.job");
const PORT = env_1.config.port;
// Start server
const startServer = async () => {
    try {
        // Check database connection
        logger_1.logger.info('🔍 Checking database connection...');
        const dbConnected = await (0, database_1.checkConnection)();
        if (!dbConnected) {
            logger_1.logger.error('❌ Failed to connect to database');
            process.exit(1);
        }
        logger_1.logger.info('✅ Database connected successfully');
        // Initialize Redis (temporarily disabled for basic functionality)
        logger_1.logger.info('🔍 Skipping Redis initialization (optional service)');
        // await initializeRedis();
        // Start abandoned cart recovery job
        logger_1.logger.info('🔍 Starting abandoned cart recovery job...');
        (0, abandonedCart_job_1.startAbandonedCartJob)();
        // Start HTTP server
        app_1.default.listen(PORT, () => {
            logger_1.logger.info('='.repeat(50));
            logger_1.logger.info('🚀 MULARY E-COMMERCE BACKEND');
            logger_1.logger.info('='.repeat(50));
            logger_1.logger.info(`📍 Environment: ${env_1.config.nodeEnv}`);
            logger_1.logger.info(`🌐 Server: http://localhost:${PORT}`);
            logger_1.logger.info(`🔐 API Base: http://localhost:${PORT}/api`);
            logger_1.logger.info(`💚 Health Check: http://localhost:${PORT}/health`);
            logger_1.logger.info('='.repeat(50));
            if (env_1.config.isDevelopment) {
                logger_1.logger.info('');
                logger_1.logger.info('📚 API Endpoints:');
                logger_1.logger.info(`   Auth:     POST   /api/auth/register`);
                logger_1.logger.info(`   Auth:     POST   /api/auth/login`);
                logger_1.logger.info(`   Products: GET    /api/products`);
                logger_1.logger.info(`   Cart:     GET    /api/cart`);
                logger_1.logger.info(`   Orders:   POST   /api/orders`);
                logger_1.logger.info(`   User:     GET    /api/user/profile`);
                logger_1.logger.info(`   Admin:    GET    /api/admin/dashboard`);
                logger_1.logger.info('');
                logger_1.logger.info('🔑 Test Credentials:');
                logger_1.logger.info(`   Admin: admin@mulary.com / admin123`);
                logger_1.logger.info('');
            }
        });
    }
    catch (error) {
        logger_1.logger.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
// Graceful shutdown
const gracefulShutdown = async (signal) => {
    logger_1.logger.info(`\n${signal} received, shutting down gracefully...`);
    try {
        await (0, database_1.closeConnections)();
        await (0, redis_1.closeRedis)();
        logger_1.logger.info('✅ All connections closed');
        process.exit(0);
    }
    catch (error) {
        logger_1.logger.error('❌ Error during shutdown:', error);
        process.exit(1);
    }
};
// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
// Handle uncaught errors
process.on('uncaughtException', (error) => {
    logger_1.logger.error('❌ Uncaught Exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    logger_1.logger.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
// Start the server
startServer();
