# Mulary E-commerce Platform - Setup Guide

This guide explains how to set up the backend server and connect it to the frontend to create a complete, production-ready e-commerce platform.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed
- Git installed

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Set up Environment Variables
Create a `.env` file in the `backend` directory with the following content:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mulary_ecommerce

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# Frontend URL
CLIENT_URL=http://localhost:5173

# Payment Gateways
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# File Uploads (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Redis (for caching, optional)
REDIS_URL=redis://localhost:6379
```

### 4. Database Setup
```bash
# Create the database
createdb mulary_ecommerce

# Run migrations
npm run migrate

# Seed initial data (optional)
npm run seed
```

### 5. Start Backend Server
```bash
npm run dev
```

The backend server will start on `http://localhost:5000`

## Frontend Setup

### 1. Install Frontend Dependencies
```bash
cd ..  # Go back to the main project directory
npm install
```

### 2. Update Environment Variables
Make sure your `.env.local` file has the correct API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Frontend Server
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## API Integration Complete

Now your frontend is connected to the backend API! The following features are now integrated:

- User authentication and management
- Product catalog with search and filtering
- Shopping cart functionality
- Order processing
- Wishlist management
- Product reviews
- Coupons and discounts
- User address management

## Testing the Integration

1. Open your browser to `http://localhost:5173`
2. Register a new account or log in with test credentials
3. Browse products and add them to your cart
4. Complete a test checkout process
5. Verify that all data is being persisted in the PostgreSQL database

## Production Deployment

For production deployment:

1. Update environment variables with production values
2. Set `NODE_ENV=production` in your backend `.env`
3. Use proper SSL certificates
4. Set up a reverse proxy (nginx)
5. Configure your domain and DNS

## API Endpoints

The backend provides the following API endpoints:

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/products` - Get products (with filters)
- `GET /api/products/:id` - Get single product
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `POST /api/orders` - Create new order
- `GET /api/user/profile` - Get user profile
- `GET /api/reviews` - Get product reviews
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/coupons/validate` - Validate coupon
- `GET /api/addresses` - Get user's addresses

## Troubleshooting

### Common Issues:

1. **Backend not starting**: Check if PostgreSQL is running
2. **Frontend can't connect to backend**: Verify the `VITE_API_URL` in your `.env.local`
3. **JWT token errors**: The backend and frontend must be properly connected for authentication to work
4. **Database connection issues**: Ensure your `DATABASE_URL` in the backend `.env` file is correct

### API Error Handling:

All API calls include proper error handling with clear error messages. Check the browser's developer console and backend logs for debug information.

## Congratulations!

Your Mulary e-commerce platform is now fully integrated with a complete backend API. You have a production-ready system with all the features needed for a successful e-commerce store.