import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, startTimeTracking, stopTimeTracking } from '../utils/analytics';

/**
 * Hook to track page views and time on page
 * Usage: Add to each page component or in App.tsx
 */
export const usePageTracking = (pageName?: string) => {
  const location = useLocation();

  useEffect(() => {
    const page = pageName || location.pathname;
    
    // Track page view
    trackPageView(location.pathname, page);
    
    // Start time tracking
    startTimeTracking(page);

    // Cleanup: stop time tracking on unmount
    return () => {
      stopTimeTracking(page);
    };
  }, [location.pathname, pageName]);
};

