// Order types and interfaces for the ecommerce application

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded';

export type PaymentMethod = 'cod' | 'card' | 'upi' | 'wallet' | 'netbanking';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  productId: string;
  productName: string;
  productSlug?: string;
  productImage?: string;
  size: string;
  color: string;
  quantity: number;
  price: number; // Price per unit at time of order
  subtotal: number; // price * quantity
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  type: 'home' | 'work' | 'other';
  phone?: string;
  name?: string;
}

export interface Order {
  _id: string;
  orderNumber: string; // Human-readable order number (e.g., ORD-2025-001)
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress; // Optional, defaults to shipping address
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  subtotal: number; // Sum of all item subtotals
  shipping: number; // Shipping charges
  tax: number; // Tax amount
  discount: number; // Discount/coupon amount
  total: number; // Final amount
  trackingNumber?: string;
  estimatedDelivery?: number; // Timestamp
  notes?: string;
  cancelledAt?: number;
  cancelledReason?: string;
  createdAt: number;
  updatedAt: number;
}

export interface OrderSummary {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalSpent: number;
}

