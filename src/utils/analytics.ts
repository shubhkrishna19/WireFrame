// Analytics utility for tracking user behavior
import { logger } from './logger';

// Configuration
const ANALYTICS_ENABLED = import.meta.env.VITE_ANALYTICS_ENABLED !== 'false';
const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID || '';
const CUSTOM_ANALYTICS_ENDPOINT = import.meta.env.VITE_ANALYTICS_ENDPOINT || '';

// Initialize Google Analytics if ID is provided
let gaInitialized = false;

const initGA = () => {
  if (!GA4_MEASUREMENT_ID || gaInitialized) return;

  // Load Google Analytics script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA4_MEASUREMENT_ID}', {
      page_path: window.location.pathname,
    });
  `;
  document.head.appendChild(script2);

  gaInitialized = true;
};

// Initialize on load
if (ANALYTICS_ENABLED && GA4_MEASUREMENT_ID) {
  initGA();
}

// Track page view
export const trackPageView = (path: string, title?: string) => {
  if (!ANALYTICS_ENABLED) return;

  const pageData = {
    path,
    title: title || document.title,
    timestamp: Date.now(),
  };

  // Google Analytics
  if (gaInitialized && (window as any).gtag) {
    (window as any).gtag('config', GA4_MEASUREMENT_ID, {
      page_path: path,
      page_title: pageData.title,
    });
  }

  // Custom endpoint
  if (CUSTOM_ANALYTICS_ENDPOINT) {
    fetch(CUSTOM_ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'page_view', ...pageData }),
    }).catch(() => { }); // Silently fail
  }

  // Console log in development
  if (import.meta.env.DEV) {
    logger.log('📊 Page View:', pageData);
  }
};

// Track custom event
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (!ANALYTICS_ENABLED) return;

  const eventData = {
    event_name: eventName,
    ...eventParams,
    timestamp: Date.now(),
    url: window.location.href,
    path: window.location.pathname,
  };

  // Google Analytics
  if (gaInitialized && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams);
  }

  // Custom endpoint
  if (CUSTOM_ANALYTICS_ENDPOINT) {
    fetch(CUSTOM_ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'event', ...eventData }),
    }).catch(() => { }); // Silently fail
  }

  // Console log in development
  if (import.meta.env.DEV) {
    logger.log('📊 Event:', eventData);
  }
};

// Track time on page
let pageStartTime = Date.now();
let timeTrackingInterval: ReturnType<typeof setInterval> | null = null;

export const startTimeTracking = (pageName: string) => {
  pageStartTime = Date.now();

  // Track every 30 seconds
  if (timeTrackingInterval) clearInterval(timeTrackingInterval);

  timeTrackingInterval = setInterval(() => {
    const timeOnPage = Math.floor((Date.now() - pageStartTime) / 1000);
    trackEvent('time_on_page', {
      page_name: pageName,
      seconds: timeOnPage,
    });
  }, 30000); // Every 30 seconds
};

export const stopTimeTracking = (pageName: string) => {
  if (timeTrackingInterval) {
    clearInterval(timeTrackingInterval);
    timeTrackingInterval = null;
  }

  const totalTime = Math.floor((Date.now() - pageStartTime) / 1000);
  trackEvent('page_exit', {
    page_name: pageName,
    total_seconds: totalTime,
  });
};

// Predefined event trackers
export const analytics = {
  // Product interactions
  productView: (productId: string, productName: string, category?: string) => {
    trackEvent('view_product', {
      product_id: productId,
      product_name: productName,
      category,
    });
  },

  productClick: (productId: string, productName: string) => {
    trackEvent('click_product', {
      product_id: productId,
      product_name: productName,
    });
  },

  addToCart: (productId: string, productName: string, price: number, quantity: number = 1) => {
    trackEvent('add_to_cart', {
      product_id: productId,
      product_name: productName,
      price,
      quantity,
      currency: 'INR',
    });
  },

  removeFromCart: (productId: string, productName: string) => {
    trackEvent('remove_from_cart', {
      product_id: productId,
      product_name: productName,
    });
  },

  // Button interactions
  buttonClick: (buttonName: string, location: string, additionalData?: Record<string, any>) => {
    trackEvent('button_click', {
      button_name: buttonName,
      location,
      ...additionalData,
    });
  },

  // Search & filters
  search: (query: string, resultsCount?: number) => {
    trackEvent('search', {
      search_term: query,
      results_count: resultsCount || 0,
    });
  },

  filter: (filters: Record<string, any>) => {
    trackEvent('apply_filter', {
      filters,
    });
  },

  filterApplied: (filterType: string, filterValue: string) => {
    trackEvent('apply_filter', {
      filter_type: filterType,
      filter_value: filterValue,
    });
  },

  // Navigation
  navigationClick: (destination: string, source: string) => {
    trackEvent('navigation', {
      destination,
      source,
    });
  },

  // Wishlist
  addToWishlist: (productId: string, productName: string) => {
    trackEvent('add_to_wishlist', {
      product_id: productId,
      product_name: productName,
    });
  },

  removeFromWishlist: (productId: string, productName: string) => {
    trackEvent('remove_from_wishlist', {
      product_id: productId,
      product_name: productName,
    });
  },

  // Checkout
  beginCheckout: (data: { items: Array<{ product_id: string; product_name: string; quantity: number; price: number }>; total: number; currency: string }) => {
    trackEvent('begin_checkout', {
      value: data.total,
      currency: data.currency,
      items: data.items.length,
      item_details: data.items,
    });
  },

  purchase: (data: { transaction_id: string; value: number; currency: string; items: Array<{ product_id: string; product_name: string; quantity: number; price: number }> }) => {
    trackEvent('purchase', {
      transaction_id: data.transaction_id,
      value: data.value,
      currency: data.currency,
      items: data.items.length,
      item_details: data.items,
    });
  },

  // Form interactions
  formStart: (formName: string) => {
    trackEvent('form_start', {
      form_name: formName,
    });
  },

  formSubmit: (formName: string, success: boolean) => {
    trackEvent('form_submit', {
      form_name: formName,
      success,
    });
  },

  // Error tracking
  error: (errorMessage: string, errorLocation: string) => {
    trackEvent('error', {
      error_message: errorMessage,
      error_location: errorLocation,
    });
  },
};

