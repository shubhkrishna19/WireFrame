// ============================================
// JWT UTILITY FUNCTIONS
// ============================================

import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { JWTPayload, RefreshTokenPayload } from '../types';

// Generate access token
export const generateAccessToken = (payload: JWTPayload): string => {
  const tokenPayload = {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  };
  return jwt.sign(tokenPayload, config.jwt.secret, { expiresIn: config.jwt.expiresIn } as any);
};

// Generate refresh token
export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
  const tokenPayload = {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    tokenVersion: payload.tokenVersion,
  };
  return jwt.sign(tokenPayload, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiresIn } as any);
};

// Generate both tokens
export const generateTokens = (
  userId: string,
  email: string,
  role: string
): { accessToken: string; refreshToken: string } => {
  const payload: JWTPayload = { userId, email, role };
  const refreshPayload: RefreshTokenPayload = { ...payload, tokenVersion: 1 };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(refreshPayload),
  };
};

// Verify access token
export const verifyAccessToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, config.jwt.secret) as JWTPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw error;
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  try {
    return jwt.verify(token, config.jwt.refreshSecret) as RefreshTokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid refresh token');
    }
    throw error;
  }
};

// Decode token without verification (for debugging)
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  return decoded.exp * 1000 < Date.now();
};

export default {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
  isTokenExpired,
};
