import { usePageTracking } from '../hooks/usePageTracking';

/**
 * Wrapper component to track all page views
 * Add this to App.tsx to automatically track all route changes
 */
export const AnalyticsWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  usePageTracking();

  return <>{children}</>;
};

