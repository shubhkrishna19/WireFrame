// ============================================
// MULARY BACKEND SERVER - ENTRY POINT
// ============================================

import app from './app';
import { config } from './config/env';
import { logger } from './config/logger';
import { checkConnection, closeConnections } from './config/database';
import { initializeRedis, closeRedis } from './config/redis';
import { startAbandonedCartJob } from './jobs/abandonedCart.job';

const PORT = config.port;

// Start server
const startServer = async () => {
  try {
    // Check database connection
    logger.info('🔍 Checking database connection...');
    const dbConnected = await checkConnection();

    if (!dbConnected) {
      logger.error('❌ Failed to connect to database');
      process.exit(1);
    }

    logger.info('✅ Database connected successfully');

    // Initialize Redis (temporarily disabled for basic functionality)
    logger.info('🔍 Skipping Redis initialization (optional service)');
    // await initializeRedis();

    // Start abandoned cart recovery job (temporarily disabled for debugging)
    // logger.info('🔍 Starting abandoned cart recovery job...');
    //start();

    // Start HTTP server
    logger.info(`🚀 Attempting to start server on port ${PORT}...`);
    const server = app.listen(PORT, () => {
      logger.info('='.repeat(50));
      logger.info('🚀 MULARY E-COMMERCE BACKEND');
      logger.info('='.repeat(50));
      logger.info(`📍 Environment: ${config.nodeEnv}`);
      logger.info(`🌐 Server: http://localhost:${PORT}`);
      logger.info(`🔐 API Base: http://localhost:${PORT}/api`);
      logger.info(`💚 Health Check: http://localhost:${PORT}/health`);
      logger.info('='.repeat(50));

      if (config.isDevelopment) {
        logger.info('');
        logger.info('📚 API Endpoints:');
        logger.info(`   Auth:     POST   /api/auth/register`);
        logger.info(`   Auth:     POST   /api/auth/login`);
        logger.info(`   Products: GET    /api/products`);
        logger.info(`   Cart:     GET    /api/cart`);
        logger.info(`   Orders:   POST   /api/orders`);
        logger.info(`   User:     GET    /api/user/profile`);
        logger.info(`   Admin:    GET    /api/admin/dashboard`);
        logger.info('');
        logger.info('🔑 Test Credentials:');
        logger.info(`   Admin: admin@mulary.com / admin123`);
        logger.info('');
      }
    });

    server.on('error', (error: any) => {
      logger.error('❌ Server startup error:', error);
      if (error.code === 'EADDRINUSE') {
        logger.error(`❌ Port ${PORT} is already in use`);
      }
      process.exit(1);
    });

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`\n${signal} received, shutting down gracefully...`);

  try {
    await closeConnections();
    await closeRedis();
    logger.info('✅ All connections closed');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();
