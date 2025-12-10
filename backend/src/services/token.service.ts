// ============================================
// TOKEN MANAGEMENT SERVICE
// ============================================

import { getRedisClient } from '../config/redis';
import { logger } from '../config/logger';
import { verifyRefreshToken } from '../utils/jwt.util';
import { RefreshTokenPayload } from '../types';

// Blacklist a refresh token
export const blacklistToken = async (refreshToken: string, expiresIn: number = 7 * 24 * 60 * 60): Promise<void> => {
  try {
    const redisClient = getRedisClient();
    if (!redisClient) {
      logger.warn('Redis not available, skipping token blacklisting');
      return;
    }

    // Get the token payload to extract the user ID
    const decoded = verifyRefreshToken(refreshToken);
    const userId = decoded.userId;
    
    // Create a unique key for this token
    const tokenKey = `blacklisted_token:${refreshToken}`;
    
    // Store the token in Redis with expiration
    await redisClient.setEx(tokenKey, expiresIn, userId);
    
    logger.info(`Token blacklisted for user: ${userId}`);
  } catch (error) {
    logger.error('Error blacklisting token:', error);
  }
};

// Check if a token is blacklisted
export const isTokenBlacklisted = async (refreshToken: string): Promise<boolean> => {
  try {
    const redisClient = getRedisClient();
    if (!redisClient) {
      // If Redis is not available, we can't check blacklist, so return false
      return false;
    }

    const tokenKey = `blacklisted_token:${refreshToken}`;
    const result = await redisClient.get(tokenKey);
    
    return result !== null;
  } catch (error) {
    logger.error('Error checking token blacklist:', error);
    return false; // Fail safe - if we can't check, assume token is not blacklisted
  }
};

// Blacklist all refresh tokens for a user (useful for account logout from all devices)
export const blacklistUserTokens = async (userId: string, expiresIn: number = 7 * 24 * 60 * 60): Promise<void> => {
  try {
    const redisClient = getRedisClient();
    if (!redisClient) {
      logger.warn('Redis not available, skipping user token blacklisting');
      return;
    }

    // Create a key to track all tokens for this user
    const userTokensKey = `user_tokens:${userId}`;
    
    // Store a marker in Redis with expiration
    await redisClient.setEx(userTokensKey, expiresIn, 'blacklisted');
    
    logger.info(`All tokens blacklisted for user: ${userId}`);
  } catch (error) {
    logger.error('Error blacklisting user tokens:', error);
  }
};

// Check if all tokens for a user are blacklisted
export const areUserTokensBlacklisted = async (userId: string): Promise<boolean> => {
  try {
    const redisClient = getRedisClient();
    if (!redisClient) {
      return false;
    }

    const userTokensKey = `user_tokens:${userId}`;
    const result = await redisClient.get(userTokensKey);
    
    return result !== null;
  } catch (error) {
    logger.error('Error checking user token blacklist:', error);
    return false;
  }
};

// Revoke a specific refresh token
export const revokeToken = async (refreshToken: string): Promise<void> => {
  return blacklistToken(refreshToken);
};

// Revoke all tokens for a user
export const revokeUserTokens = async (userId: string): Promise<void> => {
  return blacklistUserTokens(userId);
};

export default {
  blacklistToken,
  isTokenBlacklisted,
  blacklistUserTokens,
  areUserTokensBlacklisted,
  revokeToken,
  revokeUserTokens,
};