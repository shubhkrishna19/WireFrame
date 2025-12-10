/**
 * Filter Persistence Utility
 * Saves and restores filter state from localStorage
 */

import { FilterState } from '../components/FilterSidebar';

const FILTER_STORAGE_KEY = 'bluewud_product_filters';
const FILTER_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

interface StoredFilters {
  filters: FilterState;
  timestamp: number;
}

/**
 * Save filters to localStorage with expiry
 */
export const saveFilters = (filters: FilterState): void => {
  try {
    const stored: StoredFilters = {
      filters,
      timestamp: Date.now(),
    };
    localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(stored));
  } catch (error) {
    console.warn('Failed to save filters to localStorage:', error);
  }
};

/**
 * Load filters from localStorage if not expired
 */
export const loadFilters = (): FilterState | null => {
  try {
    const stored = localStorage.getItem(FILTER_STORAGE_KEY);
    if (!stored) return null;

    const parsed: StoredFilters = JSON.parse(stored);
    const now = Date.now();

    // Check if expired
    if (now - parsed.timestamp > FILTER_EXPIRY_MS) {
      localStorage.removeItem(FILTER_STORAGE_KEY);
      return null;
    }

    return parsed.filters;
  } catch (error) {
    console.warn('Failed to load filters from localStorage:', error);
    return null;
  }
};

/**
 * Clear saved filters
 */
export const clearSavedFilters = (): void => {
  try {
    localStorage.removeItem(FILTER_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear filters from localStorage:', error);
  }
};


