/**
 * Input sanitization utilities to prevent XSS attacks
 */

/**
 * Sanitizes a string by escaping HTML special characters
 * @param input - The string to sanitize
 * @returns Sanitized string safe for HTML display
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return input.replace(/[&<>"'/]/g, (char) => map[char] || char);
}

/**
 * Sanitizes an object by recursively sanitizing all string values
 * @param obj - The object to sanitize
 * @returns Sanitized object
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => 
      typeof item === 'string' ? sanitizeString(item) : sanitizeObject(item)
    ) as unknown as T;
  }

  const sanitized = { ...obj } as any;
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeString(sanitized[key]);
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeObject(sanitized[key]);
    }
  }

  return sanitized;
}

/**
 * Removes potentially dangerous characters from user input
 * @param input - The string to clean
 * @returns Cleaned string
 */
export function cleanInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove null bytes and control characters
  return input
    .replace(/\0/g, '')
    .replace(/[\x00-\x1F\x7F]/g, '')
    .trim();
}

/**
 * Validates and sanitizes email address
 * @param email - Email to validate
 * @returns Sanitized email or empty string if invalid
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') {
    return '';
  }

  const cleaned = cleanInput(email).toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  return emailRegex.test(cleaned) ? cleaned : '';
}

/**
 * Validates and sanitizes phone number (basic validation)
 * @param phone - Phone number to validate
 * @returns Sanitized phone number or empty string
 */
export function sanitizePhone(phone: string): string {
  if (typeof phone !== 'string') {
    return '';
  }

  // Remove all non-digit characters except + at the start
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Basic validation: should be 10-15 digits (with optional + prefix)
  if (cleaned.startsWith('+')) {
    return cleaned.length >= 11 && cleaned.length <= 16 ? cleaned : '';
  }
  
  return cleaned.length >= 10 && cleaned.length <= 15 ? cleaned : '';
}

/**
 * Sanitizes URL to prevent XSS through href attributes
 * @param url - URL to sanitize
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string') {
    return '';
  }

  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
    return '';
  } catch {
    // If URL parsing fails, return empty string
    return '';
  }
}

/**
 * Sanitizes HTML content (basic - for production, use DOMPurify)
 * @param html - HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  if (typeof html !== 'string') {
    return '';
  }

  // For production, consider using DOMPurify library
  // This is a basic implementation
  return sanitizeString(html);
}

