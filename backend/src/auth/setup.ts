// ============================================
// AUTHENTICATION SYSTEM - COMPLETE SETUP
// ============================================

// This file consolidates all authentication components
// including services, middleware, controllers, and utilities

import express from 'express';
import { Request, Response } from 'express';

// Import authentication middleware
import { 
  authenticate, 
  requireRole, 
  requireAdmin, 
  requireAdminOrEditor, 
  optionalAuth 
} from '../middleware/auth.middleware';

// Import authentication services
import * as authService from '../services/auth.service';
import * as tokenService from '../services/token.service';
import * as emailService from '../services/email.service';

// Import authentication controller
import * as authController from '../controllers/auth.controller';

// Import utilities
import { sendSuccess, sendError } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';
import { AuthRequest } from '../types';

// Export all authentication components
export {
  // Middleware
  authenticate,
  requireRole,
  requireAdmin,
  requireAdminOrEditor,
  optionalAuth,
  
  // Services
  authService,
  tokenService,
  emailService,
  
  // Controllers
  authController,
  
  // Utilities
  sendSuccess,
  sendError,
  asyncHandler,
};

// Role-based access helpers
export const hasRole = (user: { role: string }, role: string) => user.role === role;
export const hasAnyRole = (user: { role: string }, roles: string[]) => roles.includes(user.role);
export const getUser = (req: Request) => (req as AuthRequest).user || null;
export const isAuthenticated = (req: Request) => !!(req as AuthRequest).user;

// Authentication utilities
export const authUtils = {
  hasRole,
  hasAnyRole,
  getUser,
  isAuthenticated,
};

// Setup authentication routes
export const setupAuthRoutes = (app: express.Application) => {
  const authRoutes = require('../routes/auth.routes');
  app.use('/api/auth', authRoutes);
  console.log('🔐 Authentication routes setup complete');
};

// Export default object with all auth functionality
export default {
  middleware: {
    authenticate,
    requireRole,
    requireAdmin,
    requireAdminOrEditor,
    optionalAuth,
  },
  services: {
    auth: authService,
    token: tokenService,
    email: emailService,
  },
  controllers: {
    auth: authController,
  },
  utils: {
    sendSuccess,
    sendError,
    asyncHandler,
    authUtils,
  },
  setupAuthRoutes,
};