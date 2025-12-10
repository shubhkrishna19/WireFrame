// API Configuration for Bluewud Furniture Platform
import { Product, User, UserAddress, Review, Order, Cart } from '../types/apiTypes';

// Define all API interfaces
export interface IAuthService {
  login(credentials: { email: string; password: string }): Promise<{ user: User; token: string }>;
  register(userData: { email: string; password: string; name: string; phone?: string }): Promise<{ user: User; token: string }>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User>;
  updateUser(userId: string, updates: Partial<User>): Promise<User>;
  changePassword(currentPassword: string, newPassword: string): Promise<void>;
}

export interface IProductService {
  getProducts(filters?: any, page?: number, limit?: number): Promise<{ data: Product[]; pagination: any }>;
  getProductById(id: string): Promise<Product>;
  getProductBySlug(slug: string): Promise<Product>;
  searchProducts(query: string, limit?: number): Promise<Product[]>;
  getCategories(): Promise<any[]>;
}

export interface ICartService {
  getCart(): Promise<Cart>;
  addToCart(data: { productId: string; quantity: number; selectedSize?: string; selectedColor?: string }): Promise<Cart>;
  updateCartItem(cartItemId: string, data: { quantity: number; selectedSize?: string; selectedColor?: string }): Promise<Cart>;
  removeCartItem(cartItemId: string): Promise<Cart>;
  clearCart(): Promise<void>;
  getCartItemCount(): Promise<number>;
}

export interface IOrderService {
  createOrder(data: any): Promise<Order>;
  getOrders(page?: number, limit?: number): Promise<{ data: Order[]; pagination: any }>;
  getOrderById(orderId: string): Promise<Order>;
}

export interface IWishlistService {
  getWishlist(): Promise<any[]>;
  addToWishlist(productId: string): Promise<any>;
  removeFromWishlist(wishlistItemId: string): Promise<void>;
  isInWishlist(productId: string): Promise<boolean>;
  getWishlistCount(): Promise<number>;
}

export interface IReviewService {
  getProductReviews(productId: string, page?: number, limit?: number): Promise<{ data: Review[]; pagination: any }>;
  createReview(reviewData: any): Promise<Review>;
}

export interface ICouponService {
  validateCoupon(code: string, cartTotal?: number): Promise<any>;
  applyCoupon(code: string): Promise<any>;
}

export interface IAddressService {
  getUserAddresses(): Promise<UserAddress[]>;
  createAddress(addressData: any): Promise<UserAddress>;
  updateAddress(addressId: string, addressData: Partial<UserAddress>): Promise<UserAddress>;
  deleteAddress(addressId: string): Promise<void>;
  setDefaultAddress(addressId: string): Promise<UserAddress>;
}

// Export all service implementations
export { authService } from './authService';
export { productService } from './productService';
export { cartService } from './cartService';
export { orderService } from './orderService';
export { wishlistService } from './wishlistService';
export { reviewService } from './reviewService';
export { couponService } from './couponService';
export { addressService } from './addressService';
