// ============================================
// ADMIN CONTROLLER
// ============================================

import { Response } from 'express';
import { AuthRequest } from '../types';
import * as adminService from '../services/admin.service';
import { sendSuccess } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';

// Get dashboard stats
export const getDashboardStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const stats = await adminService.getDashboardStats();
  sendSuccess(res, stats);
});

// Get all users
export const getAllUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 20 } = req.query;
  const result = await adminService.getAllUsers({ page: Number(page), limit: Number(limit) });
  sendSuccess(res, result);
});

// Get sales report
export const getSalesReport = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { from, to } = req.query;
  const report = await adminService.getSalesReport(from as string, to as string);
  sendSuccess(res, report);
});
