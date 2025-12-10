// ============================================
// COUPON CONTROLLER
// ============================================

import { Response } from 'express';
import { AuthRequest } from '../types';
import * as couponService from '../services/coupon.service';
import { sendSuccess, sendError } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';

// Validate Coupon (Customer)
export const validateCoupon = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    sendError(res, 'Not authenticated', 401);
    return;
  }

  const { code, cart_total } = req.body;
  const result = await couponService.validateCoupon(code, req.user.id, cart_total);

  if (!result.valid) {
    sendError(res, result.message || 'Invalid coupon', 400);
    return;
  }

  sendSuccess(res, {
    discount: result.discount,
    final_total: cart_total - (result.discount || 0),
    coupon: result.coupon,
  }, result.message);
});

// Get Active Coupons (Public)
export const getActiveCoupons = asyncHandler(async (req: AuthRequest, res: Response) => {
  const coupons = await couponService.getActiveCoupons();
  sendSuccess(res, coupons, 'Active coupons fetched');
});

// Create Coupon (Admin)
export const createCoupon = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    code,
    type,
    value,
    min_order_value,
    max_discount,
    usage_limit,
    valid_from,
    valid_until,
  } = req.body;

  const coupon = await couponService.createCoupon(
    code,
    type,
    value,
    min_order_value,
    max_discount,
    usage_limit,
    valid_from,
    valid_until
  );

  sendSuccess(res, coupon, 'Coupon created successfully', 201);
});

// Get All Coupons (Admin)
export const getAllCoupons = asyncHandler(async (req: AuthRequest, res: Response) => {
  const coupons = await couponService.getAllCoupons();
  sendSuccess(res, coupons, 'Coupons fetched successfully');
});

// Update Coupon (Admin)
export const updateCoupon = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const coupon = await couponService.updateCoupon(id, updates);
  sendSuccess(res, coupon, 'Coupon updated successfully');
});

// Delete Coupon (Admin)
export const deleteCoupon = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await couponService.deleteCoupon(id);
  sendSuccess(res, null, 'Coupon deleted successfully');
});

export default {
  validateCoupon,
  getActiveCoupons,
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
};
