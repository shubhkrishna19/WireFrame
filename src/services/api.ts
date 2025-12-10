// API Service Layer for Bluewud Furniture Platform
import axios from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bluewud_auth_token') || sessionStorage.getItem('bluewud_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (token expired) - attempt refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('bluewud_refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/refresh`, {
            refreshToken
          });

          const { accessToken } = response.data;
          localStorage.setItem('bluewud_auth_token', accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, logout user
        localStorage.removeItem('bluewud_auth_token');
        localStorage.removeItem('bluewud_refresh_token');
        sessionStorage.removeItem('bluewud_auth_token');
        sessionStorage.removeItem('bluewud_refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

