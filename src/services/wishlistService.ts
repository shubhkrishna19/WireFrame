// Wishlist Service for Bluewud Furniture Platform
import apiClient from './api';
import { Product } from '../data/mockData';

interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  createdAt: string;
}

export const wishlistService = {
  // Get user's wishlist
  async getWishlist(): Promise<WishlistItem[]> {
    const response = await apiClient.get('/wishlist');
    const apiResponse = response.data;
    // Backend wraps as { success, data: { items, count } }
    const payload = apiResponse?.data ?? apiResponse;
    return (payload.items ?? payload) as WishlistItem[];
  },

  // Add product to wishlist
  async addToWishlist(productId: string): Promise<WishlistItem> {
    const response = await apiClient.post('/wishlist', { productId });
    const apiResponse = response.data;
    const payload = apiResponse?.data ?? apiResponse;
    return payload as WishlistItem;
  },

  // Remove product from wishlist
  async removeFromWishlist(wishlistItemId: string): Promise<void> {
    await apiClient.delete(`/wishlist/${wishlistItemId}`);
  },

  // Check if product is in wishlist
  async isInWishlist(productId: string): Promise<boolean> {
    try {
      const response = await apiClient.get(`/wishlist/product/${productId}`);
      const apiResponse = response.data;
      const payload = apiResponse?.data ?? apiResponse;
      // Controller returns { in_wishlist: boolean }
      return !!(payload.in_wishlist ?? payload.inWishlist);
    } catch (error) {
      // If the request fails, assume the product is not in wishlist
      return false;
    }
  },

  // Get wishlist count
  async getWishlistCount(): Promise<number> {
    const response = await apiClient.get('/wishlist/count');
    const apiResponse = response.data;
    const payload = apiResponse?.data ?? apiResponse;
    return typeof payload.count === 'number' ? payload.count : 0;
  },

  // Move wishlist item to cart
  async moveToCart(wishlistItemId: string): Promise<any> {
    const response = await apiClient.post(`/wishlist/${wishlistItemId}/move-to-cart`);
    const apiResponse = response.data;
    return apiResponse?.data ?? apiResponse;
  },
};

