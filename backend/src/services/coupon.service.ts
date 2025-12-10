// ============================================
// COUPON/DISCOUNT SERVICE
// ============================================

import { query } from '../config/database';
import { AppError } from '../middleware/error.middleware';

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order_value?: number;
  max_discount?: number;
  usage_limit?: number;
  used_count: number;
  valid_from: Date;
  valid_until: Date;
  is_active: boolean;
}

// Create Coupon (Admin)
export const createCoupon = async (
  code: string,
  type: 'percentage' | 'fixed',
  value: number,
  minOrderValue?: number,
  maxDiscount?: number,
  usageLimit?: number,
  validFrom?: Date,
  validUntil?: Date
): Promise<Coupon> => {
  // Check if code already exists
  const existing = await query(
    `SELECT id FROM coupons WHERE UPPER(code) = UPPER(?)`,
    [code]
  );

  if (existing.rows.length > 0) {
    throw new AppError('Coupon code already exists', 400);
  }

  const result = await query(
    `INSERT INTO coupons (
       code, type, value, min_order_value, max_discount, 
       usage_limit, valid_from, valid_until, created_at
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
     RETURNING *`,
    [
      code.toUpperCase(),
      type,
      value,
      minOrderValue || null,
      maxDiscount || null,
      usageLimit || null,
      validFrom || new Date(),
      validUntil || null,
    ]
  );

  return result.rows[0];
};

// Validate Coupon
export const validateCoupon = async (
  code: string,
  userId: string,
  cartTotal: number
): Promise<{ valid: boolean; coupon?: Coupon; discount?: number; message?: string }> => {
  const result = await query(
    `SELECT * FROM coupons WHERE UPPER(code) = UPPER(?) AND is_active = true`,
    [code]
  );

  if (result.rows.length === 0) {
    return { valid: false, message: 'Invalid coupon code' };
  }

  const coupon = result.rows[0];

  // Check validity dates
  const now = new Date();
  if (coupon.valid_from && new Date(coupon.valid_from) > now) {
    return { valid: false, message: 'Coupon not yet valid' };
  }

  if (coupon.valid_until && new Date(coupon.valid_until) < now) {
    return { valid: false, message: 'Coupon has expired' };
  }

  // Check usage limit
  if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
    return { valid: false, message: 'Coupon usage limit reached' };
  }

  // Check minimum order value
  if (coupon.min_order_value && cartTotal < coupon.min_order_value) {
    return {
      valid: false,
      message: `Minimum order value of ₹${coupon.min_order_value} required`,
    };
  }

  // Check if user already used this coupon
  const userUsage = await query(
    `SELECT COUNT(*) as count FROM orders 
     WHERE user_id = ? AND coupon_code = ?`,
    [userId, code]
  );

  if (parseInt(userUsage.rows[0].count) > 0) {
    return { valid: false, message: 'You have already used this coupon' };
  }

  // Calculate discount
  let discount = 0;
  if (coupon.type === 'percentage') {
    discount = (cartTotal * coupon.value) / 100;
    if (coupon.max_discount) {
      discount = Math.min(discount, coupon.max_discount);
    }
  } else {
    discount = coupon.value;
  }

  // Ensure discount doesn't exceed cart total
  discount = Math.min(discount, cartTotal);

  return {
    valid: true,
    coupon,
    discount: Math.round(discount * 100) / 100,
    message: 'Coupon applied successfully',
  };
};

// Apply Coupon (mark as used)
export const applyCoupon = async (code: string): Promise<void> => {
  await query(
    `UPDATE coupons SET used_count = used_count + 1 WHERE UPPER(code) = UPPER(?)`,
    [code]
  );
};

// Get All Coupons (Admin)
export const getAllCoupons = async (): Promise<Coupon[]> => {
  const result = await query(
    `SELECT * FROM coupons ORDER BY created_at DESC`
  );

  return result.rows;
};

// Get Active Coupons (Public)
export const getActiveCoupons = async (): Promise<Coupon[]> => {
  const result = await query(
    `SELECT code, type, value, min_order_value, valid_until
     FROM coupons 
     WHERE is_active = true 
       AND (valid_from IS NULL OR valid_from <= datetime('now'))
       AND (valid_until IS NULL OR valid_until >= datetime('now'))
       AND (usage_limit IS NULL OR used_count < usage_limit)
     ORDER BY created_at DESC`
  );

  return result.rows;
};

// Update Coupon (Admin)
export const updateCoupon = async (
  id: string,
  updates: Partial<Coupon>
): Promise<Coupon> => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  if (updates.value !== undefined) {
    fields.push(`value = $${paramCount++}`);
    values.push(updates.value);
  }
  if (updates.is_active !== undefined) {
    fields.push(`is_active = $${paramCount++}`);
    values.push(updates.is_active);
  }
  if (updates.usage_limit !== undefined) {
    fields.push(`usage_limit = $${paramCount++}`);
    values.push(updates.usage_limit);
  }

  if (fields.length === 0) {
    throw new AppError('No fields to update', 400);
  }

  values.push(id);
  const result = await query(
    `UPDATE coupons SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
    throw new AppError('Coupon not found', 404);
  }

  return result.rows[0];
};

// Delete Coupon (Admin)
export const deleteCoupon = async (id: string): Promise<void> => {
  const result = await query(`DELETE FROM coupons WHERE id = ?`, [id]);

  if (result.rowCount === 0) {
    throw new AppError('Coupon not found', 404);
  }
};

export default {
  createCoupon,
  validateCoupon,
  applyCoupon,
  getAllCoupons,
  getActiveCoupons,
  updateCoupon,
  deleteCoupon,
};
