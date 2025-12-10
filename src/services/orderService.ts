// Order Service for Bluewud Furniture Platform
import apiClient from './api';
import { Order } from '../types/apiTypes';

interface CreateOrderData {
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  billingAddress?: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  couponCode?: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }>;
}

export const orderService = {
  // Create new order
  async createOrder(data: CreateOrderData): Promise<Order> {
    const payload = {
      ...data,
      shipping_address: {
        full_name: data.shippingAddress.fullName,
        phone: data.shippingAddress.phone,
        street: data.shippingAddress.street,
        city: data.shippingAddress.city,
        state: data.shippingAddress.state,
        postal_code: data.shippingAddress.postalCode,
        country: data.shippingAddress.country,
      },
      billing_address: data.billingAddress ? {
        full_name: data.billingAddress.fullName,
        phone: data.billingAddress.phone,
        street: data.billingAddress.street,
        city: data.billingAddress.city,
        state: data.billingAddress.state,
        postal_code: data.billingAddress.postalCode,
        country: data.billingAddress.country,
      } : undefined,
      payment_method: data.paymentMethod,
      coupon_code: data.couponCode,
      items: data.items.map(item => ({
        product_id: item.productId,
        quantity: item.quantity,
        selected_size: item.size,
        selected_color: item.color,
      })),
    };
    const response = await apiClient.post('/orders', payload);
    return response.data;
  },

  // Create guest order
  async createGuestOrder(guestEmail: string, guestSessionId: string, data: CreateOrderData): Promise<Order> {
    const payload = {
      guestEmail,
      guestSessionId,
      shipping_address: {
        full_name: data.shippingAddress.fullName,
        phone: data.shippingAddress.phone,
        street: data.shippingAddress.street,
        city: data.shippingAddress.city,
        state: data.shippingAddress.state,
        postal_code: data.shippingAddress.postalCode,
        country: data.shippingAddress.country,
      },
      billing_address: data.billingAddress ? {
        full_name: data.billingAddress.fullName,
        phone: data.billingAddress.phone,
        street: data.billingAddress.street,
        city: data.billingAddress.city,
        state: data.billingAddress.state,
        postal_code: data.billingAddress.postalCode,
        country: data.billingAddress.country,
      } : undefined,
      payment_method: data.paymentMethod,
      coupon_code: data.couponCode,
      items: data.items.map(item => ({
        product_id: item.productId,
        quantity: item.quantity,
        selected_size: item.size,
        selected_color: item.color,
      })),
    };
    const response = await apiClient.post('/orders/guest', payload);
    return response.data;
  },

  // Link guest orders
  async linkGuestOrders(guestEmail: string): Promise<{ linkedCount: number }> {
    const response = await apiClient.post('/orders/link-guest-orders', { guestEmail });
    return response.data;
  },

  // Get guest session orders
  async getGuestSessionOrders(sessionId: string): Promise<Order[]> {
    const response = await apiClient.get(`/orders/guest/session/${sessionId}`);
    return response.data;
  },

  // Get user's orders
  async getOrders(page: number = 1, limit: number = 10): Promise<{
    data: Order[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const response = await apiClient.get('/orders', {
      params: { page, limit }
    });
    return response.data;
  },

  // Get order by ID
  async getOrderById(orderId: string): Promise<Order> {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  },

  // Get order by number
  async getOrderByNumber(orderNumber: string): Promise<Order> {
    const response = await apiClient.get(`/orders/number/${orderNumber}`);
    return response.data;
  },

  // Cancel order
  async cancelOrder(orderId: string): Promise<Order> {
    const response = await apiClient.put(`/orders/${orderId}/cancel`);
    return response.data;
  },

  // Track order
  async trackOrder(orderId: string): Promise<any> {
    const response = await apiClient.get(`/orders/${orderId}/track`);
    return response.data;
  },
};
