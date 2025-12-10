import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * Protected route that requires both authentication AND admin role
 */
export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // First check authentication (ProtectedRoute handles this, but we double-check)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Then check admin or editor role (both can access admin dashboard)
  if (user.role !== 'admin' && user.role !== 'editor') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

