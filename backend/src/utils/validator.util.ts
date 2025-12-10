// ============================================
// VALIDATION UTILITY FUNCTIONS
// ============================================

import { z } from 'zod';

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailSchema = z.string().email();
  return emailSchema.safeParse(email).success;
};

// Phone validation (India)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// Password strength validation
export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Postal code validation (India)
export const isValidPostalCode = (postalCode: string): boolean => {
  const postalCodeRegex = /^[1-9][0-9]{5}$/;
  return postalCodeRegex.test(postalCode);
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Sanitize string (remove HTML tags, scripts)
export const sanitizeString = (str: string): string => {
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
};

// Validate and sanitize input
export const validateInput = (input: any, schema: z.ZodSchema): any => {
  const result = schema.safeParse(input);
  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
  }
  return result.data;
};

// Common validation schemas
export const schemas = {
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
  postalCode: z.string().regex(/^[1-9][0-9]{5}$/, 'Invalid postal code'),
  uuid: z.string().uuid('Invalid ID format'),
  url: z.string().url('Invalid URL'),
  positiveInt: z.number().int().positive('Must be a positive integer'),
  price: z.number().positive('Price must be positive'),
};

export default {
  isValidEmail,
  isValidPhone,
  isStrongPassword,
  isValidPostalCode,
  isValidUrl,
  sanitizeString,
  validateInput,
  schemas,
};
