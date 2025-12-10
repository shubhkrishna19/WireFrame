/**
 * Security utilities and helpers
 */

import { sanitizeString, cleanInput, sanitizeEmail, sanitizePhone, sanitizeUrl } from './sanitize';

/**
 * Security headers configuration (for documentation/reference)
 * These should be set on the server/backend
 */
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
};

/**
 * Validates input based on type
 */
export function validateInput(input: any, type: 'string' | 'email' | 'phone' | 'url' | 'number'): boolean {
  if (input === null || input === undefined) {
    return false;
  }

  switch (type) {
    case 'string':
      return typeof input === 'string' && input.trim().length > 0;
    case 'email':
      return sanitizeEmail(String(input)) !== '';
    case 'phone':
      return sanitizePhone(String(input)) !== '';
    case 'url':
      return sanitizeUrl(String(input)) !== '';
    case 'number':
      return typeof input === 'number' && !isNaN(input);
    default:
      return false;
  }
}

/**
 * Rate limiting helper (client-side, basic implementation)
 * For production, implement proper rate limiting on the backend
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 10) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];

    // Remove old requests outside the window
    const validRequests = requests.filter((time) => now - time < this.windowMs);

    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }

  reset(key: string): void {
    this.requests.delete(key);
  }
}

export const rateLimiter = new RateLimiter(60000, 10); // 10 requests per minute

/**
 * CSRF token generation (basic - for production, use proper CSRF tokens from backend)
 */
export function generateCsrfToken(): string {
  return btoa(
    Date.now().toString() + Math.random().toString(36).substring(2, 15)
  ).substring(0, 32);
}

/**
 * Validates CSRF token (basic - for production, validate against server)
 */
export function validateCsrfToken(token: string, storedToken: string): boolean {
  return token === storedToken && token.length > 0;
}

/**
 * Secure password requirements
 */
export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: false,
};

/**
 * Validates password strength
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`);
  }

  if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (PASSWORD_REQUIREMENTS.requireNumber && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (PASSWORD_REQUIREMENTS.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitizes form data before submission
 */
export function sanitizeFormData<T extends Record<string, any>>(data: T): T {
  const sanitized = { ...data };

  for (const key in sanitized) {
    const value = sanitized[key];

    if (typeof value === 'string') {
      // Don't sanitize passwords or tokens
      if (key.toLowerCase().includes('password') || key.toLowerCase().includes('token')) {
        (sanitized as any)[key] = cleanInput(value);
      } else {
        (sanitized as any)[key] = sanitizeString(cleanInput(value));
      }
    } else if (typeof value === 'object' && value !== null) {
      (sanitized as any)[key] = sanitizeFormData(value);
    }
  }

  return sanitized;
}

