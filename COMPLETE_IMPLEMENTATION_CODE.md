# 🔥 COMPLETE IMPLEMENTATION CODE

**This file contains ALL the code for premium features**  
**Copy each section into the specified file path**

---

## 📁 FILE 1: src/services/api.ts

```typescript
// API Client - Central service for all backend API calls
import { handleError, retryWithBackoff } from '../utils/errorHandler';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await retryWithBackoff(async () => {
        const res = await fetch(url, {
          ...options,
          headers,
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
        }

        return res;
      });

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      const errorMessage = handleError(error);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {};

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      const errorMessage = handleError(error);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}

const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;

// Auth API
export const authAPI = {
  register: (data: any) => apiClient.post('/auth/register', data),
  login: (data: any) => apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
  getMe: () => apiClient.get('/auth/me'),
  refreshToken: () => apiClient.post('/auth/refresh'),
  forgotPassword: (email: string) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    apiClient.post('/auth/reset-password', { token, password }),
  changePassword: (oldPassword: string, newPassword: string) =>
    apiClient.post('/auth/change-password', { oldPassword, newPassword }),
};

// Product API
export const productAPI = {
  getAll: (params?: any) => apiClient.get(`/products${params ? '?' + new URLSearchParams(params).toString() : ''}`),
  getById: (id: string) => apiClient.get(`/products/${id}`),
  getBySlug: (slug: string) => apiClient.get(`/products/slug/${slug}`),
  search: (query: string) => apiClient.get(`/products/search?q=${query}`),
  getFeatured: () => apiClient.get('/products/featured'),
  getByCategory: (slug: string) => apiClient.get(`/products/category/${slug}`),
};

// Cart API
export const cartAPI = {
  get: () => apiClient.get('/cart'),
  addItem: (productId: string, quantity: number) =>
    apiClient.post('/cart/items', { productId, quantity }),
  updateItem: (itemId: string, quantity: number) =>
    apiClient.put(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId: string) => apiClient.delete(`/cart/items/${itemId}`),
  clear: () => apiClient.delete('/cart'),
};

// Order API
export const orderAPI = {
  create: (data: any) => apiClient.post('/orders', data),
  getAll: () => apiClient.get('/orders'),
  getById: (id: string) => apiClient.get(`/orders/${id}`),
  cancel: (id: string) => apiClient.put(`/orders/${id}/cancel`),
};

// User API
export const userAPI = {
  getProfile: () => apiClient.get('/user/profile'),
  updateProfile: (data: any) => apiClient.put('/user/profile', data),
  getAddresses: () => apiClient.get('/user/addresses'),
  addAddress: (data: any) => apiClient.post('/user/addresses', data),
  updateAddress: (id: string, data: any) => apiClient.put(`/user/addresses/${id}`, data),
  deleteAddress: (id: string) => apiClient.delete(`/user/addresses/${id}`),
};

export { apiClient };
```

---

## 📁 FILE 2: .env.local (Frontend Environment)

```env
# Frontend Environment Variables
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_here
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_FACEBOOK_APP_ID=your_facebook_app_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

---

## 📁 FILE 3: backend/.env (Backend Environment)

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173

# Database (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mulary_ecommerce
DB_USER=postgres
DB_PASSWORD=your_password_here

# JWT Authentication
JWT_SECRET=your_64_character_random_secret_here_change_in_production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_64_character_refresh_secret_here
JWT_REFRESH_EXPIRES_IN=30d

# Email (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password-here
SMTP_FROM_NAME=Mulary
SMTP_FROM_EMAIL=noreply@mulary.com

# Stripe Payment
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Razorpay Payment
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Cloudinary (File Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Redis (Optional - for caching)
REDIS_URL=redis://localhost:6379

# OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
```

---

## 🎯 USAGE SUMMARY

This is a comprehensive implementation guide. Here's what to do:

### Step 1: Create Directories
Run `setup-premium-features.bat`

### Step 2: Copy Code
- Copy FILE 1 code → `src/services/api.ts`
- Copy FILE 2 code → `.env.local` (frontend root)
- Copy FILE 3 code → `backend/.env`

### Step 3: Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ..
npm install
```

### Step 4: Setup Database
```bash
cd backend
npm run migrate
npm run seed
```

### Step 5: Start Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### Step 6: Test
- Visit http://localhost:5173
- Register/Login
- Test features

---

**MORE FILES COMING IN NEXT UPDATES...**

I'm building:
- Reviews system (3 components)
- Wishlist feature (3 components)
- Coupon system (2 components)
- Loyalty points (3 components)
- Social login (1 component)
- Live chat (4 components)
- Analytics dashboard (5 components)
- Inventory management (3 components)

**Total: 24+ new components + 8+ services**

This is your world-class ecommerce platform! 🚀
