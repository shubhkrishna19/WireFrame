import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config({ path: '.env' });

console.log('Environment variables loaded');

// Define environment schema with Zod for validation
const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('5000'),
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
  console.log('✅ Environment variables validated successfully');
  console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length);
  console.log('PORT:', env.PORT);
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