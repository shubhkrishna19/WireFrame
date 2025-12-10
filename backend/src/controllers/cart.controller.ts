// ============================================
// CART CONTROLLER
// ============================================

import { Response } from 'express';
import { AuthRequest } from '../types';
import * as cartService from '../services/cart.service';
import { sendSuccess, sendCreated, sendNoContent, sendError } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';

// Get user's cart
export const getCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'User not authenticated', 401);
    return;
  }
  const cart = await cartService.getCart(req.user.id);
  sendSuccess(res, cart);
});

// Add item to cart
export const addToCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'User not authenticated', 401);
    return;
  }
  const { product_id, variant_id, quantity, selected_size, selected_color } = req.body;
  const item = await cartService.addToCart(req.user.id, product_id, quantity, selected_size, selected_color, variant_id);
  sendCreated(res, item, 'Item added to cart');
});

// Update cart item
export const updateCartItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'User not authenticated', 401);
    return;
  }
  const { id } = req.params;
  const { quantity } = req.body;
  const item = await cartService.updateCartItem(req.user.id, id, quantity);
  sendSuccess(res, item, 'Cart item updated');
});

// Remove cart item
export const removeCartItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'User not authenticated', 401);
    return;
  }
  const { id } = req.params;
  await cartService.removeCartItem(req.user.id, id);
  sendNoContent(res);
});

// Clear cart
export const clearCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'User not authenticated', 401);
    return;
  }
  await cartService.clearCart(req.user.id);
  sendNoContent(res);
});
