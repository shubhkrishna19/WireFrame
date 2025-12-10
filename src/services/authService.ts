// Authentication Service for Bluewud Furniture Platform
import apiClient from './api';
import { User } from '../data/mockData';
import { logger } from '../utils/logger';

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export const authService = {
  // Login user
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      logger.info('ðŸ” AuthService: Making login request...');
      const response = await apiClient.post('/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });
      logger.info('ðŸ” AuthService: Login raw response:', response.data);

      // Backend wraps data as { success, data, message }, so unwrap if needed
      const apiResponse = response.data;
      const payload = apiResponse?.data ?? apiResponse;
      const { user, accessToken, refreshToken } = payload;
      logger.info('ðŸ” AuthService: Extracted tokens - accessToken:', accessToken, 'refreshToken:', refreshToken);

      // Store tokens based on rememberMe preference
      if (credentials.rememberMe) {
        if (accessToken) {
          localStorage.setItem('bluewud_auth_token', accessToken);
        }
        if (refreshToken) {
          localStorage.setItem('bluewud_refresh_token', refreshToken);
        }
        logger.info('ðŸ” AuthService: Tokens stored in localStorage');
      } else {
        if (accessToken) {
          sessionStorage.setItem('bluewud_auth_token', accessToken);
        }
        if (refreshToken) {
          sessionStorage.setItem('bluewud_refresh_token', refreshToken);
        }
        logger.info('ðŸ” AuthService: Tokens stored in sessionStorage');
      }

      logger.info('ðŸ” AuthService: Returning result:', { user, accessToken, refreshToken });
      return { user, accessToken, refreshToken };
    } catch (error: any) {
      // MOCK AUTH FALLBACK: Use mock data when backend is unavailable
      logger.info('âš ï¸ AuthService: Backend unavailable, using mock authentication...');
      const { mockUsers } = await import('../data/mockData');
      const storedMockUsersStr = localStorage.getItem('bluewud_mock_users');
      const storedMockUsers: User[] = storedMockUsersStr ? JSON.parse(storedMockUsersStr) : [];

      const allMockUsers = [...mockUsers, ...storedMockUsers];

      const mockUser = allMockUsers.find(u => u.email === credentials.email && u.password === credentials.password);

      if (!mockUser) {
        throw new Error('Invalid email or password. Please check your credentials.');
      }

      // Generate mock tokens
      const mockAccessToken = `mock_token_${mockUser._id}_${Date.now()}`;
      const mockRefreshToken = `mock_refresh_${mockUser._id}_${Date.now()}`;

      // Store tokens and user data
      const storage = credentials.rememberMe ? localStorage : sessionStorage;
      storage.setItem('bluewud_auth_token', mockAccessToken);
      storage.setItem('bluewud_refresh_token', mockRefreshToken);
      storage.setItem('bluewud_user', JSON.stringify(mockUser));

      logger.info('âœ… AuthService: Mock login successful for:', mockUser.email, 'Role:', mockUser.role);

      return {
        user: mockUser,
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
      };
    }
  },

  // Register new user
  async register(userData: RegisterData): Promise<LoginResponse> {
    try {
      const response = await apiClient.post('/auth/register', {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        phone: userData.phone,
      });

      const apiResponse = response.data;
      const payload = apiResponse?.data ?? apiResponse;
      const { user, accessToken, refreshToken } = payload;

      // Store tokens in sessionStorage by default for new registrations
      if (accessToken) {
        sessionStorage.setItem('bluewud_auth_token', accessToken);
      }
      if (refreshToken) {
        sessionStorage.setItem('bluewud_refresh_token', refreshToken);
      }

      return { user, accessToken, refreshToken };
    } catch (error: any) {
      // MOCK REGISTRATION FALLBACK
      logger.info('âš ï¸ AuthService: Backend unavailable, using mock registration...');

      // Check if user already exists in mock data
      const { mockUsers } = await import('../data/mockData');
      const storedMockUsersStr = localStorage.getItem('bluewud_mock_users');
      const storedMockUsers: User[] = storedMockUsersStr ? JSON.parse(storedMockUsersStr) : [];

      const allMockUsers = [...mockUsers, ...storedMockUsers];

      if (allMockUsers.some(u => u.email === userData.email)) {
        throw new Error('An account with this email already exists (Mock).');
      }

      // Create new mock user
      const newUser: User = {
        _id: `user_${Date.now()}`,
        email: userData.email,
        password: userData.password, // In a real app, never store plain text!
        name: userData.name,
        role: 'customer',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        emailVerified: false,
        phone: userData.phone
      };

      // Save to local storage
      storedMockUsers.push(newUser);
      localStorage.setItem('bluewud_mock_users', JSON.stringify(storedMockUsers));

      // Generate mock tokens
      const mockAccessToken = `mock_token_${newUser._id}_${Date.now()}`;
      const mockRefreshToken = `mock_refresh_${newUser._id}_${Date.now()}`;

      // Store tokens
      sessionStorage.setItem('bluewud_auth_token', mockAccessToken);
      sessionStorage.setItem('bluewud_refresh_token', mockRefreshToken);
      sessionStorage.setItem('bluewud_user', JSON.stringify(newUser));

      logger.info('âœ… AuthService: Mock registration successful for:', newUser.email);

      return {
        user: newUser,
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken
      };
    }
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Even if the logout request fails, clear local tokens
      logger.error('Logout API call failed:', error);
    } finally {
      // Clear all stored tokens
      localStorage.removeItem('bluewud_auth_token');
      localStorage.removeItem('bluewud_refresh_token');
      sessionStorage.removeItem('bluewud_auth_token');
      sessionStorage.removeItem('bluewud_refresh_token');
    }
  },

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get('/user/profile');
      const apiResponse = response.data;
      return (apiResponse?.data ?? apiResponse) as User;
    } catch (error) {
      // Fallback to stored mock user data
      logger.info('âš ï¸ AuthService: Using stored user data (mock mode)');
      const storedUser = localStorage.getItem('bluewud_user') || sessionStorage.getItem('bluewud_user');
      if (storedUser) {
        return JSON.parse(storedUser) as User;
      }
      throw new Error('No user data available');
    }
  },

  // Update user profile
  async updateUser(updates: Partial<User>): Promise<User> {
    const response = await apiClient.put(`/user/profile`, updates);
    const apiResponse = response.data;
    return (apiResponse?.data ?? apiResponse) as User;
  },

  // Change user password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },

  // Refresh authentication token
  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('bluewud_refresh_token') || sessionStorage.getItem('bluewud_refresh_token');

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post('/auth/refresh', { refreshToken });
    const apiResponse = response.data;
    const payload = apiResponse?.data ?? apiResponse;
    const { accessToken, refreshToken: newRefreshToken } = payload as { accessToken: string; refreshToken?: string };

    // Update stored tokens
    const isPersistent = !!localStorage.getItem('bluewud_auth_token');
    if (isPersistent) {
      if (accessToken) {
        localStorage.setItem('bluewud_auth_token', accessToken);
      }
      if (newRefreshToken) {
        localStorage.setItem('bluewud_refresh_token', newRefreshToken);
      }
    } else {
      if (accessToken) {
        sessionStorage.setItem('bluewud_auth_token', accessToken);
      }
      if (newRefreshToken) {
        sessionStorage.setItem('bluewud_refresh_token', newRefreshToken);
      }
    }

    return accessToken;
  },

  // Forgot password
  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { email });
  },

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/reset-password', {
      token,
      newPassword,
    });
  },

  // Verify email
  async verifyEmail(token: string): Promise<void> {
    await apiClient.post(`/auth/verify-email/${token}`);
  },
};

