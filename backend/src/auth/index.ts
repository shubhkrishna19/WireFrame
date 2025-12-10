// ============================================
// AUTHENTICATION SETUP
// ============================================

import express, { Request, Response, NextFunction } from 'express';
import { authenticate, requireRole, requireAdmin, requireAdminOrEditor, optionalAuth } from '../middleware/auth.middleware';
import * as authService from '../services/auth.service';
import * as tokenService from '../services/token.service';
import * as emailService from '../services/email.service';
import { sendSuccess, sendError } from '../utils/response.util';
import { AuthRequest } from '../types';
import { asyncHandler } from '../middleware/error.middleware';

// Controller functions
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name, phone } = req.body;
  const result = await authService.register(email, password, name, phone);
  sendSuccess(res, result, 'User registered successfully');
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  sendSuccess(res, result, 'Login successful');
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'User not authenticated', 401);
    return;
  }
  await tokenService.revokeUserTokens(req.user.id);
  sendSuccess(res, null, 'Logout successful');
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'User not authenticated', 401);
    return;
  }
  const user = await authService.getUserById(req.user.id);
  sendSuccess(res, user);
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const result = await authService.refreshToken(refreshToken);
  sendSuccess(res, result, 'Token refreshed');
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  await authService.requestPasswordReset(email);
  sendSuccess(res, null, 'Password reset email sent');
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  await authService.resetPassword(token, newPassword);
  sendSuccess(res, null, 'Password reset successful');
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;
  await authService.verifyEmail(token);
  sendSuccess(res, null, 'Email verified successfully');
});

export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'User not authenticated', 401);
    return;
  }
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword(req.user.id, currentPassword, newPassword);
  sendSuccess(res, null, 'Password changed successfully');
});

// Export all authentication-related functionality
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

  // Utilities
  sendSuccess,
  sendError,
  asyncHandler,
};

// Additional authentication utilities
export const authUtils = {
  // Check if user has specific role
  hasRole: (user: { role: string }, role: string) => user.role === role,

  // Check if user has any of the specified roles
  hasAnyRole: (user: { role: string }, roles: string[]) => roles.includes(user.role),

  // Get user from request (returns null if not authenticated)
  getUser: (req: Request) => (req as AuthRequest).user || null,

  // Check if authenticated
  isAuthenticated: (req: Request) => !!(req as AuthRequest).user,
};

// Authentication router setup helper
export const setupAuthRoutes = (app: express.Application) => {
  // Import auth routes
  const authRoutes = require('../routes/auth.routes');
  app.use('/api/auth', authRoutes);

  console.log('🔐 Authentication routes setup complete');
};

export default {
  authenticate,
  requireRole,
  requireAdmin,
  requireAdminOrEditor,
  optionalAuth,
  register,
  login,
  logout,
  getMe,
  refresh,
  forgotPassword,
  resetPassword,
  verifyEmail,
  changePassword,
  setupAuthRoutes,
  authUtils,
};