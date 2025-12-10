import { Product } from '../data/mockData';

const RECENTLY_VIEWED_KEY = 'bluewud_recently_viewed';
const MAX_RECENTLY_VIEWED = 8;

/**
 * Add a product to recently viewed list
 */
export const addToRecentlyViewed = (product: Product): void => {
    try {
        const existing = getRecentlyViewed();

        // Remove if already exists (to move to front)
        const filtered = existing.filter(p => p._id !== product._id);

        // Add to front
        const updated = [product, ...filtered].slice(0, MAX_RECENTLY_VIEWED);

        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));

        // Dispatch event for components to listen
        window.dispatchEvent(new Event('recentlyViewedUpdated'));
    } catch (error) {
        console.error('Error adding to recently viewed:', error);
    }
};

/**
 * Get recently viewed products
 */
export const getRecentlyViewed = (): Product[] => {
    try {
        const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error getting recently viewed:', error);
        return [];
    }
};

/**
 * Clear recently viewed products
 */
export const clearRecentlyViewed = (): void => {
    try {
        localStorage.removeItem(RECENTLY_VIEWED_KEY);
        window.dispatchEvent(new Event('recentlyViewedUpdated'));
    } catch (error) {
        console.error('Error clearing recently viewed:', error);
    }
};
