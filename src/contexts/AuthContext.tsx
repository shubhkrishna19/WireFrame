import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../data/mockData';
import { authService } from '../services/authService';
import { logger } from '../utils/logger';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedToken = localStorage.getItem('bluewud_auth_token') || sessionStorage.getItem('bluewud_auth_token');

    if (storedToken) {
      // Verify token and get user data
      authService.getCurrentUser()
        .then(userData => {
          setUser(userData);
          setToken(storedToken);
          setIsLoading(false);
        })
        .catch(() => {
          // Token invalid, clear it
          localStorage.removeItem('bluewud_auth_token');
          sessionStorage.removeItem('bluewud_auth_token');
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    logger.info('ðŸ” AuthContext: Starting login...');
    const result = await authService.login({ email, password, rememberMe });
    logger.info('ðŸ” AuthContext: Login result:', result);
    setUser(result.user);
    setToken(result.accessToken);

    // Store timestamp for "Remember Me" feature support
    const timestamp = Date.now();

    // Persist tokens based on rememberMe flag
    if (rememberMe) {
      if (result.accessToken) localStorage.setItem('bluewud_auth_token', result.accessToken);
      if (result.refreshToken) localStorage.setItem('bluewud_refresh_token', result.refreshToken);
      localStorage.setItem('bluewud_login_timestamp', timestamp.toString());
    } else {
      if (result.accessToken) sessionStorage.setItem('bluewud_auth_token', result.accessToken);
      if (result.refreshToken) sessionStorage.setItem('bluewud_refresh_token', result.refreshToken);
      sessionStorage.setItem('bluewud_login_timestamp', timestamp.toString());
    }
    logger.info('ðŸ” AuthContext: Tokens persisted based on rememberMe');
  };

  const register = async (email: string, password: string, name: string, phone?: string) => {
    const result = await authService.register({ email, password, name, phone });
    setUser(result.user);
    setToken(result.accessToken);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
      // Clear tokens even if API call fails
      localStorage.removeItem('bluewud_auth_token');
      localStorage.removeItem('bluewud_refresh_token');
      sessionStorage.removeItem('bluewud_auth_token');
      sessionStorage.removeItem('bluewud_refresh_token');
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error refreshing user data:', error);
      // If refresh fails, logout user
      await logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

