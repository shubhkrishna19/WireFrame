// Wishlist store using API service

import { wishlistService } from '../services/wishlistService';
import { logger } from '../utils/logger';

// Cache for wishlist data
let wishlistCache: string[] | null = null;
let wishlistCacheTime = 0;
const CACHE_DURATION = 10000; // 10 seconds

// Individual product wishlist status cache
const productWishlistCache = new Map<string, { status: boolean; timestamp: number }>();
const PRODUCT_CACHE_DURATION = 30000; // 30 seconds

// Get wishlist from API with localStorage fallback
export const getWishlist = async (): Promise<string[]> => {
  // Return cached wishlist if still valid
  if (wishlistCache !== null && Date.now() - wishlistCacheTime < CACHE_DURATION) {
    return wishlistCache;
  }

  try {
    const apiWishlist = await wishlistService.getWishlist();
    // Return only the product IDs for compatibility with existing code
    wishlistCache = apiWishlist.map(item => item.productId);
    wishlistCacheTime = Date.now();
    return wishlistCache || [];
  } catch (error) {
    logger.log('API not available, using localStorage for wishlist');
    // Fallback to localStorage
    const stored = localStorage.getItem('bluewud_wishlist');
    wishlistCache = stored ? JSON.parse(stored) : [];
    wishlistCacheTime = Date.now();
    return wishlistCache || [];
  }
};

// Clear individual product cache
const clearProductCache = (productId: string) => {
  productWishlistCache.delete(productId);
};

// Add product to wishlist
export const addToWishlist = async (productId: string): Promise<void> => {
  try {
    await wishlistService.addToWishlist(productId);
    clearProductCache(productId);
  } catch (error) {
    logger.log('API not available, using localStorage for wishlist');
    // Fallback to localStorage
    const wishlist = await getWishlist();
    if (!wishlist.includes(productId)) {
      wishlist.push(productId);
      localStorage.setItem('bluewud_wishlist', JSON.stringify(wishlist));
      clearProductCache(productId);
    }
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (productId: string): Promise<void> => {
  try {
    // We need to get the wishlist to find the wishlist item ID by product ID
    const apiWishlist = await wishlistService.getWishlist();
    const wishlistItem = apiWishlist.find(item => item.productId === productId);

    if (wishlistItem) {
      await wishlistService.removeFromWishlist(wishlistItem.id);
      clearProductCache(productId);
    }
  } catch (error) {
    logger.log('API not available, using localStorage for wishlist');
    // Fallback to localStorage
    const wishlist = await getWishlist();
    const updatedWishlist = wishlist.filter(id => id !== productId);
    localStorage.setItem('bluewud_wishlist', JSON.stringify(updatedWishlist));
    clearProductCache(productId);
  }
};

// Check if product is in wishlist
export const isInWishlist = async (productId: string): Promise<boolean> => {
  // Check individual product cache first
  const cached = productWishlistCache.get(productId);
  if (cached && Date.now() - cached.timestamp < PRODUCT_CACHE_DURATION) {
    return cached.status;
  }

  try {
    // Check using cached wishlist
    const wishlist = await getWishlist();
    const status = wishlist.includes(productId);
    productWishlistCache.set(productId, { status, timestamp: Date.now() });
    return status;
  } catch (error) {
    logger.log('API not available, using localStorage for wishlist');
    // Fallback to localStorage
    const wishlist = await getWishlist();
    const status = wishlist.includes(productId);
    productWishlistCache.set(productId, { status, timestamp: Date.now() });
    return status;
  }
};

// Toggle wishlist status
export const toggleWishlist = async (productId: string): Promise<boolean> => {
  try {
    const inWishlist = await isInWishlist(productId);
    if (inWishlist) {
      await removeFromWishlist(productId);
      // Notify other components of change
      window.dispatchEvent(new Event('wishlistUpdated'));
      return false;
    } else {
      await addToWishlist(productId);
      window.dispatchEvent(new Event('wishlistUpdated'));
      return true;
    }
  } catch (error) {
    logger.log('API not available, using localStorage for wishlist');
    // Fallback to localStorage
    const wishlist = await getWishlist();
    const isIn = wishlist.includes(productId);
    if (isIn) {
      const updatedWishlist = wishlist.filter(id => id !== productId);
      localStorage.setItem('bluewud_wishlist', JSON.stringify(updatedWishlist));
      window.dispatchEvent(new Event('wishlistUpdated'));
      return false;
    } else {
      wishlist.push(productId);
      localStorage.setItem('bluewud_wishlist', JSON.stringify(wishlist));
      window.dispatchEvent(new Event('wishlistUpdated'));
      return true;
    }
  }
};

// Get wishlist count
export const getWishlistCount = async (): Promise<number> => {
  try {
    const count = await wishlistService.getWishlistCount();
    return count || 0;
  } catch (error) {
    // Silently fail - don't log errors for count requests to avoid console spam
    // Fallback to localStorage
    try {
      const wishlist = await getWishlist();
      return wishlist.length;
    } catch (fallbackError) {
      return 0;
    }
  }
};

// Clear wishlist
export const clearWishlist = async (): Promise<void> => {
  try {
    const wishlist = await getWishlist();
    // Remove each item individually since API doesn't have a clear all endpoint
    for (const productId of wishlist) {
      await removeFromWishlist(productId);
    }
  } catch (error) {
    logger.log('API not available, using localStorage for wishlist');
    // Fallback to localStorage
    localStorage.removeItem('bluewud_wishlist');
  }
};

