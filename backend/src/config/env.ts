// ============================================
// ENVIRONMENT CONFIGURATION & VALIDATION
// ============================================

import { config as dotenvConfig } from 'dotenv';
import { z } from 'zod';
import { join } from 'path';

// Load environment variables
// Look for .env file in the backend directory (where this config file is located)
const envPath = join(__dirname, '../../.env');
dotenvConfig({ path: envPath });

// Define environment schema with Zod for validation
const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('5001'),
  API_URL: z.string().url().default('http://localhost:5000'),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),

  // Database (using SQLite for development, PostgreSQL for production)
  DB_HOST: z.string().optional().default('localhost'),
  DB_PORT: z.string().transform(Number).optional().default('5432'),
  DB_NAME: z.string().optional().default('mulary_ecommerce'),
  DB_USER: z.string().optional().default('postgres'),
  DB_PASSWORD: z.string().optional().default('dummy_password_for_sqlite'), // Made optional for SQLite

  // JWT
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT refresh secret must be at least 32 characters'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

  // Email
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.string().transform(Number).default('587'),
  SMTP_SECURE: z.string().transform(val => val === 'true').default('false'),
  SMTP_USER: z.string().default('test@example.com'), // Made optional with default
  SMTP_PASSWORD: z.string().default('dummy_password'), // Made optional with default
  EMAIL_FROM: z.string().email().default('noreply@mulary.com'),
  EMAIL_FROM_NAME: z.string().default('Mulary'),

  // Payment - Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_CURRENCY: z.string().default('inr'),

  // Payment - Razorpay
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),

  // Cloud Storage
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  CLOUDINARY_UPLOAD_PRESET: z.string().default('mulary_products'),

  // AI Services
  OPENAI_API_KEY: z.string().optional(),

  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().transform(Number).default('6379'),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.string().transform(Number).default('0'),

  // Security
  BCRYPT_SALT_ROUNDS: z.string().transform(Number).default('12'),
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
  RATE_LIMIT_AUTH_MAX: z.string().transform(Number).default('5'),
  SESSION_SECRET: z.string().min(32, 'Session secret must be at least 32 characters'),
  COOKIE_DOMAIN: z.string().default('localhost'),
  COOKIE_MAX_AGE: z.string().transform(Number).default('604800000'),

  // File Upload
  MAX_FILE_SIZE: z.string().transform(Number).default('5242880'),
  ALLOWED_IMAGE_TYPES: z.string().default('image/jpeg,image/png,image/webp,image/jpg'),
  UPLOAD_DIR: z.string().default('./uploads'),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_FILE_PATH: z.string().default('./logs'),
  LOG_MAX_SIZE: z.string().default('10m'),
  LOG_MAX_FILES: z.string().default('7'),

  // Business
  FREE_SHIPPING_THRESHOLD: z.string().transform(Number).default('1500'),
  DEFAULT_SHIPPING_COST: z.string().transform(Number).default('100'),
  EXPRESS_SHIPPING_COST: z.string().transform(Number).default('200'),
  DEFAULT_CURRENCY: z.string().default('INR'),
  CURRENCY_SYMBOL: z.string().default('₹'),
  DEFAULT_PAGE_SIZE: z.string().transform(Number).default('20'),
  MAX_PAGE_SIZE: z.string().transform(Number).default('100'),

  // Admin
  ADMIN_EMAIL: z.string().email().default('admin@mulary.com'),
  ADMIN_PASSWORD: z.string().min(8, 'Admin password must be at least 8 characters').default('ChangeThisStrongPassword123!'),

  // Development
  DEBUG: z.string().transform(val => val === 'true').default('false'),
  SEED_DATABASE: z.string().transform(val => val === 'true').default('false'),
  TEST_MODE: z.string().transform(val => val === 'true').default('true'),
});

// Parse and validate environment variables
let env: z.infer<typeof envSchema>;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Invalid environment variables:');
    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
    process.exit(1);
  }
  throw error;
}

// Export validated config
export const config = {
  // Server
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  apiUrl: env.API_URL,
  clientUrl: env.CLIENT_URL,
  isDevelopment: env.NODE_ENV === 'development',
  isProduction: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',

  // Database
  database: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    name: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    url: `postgresql://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`,
  },

  // JWT
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshSecret: env.JWT_REFRESH_SECRET,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },

  // Email
  email: {
    smtp: {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD,
      },
    },
    from: env.EMAIL_FROM,
    fromName: env.EMAIL_FROM_NAME,
  },

  // Payment
  payment: {
    stripe: {
      secretKey: env.STRIPE_SECRET_KEY,
      publishableKey: env.STRIPE_PUBLISHABLE_KEY,
      webhookSecret: env.STRIPE_WEBHOOK_SECRET,
      currency: env.STRIPE_CURRENCY,
    },
    razorpay: {
      keyId: env.RAZORPAY_KEY_ID,
      keySecret: env.RAZORPAY_KEY_SECRET,
      webhookSecret: env.RAZORPAY_WEBHOOK_SECRET,
    },
  },

  // Cloud Storage
  cloudinary: {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
    uploadPreset: env.CLOUDINARY_UPLOAD_PRESET,
  },

  // AI Services
  openai: {
    apiKey: env.OPENAI_API_KEY,
  },

  // Redis
  redis: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
    db: env.REDIS_DB,
  },

  // Security
  security: {
    bcryptRounds: env.BCRYPT_SALT_ROUNDS,
    rateLimit: {
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      max: env.RATE_LIMIT_MAX_REQUESTS,
      authMax: env.RATE_LIMIT_AUTH_MAX,
    },
    session: {
      secret: env.SESSION_SECRET,
    },
    cookie: {
      domain: env.COOKIE_DOMAIN,
      maxAge: env.COOKIE_MAX_AGE,
    },
  },

  // File Upload
  upload: {
    maxFileSize: env.MAX_FILE_SIZE,
    allowedTypes: env.ALLOWED_IMAGE_TYPES.split(','),
    uploadDir: env.UPLOAD_DIR,
  },

  // Logging
  logging: {
    level: env.LOG_LEVEL,
    filePath: env.LOG_FILE_PATH,
    maxSize: env.LOG_MAX_SIZE,
    maxFiles: env.LOG_MAX_FILES,
  },

  // Business
  business: {
    shipping: {
      freeThreshold: env.FREE_SHIPPING_THRESHOLD,
      defaultCost: env.DEFAULT_SHIPPING_COST,
      expressCost: env.EXPRESS_SHIPPING_COST,
    },
    currency: {
      code: env.DEFAULT_CURRENCY,
      symbol: env.CURRENCY_SYMBOL,
    },
    pagination: {
      defaultSize: env.DEFAULT_PAGE_SIZE,
      maxSize: env.MAX_PAGE_SIZE,
    },
  },

  // Admin
  admin: {
    email: env.ADMIN_EMAIL,
    password: env.ADMIN_PASSWORD,
  },

  // Development
  debug: env.DEBUG,
  seedDatabase: env.SEED_DATABASE,
  testMode: env.TEST_MODE,
} as const;

// Type-safe config export
export type Config = typeof config;

export default config;
