// Review Service for Bluewud Furniture Platform
import apiClient from './api';

interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

interface CreateReviewData {
  productId: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
}

interface UpdateReviewData {
  rating?: number;
  title?: string;
  comment?: string;
  images?: string[];
}

export const reviewService = {
  // Get product reviews
  async getProductReviews(productId: string, page: number = 1, limit: number = 10): Promise<{
    data: Review[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const response = await apiClient.get(`/reviews/product/${productId}`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Get user's review for a product
  async getUserReviewForProduct(productId: string): Promise<Review | null> {
    try {
      const response = await apiClient.get(`/reviews/product/${productId}/user`);
      return response.data;
    } catch (error) {
      if ((error as any).response?.status === 404) {
        return null; // User hasn't reviewed this product
      }
      throw error;
    }
  },

  // Create a review
  async createReview(reviewData: CreateReviewData): Promise<Review> {
    const response = await apiClient.post('/reviews', reviewData);
    return response.data;
  },

  // Update a review
  async updateReview(reviewId: string, reviewData: UpdateReviewData): Promise<Review> {
    const response = await apiClient.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  // Delete a review
  async deleteReview(reviewId: string): Promise<void> {
    await apiClient.delete(`/reviews/${reviewId}`);
  },

  // Mark review as helpful
  async markReviewHelpful(reviewId: string): Promise<Review> {
    const response = await apiClient.post(`/reviews/${reviewId}/helpful`);
    return response.data;
  },

  // Get average rating for a product
  async getProductAverageRating(productId: string): Promise<number> {
    const response = await apiClient.get(`/reviews/product/${productId}/average-rating`);
    return response.data.averageRating;
  },

  // Get review statistics for a product
  async getProductReviewStats(productId: string): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingBreakdown: { [key: string]: number };
  }> {
    const response = await apiClient.get(`/reviews/product/${productId}/stats`);
    return response.data;
  },

  // Get user's reviews
  async getUserReviews(page: number = 1, limit: number = 10): Promise<{
    data: Review[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const response = await apiClient.get('/reviews/user', {
      params: { page, limit }
    });
    return response.data;
  },
};
