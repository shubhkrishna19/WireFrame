# 🧪 COMPLETE TESTING GUIDE

## 📋 PRE-TESTING SETUP

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup PostgreSQL Database
```bash
# Option A: Docker (Easiest)
docker run --name mulary-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15

# Option B: Local PostgreSQL
# Download from: https://www.postgresql.org/download/windows/
# Install and create database
```

### 3. Configure Environment
```bash
# Copy example
copy .env.example .env

# Edit .env with your settings (minimum required):
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mulary_ecommerce
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your_super_long_random_string_at_least_64_characters_for_security
```

### 4. Run Database Migrations
```bash
npm run migrate
# Then run premium features:
# psql -U postgres -d mulary_ecommerce -f src/db/schema_premium.sql
```

### 5. Start Backend Server
```bash
npm run dev
# Server should start at http://localhost:5000
```

---

## ✅ AUTOMATED TESTING (Quick Check)

### Health Check
```bash
# Should return: {"status":"ok"}
curl http://localhost:5000/health
```

### API Documentation Check
```bash
# Should return HTML page
curl http://localhost:5000/api-docs
```

---

## 🧪 MANUAL ENDPOINT TESTING

### Use Thunder Client (VS Code) or Postman

## 1️⃣ AUTHENTICATION TESTS

### Register New User
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Password123!",
  "name": "Test User",
  "phone": "1234567890"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "test@example.com", "name": "Test User" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Registration successful"
}
```

### Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Password123!"
}
```

### Get Current User
```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 2️⃣ PRODUCT TESTS

### Get All Products
```http
GET http://localhost:5000/api/products
```

### Get Product by ID
```http
GET http://localhost:5000/api/products/{product_id}
```

### Search Products
```http
GET http://localhost:5000/api/products?search=shirt&category=men&min_price=500&max_price=2000
```

### Create Product (Admin)
```http
POST http://localhost:5000/api/products
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "name": "Classic White Tee",
  "slug": "classic-white-tee",
  "description": "Premium cotton t-shirt",
  "price": 999,
  "category_id": "category-uuid",
  "stock_quantity": 50,
  "images": ["https://example.com/image.jpg"],
  "is_active": true
}
```

---

## 3️⃣ CART TESTS

### Get Cart
```http
GET http://localhost:5000/api/cart
Authorization: Bearer YOUR_TOKEN
```

### Add to Cart
```http
POST http://localhost:5000/api/cart
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "product_id": "product-uuid",
  "quantity": 2
}
```

### Update Cart Item
```http
PUT http://localhost:5000/api/cart/{cart_item_id}
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "quantity": 3
}
```

### Remove from Cart
```http
DELETE http://localhost:5000/api/cart/{cart_item_id}
Authorization: Bearer YOUR_TOKEN
```

---

## 4️⃣ WISHLIST TESTS

### Get Wishlist
```http
GET http://localhost:5000/api/wishlist
Authorization: Bearer YOUR_TOKEN
```

### Add to Wishlist
```http
POST http://localhost:5000/api/wishlist
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "product_id": "product-uuid"
}
```

### Remove from Wishlist
```http
DELETE http://localhost:5000/api/wishlist/{product_id}
Authorization: Bearer YOUR_TOKEN
```

---

## 5️⃣ REVIEW TESTS

### Get Product Reviews
```http
GET http://localhost:5000/api/reviews/product/{product_id}?page=1&limit=10&sort=recent
```

### Create Review
```http
POST http://localhost:5000/api/reviews
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "product_id": "product-uuid",
  "rating": 5,
  "title": "Excellent product!",
  "comment": "Really love the quality and fit. Highly recommended!",
  "images": ["https://example.com/review-photo.jpg"]
}
```

### Update Review
```http
PUT http://localhost:5000/api/reviews/{review_id}
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "rating": 4,
  "title": "Good product",
  "comment": "Updated my review after wearing it more"
}
```

### Mark Review as Helpful
```http
POST http://localhost:5000/api/reviews/{review_id}/helpful
Authorization: Bearer YOUR_TOKEN
```

---

## 6️⃣ COUPON TESTS

### Get Active Coupons
```http
GET http://localhost:5000/api/coupons/active
```

### Validate Coupon
```http
POST http://localhost:5000/api/coupons/validate
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "code": "WELCOME10",
  "cart_total": 2000
}
```

### Create Coupon (Admin)
```http
POST http://localhost:5000/api/coupons
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "code": "SUMMER20",
  "type": "percentage",
  "value": 20,
  "min_order_value": 1000,
  "max_discount": 500,
  "usage_limit": 100,
  "valid_until": "2024-08-31T23:59:59Z"
}
```

---

## 7️⃣ ORDER TESTS

### Create Order
```http
POST http://localhost:5000/api/orders
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "items": [
    {
      "product_id": "product-uuid",
      "quantity": 2,
      "price": 999
    }
  ],
  "shipping_address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postal_code": "400001",
    "country": "India"
  },
  "payment_method": "stripe",
  "coupon_code": "WELCOME10"
}
```

### Get User Orders
```http
GET http://localhost:5000/api/orders
Authorization: Bearer YOUR_TOKEN
```

### Get Order Details
```http
GET http://localhost:5000/api/orders/{order_id}
Authorization: Bearer YOUR_TOKEN
```

### Cancel Order
```http
POST http://localhost:5000/api/orders/{order_id}/cancel
Authorization: Bearer YOUR_TOKEN
```

---

## 8️⃣ PAYMENT TESTS

### Create Stripe Payment Intent
```http
POST http://localhost:5000/api/payment/stripe/create-intent
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "orderId": "order-uuid",
  "amount": 2000,
  "currency": "INR"
}
```

### Create Razorpay Order
```http
POST http://localhost:5000/api/payment/razorpay/create-order
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "orderId": "order-uuid",
  "amount": 2000,
  "currency": "INR"
}
```

---

## 9️⃣ UPLOAD TESTS

### Upload Product Image (Admin)
```http
POST http://localhost:5000/api/upload/image
Authorization: Bearer ADMIN_TOKEN
Content-Type: multipart/form-data

Form Data:
- image: [select file]
- folder: products
```

### Upload Multiple Images (Admin)
```http
POST http://localhost:5000/api/upload/images
Authorization: Bearer ADMIN_TOKEN
Content-Type: multipart/form-data

Form Data:
- images: [select multiple files]
- folder: products
```

### Upload Avatar
```http
POST http://localhost:5000/api/upload/avatar
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data

Form Data:
- avatar: [select file]
```

---

## 🔟 ADMIN TESTS

### Get Dashboard Stats
```http
GET http://localhost:5000/api/admin/stats
Authorization: Bearer ADMIN_TOKEN
```

### Get All Orders (Admin)
```http
GET http://localhost:5000/api/admin/orders?status=pending&page=1&limit=20
Authorization: Bearer ADMIN_TOKEN
```

### Update Order Status (Admin)
```http
PUT http://localhost:5000/api/admin/orders/{order_id}/status
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "status": "shipped",
  "tracking_number": "TRACK123456"
}
```

### Get All Users (Admin)
```http
GET http://localhost:5000/api/admin/users?role=customer&page=1
Authorization: Bearer ADMIN_TOKEN
```

---

## 🎯 COMPLETE USER JOURNEY TEST

### Scenario: Customer Buys a Product

```bash
# 1. Register
POST /api/auth/register

# 2. Browse products
GET /api/products

# 3. View product details
GET /api/products/{id}

# 4. Read reviews
GET /api/reviews/product/{id}

# 5. Add to wishlist
POST /api/wishlist

# 6. Add to cart
POST /api/cart

# 7. Validate coupon
POST /api/coupons/validate

# 8. Create order
POST /api/orders

# 9. Make payment
POST /api/payment/stripe/create-intent

# 10. Track order
GET /api/orders/{id}

# 11. Leave review (after delivery)
POST /api/reviews
```

---

## 🐛 COMMON ISSUES & FIXES

### Issue 1: Database Connection Error
**Error:** `ECONNREFUSED ::1:5432`
**Fix:**
```bash
# Check PostgreSQL is running
# Windows: Services → postgresql-x64-15
# Or start Docker container
docker start mulary-postgres
```

### Issue 2: JWT Invalid
**Error:** `Invalid token`
**Fix:**
- Check JWT_SECRET in .env matches
- Token might be expired (default 7 days)
- Re-login to get new token

### Issue 3: Port Already in Use
**Error:** `EADDRINUSE: address already in use :::5000`
**Fix:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change PORT in .env
```

### Issue 4: Upload Fails
**Error:** `Image upload failed`
**Fix:**
- Create `uploads/` folder in backend root
- Check Cloudinary credentials in .env
- Ensure file size < 5MB

---

## 📊 EXPECTED SUCCESS METRICS

### Performance:
- ✅ Health check: <50ms
- ✅ GET /products: <200ms
- ✅ POST /orders: <500ms
- ✅ Image upload: <2s

### Database:
- ✅ 17 base tables created
- ✅ 14 premium feature tables created
- ✅ All indexes created
- ✅ Foreign keys working

### Security:
- ✅ Password hashed (bcrypt)
- ✅ JWT tokens working
- ✅ Rate limiting active
- ✅ Input validation working
- ✅ CORS configured

---

## ✅ FINAL CHECKLIST BEFORE PRODUCTION

- ✅ All endpoints tested manually
- ✅ Database migrations run successfully
- ✅ Admin user created
- ✅ Sample products added
- ✅ Payment gateways tested (test mode)
- ✅ Email sending working
- ✅ Image upload working
- ✅ Error handling working
- ✅ Logging working (check logs folder)
- ✅ Rate limiting tested
- ✅ Complete user journey tested
- ✅ Performance acceptable
- ✅ Environment variables set
- ✅ SSL configured (in production)

---

## 🚀 READY FOR LOCAL TESTING

1. Start backend: `npm run dev`
2. Use Thunder Client/Postman
3. Import collection (create from endpoints above)
4. Test systematically
5. Report any issues
6. Ready for frontend integration!

**Happy Testing! 🎉**
