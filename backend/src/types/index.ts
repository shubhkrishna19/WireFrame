// ============================================
// MULARY BACKEND - TYPESCRIPT TYPES
// ============================================

import { Request } from 'express';

// ============================================
// USER TYPES
// ============================================

export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  phone?: string;
  role: 'customer' | 'admin' | 'editor';
  avatar_url?: string;
  email_verified: boolean;
  email_verification_token?: string;
  password_reset_token?: string;
  password_reset_expires?: Date;
  is_active: boolean;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface SafeUser extends Omit<User, 'password_hash' | 'password_reset_token' | 'email_verification_token'> { }

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  address_type?: string;
  created_at: Date;
  updated_at: Date;
}

// ============================================
// PRODUCT TYPES
// ============================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  image_url?: string;
  is_active: boolean;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface ProductSpecifications {
  fabric?: string;
  fabricComposition?: string;
  gsm?: number;
  weight?: string;
  fit?: string;
  pattern?: string;
  sleeveLength?: string;
  neckType?: string;
  collarType?: string;
  closure?: string;
  pockets?: string;
  careInstructions?: string[];
  countryOfOrigin?: string;
  season?: string;
  occasion?: string;
  material?: string;
  breathable?: boolean;
  stretchable?: boolean;
  wrinkleFree?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  category_id?: string;
  brand?: string;
  price: number;
  original_price?: number;
  discount_percentage?: number;
  sku: string;
  stock: number;
  rating: number;
  review_count: number;
  thumbnail_url?: string;
  is_active: boolean;
  is_featured: boolean;
  fit_type?: string;
  design?: string;
  sleeve?: string;
  neck?: string;
  type?: string;
  offer?: string;
  specifications?: ProductSpecifications;
  tags?: string[];
  created_at: Date;
  updated_at: Date;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  color?: string;
  is_primary: boolean;
  display_order: number;
  created_at: Date;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  color: string;
  stock: number;
  price_adjustment: number;
  sku?: string;
  image_url?: string;
  created_at: Date;
  updated_at: Date;
}

// ============================================
// CART TYPES
// ============================================

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  selected_size?: string;
  selected_color?: string;
  price_at_add: number;
  created_at: Date;
  updated_at: Date;
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
  variant?: ProductVariant;
}

// ============================================
// ORDER TYPES
// ============================================

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method?: string;
  payment_id?: string;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  shipping_address: Address;
  billing_address?: Address;
  tracking_number?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  variant_id?: string;
  product_name: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  selected_size?: string;
  selected_color?: string;
  created_at: Date;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
  user?: SafeUser;
}

// ============================================
// REVIEW TYPES
// ============================================

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  order_id?: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
  is_verified_purchase: boolean;
  is_approved: boolean;
  helpful_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface ReviewWithUser extends Review {
  user: {
    name: string;
    avatar_url?: string;
  };
}

// ============================================
// PAYMENT TYPES
// ============================================

export interface PaymentTransaction {
  id: string;
  order_id?: string;
  user_id?: string;
  payment_method: string;
  payment_gateway?: string;
  transaction_id?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  gateway_response?: any;
  created_at: Date;
  updated_at: Date;
}

// ============================================
// COUPON TYPES
// ============================================

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase_amount?: number;
  max_discount_amount?: number;
  usage_limit?: number;
  used_count: number;
  valid_from?: Date;
  valid_until?: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// ============================================
// WISHLIST TYPES
// ============================================

export interface Wishlist {
  id: string;
  user_id: string;
  product_id: string;
  created_at: Date;
}

export interface WishlistWithProduct extends Wishlist {
  product: Product;
}

// ============================================
// EMAIL TYPES
// ============================================

export interface EmailQueue {
  id: string;
  to_email: string;
  subject: string;
  body: string;
  template?: string;
  template_data?: any;
  status: 'pending' | 'sent' | 'failed';
  attempts: number;
  error_message?: string;
  sent_at?: Date;
  created_at: Date;
}

export interface EmailTemplate {
  template: string;
  subject: string;
  data: any;
}

// ============================================
// ADMIN TYPES
// ============================================

export interface AdminLog {
  id: string;
  user_id?: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  details?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: OrderWithItems[];
  lowStockProducts: Product[];
  topProducts: Product[];
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ============================================
// FILTER TYPES
// ============================================

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sizes?: string[];
  colors?: string[];
  inStock?: boolean;
  isFeatured?: boolean;
  search?: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  payment_status?: PaymentStatus;
  from_date?: Date;
  to_date?: Date;
  customer_email?: string;
}

// ============================================
// VALIDATION TYPES
// ============================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface CreateProductInput {
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  category_id?: string;
  brand?: string;
  price: number;
  original_price?: number;
  sku: string;
  stock: number;
  images?: string[];
  sizes?: string[];
  colors?: string[];
  specifications?: ProductSpecifications;
  tags?: string[];
}

export interface CreateOrderInput {
  items: {
    product_id: string;
    variant_id?: string;
    quantity: number;
    selected_size?: string;
    selected_color?: string;
  }[];
  shipping_address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
  billing_address?: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
  payment_method: string;
  coupon_code?: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// ============================================
// JWT PAYLOAD
// ============================================

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  exp?: number; // Token expiration timestamp
  iat?: number; // Token issued at timestamp
}

export interface RefreshTokenPayload extends JWTPayload {
  tokenVersion: number;
}

// ============================================
// FILE UPLOAD TYPES
// ============================================

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  url: string;
  public_id?: string;
}

// ============================================
// EXPORTS
// ============================================

export * from './index';
