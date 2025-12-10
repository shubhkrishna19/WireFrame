"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const zod_1 = require("zod");
// Load environment variables
dotenv_1.default.config({ path: '.env' });
console.log('Environment variables loaded');
// Define environment schema with Zod for validation
const envSchema = zod_1.z.object({
    // Server
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().transform(Number).default('5000'),
    API_URL: zod_1.z.string().url().default('http://localhost:5000'),
    CLIENT_URL: zod_1.z.string().url().default('http://localhost:5173'),
    // Database (using SQLite for development, PostgreSQL for production)
    DB_HOST: zod_1.z.string().optional().default('localhost'),
    DB_PORT: zod_1.z.string().transform(Number).optional().default('5432'),
    DB_NAME: zod_1.z.string().optional().default('mulary_ecommerce'),
    DB_USER: zod_1.z.string().optional().default('postgres'),
    DB_PASSWORD: zod_1.z.string().optional().default('dummy_password_for_sqlite'), // Made optional for SQLite
    // JWT
    JWT_SECRET: zod_1.z.string().min(32, 'JWT secret must be at least 32 characters'),
    JWT_EXPIRES_IN: zod_1.z.string().default('7d'),
    JWT_REFRESH_SECRET: zod_1.z.string().min(32, 'JWT refresh secret must be at least 32 characters'),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default('30d'),
    // Email
    SMTP_HOST: zod_1.z.string().default('smtp.gmail.com'),
    SMTP_PORT: zod_1.z.string().transform(Number).default('587'),
    SMTP_SECURE: zod_1.z.string().transform(val => val === 'true').default('false'),
    SMTP_USER: zod_1.z.string().default('test@example.com'), // Made optional with default
    SMTP_PASSWORD: zod_1.z.string().default('dummy_password'), // Made optional with default
    EMAIL_FROM: zod_1.z.string().email().default('noreply@mulary.com'),
    EMAIL_FROM_NAME: zod_1.z.string().default('Mulary'),
    // Payment - Stripe
    STRIPE_SECRET_KEY: zod_1.z.string().optional(),
    STRIPE_PUBLISHABLE_KEY: zod_1.z.string().optional(),
    STRIPE_WEBHOOK_SECRET: zod_1.z.string().optional(),
    STRIPE_CURRENCY: zod_1.z.string().default('inr'),
    // Payment - Razorpay
    RAZORPAY_KEY_ID: zod_1.z.string().optional(),
    RAZORPAY_KEY_SECRET: zod_1.z.string().optional(),
    RAZORPAY_WEBHOOK_SECRET: zod_1.z.string().optional(),
    // Cloud Storage
    CLOUDINARY_CLOUD_NAME: zod_1.z.string().optional(),
    CLOUDINARY_API_KEY: zod_1.z.string().optional(),
    CLOUDINARY_API_SECRET: zod_1.z.string().optional(),
    CLOUDINARY_UPLOAD_PRESET: zod_1.z.string().default('mulary_products'),
    // Redis
    REDIS_HOST: zod_1.z.string().default('localhost'),
    REDIS_PORT: zod_1.z.string().transform(Number).default('6379'),
    REDIS_PASSWORD: zod_1.z.string().optional(),
    REDIS_DB: zod_1.z.string().transform(Number).default('0'),
    // Security
    BCRYPT_SALT_ROUNDS: zod_1.z.string().transform(Number).default('12'),
    RATE_LIMIT_WINDOW_MS: zod_1.z.string().transform(Number).default('900000'),
    RATE_LIMIT_MAX_REQUESTS: zod_1.z.string().transform(Number).default('100'),
    RATE_LIMIT_AUTH_MAX: zod_1.z.string().transform(Number).default('5'),
    SESSION_SECRET: zod_1.z.string().min(32, 'Session secret must be at least 32 characters'),
    COOKIE_DOMAIN: zod_1.z.string().default('localhost'),
    COOKIE_MAX_AGE: zod_1.z.string().transform(Number).default('604800000'),
    // File Upload
    MAX_FILE_SIZE: zod_1.z.string().transform(Number).default('5242880'),
    ALLOWED_IMAGE_TYPES: zod_1.z.string().default('image/jpeg,image/png,image/webp,image/jpg'),
    UPLOAD_DIR: zod_1.z.string().default('./uploads'),
    // Logging
    LOG_LEVEL: zod_1.z.enum(['error', 'warn', 'info', 'debug']).default('info'),
    LOG_FILE_PATH: zod_1.z.string().default('./logs'),
    LOG_MAX_SIZE: zod_1.z.string().default('10m'),
    LOG_MAX_FILES: zod_1.z.string().default('7'),
    // Business
    FREE_SHIPPING_THRESHOLD: zod_1.z.string().transform(Number).default('1500'),
    DEFAULT_SHIPPING_COST: zod_1.z.string().transform(Number).default('100'),
    EXPRESS_SHIPPING_COST: zod_1.z.string().transform(Number).default('200'),
    DEFAULT_CURRENCY: zod_1.z.string().default('INR'),
    CURRENCY_SYMBOL: zod_1.z.string().default('₹'),
    DEFAULT_PAGE_SIZE: zod_1.z.string().transform(Number).default('20'),
    MAX_PAGE_SIZE: zod_1.z.string().transform(Number).default('100'),
    // Admin
    ADMIN_EMAIL: zod_1.z.string().email().default('admin@mulary.com'),
    ADMIN_PASSWORD: zod_1.z.string().min(8, 'Admin password must be at least 8 characters').default('ChangeThisStrongPassword123!'),
    // Development
    DEBUG: zod_1.z.string().transform(val => val === 'true').default('false'),
    SEED_DATABASE: zod_1.z.string().transform(val => val === 'true').default('false'),
    TEST_MODE: zod_1.z.string().transform(val => val === 'true').default('true'),
});
// Parse and validate environment variables
let env;
try {
    env = envSchema.parse(process.env);
    console.log('✅ Environment variables validated successfully');
    console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length);
    console.log('PORT:', env.PORT);
}
catch (error) {
    if (error instanceof zod_1.z.ZodError) {
        console.error('❌ Invalid environment variables:');
        error.errors.forEach((err) => {
            console.error(`  - ${err.path.join('.')}: ${err.message}`);
        });
        process.exit(1);
    }
    throw error;
}
