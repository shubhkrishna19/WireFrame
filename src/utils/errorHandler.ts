// Centralized error handling utilities

export class AppError extends Error {
  code: string;
  details?: any;
  retryable: boolean;

  constructor(code: string, message: string, details?: any, retryable = false) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
    this.retryable = retryable;
  }
}

/**
 * Handle errors gracefully with user-friendly messages
 */
export const handleError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    // Network errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return new AppError(
        'NETWORK_ERROR',
        'Network connection failed. Please check your internet connection and try again.',
        { originalError: error.message },
        true
      );
    }

    // Storage errors
    if (error.message.includes('localStorage') || error.message.includes('quota')) {
      return new AppError(
        'STORAGE_ERROR',
        'Unable to save data. Please clear some space and try again.',
        { originalError: error.message },
        false
      );
    }

    // Generic error
    return new AppError(
      'UNKNOWN_ERROR',
      'An unexpected error occurred. Please try again.',
      { originalError: error.message },
      true
    );
  }

  // Unknown error type
  return new AppError(
    'UNKNOWN_ERROR',
    'An unexpected error occurred. Please try again.',
    { error },
    true
  );
};

/**
 * Retry a function with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> => {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Retry failed');
};

/**
 * Safe localStorage operations with error handling
 */
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Failed to get localStorage item: ${key}`, error);
      return null;
    }
  },

  setItem: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Failed to set localStorage item: ${key}`, error);
      return false;
    }
  },

  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Failed to remove localStorage item: ${key}`, error);
      return false;
    }
  },

  clear: (): boolean => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage', error);
      return false;
    }
  },
};

