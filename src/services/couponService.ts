// Coupon Service for Bluewud Furniture Platform
import apiClient from './api';

interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  validFrom?: string;
  validUntil?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ValidateCouponResponse {
  isValid: boolean;
  discountAmount: number;
  errorMessage?: string;
  coupon?: Coupon;
}

export const couponService = {
  // Validate coupon code
  async validateCoupon(code: string, cartTotal: number = 0): Promise<ValidateCouponResponse> {
    const response = await apiClient.post('/coupons/validate', {
      code,
      cartTotal
    });
    return response.data;
  },

  // Apply coupon to cart
  async applyCoupon(code: string): Promise<any> {
    const response = await apiClient.post('/cart/apply-coupon', {
      code
    });
    return response.data;
  },

  // Get all active coupons
  async getActiveCoupons(): Promise<Coupon[]> {
    const response = await apiClient.get('/coupons/active');
    return response.data;
  },

  // Get coupon by code
  async getCouponByCode(code: string): Promise<Coupon | null> {
    try {
      const response = await apiClient.get(`/coupons/code/${code}`);
      return response.data;
    } catch (error) {
      if ((error as any).response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Create a new coupon (admin only)
  async createCoupon(couponData: Omit<Coupon, 'id' | 'usedCount' | 'createdAt' | 'updatedAt'>): Promise<Coupon> {
    const response = await apiClient.post('/coupons', couponData);
    return response.data;
  },

  // Update a coupon (admin only)
  async updateCoupon(couponId: string, couponData: Partial<Coupon>): Promise<Coupon> {
    const response = await apiClient.put(`/coupons/${couponId}`, couponData);
    return response.data;
  },

  // Delete a coupon (admin only)
  async deleteCoupon(couponId: string): Promise<void> {
    await apiClient.delete(`/coupons/${couponId}`);
  },

  // Get user's coupon history
  async getUserCouponHistory(): Promise<Coupon[]> {
    const response = await apiClient.get('/coupons/user/history');
    return response.data;
  },

  // Get coupon usage stats (admin only)
  async getCouponStats(): Promise<any> {
    const response = await apiClient.get('/admin/coupons/stats');
    return response.data;
  },
};
