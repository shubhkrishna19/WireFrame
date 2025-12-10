// ============================================
// REDIS CONFIGURATION (Optional - for caching)
// ============================================

import { createClient, RedisClientType } from 'redis';
import { config } from './env';
import { logger } from './logger';

let redisClient: RedisClientType | null = null;

// Initialize Redis client (only if Redis is available)
export const initializeRedis = async (): Promise<RedisClientType | null> => {
  return new Promise((resolve) => {
    // Set a timeout to prevent blocking server startup
    const timeout = setTimeout(() => {
      logger.warn('⚠️  Redis connection timeout (continuing without cache)');
      resolve(null);
    }, 5000); // 5 second timeout

    try {
      const client = createClient({
        socket: {
          host: config.redis.host,
          port: config.redis.port,
        },
        password: config.redis.password || undefined,
        database: config.redis.db,
      });

      client.on('error', (err) => {
        logger.warn('Redis Client Error (non-critical):', err);
      });

      client.on('connect', () => {
        logger.info('✅ Connected to Redis');
        clearTimeout(timeout);
        redisClient = client as RedisClientType;
        resolve(client as RedisClientType);
      });

      client.on('ready', () => {
        clearTimeout(timeout);
        redisClient = client as RedisClientType;
        resolve(client as RedisClientType);
      });

      // Attempt connection
      client.connect().catch((error) => {
        clearTimeout(timeout);
        logger.warn('⚠️  Redis connection failed (continuing without cache):', error);
        resolve(null);
      });

    } catch (error) {
      clearTimeout(timeout);
      logger.warn('⚠️  Redis initialization failed (continuing without cache):', error);
      resolve(null);
    }
  });
};

// Get Redis client
export const getRedisClient = (): RedisClientType | null => {
  return redisClient;
};

// Cache helpers
export const cacheGet = async (key: string): Promise<string | null> => {
  if (!redisClient) return null;
  try {
    return await redisClient.get(key);
  } catch (error) {
    logger.warn('Redis GET error:', error);
    return null;
  }
};

export const cacheSet = async (
  key: string,
  value: string,
  expiresIn?: number
): Promise<void> => {
  if (!redisClient) return;
  try {
    if (expiresIn) {
      await redisClient.setEx(key, expiresIn, value);
    } else {
      await redisClient.set(key, value);
    }
  } catch (error) {
    logger.warn('Redis SET error:', error);
  }
};

export const cacheDel = async (key: string): Promise<void> => {
  if (!redisClient) return;
  try {
    await redisClient.del(key);
  } catch (error) {
    logger.warn('Redis DEL error:', error);
  }
};

export const cacheFlush = async (): Promise<void> => {
  if (!redisClient) return;
  try {
    await redisClient.flushDb();
    logger.info('Redis cache flushed');
  } catch (error) {
    logger.warn('Redis FLUSH error:', error);
  }
};

// Close Redis connection
export const closeRedis = async (): Promise<void> => {
  if (redisClient) {
    try {
      await redisClient.quit();
      logger.info('Redis connection closed');
    } catch (error) {
      logger.error('Error closing Redis connection:', error);
    }
  }
};

export default {
  initialize: initializeRedis,
  get: cacheGet,
  set: cacheSet,
  del: cacheDel,
  flush: cacheFlush,
  close: closeRedis,
};
