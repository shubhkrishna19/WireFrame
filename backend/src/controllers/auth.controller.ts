// ============================================
// AUTHENTICATION CONTROLLER
// ============================================

import { Response } from 'express';
import { AuthRequest } from '../types';
import * as authService from '../services/auth.service';
import * as tokenService from '../services/token.service';
import { sendSuccess, sendCreated, sendError } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';

// Register new user
export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password, name, phone } = req.body;
  const result = await authService.register(email, password, name, phone);
  sendCreated(res, result, 'User registered successfully');
});

// Login user
export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  sendSuccess(res, result, 'Login successful');
});

// Refresh access token
export const refresh = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { refreshToken } = req.body;
  const result = await authService.refreshToken(refreshToken);
  sendSuccess(res, result, 'Token refreshed');
});

// Get current user
export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'User not authenticated', 401);
    return;
  }
  const user = await authService.getUserById(req.user.id);
  sendSuccess(res, user);
});

// Logout user
export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'User not authenticated', 401);
    return;
  }

  // Blacklist all tokens for this user (logout from all devices)
  await tokenService.revokeUserTokens(req.user.id);

  sendSuccess(res, null, 'Logout successful');
});

// Request password reset
export const forgotPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email } = req.body;
  await authService.requestPasswordReset(email);
  sendSuccess(res, null, 'Password reset email sent');
});

// Reset password with token
export const resetPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { token, newPassword } = req.body;
  await authService.resetPassword(token, newPassword);
  sendSuccess(res, null, 'Password reset successful');
});

// Verify email with token
export const verifyEmail = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { token } = req.params;
  await authService.verifyEmail(token);
  sendSuccess(res, null, 'Email verified successfully');
});

// Change password
export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'User not authenticated', 401);
    return;
  }
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword(req.user.id, currentPassword, newPassword);
  sendSuccess(res, null, 'Password changed successfully');
});
