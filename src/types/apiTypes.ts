// Common types for Bluewud Furniture Platform

// Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
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

// Product and category types
export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  images: string[];
  thumbnail: string;
  sizes: string[];
  colors: string[];
  stock: number;
  sku: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  fitType?: 'Oversized' | 'Slim Fit' | 'Classic' | 'Regular Fit' | 'Relaxed Fit' | 'Athletic Fit' | 'Formal Fit' | 'Skinny Fit';
  customBottomText?: string;
  customStockText?: string;
  colorImages?: Record<string, string[]>; // color -> array of image URLs
  displayTags?: string[]; // Max 2 tags to display on product card
  showDiscount?: boolean;
  discountDisplayText?: string;
  specifications?: {
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
    lining?: string;
    innerMaterial?: string;
    careInstructions?: string[];
    care?: string[];
    countryOfOrigin?: string;
    season?: string;
    occasion?: string;
    material?: string;
    breathable?: boolean;
    stretchable?: boolean;
    wrinkleFree?: boolean;
    waterResistant?: boolean;
    dimensions?: {
      length?: string;
      width?: string;
      height?: string;
    };
  };
  createdAt: number;
  updatedAt: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  displayOrder?: number;
  isActive: boolean;
}

// User types
export interface User {
  _id: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: 'customer' | 'admin';
  avatar?: string;
  emailVerified: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface UserAddress {
  _id: string;
  userId: string;
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  createdAt: number;
  updatedAt: number;
  name?: string;
  phone?: string;
}

// Review types
export interface Review {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  helpfulCount: number;
  createdAt: number;
  updatedAt: number;
}

// Order types
export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod?: string;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  shippingAddress: UserAddress;
  billingAddress?: UserAddress;
  trackingNumber?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// Cart types
export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number; // Price at time of adding to cart
  size?: string;
  color?: string;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Coupon types
export interface Coupon {
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
