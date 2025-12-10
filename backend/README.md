# Mulary E-Commerce Backend API

Production-ready Node.js + Express + TypeScript backend for Mulary e-commerce platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL 14+ installed
- Redis 7+ installed (optional, for caching)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   copy .env.example .env
   # Edit .env with your actual values
   ```

3. **Setup database:**
   ```bash
   # Create database
   createdb mulary_ecommerce
   
   # Run migrations
   npm run migrate
   
   # Seed with test data (optional)
   npm run seed
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

Server will run on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── middleware/       # Express middleware
│   ├── models/           # Database models
│   ├── utils/            # Helper functions
│   ├── types/            # TypeScript types
│   ├── db/               # Database scripts
│   └── server.ts         # Entry point
├── logs/                 # Application logs
└── uploads/              # Uploaded files
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/verify-email/:token` - Verify email

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/slug/:slug` - Get product by slug
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove cart item
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/orders` - All orders
- `PUT /api/admin/orders/:id/status` - Update order status

## 🔐 Authentication

API uses JWT (JSON Web Tokens) for authentication.

Include token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 🧪 Testing

```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## 🏗️ Building for Production

```bash
npm run build    # Build TypeScript to JavaScript
npm start        # Start production server
```

## 🔒 Security Features

- Password hashing with bcrypt (12 rounds)
- JWT tokens with expiration
- Rate limiting on all endpoints
- CORS configured
- Helmet.js security headers
- Input validation on all requests
- SQL injection prevention
- XSS protection

## 📄 License

MIT
