// Cart Service for Bluewud Furniture Platform
import apiClient from './api';

interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
  size?: string;
  color?: string;
  subtotal?: number;
}

interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

interface AddToCartData {
  productId: string;
  quantity: number;
  variantId?: string;
  selectedSize?: string;
  selectedColor?: string;
}

interface UpdateCartItemData {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export const cartService = {
  // Get user's cart
  async getCart(): Promise<Cart> {
    const response = await apiClient.get('/cart');
    return response.data;
  },

  // Add item to cart
  async addToCart(data: AddToCartData): Promise<Cart> {
    const response = await apiClient.post('/cart/items', data);
    return response.data;
  },

  // Update cart item
  async updateCartItem(cartItemId: string, data: UpdateCartItemData): Promise<Cart> {
    const response = await apiClient.put(`/cart/items/${cartItemId}`, data);
    return response.data;
  },

  // Remove item from cart
  async removeCartItem(cartItemId: string): Promise<Cart> {
    const response = await apiClient.delete(`/cart/items/${cartItemId}`);
    return response.data;
  },

  // Clear entire cart
  async clearCart(): Promise<void> {
    await apiClient.delete('/cart');
  },

  // Get cart item count
  async getCartItemCount(): Promise<number> {
    const response = await apiClient.get('/cart/count');
    return response.data.count;
  },

  // Apply coupon to cart
  async applyCoupon(couponCode: string): Promise<Cart> {
    const response = await apiClient.post('/cart/apply-coupon', { couponCode });
    return response.data;
  },

  // Remove coupon from cart
  async removeCoupon(): Promise<Cart> {
    const response = await apiClient.delete('/cart/coupon');
    return response.data;
  },

  // Get cart recommendations
  async getCartRecommendations(): Promise<any[]> {
    const response = await apiClient.get('/cart/recommendations');
    return response.data;
  },
};
