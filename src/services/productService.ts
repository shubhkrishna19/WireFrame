// Product Service for Bluewud Furniture Platform
import apiClient from './api';
import { Product, Category } from '../data/mockData';

interface ProductFilters {
  category?: string;
  search?: string;
  priceMin?: number;
  priceMax?: number;
  brands?: string[];
  minRating?: number;
  sizes?: string[];
  colors?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface ProductResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const productService = {
  // Get all products with filters and pagination
  async getProducts(filters?: ProductFilters, page: number = 1, limit: number = 20): Promise<ProductResponse> {
    const params: any = {
      page,
      limit,
      ...filters,
    };

    // Clean up undefined/null params
    Object.keys(params).forEach(key => {
      if (params[key] === undefined || params[key] === null) {
        delete params[key];
      }
    });

    const response = await apiClient.get('/products', { params });
    return response.data;
  },

  // Get featured products
  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    const response = await apiClient.get('/products/featured', { params: { limit } });
    return response.data;
  },

  // Get product by ID
  async getProductById(id: string): Promise<Product> {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // Get product by slug
  async getProductBySlug(slug: string): Promise<Product> {
    const response = await apiClient.get(`/products/slug/${slug}`);
    return response.data;
  },

  // Search products
  async searchProducts(query: string, limit: number = 10): Promise<Product[]> {
    const response = await apiClient.get('/products/search', {
      params: { q: query, limit }
    });
    return response.data;
  },

  // Get products by category
  async getProductsByCategory(categorySlug: string, page: number = 1, limit: number = 20): Promise<ProductResponse> {
    const response = await apiClient.get(`/products/category/${categorySlug}`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Get related products
  async getRelatedProducts(productId: string, limit: number = 4): Promise<Product[]> {
    const response = await apiClient.get(`/products/${productId}/related`, {
      params: { limit }
    });
    return response.data;
  },

  // Get all categories
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  // Get category by slug
  async getCategoryBySlug(slug: string): Promise<Category> {
    const response = await apiClient.get(`/categories/${slug}`);
    return response.data;
  },

  // Get products by category ID
  async getProductsByCategoryId(categoryId: string, page: number = 1, limit: number = 20): Promise<ProductResponse> {
    const response = await apiClient.get('/products', {
      params: { categoryId, page, limit }
    });
    return response.data;
  },

  // Get product reviews
  async getProductReviews(productId: string, page: number = 1, limit: number = 10): Promise<any> {
    const response = await apiClient.get(`/reviews/product/${productId}`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Add product review
  async addProductReview(productId: string, reviewData: {
    rating: number;
    title: string;
    comment: string;
    images?: string[];
  }): Promise<any> {
    const response = await apiClient.post(`/reviews/product/${productId}`, reviewData);
    return response.data;
  },

  // Get product variants
  async getProductVariants(productId: string): Promise<any[]> {
    const response = await apiClient.get(`/products/${productId}/variants`);
    return response.data;
  },

  // Get product images
  async getProductImages(productId: string): Promise<any[]> {
    const response = await apiClient.get(`/products/${productId}/images`);
    return response.data;
  },
};
