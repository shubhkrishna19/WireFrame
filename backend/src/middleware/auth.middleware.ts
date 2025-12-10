// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================

import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { verifyAccessToken } from '../utils/jwt.util';
import { sendUnauthorized, sendForbidden } from '../utils/response.util';
import { logger } from '../config/logger';

// Authenticate user (verify JWT token)
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendUnauthorized(res, 'No token provided');
      return;
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyAccessToken(token);

    // Attach user info to request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error: any) {
    logger.warn('Authentication failed:', error.message);
    sendUnauthorized(res, error.message || 'Invalid token');
  }
};

// Require specific role
export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendUnauthorized(res, 'User not authenticated');
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendForbidden(res, 'Insufficient permissions');
      return;
    }

    next();
  };
};

// Require admin role
export const requireAdmin = requireRole('admin');

// Require admin or editor role
export const requireAdminOrEditor = requireRole('admin', 'editor');

// Optional authentication (don't fail if no token)
export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyAccessToken(token);
      
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
    }
    
    next();
  } catch (error) {
    // Continue without user info
    next();
  }
};

export default {
  authenticate,
  requireRole,
  requireAdmin,
  requireAdminOrEditor,
  optionalAuth,
};
