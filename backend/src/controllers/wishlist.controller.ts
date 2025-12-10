// ============================================
// WISHLIST CONTROLLER
// ============================================

import { Response } from 'express';
import { AuthRequest } from '../types';
import * as wishlistService from '../services/wishlist.service';
import { sendSuccess, sendCreated, sendNoContent, sendError } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';

// Get user wishlist
export const getWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'Not authenticated', 401);
    return;
  }
  const wishlist = await wishlistService.getUserWishlist(req.user.id);
  sendSuccess(res, wishlist);
});

// Get wishlist count
export const getWishlistCount = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'Not authenticated', 401);
    return;
  }
  const count = await wishlistService.getWishlistCount(req.user.id);
  sendSuccess(res, { count });
});

// Add product to wishlist
export const addToWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'Not authenticated', 401);
    return;
  }
  const { productId, product_id } = req.body;
  const pid = productId || product_id;
  await wishlistService.addToWishlist(req.user.id, pid);
  sendCreated(res, { success: true }, 'Added to wishlist');
});

// Remove product from wishlist
export const removeFromWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'Not authenticated', 401);
    return;
  }
  const { productId } = req.params;
  await wishlistService.removeFromWishlist(req.user.id, productId);
  sendNoContent(res);
});

// Remove from wishlist by item ID
export const removeFromWishlistById = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'Not authenticated', 401);
    return;
  }
  const { wishlistItemId } = req.params;
  await wishlistService.removeFromWishlistById(req.user.id, wishlistItemId);
  sendNoContent(res);
});

// Check if product is in wishlist
export const checkWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'Not authenticated', 401);
    return;
  }
  const { productId } = req.params;
  const isInWishlist = await wishlistService.isInWishlist(req.user.id, productId);
  sendSuccess(res, { isInWishlist });
});

// Clear wishlist
export const clearWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'Not authenticated', 401);
    return;
  }
  await wishlistService.clearWishlist(req.user.id);
  sendNoContent(res);
});

export default {
  getWishlist,
  getWishlistCount,
  addToWishlist,
  removeFromWishlist,
  removeFromWishlistById,
  checkWishlist,
  clearWishlist,
};
