// API-based data store using the new service layer with fallback to mock data
import { Product, Category, UserAddress, Review, User, mockProducts, mockCategories } from '../data/mockData';
import { productService } from '../services/productService';
import { addressService } from '../services/addressService';
import { reviewService } from '../services/reviewService';
import { authService } from '../services/authService';
import { logger } from '../utils/logger';


// Initialize storage
export const initializeStore = () => {
  // No initialization needed as we're using API calls
  // Tokens will be stored in localStorage/sessionStorage by auth service
};

// Product management using API with fallback to mock data
export const getProducts = async (filters?: {
  categoryId?: string;
  search?: string;
  priceMin?: number;
  priceMax?: number;
  brands?: string[];
  minRating?: number;
  sizes?: string[];
  colors?: string[];
  materials?: string[];
  finishes?: string[];
  styles?: string[];
  rooms?: string[];
  tags?: string[];
}, page: number = 1, limit: number = 20) => {
  try {
    const result = await productService.getProducts(filters, page, limit);
    return result.data;
  } catch (error) {
    console.error('Error fetching products from API:', error);
    logger.log('Falling back to mock data. Total products:', mockProducts.length);

    // Filter mock products based on the provided filters as fallback
    let filteredProducts = [...mockProducts];

    if (filters?.categoryId) {
      filteredProducts = filteredProducts.filter(product => product.categoryId === filters.categoryId);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (filters?.priceMin !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.price >= filters.priceMin!);
    }

    if (filters?.priceMax !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.price <= filters.priceMax!);
    }

    if (filters?.brands && filters.brands.length > 0) {
      filteredProducts = filteredProducts.filter(product => filters.brands!.includes(product.brand));
    }

    if (filters?.minRating !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.rating >= filters.minRating!);
    }

    if (filters?.sizes && filters.sizes.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        product.sizes.some(size => filters.sizes!.includes(size))
      );
    }

    if (filters?.colors && filters.colors.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        product.colors.some(color => filters.colors!.includes(color))
      );
    }

    if (filters?.materials && filters.materials.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        product.specifications?.material && filters.materials!.includes((product.specifications as any).material)
      );
    }

    if (filters?.finishes && filters.finishes.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        product.specifications?.finish && filters.finishes!.includes((product.specifications as any).finish)
      );
    }

    if (filters?.styles && filters.styles.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        product.specifications?.style && filters.styles!.includes((product.specifications as any).style)
      );
    }

    if (filters?.rooms && filters.rooms.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        product.specifications?.room && filters.rooms!.includes((product.specifications as any).room)
      );
    }

    if (filters?.tags && filters.tags.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        product.tags.some(tag => filters.tags!.includes(tag))
      );
    }

    // Return filtered products for backward compatibility
    return filteredProducts;
  }
};

export const getProductById = async (productId: string): Promise<Product | undefined> => {
  try {
    const product = await productService.getProductById(productId);
    return product;
  } catch (error) {
    logger.log('API not available, finding product by ID in mock data');
    // Fallback to mock data
    return mockProducts.find(product => product._id === productId);
  }
};

export const getProductBySlug = async (slug: string): Promise<Product | undefined> => {
  try {
    const product = await productService.getProductBySlug(slug);
    return product;
  } catch (error) {
    logger.log('API not available, finding product by slug in mock data');
    // Fallback to mock data
    return mockProducts.find(product => product.slug === slug);
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const categories = await productService.getCategories();
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return mock categories as fallback
    return mockCategories;
  }
};

export const getCategoryBySlug = async (slug: string): Promise<Category | undefined> => {
  try {
    const category = await productService.getCategoryBySlug(slug);
    return category;
  } catch (error) {
    console.error('Error fetching category:', error);
    // Find in mock categories as fallback
    return mockCategories.find(cat => cat.slug === slug);
  }
};

// User address management using API
export const getUserAddresses = async (): Promise<UserAddress[]> => {
  try {
    const addresses = await addressService.getUserAddresses();
    // Filter by userId for consistency with old interface
    return addresses.map(addr => ({
      _id: addr.id,
      userId: addr.userId,
      type: addr.addressType as 'home' | 'work' | 'other',
      street: addr.street,
      city: addr.city,
      state: addr.state,
      zipCode: addr.postalCode,
      isDefault: addr.isDefault,
      createdAt: new Date(addr.createdAt).getTime(),
      updatedAt: new Date(addr.updatedAt).getTime(),
    }));
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    return [];
  }
};

export const addAddress = async (address: Omit<UserAddress, '_id' | 'createdAt' | 'updatedAt'>): Promise<UserAddress> => {
  try {
    const addressData = {
      fullName: address.type === 'home' ? 'Home Address' : address.type === 'work' ? 'Work Address' : 'Other Address',
      phone: '0000000000', // Placeholder phone
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.zipCode,
      country: 'India', // Default country
      isDefault: address.isDefault,
      addressType: address.type,
    };

    const result = await addressService.createAddress(addressData);
    return {
      _id: result.id,
      userId: result.userId,
      type: result.addressType as 'home' | 'work' | 'other',
      street: result.street,
      city: result.city,
      state: result.state,
      zipCode: result.postalCode,
      isDefault: result.isDefault,
      createdAt: new Date(result.createdAt).getTime(),
      updatedAt: new Date(result.updatedAt).getTime(),
    };
  } catch (error) {
    console.error('Error adding address:', error);
    throw error;
  }
};

export const updateUser = async (_userId: string, updates: Partial<User>): Promise<User> => {
  try {
    // Note: userId arg is ignored because authService uses current user context from token
    // We keep it in signature for compatibility with existing code
    return await authService.updateUser(updates);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const updateAddress = async (addressId: string, updates: Partial<UserAddress>): Promise<void> => {
  try {
    const addressUpdates = {
      fullName: updates.type ? (updates.type === 'home' ? 'Home Address' : updates.type === 'work' ? 'Work Address' : 'Other Address') : undefined,
      street: updates.street,
      city: updates.city,
      state: updates.state,
      postalCode: updates.zipCode,
      isDefault: updates.isDefault,
    };

    await addressService.updateAddress(addressId, addressUpdates);
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
};

export const deleteAddress = async (addressId: string): Promise<void> => {
  try {
    await addressService.deleteAddress(addressId);
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
};

// Reviews management using API
// Mock Reviews for fallback
const mockReviews: any[] = [
  {
    _id: "rev-1",
    productId: "prod-1",
    userId: "user-1",
    userName: "Priya Sharma",
    userAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    title: "Excellent Quality and Comfort!",
    comment: "Absolutely love this sofa! The velvet fabric is so soft and luxurious. Assembly was straightforward, and it looks much more expensive than it cost. Highly recommend!",
    helpfulCount: 24,
    createdAt: Date.now() - 86400000 * 12,
    updatedAt: Date.now() - 86400000 * 12,
  },
  {
    _id: "rev-2",
    productId: "prod-1",
    userId: "user-2",
    userName: "Rajesh Kumar",
    userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    title: "Perfect for my living room",
    comment: "Great purchase! The color is exactly as shown in pictures. Very comfortable and sturdy. The chrome legs give it a premium look.",
    helpfulCount: 18,
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now() - 86400000 * 7,
  },
  {
    _id: "rev-3",
    productId: "prod-1",
    userId: "user-3",
    userName: "Anita Patel",
    rating: 4,
    title: "Good value for money",
    comment: "Nice sofa for the price. The only minor issue is that the cushions could be a bit firmer, but overall very satisfied with the purchase.",
    helpfulCount: 12,
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 5,
  },
  {
    _id: "rev-4",
    productId: "prod-2",
    userId: "user-4",
    userName: "Vikram Singh",
    rating: 5,
    title: "Exceeded expectations!",
    comment: "This is my second purchase from this brand. Quality is consistently good. Delivery was on time and the delivery team was professional.",
    helpfulCount: 31,
    createdAt: Date.now() - 86400000 * 17,
    updatedAt: Date.now() - 86400000 * 17,
  },
  {
    _id: "rev-5",
    productId: "prod-3",
    userId: "user-5",
    userName: "Meera Reddy",
    rating: 4,
    title: "Beautiful and comfortable",
    comment: "Love the design! It's become the focal point of our living room. Assembly took about 45 minutes with two people.",
    helpfulCount: 15,
    createdAt: Date.now() - 86400000 * 9,
    updatedAt: Date.now() - 86400000 * 9,
  },
  {
    _id: "rev-6",
    productId: "prod-4",
    userId: "user-6",
    userName: "Arjun Nair",
    rating: 5,
    title: "Best furniture investment",
    comment: "After 3 months of use, I can confidently say this was money well spent. Still looks brand new and is incredibly comfortable for movie nights!",
    helpfulCount: 42,
    createdAt: Date.now() - 86400000 * 90,
    updatedAt: Date.now() - 86400000 * 90,
  }
];

export const getReviews = async (productId: string): Promise<Review[]> => {
  try {
    const result = await reviewService.getProductReviews(productId);
    return result.data.map(review => ({
      _id: review.id,
      productId: review.productId,
      userId: review.userId,
      userName: review.userName,
      userAvatar: review.userAvatar,
      rating: review.rating,
      comment: review.comment,
      helpfulCount: review.helpfulCount,
      createdAt: new Date(review.createdAt).getTime(),
      updatedAt: new Date(review.updatedAt).getTime(),
    }));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    // Return mock reviews for the requested product (or all if generic fallback needed)
    // For demo purposes, we'll return a mix of reviews for any product to ensure data visibility
    return mockReviews.map(r => ({ ...r, productId }));
  }
};

export const addReview = async (review: Omit<Review, '_id' | 'createdAt' | 'updatedAt'>): Promise<Review> => {
  try {
    const reviewData = {
      productId: review.productId,
      rating: review.rating,
      title: review.comment.substring(0, 50), // Use beginning of comment as title
      comment: review.comment,
      images: review.userAvatar ? [review.userAvatar] : undefined,
    };

    const result = await reviewService.createReview(reviewData);
    return {
      _id: result.id,
      productId: result.productId,
      userId: result.userId,
      userName: result.userName,
      userAvatar: result.userAvatar,
      rating: result.rating,
      comment: result.comment,
      helpfulCount: result.helpfulCount,
      createdAt: new Date(result.createdAt).getTime(),
      updatedAt: new Date(result.updatedAt).getTime(),
    };
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

// Pincode management using API
export const checkPincodeServiceable = async (pincode: string): Promise<{ serviceable: boolean; estimatedDays?: number }> => {
  try {
    return await addressService.checkPincodeServiceable(pincode);
  } catch (error) {
    console.error('Error checking pincode:', error);
    // Default to serviceable in case of error
    return { serviceable: true, estimatedDays: 5 };
  }
};

export const markReviewHelpful = async (reviewId: string): Promise<void> => {
  try {
    await reviewService.markReviewHelpful(reviewId);
  } catch (error) {
    console.error('Error marking review as helpful:', error);
    throw error;
  }
};

export const addProduct = async (product: Product): Promise<Product> => {
  try {
    // In a real app, this would call the API
    // const newProduct = await productService.createProduct(product);
    // return newProduct;

    logger.log('Mock adding product:', product);
    mockProducts.push(product);
    return product;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (productId: string, updates: Partial<Product>): Promise<Product | undefined> => {
  try {
    // In a real app, this would call the API
    // const updatedProduct = await productService.updateProduct(productId, updates);
    // return updatedProduct;

    logger.log('Mock updating product:', productId, updates);
    const index = mockProducts.findIndex(p => p._id === productId);
    if (index !== -1) {
      mockProducts[index] = { ...mockProducts[index], ...updates, updatedAt: Date.now() } as any;
      return mockProducts[index];
    }
    return undefined;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const changePassword = async (_userId: string, current: string, newPass: string) => {
  return await authService.changePassword(current, newPass);
};
