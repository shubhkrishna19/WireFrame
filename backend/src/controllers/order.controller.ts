// ============================================
// ORDER CONTROLLER
// ============================================

import { Response } from 'express';
import { AuthRequest } from '../types';
import * as orderService from '../services/order.service';
import { sendSuccess, sendCreated, sendNotFound, sendError } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';

// Create new order
export const createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'User not authenticated', 401);
    return;
  }
  const order = await orderService.createOrder(req.user.id, req.body);
  sendCreated(res, order, 'Order created successfully');
});

// Get user's orders
export const getUserOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'User not authenticated', 401);
    return;
  }
  const orders = await orderService.getUserOrders(req.user.id);
  sendSuccess(res, orders);
});

// Get order by ID
export const getOrderById = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'User not authenticated', 401);
    return;
  }
  const { id } = req.params;
  const order = await orderService.getOrderById(id, req.user.id);
  if (!order) {
    sendNotFound(res, 'Order not found');
    return;
  }
  sendSuccess(res, order);
});

// Cancel order
export const cancelOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'User not authenticated', 401);
    return;
  }
  const { id } = req.params;
  const order = await orderService.cancelOrder(id, req.user.id);
  sendSuccess(res, order, 'Order cancelled successfully');
});

// Get all orders (admin)
export const getAllOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 20, status, payment_status } = req.query;
  const result = await orderService.getAllOrders(
    { status: status as any, payment_status: payment_status as any },
    { page: Number(page), limit: Number(limit) }
  );
  sendSuccess(res, result);
});

// Update order status (admin)
export const updateOrderStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = await orderService.updateOrderStatus(id, status);
  sendSuccess(res, order, 'Order status updated');
});

// Create guest order (no authentication required)
export const createGuestOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { guestEmail, guestSessionId, ...orderData } = req.body;

  if (!guestEmail || !guestSessionId) {
    sendError(res, 'Guest email and session ID are required', 400);
    return;
  }

  const order = await orderService.createGuestOrder(guestEmail, guestSessionId, orderData);
  sendCreated(res, order, 'Guest order created successfully');
});

// Link guest orders to user account (called after registration)
export const linkGuestOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'User not authenticated', 401);
    return;
  }

  const { guestEmail } = req.body;

  if (!guestEmail) {
    sendError(res, 'Guest email is required', 400);
    return;
  }

  const linkedCount = await orderService.linkGuestOrdersToUser(guestEmail, req.user.id);
  sendSuccess(res, { linkedCount }, `${linkedCount} guest order(s) linked to your account`);
});

// Get guest orders by session (for tracking without login)
export const getGuestSessionOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    sendError(res, 'Session ID is required', 400);
    return;
  }

  const orders = await orderService.getGuestOrders(sessionId);
  sendSuccess(res, orders);
});

