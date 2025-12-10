// ============================================
// USER CONTROLLER
// ============================================

import { Response } from 'express';
import { AuthRequest } from '../types';
import * as userService from '../services/user.service';
import { sendSuccess, sendError, sendNoContent } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';

// Get user profile
export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'Not authenticated', 401);
    return;
  }
  const user = await userService.getUserById(req.user.id);
  sendSuccess(res, user);
});

// Update user profile
export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'Not authenticated', 401);
    return;
  }
  const user = await userService.updateProfile(req.user.id, req.body);
  sendSuccess(res, user, 'Profile updated successfully');
});

// Get user addresses
export const getAddresses = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'Not authenticated', 401);
    return;
  }
  const addresses = await userService.getAddresses(req.user.id);
  sendSuccess(res, addresses);
});

// Add new address
export const addAddress = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'Not authenticated', 401);
    return;
  }
  const address = await userService.addAddress(req.user.id, req.body);
  sendSuccess(res, address, 'Address added successfully');
});

// Update address
export const updateAddress = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'Not authenticated', 401);
    return;
  }
  const { id } = req.params;
  const address = await userService.updateAddress(req.user.id, id, req.body);
  sendSuccess(res, address, 'Address updated successfully');
});

// Delete address
export const deleteAddress = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'Not authenticated', 401);
    return;
  }
  const { id } = req.params;
  await userService.deleteAddress(req.user.id, id);
  sendNoContent(res);
});
