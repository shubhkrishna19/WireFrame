# bewakoof

# BEWAKOOF CLONE - COMPLETE IMPLEMENTATION GUIDE
## For Cline + VS Code + OpenHermes-2.5-Mistral-7B (Local LLM)
## With Frontend Shopping Cart, Backend Architecture, and Production Roadmap

**Updated:** November 13, 2025  
**Stack:** Cline (VS Code) + OpenHermes-2.5-Mistral-7B + Supabase + React + TypeScript + Tailwind + Node.js + Express  
**End-to-End Build Time:** 6-8 hours (Immediate) + 2-4 weeks (Short-term) + 1-2 months (Medium-term)  
**Per Feature:** 3-5 minutes (AI creates everything automatically)

---

## EXECUTIVE SUMMARY

This guide covers the **complete journey** from frontend shopping cart implementation to production-ready e-commerce platform. You'll have:

- **This Week:** Working shopping cart (frontend), product details, improved UX
- **Next 2-4 Weeks:** Full backend with authentication, database, API integration
- **1-2 Months:** Production-ready with payments, admin dashboard, order management

---

# TABLE OF CONTENTS

1. [PART 1: Setup Checklist](#part-1-setup-checklist)
2. [PART 2: Development Workflow](#part-2-development-workflow)
3. [PART 3: Immediate Phase - Shopping Cart & UX](#part-3-immediate-phase)
4. [PART 4: Short-term Phase - Backend Setup](#part-4-short-term-phase)
5. [PART 5: Medium-term Phase - Full Features](#part-5-medium-term-phase)
6. [PART 6: Implementation Timeline](#part-6-implementation-timeline)
7. [PART 7: Technology Stack Deep Dive](#part-7-tech-stack)
8. [PART 8: Troubleshooting](#part-8-troubleshooting)

---

# PART 1: SETUP CHECKLIST

## Prerequisites (Verify You Have These):

- ✅ VS Code installed with Cline extension
- ✅ LM Studio running with OpenHermes-2.5-Mistral-7B Q4_K_M loaded
- ✅ Local LLM server running on `http://127.0.0.1:1234`
- ✅ Supabase account + project created
- ✅ Node.js v18+ installed
- ✅ React project created with TypeScript
- ✅ npm run dev already executing

## Cline Configuration (Double-check):

```
API Provider:         OpenAI Compatible ✅
Base URL:             http://127.0.0.1:1234 ✅
Model ID:             openhermes-2.5-mistral-7b ✅
Context Window:       4096 ✅
Temperature:          0.7 ✅
Supports Images:      Checked ✅
Enable R1:            Checked ✅
```

---

# PART 2: DEVELOPMENT WORKFLOW

## The Vibe Coding Loop (3-5 min per feature):

```
┌──────────────────────────────────────────────────────────┐
│ YOU DESCRIBE FEATURE IN CLINE                            │
├──────────────────────────────────────────────────────────┤
│ Example: "Build shopping cart with localStorage..."      │
└──────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────┐
│ CLINE THINKS & PLANS (10-15 seconds)                     │
├──────────────────────────────────────────────────────────┤
│ Creates plan, shows you actions                          │
└──────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────┐
│ CLINE SHOWS YOU THE PLAN                                 │
├──────────────────────────────────────────────────────────┤
│ [👍 Approve] [👎 Revise]                                │
└──────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────┐
│ CLINE EXECUTES (30-60 seconds)                           │
├──────────────────────────────────────────────────────────┤
│ Creates files, updates code, verifies build              │
└──────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────┐
│ YOU TEST IN BROWSER (30-60 seconds)                      │
├──────────────────────────────────────────────────────────┤
│ http://localhost:5173 → Test new feature ✓               │
└──────────────────────────────────────────────────────────┘
                           ↓
                    ✅ DONE IN 3-5 MIN!
                  Move to next feature
```

---

# PART 3: IMMEDIATE PHASE - SHOPPING CART & UX
## Timeline: This Week (5-10 hours)

### FEATURE 1: Shopping Cart (Frontend + localStorage)

**What to paste in Cline:**

```
I'm building a Bewakoof clone. Add shopping cart functionality with localStorage:

1. Cart Context (context/CartContext.tsx):
   - Global cart state with React Context
   - useCart hook for accessing cart anywhere
   - Initial state from localStorage on app start
   - Auto-save to localStorage on any changes

2. Cart Data Structure:
   - Store cart items with: id, productId, name, price, quantity, size, color, image
   - Calculate subtotal, total, itemCount
   - Support add, remove, updateQuantity, clear operations

3. Add to Cart Button (components/Products/AddToCartButton.tsx):
   - Shows on product detail page and product cards
   - Modal/form to select size and color before adding
   - Quantity selector in modal
   - Success toast notification
   - Add to cart button state (loading, disabled if out of stock)

4. Shopping Cart Page (pages/CartPage.tsx):
   - Display all cart items in table format
   - Product image, name, size, color, price per item
   - Quantity selector (+/- buttons) for each item with real-time total update
   - Remove button (trash icon) per item with confirmation
   - Empty cart state with "Continue Shopping" button
   
   Cart Summary (sticky on desktop, bottom on mobile):
   - Subtotal
   - Shipping estimate (₹0 for free, ₹150 for express)
   - Tax calculation (18% GST)
   - Discount section (show applied coupon if any)
   - TOTAL (bold, large)
   - "Proceed to Checkout" button (disabled if empty)
   - "Continue Shopping" link

5. Cart Badge (components/Header/CartBadge.tsx):
   - Show in header/navbar
   - Display item count (e.g., "3")
   - Badge color indicates: normal (blue), items added recently (green), saved for later (yellow)
   - Click to go to cart page

6. Features:
   - All data saved to localStorage automatically
   - Cart persists across browser sessions
   - TypeScript interfaces for cart items and state
   - Tailwind CSS styling (mobile-responsive)
   - Toast notifications for add/remove actions
   - Error handling for edge cases

Use localStorage API, React Context, TypeScript, Tailwind CSS.
Make it production-ready with proper error handling.
```

**Expected Result:**
- ✅ Cart context working with localStorage
- ✅ Add to cart from any page
- ✅ Cart page fully functional
- ✅ Item count badge in header
- ✅ Persists across sessions

---

### FEATURE 2: Product Detail Pages

**What to paste in Cline:**

```
Build product detail pages for the Bewakoof clone:

1. Product Detail Page (pages/ProductDetail.tsx):
   
   Layout (2 columns on desktop, 1 on mobile):
   
   LEFT COLUMN - Image Gallery (components/Products/ImageGallery.tsx):
   - Large main image (500x500px)
   - Zoom on hover (2x zoom)
   - Thumbnail strip below (scrollable on mobile)
   - Click thumbnail to change main image
   - Previous/Next arrow buttons
   - Image counter "1 of 5"
   - Fullscreen button (lightbox)
   
   RIGHT COLUMN - Product Info:
   
   Header Section:
   - Product name (large, bold, H1)
   - Brand name as link
   - Star rating (★★★★☆ format) with count
   - Review count as link to reviews section
   - Product code/SKU
   
   Price Section:
   - Current price (₹1,299) - bold, large, color green
   - Original price (₹2,999) - strikethrough, gray
   - Discount percentage badge (50% OFF) - red
   - Savings amount (Save ₹1,700) - green
   - "In Stock" / "Out of Stock" indicator with color
   - "Only 3 left!" warning if stock ≤ 5
   
   Description Section:
   - Short description (1 paragraph)
   - Bullet points of key features
   - Material/Fabric info
   - Care instructions
   
   Options Section:
   - Size selection: grid of buttons (XS, S, M, L, XL, XXL)
     - Unavailable sizes greyed out with "Not available"
     - Click to select, show selected with highlight
   - Color selection: color swatches (20x20px circular)
     - Show hex code and color name on hover
     - Click to select
   
   Action Buttons:
   - "Add to Cart" (green, large, full width)
   - "Add to Wishlist" (heart icon, secondary)
   - "Share" (link icon, opens share menu)
   - Quantity selector (+/- buttons) next to Add to Cart
   
   Shipping/Delivery Info Box:
   - Free shipping badge if ₹500+
   - Delivery date estimate
   - "Easy returns" badge
   - "Authentic" badge

2. Product Info Tabs (components/Products/ProductTabs.tsx):
   - Tab 1: Description (full details)
   - Tab 2: Specifications (table format)
   - Tab 3: Shipping & Returns
   - Tab 4: Reviews (below this section)
   
   Make tabs clickable, show content for active tab.

3. Reviews Section (components/Reviews/ProductReviews.tsx):
   
   Reviews Summary:
   - Overall rating: 4.2/5
   - Total reviews: 1,203
   - Rating distribution bar chart:
     5★ ████████░░ 40%
     4★ ███████░░░ 35%
     3★ ████░░░░░░ 15%
     2★ ██░░░░░░░░ 7%
     1★ █░░░░░░░░░ 3%
   
   Review Filters:
   - Dropdown: "Helpful" / "Recent" / "Highest Rating" / "Lowest Rating"
   - Checkbox: "Verified Purchase" only
   
   Reviews List (show top 5, paginate):
   - Each review shows:
     * Rating (★★★★★)
     * Review title
     * Author name
     * Date (e.g., "2 weeks ago")
     * "Verified Purchase" badge if applicable
     * Review text
     * Images if user added any
     * Helpful count (+1 button)
     * "Unhelpful" option
   
   "Load More Reviews" button for pagination

4. Related Products (components/Products/RelatedProducts.tsx):
   - Show 5-6 related products (same category)
   - Product cards with image, name, price, rating
   - Carousel/slider on mobile
   - Grid layout on desktop

5. URL Routing:
   - Route: /product/:slug
   - Use slug to fetch product from Supabase
   - Handle 404 if product not found
   - Show loading skeleton while fetching

6. useProductDetail hook (hooks/useProductDetail.ts):
   - Fetch product by slug
   - Handle loading, error, success states
   - Cache product data for 5 minutes

Use TypeScript, Supabase for data, Tailwind CSS, React Router.
```

**Expected Result:**
- ✅ Product detail page shows full info
- ✅ Image gallery functional with zoom
- ✅ Size/color selection working
- ✅ Add to cart integrates with cart context
- ✅ Reviews display properly
- ✅ Related products shown

---

### FEATURE 3: Improve UI/UX (Loading States, Error Handling)

**What to paste in Cline:**

```
Improve UI/UX across the Bewakoof clone with loading states and error handling:

1. Loading Skeleton Components (components/Common/Skeletons/):
   
   ProductCardSkeleton.tsx:
   - Skeleton loader for product cards
   - Grey placeholder for image (w:300px, h:300px)
   - Shimmer animation (moving light effect)
   - Placeholder lines for name, price, rating
   
   ProductListSkeleton.tsx:
   - Grid of 12 ProductCardSkeletons
   - Responsive: 1 col mobile, 2 tablet, 4 desktop
   
   ProductDetailSkeleton.tsx:
   - Large image skeleton (500x500)
   - Title and description skeletons
   - Form field skeletons
   
   CartSkeleton.tsx:
   - Cart table rows skeletons
   - Cart summary skeleton

2. Error Boundary (components/Common/ErrorBoundary.tsx):
   - Catch React errors globally
   - Show fallback UI with error message
   - "Reload" button to retry
   - Log error to console

3. Error Pages:
   - 404 Page (pages/NotFound.tsx): Product not found, go back link
   - 500 Page (pages/ServerError.tsx): Something went wrong, reload button

4. Toast Notifications (components/Common/Toast.tsx):
   - Success toast (green): "Added to cart!", "Removed from cart"
   - Error toast (red): "Product out of stock", "Failed to add"
   - Info toast (blue): "Cart updated"
   - Warning toast (yellow): "Stock running low"
   - Auto-dismiss after 4 seconds
   - Close button manually
   - Stack multiple toasts (top-right corner)
   
   useToast hook (hooks/useToast.ts):
   - Show toast from anywhere: useToast().success("Message")

5. Empty States:
   - Empty cart: Image + "Your cart is empty" + "Continue Shopping" button
   - No search results: Image + "No products found" + "Try different search"
   - No reviews: "Be the first to review this product" + Review form

6. Fallback UI Components:
   - GlobalLoader (full page loading spinner)
   - MiniLoader (inline loading spinner)
   - ErrorMessage (styled error box with icon)
   - EmptyState (generic empty state template)

7. Loading States for Async Operations:
   - Product list page: Show 12 skeletons while loading
   - Product detail: Show skeleton until data loads
   - Cart operations: Disable buttons, show spinner on button text
   - Search: Show results skeleton while typing (debounced 300ms)

8. Error Handling Strategy:
   - Try-catch all async operations
   - Show specific error messages to users
   - Log errors with timestamps for debugging
   - Provide "Retry" buttons where applicable
   - Don't expose internal error details to users

All with Tailwind CSS animations, TypeScript, proper accessibility.
```

**Expected Result:**
- ✅ Smooth loading states with skeletons
- ✅ Professional error handling
- ✅ Toast notifications working
- ✅ Empty states for all scenarios
- ✅ Better overall UX

---

### Phase 1 Summary

After completing these 3 immediate features:

- ✅ **Shopping cart** fully functional with localStorage
- ✅ **Product detail pages** with full information display
- ✅ **Professional UX** with loading states and error handling
- ✅ Frontend completely usable as standalone progressive web app
- ⏳ Data still hardcoded (will connect to backend next phase)

**Estimated Time:** 5-10 hours of AI work + 2-3 hours testing

---

# PART 4: SHORT-TERM PHASE - BACKEND SETUP
## Timeline: Next 2-4 Weeks (40-60 hours)

### BACKEND ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│              (Cline generates 15 features)               │
└────────────────────┬────────────────────────────────────┘
                     │ API Calls (fetch, axios)
                     ↓
┌─────────────────────────────────────────────────────────┐
│              Express.js REST API                         │
│  - Authentication endpoints (login, register, logout)   │
│  - Product endpoints (list, detail, search, filter)     │
│  - Cart endpoints (get, add, remove, update)            │
│  - Order endpoints (create, list, detail, track)        │
│  - Payment endpoints (create, verify, webhook)          │
│  - Admin endpoints (dashboard, products, orders)        │
└────────────────────┬────────────────────────────────────┘
                     │ SQL Queries
                     ↓
┌─────────────────────────────────────────────────────────┐
│         PostgreSQL Database (via Supabase)              │
│  - users, products, categories, carts, orders, payments │
│  - reviews, wishlist, returns, coupons, analytics       │
└─────────────────────────────────────────────────────────┘
```

### FEATURE 1: Backend Project Setup & Structure

**What to paste in Cline:**

```
Set up the backend for Bewakoof clone using Node.js + Express + TypeScript:

1. Create folder structure:
   backend/
   ├── src/
   │   ├── config/
   │   │   ├── database.ts (Supabase connection)
   │   │   ├── env.ts (environment variables)
   │   │   └── constants.ts
   │   ├── middleware/
   │   │   ├── auth.ts (JWT verification)
   │   │   ├── errorHandler.ts
   │   │   ├── corsHandler.ts
   │   │   └── requestLogger.ts
   │   ├── routes/
   │   │   ├── auth.routes.ts
   │   │   ├── products.routes.ts
   │   │   ├── cart.routes.ts
   │   │   ├── orders.routes.ts
   │   │   ├── payments.routes.ts
   │   │   └── admin.routes.ts
   │   ├── controllers/
   │   │   ├── auth.controller.ts
   │   │   ├── products.controller.ts
   │   │   ├── cart.controller.ts
   │   │   ├── orders.controller.ts
   │   │   └── payments.controller.ts
   │   ├── services/
   │   │   ├── auth.service.ts
   │   │   ├── product.service.ts
   │   │   ├── cart.service.ts
   │   │   ├── order.service.ts
   │   │   ├── payment.service.ts
   │   │   └── email.service.ts
   │   ├── types/
   │   │   ├── express.d.ts (extend Express Request)
   │   │   ├── api.types.ts
   │   │   └── database.types.ts
   │   ├── utils/
   │   │   ├── jwt.ts
   │   │   ├── validation.ts
   │   │   ├── response.ts
   │   │   └── logger.ts
   │   └── index.ts (main server file)
   ├── .env.example
   ├── .env (add to .gitignore)
   ├── package.json
   ├── tsconfig.json
   └── README.md

2. Initialize package.json with dependencies:
   - express
   - typescript
   - ts-node
   - cors
   - dotenv
   - jsonwebtoken
   - bcryptjs
   - @supabase/supabase-js
   - axios (for external API calls)
   - express-validator
   - morgan (logging)

3. Create main server file (src/index.ts):
   - Initialize Express app
   - Load environment variables
   - Set up middleware (CORS, bodyParser, logger)
   - Connect to Supabase
   - Register routes
   - Error handling middleware
   - Start server on port 5000

4. Environment variables (.env):
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - JWT_SECRET
   - NODE_ENV (development/production)
   - PORT (5000)
   - STRIPE_SECRET_KEY (for later)
   - RAZORPAY_KEY_ID (for later)

5. TypeScript config (tsconfig.json):
   - Target: ES2020
   - Module: commonjs
   - Strict: true
   - Esm interop: true
   - Resolve json module: true

6. Create npm scripts:
   - "dev": "ts-node src/index.ts" (development)
   - "build": "tsc" (compile)
   - "start": "node dist/index.js" (production)
   - "lint": "eslint src/**/*.ts"

Use TypeScript, Express best practices, proper error handling.
```

**Expected Result:**
- ✅ Backend folder structure created
- ✅ Express server runs on port 5000
- ✅ TypeScript configured properly
- ✅ Environment variables setup
- ✅ Basic middleware configured

---

### FEATURE 2: Authentication API (JWT)

**What to paste in Cline:**

```
Implement JWT-based authentication API:

1. Auth Service (src/services/auth.service.ts):
   - generateToken(userId, expiresIn: "7d"): string
   - verifyToken(token: string): object | null
   - hashPassword(password: string): string
   - comparePassword(password: string, hash: string): boolean
   - validateEmail(email: string): boolean
   - validatePassword(password: string): boolean
   
2. Auth Routes (src/routes/auth.routes.ts):
   
   POST /auth/register:
   - Body: { email, password, confirmPassword, firstName, lastName }
   - Validate email format
   - Check if user already exists
   - Validate password (min 8 chars, 1 uppercase, 1 number, 1 special)
   - Hash password with bcryptjs
   - Create user in Supabase auth
   - Store user profile in users table
   - Return: { userId, email, firstName, lastName }
   
   POST /auth/login:
   - Body: { email, password }
   - Find user by email
   - Compare password
   - Generate JWT token (7-day expiry)
   - Return: { token, user: { id, email, firstName, lastName, role } }
   - Set refresh token in HttpOnly cookie (14-day expiry)
   
   POST /auth/logout:
   - Clear refresh token cookie
   - Return: { message: "Logged out successfully" }
   
   POST /auth/refresh:
   - Accept refresh token from cookie
   - Verify refresh token
   - Generate new access token
   - Return: { token }
   
   GET /auth/me:
   - Require auth middleware
   - Return current user profile
   
   POST /auth/forgot-password:
   - Body: { email }
   - Generate password reset token (1 hour expiry)
   - Send email with reset link
   - Return: { message: "Check your email" }
   
   POST /auth/reset-password:
   - Body: { token, newPassword, confirmPassword }
   - Verify reset token
   - Update password
   - Invalidate old refresh tokens
   - Return: { message: "Password updated" }

3. Auth Middleware (src/middleware/auth.ts):
   - Extract token from Authorization header
   - Verify JWT signature
   - Attach user data to req.user
   - Return 401 if token invalid/expired
   
4. Types (src/types/api.types.ts):
   - User interface
   - AuthRequest/AuthResponse types
   - JWTPayload type

5. Database Schema (create in Supabase):

   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     auth_id UUID REFERENCES auth.users(id),
     email VARCHAR(255) NOT NULL UNIQUE,
     first_name VARCHAR(100),
     last_name VARCHAR(100),
     phone VARCHAR(20),
     avatar_url VARCHAR(500),
     role VARCHAR(20) DEFAULT 'customer', -- customer, admin
     email_verified BOOLEAN DEFAULT FALSE,
     last_login TIMESTAMP,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE password_reset_tokens (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES users(id),
     token VARCHAR(500) NOT NULL UNIQUE,
     expires_at TIMESTAMP NOT NULL,
     used_at TIMESTAMP,
     created_at TIMESTAMP DEFAULT NOW()
   );

Use TypeScript, bcryptjs, jsonwebtoken, Supabase, proper error handling.
```

**Expected Result:**
- ✅ User registration working
- ✅ User login with JWT tokens
- ✅ Password reset flow
- ✅ Protected routes working
- ✅ Refresh token mechanism

---

### FEATURE 3: Product API & Database Schema

**What to paste in Cline:**

```
Create product API and set up database schema:

1. Database Schema (create in Supabase SQL):

   CREATE TABLE categories (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name VARCHAR(100) NOT NULL UNIQUE,
     slug VARCHAR(100) NOT NULL UNIQUE,
     description TEXT,
     image_url VARCHAR(500),
     display_order INTEGER DEFAULT 0,
     is_active BOOLEAN DEFAULT TRUE,
     created_at TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE products (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name VARCHAR(255) NOT NULL,
     slug VARCHAR(255) NOT NULL UNIQUE,
     description TEXT,
     short_description VARCHAR(500),
     category_id UUID NOT NULL REFERENCES categories(id),
     brand VARCHAR(100),
     price DECIMAL(10, 2) NOT NULL,
     original_price DECIMAL(10, 2),
     discount_percentage INTEGER DEFAULT 0,
     thumbnail_url VARCHAR(500),
     stock INTEGER DEFAULT 0,
     sku VARCHAR(100) UNIQUE,
     avg_rating DECIMAL(3, 2) DEFAULT 0,
     review_count INTEGER DEFAULT 0,
     is_active BOOLEAN DEFAULT TRUE,
     is_featured BOOLEAN DEFAULT FALSE,
     tags TEXT[],
     material VARCHAR(100),
     care_instructions TEXT,
     shipping_info TEXT,
     return_policy TEXT,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE product_images (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
     image_url VARCHAR(500) NOT NULL,
     alt_text VARCHAR(255),
     display_order INTEGER DEFAULT 0,
     created_at TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE product_variants (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
     size VARCHAR(20),
     color VARCHAR(50),
     color_hex VARCHAR(7),
     stock INTEGER DEFAULT 0,
     sku VARCHAR(100),
     created_at TIMESTAMP DEFAULT NOW()
   );

2. Product Routes (src/routes/products.routes.ts):
   
   GET /products:
   - Query params: page=1, limit=20, category=?, search=?, sort=?, minPrice=?, maxPrice=?
   - Return paginated products with category filter, search, price range
   - Response: { products: [...], total, page, totalPages }
   
   GET /products/:slug:
   - Return single product with images and variants
   - Include related products (5 random from same category)
   
   GET /products/category/:categorySlug:
   - Return all products in category with pagination
   
   GET /categories:
   - Return all active categories
   
   GET /search?q=keyword:
   - Full-text search on product name, brand, tags
   - Return top 20 matches with images

3. Product Controller (src/controllers/products.controller.ts):
   - getProducts() - with filtering, sorting, pagination
   - getProductBySlug()
   - getProductsByCategory()
   - getCategories()
   - searchProducts()
   - Each with error handling

4. Product Service (src/services/product.service.ts):
   - Query Supabase with filters
   - Apply sorting (recommended, price_asc, price_desc, newest, best_seller, rating)
   - Implement pagination
   - Cache results (1 hour) using simple in-memory cache or Redis

5. Seed Data (create seed script):
   - Create 5 categories: Men, Women, Kids, Accessories, Sports
   - Create 50+ products with realistic data
   - Add 3-5 images per product
   - Add variants (sizes, colors)
   - Set various prices, discounts, ratings

Use Supabase, TypeScript, proper pagination, error handling.
```

**Expected Result:**
- ✅ Product schema created
- ✅ Get products with filters API working
- ✅ Search API functional
- ✅ Categories API working
- ✅ 50+ sample products seeded

---

### FEATURE 4: Cart & Order Management API

**What to paste in Cline:**

```
Implement cart and order management APIs:

1. Database Schema:

   CREATE TABLE carts (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW(),
     UNIQUE(user_id)
   );

   CREATE TABLE cart_items (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
     product_id UUID NOT NULL REFERENCES products(id),
     quantity INTEGER NOT NULL DEFAULT 1,
     selected_size VARCHAR(20),
     selected_color VARCHAR(50),
     price_at_add DECIMAL(10, 2),
     added_at TIMESTAMP DEFAULT NOW(),
     UNIQUE(cart_id, product_id, selected_size, selected_color)
   );

   CREATE TABLE orders (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     order_number VARCHAR(50) NOT NULL UNIQUE,
     user_id UUID NOT NULL REFERENCES users(id),
     subtotal DECIMAL(10, 2),
     shipping_cost DECIMAL(10, 2) DEFAULT 0,
     tax DECIMAL(10, 2),
     discount DECIMAL(10, 2) DEFAULT 0,
     total DECIMAL(10, 2),
     status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, shipped, delivered, cancelled
     shipping_address JSONB,
     billing_address JSONB,
     payment_method VARCHAR(50),
     delivery_date DATE,
     notes TEXT,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE order_items (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
     product_id UUID NOT NULL REFERENCES products(id),
     quantity INTEGER NOT NULL,
     size VARCHAR(20),
     color VARCHAR(50),
     unit_price DECIMAL(10, 2),
     subtotal DECIMAL(10, 2),
     created_at TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE addresses (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     address_type VARCHAR(20), -- billing, shipping, both
     full_name VARCHAR(100),
     phone VARCHAR(20),
     street VARCHAR(255),
     city VARCHAR(100),
     state VARCHAR(100),
     postal_code VARCHAR(20),
     country VARCHAR(100) DEFAULT 'India',
     is_default BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP DEFAULT NOW()
   );

2. Cart Routes (require auth):
   
   GET /cart:
   - Return user's cart with items
   - Response: { items, subtotal, itemCount }
   
   POST /cart/items:
   - Body: { productId, quantity, size, color }
   - Add item to cart
   - If item exists, update quantity
   
   PUT /cart/items/:itemId:
   - Body: { quantity }
   - Update item quantity
   
   DELETE /cart/items/:itemId:
   - Remove item from cart
   
   DELETE /cart:
   - Clear entire cart

3. Order Routes (require auth):
   
   POST /orders:
   - Body: { cartItems, shippingAddressId, billingAddressId, paymentMethod }
   - Create order from cart
   - Clear cart after order creation
   - Return: { orderId, orderNumber }
   
   GET /orders:
   - Return all orders for user (paginated)
   - Response: { orders: [...], total, page }
   
   GET /orders/:orderId:
   - Return single order with items and status history
   
   PUT /orders/:orderId/cancel:
   - Cancel order if status is 'pending'

4. Address Routes (require auth):
   
   GET /addresses:
   - Return all addresses for user
   
   POST /addresses:
   - Body: { fullName, phone, street, city, state, postalCode, type }
   - Create new address
   
   PUT /addresses/:addressId:
   - Update address
   
   DELETE /addresses/:addressId:
   - Delete address

5. Controllers:
   - CartController: get, addItem, updateItem, removeItem, clear
   - OrderController: create, list, getById, cancel
   - AddressController: list, create, update, delete

Use TypeScript, Supabase, auth middleware, validation.
```

**Expected Result:**
- ✅ Cart management working
- ✅ Order creation from cart
- ✅ User addresses management
- ✅ Order tracking setup
- ✅ Proper auth checks

---

### Phase 2 Summary (Short-term)

After completing backend setup:

- ✅ **Express API server** running on port 5000
- ✅ **Authentication system** with JWT tokens
- ✅ **Product API** with filtering and search
- ✅ **Cart management** API
- ✅ **Order management** API
- ✅ **Database schema** in Supabase
- ✅ **50+ sample products** seeded

**Time to Complete:** 2-4 weeks (40-60 hours)

**Next Step:** Connect frontend to backend APIs

---

# PART 5: MEDIUM-TERM PHASE - PRODUCTION FEATURES
## Timeline: 1-2 Months (80-120 hours)

### FEATURE 1: Payment Integration (Stripe + Razorpay)

**What to paste in Cline:**

```
Integrate Stripe and Razorpay payment processing:

1. Stripe Setup:
   - Create .env variables: STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY
   - Install stripe npm package
   
2. Razorpay Setup:
   - Create .env variables: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
   - Install razorpay npm package

3. Payment Routes:
   
   POST /payments/create-intent:
   - Body: { orderId, amount, currency: 'INR' }
   - Create Stripe PaymentIntent
   - Return: { clientSecret }
   
   POST /payments/razorpay-order:
   - Body: { orderId, amount }
   - Create Razorpay order
   - Return: { orderId, key, amount }
   
   POST /payments/verify:
   - Body: { paymentId, signature, orderId }
   - Verify payment with Stripe/Razorpay
   - Update order status to 'confirmed'
   - Send confirmation email
   
   POST /payments/webhook:
   - Handle Stripe/Razorpay webhooks
   - Update order status
   - Send notifications

4. Payment Frontend (React components):
   - PaymentPage with Stripe Elements
   - Razorpay payment button
   - UPI payment option
   - COD (Cash on Delivery) option

Use Stripe SDK, Razorpay SDK, webhook security.
```

### FEATURE 2: Admin Dashboard & Analytics

**What to paste in Cline:**

```
Build admin dashboard with analytics:

1. Admin Routes (require admin role):
   
   GET /admin/dashboard:
   - Return: { totalOrders, totalRevenue, newCustomers, topProducts }
   
   GET /admin/analytics:
   - Revenue trend (last 30 days)
   - Order trend (last 30 days)
   - Customer growth
   - Return: { data: [...], charts }
   
   GET /admin/products:
   - Manage products: list, create, update, delete
   
   GET /admin/orders:
   - View all orders, update status
   
   GET /admin/customers:
   - View all customers, customer details

2. Frontend Admin Pages:
   - AdminDashboard: KPI cards, revenue chart, order chart
   - ProductManagement: Product list, add/edit form, bulk operations
   - OrderManagement: Order list, order detail, status updates
   - CustomerManagement: Customer list, customer detail, export
```

### FEATURE 3: Email Notifications

**What to paste in Cline:**

```
Set up SendGrid for email notifications:

1. SendGrid Integration:
   - Create SENDGRID_API_KEY env variable
   - Install @sendgrid/mail package

2. Email Templates:
   - Verification email
   - Welcome email
   - Order confirmation
   - Order shipped
   - Order delivered
   - Password reset
   - Promotion/newsletter

3. Email Service (services/email.service.ts):
   - sendOrderConfirmation()
   - sendShippedNotification()
   - sendPasswordResetEmail()
   - etc.
```

### FEATURE 4: Advanced Features

**What to paste in Cline:**

```
Implement advanced e-commerce features:

1. Coupons & Discounts:
   - Coupon API (create, validate, apply)
   - Coupon types: percentage, fixed, BOGO
   - Usage tracking and limits

2. Wishlist:
   - Wishlist API (add, remove, list)
   - Move to cart from wishlist

3. Reviews & Ratings:
   - Review API (create, update, delete, list)
   - Rating aggregation
   - Helpful votes

4. Returns & Exchanges:
   - Return request API
   - Return status tracking
   - Refund processing

5. User Analytics:
   - Track user behavior
   - Personalized recommendations
   - Email marketing integration

6. Inventory Management:
   - Low stock alerts
   - Auto-reorder alerts
   - Stock level updates
```

---

# PART 6: IMPLEMENTATION TIMELINE

## Week-by-Week Breakdown

### IMMEDIATE (Week 1):
```
Monday-Tuesday:
- [x] Setup React + TypeScript + Tailwind
- [x] Create initial product/category components
- [ ] → ITERATION 1: Auth system
- [ ] → ITERATION 2: Product catalog
- [ ] → ITERATION 3: Search & filters

Wednesday-Friday:
- [ ] → ITERATION 4: Product details + Cart
- [ ] → ITERATION 5: Wishlist & recommendations
- [ ] → ITERATION 6: Reviews & ratings
- [x] Manual testing & bug fixes

Weekend:
- [x] UI/UX improvements
- [x] Performance optimization
- [x] Responsive design tweaks
```

### SHORT-TERM (Weeks 2-3):
```
Week 2:
- [ ] Backend setup (Express + TypeScript)
- [ ] Database schema (Supabase)
- [ ] Auth API implementation
- [ ] Product API with filters

Week 3:
- [ ] Cart API
- [ ] Order management API
- [ ] Frontend-backend integration
- [ ] Testing & bug fixes
```

### MEDIUM-TERM (Weeks 4-8):
```
Week 4-5:
- [ ] Payment integration (Stripe + Razorpay)
- [ ] Checkout flow
- [ ] Order confirmation

Week 6:
- [ ] Admin dashboard
- [ ] Product management
- [ ] Order management

Week 7:
- [ ] Email notifications
- [ ] Advanced features
- [ ] Analytics

Week 8:
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Production deployment
```

---

# PART 7: TECHNOLOGY STACK DEEP DIVE

## Frontend Stack

| Technology | Purpose | Why |
|---|---|---|
| **React 18** | UI library | Component-based, fast, large ecosystem |
| **TypeScript** | Type safety | Catch errors early, better IDE support |
| **Tailwind CSS** | Styling | Utility-first, fast, responsive |
| **React Router** | Routing | Client-side navigation |
| **React Context** | State management | Simple, no extra dependencies initially |
| **Vite** | Build tool | Fast builds, great DX |
| **localStorage** | Client-side storage | Cart persistence |

### Frontend Project Structure:
```
src/
├── components/
│   ├── Common/ (Header, Footer, Navbar)
│   ├── Products/ (ProductCard, ProductList, etc.)
│   ├── Cart/ (CartPage, CartSummary)
│   ├── Auth/ (LoginPage, RegisterPage)
│   ├── Checkout/ (CheckoutPage, PaymentPage)
│   └── Admin/ (Dashboard, OrderManagement)
├── pages/
│   ├── HomePage.tsx
│   ├── ProductDetailPage.tsx
│   ├── CartPage.tsx
│   ├── CheckoutPage.tsx
│   └── AdminDashboard.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useCart.ts
│   ├── useProducts.ts
│   └── useToast.ts
├── context/
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   └── ToastContext.tsx
├── services/
│   ├── api.ts (fetch wrapper)
│   ├── auth.service.ts
│   ├── product.service.ts
│   └── cart.service.ts
├── types/
│   ├── index.ts
│   ├── auth.ts
│   ├── products.ts
│   └── cart.ts
└── App.tsx
```

## Backend Stack

| Technology | Purpose | Why |
|---|---|---|
| **Node.js** | Runtime | JavaScript everywhere |
| **Express.js** | Web framework | Minimal, flexible, mature |
| **TypeScript** | Type safety | Catch errors, better code quality |
| **PostgreSQL** | Database | Relational, powerful, free (Supabase) |
| **Supabase** | Backend-as-a-Service | PostgreSQL + Auth + Real-time APIs |
| **JWT** | Authentication | Stateless, scalable, secure |
| **Stripe + Razorpay** | Payments | Secure, PCI-compliant |
| **SendGrid** | Email | Reliable delivery, good rates |

### Backend Project Structure:
```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── env.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── corsHandler.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── products.routes.ts
│   │   ├── cart.routes.ts
│   │   ├── orders.routes.ts
│   │   └── payments.routes.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── products.controller.ts
│   │   ├── cart.controller.ts
│   │   └── orders.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── product.service.ts
│   │   ├── cart.service.ts
│   │   ├── order.service.ts
│   │   ├── payment.service.ts
│   │   └── email.service.ts
│   ├── types/
│   │   ├── api.types.ts
│   │   └── database.types.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── validation.ts
│   │   └── logger.ts
│   └── index.ts
└── package.json
```

## Database Schema Overview

### Core Tables:
- **users**: User accounts and profiles
- **products**: Product catalog
- **categories**: Product categories
- **product_images**: Product photos
- **product_variants**: Sizes, colors, stock
- **carts**: Shopping carts
- **cart_items**: Items in carts
- **orders**: Customer orders
- **order_items**: Items in orders
- **addresses**: Shipping/billing addresses
- **reviews**: Product reviews
- **wishlist**: Saved items
- **coupons**: Discount codes
- **payments**: Payment records

---

# PART 8: TROUBLESHOOTING

### Issue: Cline response is slow (>3 min)

**Solution:**
- Reduce prompt length (split into smaller chunks)
- Close other heavy applications
- Check LM Studio isn't maxing out CPU
- Restart LM Studio if needed

### Issue: Generated code has TypeScript errors

**Solution:**
```
Message Cline:
"There's a TypeScript error in [FileName].tsx.
The type 'User' is not defined. 
Add it to types/auth.ts and import it."
```

Cline will fix automatically.

### Issue: npm run build fails

**Solution:**
```
Message Cline:
"npm run build is failing.
Error: Cannot find module '@supabase/supabase-js'.
Install all dependencies and fix imports."
```

### Issue: Backend API not responding

**Solution:**
1. Check server is running: `npm run dev` in backend folder
2. Verify port 5000 is available
3. Check .env variables are set
4. Check Supabase connection string

### Issue: Frontend can't connect to backend

**Solution:**
1. Make sure backend API is running
2. Check CORS is enabled in Express
3. Verify API endpoint URLs in frontend
4. Check Network tab in DevTools for errors

### Issue: Cart not persisting

**Solution:**
```
Message Cline:
"The cart is not persisting to localStorage.
Debug the CartContext saveToLocalStorage function
and verify localStorage is working."
```

---

# NEXT STEPS

## Immediate Action Items:

1. **Verify Setup:**
   - [ ] LM Studio running with OpenHermes
   - [ ] Cline configured in VS Code
   - [ ] React project with TypeScript ready
   - [ ] npm run dev working

2. **Start Building:**
   - [ ] Copy FEATURE 1 prompt from PART 3
   - [ ] Open Cline in VS Code
   - [ ] Paste the prompt
   - [ ] Watch Cline build 
   - [ ] Test in browser
   - [ ] Move to next feature

3. **This Week (Immediate):**
   - [ ] Shopping cart (frontend + localStorage)
   - [ ] Product detail pages
   - [ ] UI/UX improvements

4. **Next 2-4 Weeks (Short-term):**
   - [ ] Backend setup
   - [ ] Authentication API
   - [ ] Product + Cart APIs

5. **1-2 Months (Medium-term):**
   - [ ] Payment integration
   - [ ] Admin dashboard
   - [ ] Email notifications

---

# DEVELOPER QUICK REFERENCE

## Cline Prompt Template

```
I'm building a Bewakoof clone with [STACK].

Create [COMPONENT/FEATURE] with:
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]
- TypeScript types
- Tailwind CSS styling
- Error handling
- Loading states

Use [LIBRARIES]. Make it production-ready.
```

## Common Commands

```bash
# Frontend
npm run dev                 # Start dev server
npm run build             # Build for production
npm run lint              # Check TypeScript

# Backend
npm run dev               # Start dev server (backend)
npm run build            # Build
npm start                # Production start

# Database
# Open Supabase dashboard and run SQL
```

## API Endpoint Structure

```
Auth:
  POST /auth/register
  POST /auth/login
  POST /auth/logout
  GET  /auth/me

Products:
  GET  /products
  GET  /products/:slug
  GET  /categories

Cart:
  GET  /cart
  POST /cart/items
  PUT  /cart/items/:id
  DEL  /cart/items/:id

Orders:
  POST /orders
  GET  /orders
  GET  /orders/:id

Admin:
  GET  /admin/dashboard
  GET  /admin/analytics
  POST /admin/products
  PUT  /admin/orders/:id/status
```

---

# FINAL CHECKLIST

Before you start, make sure you have:

- [ ] LM Studio running with model loaded
- [ ] VS Code with Cline installed
- [ ] React project with TypeScript ready
- [ ] npm run dev working (localhost:5173)
- [ ] Supabase account + project created
- [ ] .env files with API keys ready
- [ ] Node.js v18+ installed
- [ ] This guide bookmarked for reference

**Everything checked? 🎉 You're ready to build your Bewakoof clone!**

---

# RESOURCES & LINKS

- [Supabase Documentation](https://supabase.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [React TypeScript Cheat Sheet](https://react-typescript-cheatsheet.netlify.app/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Razorpay Integration Guide](https://razorpay.com/docs/)

---

**Last Updated:** November 13, 2025  
**For Cline Agent:** This document serves as the master implementation guide for the Bewakoof clone project. Reference this for all development decisions and architectural choices.
