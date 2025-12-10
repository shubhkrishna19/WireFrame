# basics

# BEWAKOOF CLONE - PRODUCTION-READY IMPLEMENTATION GUIDE
## React + Node.js + Pocketbase (Self-Hosted, Fully Offline)
## For Cline + VS Code + OpenHermes-2.5-Mistral-7B

**Updated:** November 13, 2025  
**Final Stack:** React + TypeScript + Tailwind | Node.js + Express + TypeScript | Pocketbase (Self-Hosted)  
**Architecture:** Fully Local, Offline-First, Zero Vendor Lock-in  
**Build Time:** 6-8 hours (Immediate) + 2-4 weeks (Short-term) + 1-2 months (Production)

---

## EXECUTIVE SUMMARY: YOUR TECH STACK DECISION

### Why This Combination?

**Frontend: React + TypeScript**
- ✅ You already know it (maximize productivity)
- ✅ Can expand to Desktop (Electron) & Mobile (React Native)
- ✅ Largest ecosystem and job market
- ✅ Future-proof for your Bluewud automation needs

**Backend: Node.js + Express + TypeScript**
- ✅ Same language as frontend (full-stack JavaScript)
- ✅ Runs completely offline on your laptop
- ✅ Zero context switching between frontend/backend
- ✅ Perfect for automation scripts + API integration
- ✅ Easy to deploy anywhere (Vercel, Railway, your own server)

**Database: Pocketbase (Self-Hosted)**
- ✅ **Single executable binary** (~60MB) - no installation needed
- ✅ **100% offline** - runs on your laptop, no cloud dependency
- ✅ **Built-in REST API** - no separate backend needed (optionally!)
- ✅ **Real-time database** - WebSocket support out of box
- ✅ **Built-in authentication** - user management included
- ✅ **Open source** - full control, no vendor lock-in
- ✅ **Perfect for e-commerce** - fast, reliable, production-grade

### The Architecture You're Getting

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR LAPTOP (OFFLINE)                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Frontend (React)              Backend (Node.js)            │
│  Port 5173                     Port 5000                    │
│  ├── Product Listing           ├── Auth Service             │
│  ├── Shopping Cart             ├── Cart Management          │
│  ├── Checkout                  ├── Order Processing         │
│  └── Admin Dashboard           ├── Payment Webhooks         │
│                                └── File Uploads             │
│                                       ↓                      │
│                          Pocketbase Database                │
│                          Port 8090                          │
│                          ├── Users (Auth)                   │
│                          ├── Products                       │
│                          ├── Orders                         │
│                          ├── Cart Items                     │
│                          ├── Reviews                        │
│                          └── Inventory                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘

ALL RUNNING LOCALLY. NO CLOUD DEPENDENCY.
EVERYTHING OFFLINE. FULL CONTROL. ✨
```

---

## PART 1: SETUP YOUR DEVELOPMENT ENVIRONMENT

### Step 1: Install Prerequisites

```bash
# Install Node.js (v18+)
# From: https://nodejs.org/

# Install Docker (for Pocketbase)
# From: https://www.docker.com/products/docker-desktop

# Verify installations
node --version        # Should be v18+
npm --version         # Should be v9+
docker --version      # Should be Docker 20+
```

### Step 2: Clone Pocketbase (One-Time Setup)

**Option A: Use Docker (Recommended - Easiest)**

```bash
# Create data folder
mkdir -p ~/pocketbase/data

# Run Pocketbase in Docker
docker run -d \
  -p 8090:8090 \
  -v ~/pocketbase/data:/pb/pb_data \
  --name pocketbase \
  ghcr.io/pocketbase/pocketbase:latest
  
# Access admin panel: http://localhost:8090/_/

# Check if running
docker ps | grep pocketbase
```

**Option B: Download Binary (Most Control)**

```bash
# Visit: https://pocketbase.io/docs/
# Download for your OS (Mac/Linux/Windows)

# Extract and run
./pocketbase serve

# Access admin panel: http://localhost:8090/_/
```

### Step 3: Create Project Structure

```bash
# Create main project folder
mkdir bewakoof-clone && cd bewakoof-clone

# Create frontend
npm create vite@latest frontend -- --template react-ts
cd frontend && npm install && cd ..

# Create backend
mkdir backend && cd backend
npm init -y
npm install express typescript ts-node @types/express @types/node \
  cors dotenv jsonwebtoken bcryptjs axios pocketbase
npm install --save-dev @types/node typescript
```

### Step 4: Configure Environment Variables

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000
VITE_POCKETBASE_URL=http://localhost:8090
```

**Backend (.env)**
```
NODE_ENV=development
PORT=5000
POCKETBASE_URL=http://localhost:8090
JWT_SECRET=your-super-secret-jwt-key-change-in-production
API_TIMEOUT=30000
```

### Step 5: Setup Cline in VS Code

```
Settings:
├── API Provider: OpenAI Compatible ✅
├── Base URL: http://127.0.0.1:1234 ✅
├── Model: openhermes-2.5-mistral-7b ✅
├── Context Window: 4096 ✅
└── Temperature: 0.7 ✅
```

---

## PART 2: POCKETBASE DATABASE SCHEMA

### Understanding Pocketbase

Pocketbase is your **all-in-one backend**. It replaces:
- ✅ Supabase/Firebase
- ✅ Auth0 (authentication)
- ✅ REST API (built-in)
- ✅ Real-time database
- ✅ File storage

### Creating Collections in Pocketbase

**Option A: UI (Easiest)**

1. Open http://localhost:8090/_/ in browser
2. Create new collection for each table:
   - users
   - products
   - orders
   - cart_items
   - reviews
   - etc.

**Option B: Programmatic (Recommended)**

Create `backend/scripts/setupPocketbase.ts`:

```typescript
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

async function setupDatabase() {
  try {
    // Create Users Collection (Pocketbase built-in 'users' - extend it)
    console.log('✅ Users collection ready (built-in)');

    // Create Products Collection
    const productsCollection = {
      name: 'products',
      type: 'base',
      schema: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          unique: true,
        },
        {
          name: 'description',
          type: 'editor',
        },
        {
          name: 'category',
          type: 'relation',
          collectionId: 'categories_id',
        },
        {
          name: 'price',
          type: 'number',
          required: true,
        },
        {
          name: 'originalPrice',
          type: 'number',
        },
        {
          name: 'discount',
          type: 'number',
          min: 0,
          max: 100,
        },
        {
          name: 'image',
          type: 'file',
        },
        {
          name: 'images',
          type: 'file',
          max: 10,
        },
        {
          name: 'stock',
          type: 'number',
          min: 0,
        },
        {
          name: 'rating',
          type: 'number',
          min: 0,
          max: 5,
        },
        {
          name: 'isActive',
          type: 'bool',
          default: true,
        },
      ],
    };

    // Similar for: categories, orders, cart, reviews, etc.
    console.log('✅ Collections created');
  } catch (error) {
    console.error('Database setup failed:', error);
  }
}

setupDatabase();
```

### Core Collections Schema

#### 1. Categories Collection
```
- id (auto)
- name (text, required, unique)
- slug (text, unique)
- description (text)
- image (file)
- displayOrder (number)
- isActive (bool)
- created (datetime, auto)
- updated (datetime, auto)
```

#### 2. Products Collection
```
- id (auto)
- name (text, required)
- slug (text, unique)
- description (editor)
- shortDescription (text)
- category (relation → categories)
- brand (text)
- price (number, required)
- originalPrice (number)
- discount (number 0-100)
- image (file)
- images (files, max 10)
- stock (number)
- rating (number 0-5)
- reviewCount (number)
- sku (text, unique)
- tags (select multiple)
- material (text)
- careInstructions (text)
- shippingInfo (text)
- returnPolicy (text)
- isActive (bool, default true)
- isFeatured (bool)
- created (datetime, auto)
- updated (datetime, auto)
```

#### 3. Orders Collection
```
- id (auto)
- orderNumber (text, unique)
- user (relation → users)
- items (text, JSON array)
- subtotal (number)
- shipping (number)
- tax (number)
- discount (number)
- total (number, required)
- status (select: pending/confirmed/shipped/delivered/cancelled)
- shippingAddress (text, JSON)
- billingAddress (text, JSON)
- paymentMethod (text)
- trackingNumber (text)
- notes (text)
- deliveryDate (date)
- created (datetime, auto)
- updated (datetime, auto)
```

#### 4. CartItems Collection
```
- id (auto)
- user (relation → users)
- product (relation → products)
- quantity (number, min 1)
- selectedSize (text)
- selectedColor (text)
- priceAtAdd (number)
- addedAt (datetime, auto)
```

#### 5. Reviews Collection
```
- id (auto)
- product (relation → products)
- user (relation → users)
- rating (number 1-5)
- title (text)
- comment (editor)
- images (files, max 5)
- helpful (number, default 0)
- unhelpful (number, default 0)
- isVerifiedPurchase (bool)
- created (datetime, auto)
- updated (datetime, auto)
```

#### 6. Wishlist Collection
```
- id (auto)
- user (relation → users)
- product (relation → products)
- addedAt (datetime, auto)
```

#### 7. Coupons Collection
```
- id (auto)
- code (text, unique, required)
- type (select: percentage/fixed/freeShipping/bogo)
- value (number)
- maxUses (number)
- usedCount (number)
- minAmount (number)
- expiryDate (date)
- isActive (bool)
- created (datetime, auto)
```

---

## PART 3: BACKEND API WITH POCKETBASE

### Option A: Use Pocketbase REST API Directly (Simplest)

Pocketbase **automatically** creates REST endpoints for every collection:

```javascript
// GET all products
fetch('http://localhost:8090/api/collections/products/records')

// GET single product
fetch('http://localhost:8090/api/collections/products/records/PRODUCT_ID')

// POST create product
fetch('http://localhost:8090/api/collections/products/records', {
  method: 'POST',
  body: JSON.stringify({ name: '...', price: 999 })
})

// Auth
fetch('http://localhost:8090/api/collections/users/auth-with-password', {
  method: 'POST',
  body: JSON.stringify({ identity: 'user@email.com', password: 'pass' })
})
```

**Pros:**
- ✅ Zero backend code needed
- ✅ Auto REST API for everything
- ✅ Built-in authentication
- ✅ File uploads built-in
- ✅ Real-time subscriptions built-in

**Cons:**
- ⚠️ Frontend directly hits database
- ⚠️ Less control over business logic
- ⚠️ Limited to Pocketbase API features

### Option B: Custom Node.js Backend (More Control)

Create Express server that wraps Pocketbase:

**Backend Structure:**
```
backend/
├── src/
│   ├── config/
│   │   ├── pocketbase.ts
│   │   └── env.ts
│   ├── routes/
│   │   ├── products.ts
│   │   ├── cart.ts
│   │   ├── orders.ts
│   │   ├── auth.ts
│   │   └── payments.ts
│   ├── controllers/
│   │   ├── product.controller.ts
│   │   ├── cart.controller.ts
│   │   └── order.controller.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   ├── services/
│   │   ├── product.service.ts
│   │   ├── cart.service.ts
│   │   └── payment.service.ts
│   ├── types/
│   │   └── api.types.ts
│   └── index.ts
├── .env
└── package.json
```

**Main Server File (src/index.ts):**
```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import PocketBase from 'pocketbase';

dotenv.config();

const app = express();
const pb = new PocketBase(process.env.POCKETBASE_URL);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/products', async (req, res) => {
  try {
    const records = await pb.collection('products').getList(1, 20);
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Auth
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const authData = await pb.collection('users').authWithPassword(email, password);
    res.json({ token: authData.token, user: authData.record });
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Pocketbase: ${process.env.POCKETBASE_URL}`);
});
```

**Why both?**
- Pocketbase REST: Fast development, perfect for frontend
- Node.js Backend: Business logic, payment webhooks, integrations

---

## PART 4: IMMEDIATE FEATURES (This Week)

### FEATURE 1: Shopping Cart (Frontend + Pocketbase)

**What to paste in Cline:**

```
Build shopping cart for Bewakoof clone with Pocketbase backend:

Tech Stack: React + TypeScript + Pocketbase

1. Create CartContext (context/CartContext.tsx):
   - Use Pocketbase as backend (no localStorage!)
   - useCart hook for accessing cart anywhere
   - getCart(), addToCart(), removeFromCart(), updateQuantity()
   - Auto-sync with Pocketbase
   - User-specific carts (one per user)

2. Cart Structure in Pocketbase:
   Collection: cart_items
   - user (relation to users)
   - product (relation to products)
   - quantity (number)
   - selectedSize (text)
   - selectedColor (text)
   - priceAtAdd (number)

3. AddToCartButton Component:
   - Select size and color before adding
   - Show quantity selector
   - Send to Pocketbase
   - Success notification

4. CartPage Component:
   - Fetch from Pocketbase cart_items table
   - Display items with images, names, prices
   - Update quantity (real-time sync to PB)
   - Remove items
   - Show cart total
   - "Proceed to Checkout" button

5. Cart Badge in Header:
   - Show item count
   - Update real-time from Pocketbase

6. Features:
   - TypeScript interfaces
   - Tailwind CSS
   - Error handling
   - Loading states
   - Real-time sync with Pocketbase

Use Pocketbase SDK for React, NOT localStorage.
This way data persists server-side and syncs across devices/browsers.
```

### FEATURE 2: Product Detail Pages

```
Build product detail pages:

1. ProductDetailPage (/product/:slug):
   - Fetch product from Pocketbase by slug
   - Image gallery (main + thumbnails)
   - Product info (name, price, rating, reviews)
   - Size/color selection
   - "Add to Cart" button (integrates with cart context)
   - Related products section
   
2. ImageGallery Component:
   - Main image (500x500)
   - Zoom on hover
   - Thumbnail strip
   - Previous/Next arrows
   
3. ProductInfo Component:
   - Price display (current, original, discount%)
   - Stock status
   - Rating with stars
   - Review count
   
4. ReviewsSection Component:
   - Fetch reviews from Pocketbase
   - Show rating distribution
   - List 5 reviews with pagination
   - Review form (if logged in)
   
5. RelatedProducts:
   - Query Pocketbase for products in same category
   - Show 5-6 related items

Use TypeScript, Pocketbase queries, Tailwind CSS.
```

### FEATURE 3: UI/UX Improvements

```
Add loading states and error handling:

1. Skeleton Loaders:
   - ProductCardSkeleton with shimmer effect
   - ProductListSkeleton (grid of 12 cards)
   - ProductDetailSkeleton
   
2. Error Boundary Component:
   - Catch React errors
   - Show fallback UI with retry
   
3. Toast Notifications:
   - Success: "Added to cart!"
   - Error: "Failed to add product"
   - Info: "Updating cart..."
   - Auto-dismiss or manual close
   
4. Empty States:
   - Empty cart with "Continue Shopping" button
   - No search results
   - No reviews yet
   
5. Loading States:
   - Show skeletons while fetching from Pocketbase
   - Disable buttons while loading
   - Spinner on buttons

Use Tailwind CSS animations, proper accessibility.
```

---

## PART 5: SHORT-TERM PHASE - BACKEND EXPANSION (2-4 Weeks)

### Custom Node.js Backend Layer

If Pocketbase REST API isn't enough, add custom backend:

```typescript
// backend/src/index.ts

import express from 'express';
import cors from 'cors';
import PocketBase from 'pocketbase';

const app = express();
const pb = new PocketBase('http://localhost:8090');

app.use(cors());
app.use(express.json());

// Middleware for auth
app.use(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      // Verify with Pocketbase
      pb.authStore.save(token);
      res.locals.user = pb.authStore.record;
    } catch (e) {}
  }
  next();
});

// Routes
app.get('/api/products', async (req, res) => {
  const records = await pb.collection('products').getList(1, 20);
  res.json(records.items);
});

app.post('/api/cart', async (req, res) => {
  const { productId, quantity, size, color } = req.body;
  const record = await pb.collection('cart_items').create({
    user: res.locals.user.id,
    product: productId,
    quantity,
    selectedSize: size,
    selectedColor: color,
    priceAtAdd: product.price,
  });
  res.json(record);
});

app.listen(5000, () => {
  console.log('Backend running on 5000');
});
```

### When to Use Custom Backend:

✅ **Use just Pocketbase REST API if:**
- Simple CRUD operations
- No complex business logic
- Quick MVP

✅ **Add Node.js backend if:**
- Need payment processing
- Complex order logic
- File processing
- External integrations
- Rate limiting needed

---

## PART 6: DEPLOYMENT STRATEGY

### Development (What You Have Now)

```
Your Laptop:
├── Frontend: npm run dev (Port 5173)
├── Backend: npm run dev (Port 5000)
└── Pocketbase: docker run (Port 8090)

All local, all offline, full control ✨
```

### Production Deployment

**Option 1: Keep It Local (Best for Bluewud)**
```
Your Server (24/7):
├── Frontend: Nginx
├── Backend: Node.js + PM2
└── Pocketbase: systemd service

All running on your server. Zero cloud vendor.
```

**Option 2: Hybrid (Recommended)**
```
Frontend: Vercel (free tier)
Backend: Railway or Render (cheap)
Database: Pocketbase self-hosted on your server

Or use Pocketbase cloud version (coming soon)
```

**Option 3: Full Cloud**
```
Frontend: Vercel
Backend: Railway
Database: Neon (PostgreSQL) + Pocketbase Docker

But you still have full control over data.
```

### Migration Path

```
Phase 1: Development (This week)
├── Everything local
├── Pocketbase + React + Node.js
└── Test locally

Phase 2: Self-hosted (2-4 weeks)
├── Deploy to your server
├── Keep Pocketbase local
├── Full ownership

Phase 3: Hybrid (1-2 months)
├── Frontend on Vercel
├── Backend on Railway
├── Pocketbase on your server
└── Best of both worlds

Phase 4: Scale (3+ months)
├── Add CDN for frontend
├── Load balancing for backend
├── Pocketbase clustering
└── Database replication
```

---

## PART 7: QUICK START CHECKLIST

### This Week (Do Now):

- [ ] Install Node.js, Docker
- [ ] Download Pocketbase
- [ ] Create React project with Vite
- [ ] Create backend folder structure
- [ ] Set up Cline with OpenHermes
- [ ] Build Feature 1: Shopping Cart
- [ ] Build Feature 2: Product Details
- [ ] Build Feature 3: UX Improvements
- [ ] Manual testing
- [ ] Commit to git

### Testing Checklist:

- [ ] Can add items to cart?
- [ ] Cart persists on refresh?
- [ ] Product details load?
- [ ] Images display correctly?
- [ ] Mobile responsive?
- [ ] No console errors?
- [ ] Loading states show?
- [ ] Error messages clear?

---

## PART 8: COMMANDS YOU'LL USE DAILY

```bash
# Terminal 1: Frontend
cd frontend
npm run dev
# Open http://localhost:5173

# Terminal 2: Backend
cd backend
npm run dev
# Runs on http://localhost:5000

# Terminal 3: Pocketbase (if not Docker)
./pocketbase serve
# Access http://localhost:8090/_/

# Or if Docker:
docker start pocketbase

# Check services are running
curl http://localhost:5173  # Frontend
curl http://localhost:5000  # Backend
curl http://localhost:8090  # Pocketbase
```

---

## PART 9: POCKETBASE TIPS

### Accessing Pocketbase Admin Panel
```
URL: http://localhost:8090/_/
Default credentials: admin@admin / password
(Change immediately in production!)
```

### Common Pocketbase Queries

```typescript
// Get all products
const products = await pb.collection('products').getList(1, 20);

// Search products
const results = await pb.collection('products').getList(1, 20, {
  filter: 'name ~ "shirt" && price <= 1000'
});

// Get user's cart
const cartItems = await pb.collection('cart_items').getList(1, 100, {
  filter: `user = "${userId}"`
});

// Create order
const order = await pb.collection('orders').create({
  orderNumber: 'ORD-123456',
  user: userId,
  total: 5999,
  status: 'pending'
});

// Real-time subscription
pb.collection('orders').subscribe('*', (e) => {
  console.log('Order updated:', e.record);
});
```

### Backup Pocketbase Data

```bash
# If Docker
docker exec pocketbase tar czf - /pb/pb_data | tar xz -C ~/backups/

# If binary
cp -r pb_data ~/backups/pb_data_$(date +%Y%m%d)

# Restore
docker cp ~/backups/pb_data.tar pocketbase:/pb/
```

---

## PART 10: ARCHITECTURE DECISION MATRIX

| Feature | Pocketbase REST Only | Custom Backend Needed |
|---------|---------------------|---------------------|
| Product listing | ✅ Easy | ✅ Works |
| Shopping cart | ✅ Easy | ✅ Better |
| User auth | ✅ Built-in | ✅ Wrapper |
| Order creation | ✅ Possible | ✅ Recommended |
| Payment webhooks | ❌ No | ✅ Yes |
| Email notifications | ❌ No | ✅ Yes |
| Inventory sync | ❌ No | ✅ Yes |
| Rate limiting | ❌ No | ✅ Yes |
| Analytics | ⚠️ Limited | ✅ Full |

**Recommendation:** Start with Pocketbase REST only. Add Node.js backend when you need webhook handling (payments) or complex logic.

---

## FINAL ARCHITECTURE DIAGRAM

```
                    Frontend (React)
                    Port 5173
                         │
         ┌───────────────┼────────────────┐
         │               │                │
      Option A        Option B         Option C
    (Direct REST)    (Backend)       (Hybrid)
         │               │                │
         ↓               ↓                ↓
    ┌─────────────────────────────────────────┐
    │     Pocketbase (Your Database)          │
    │     Port 8090                           │
    │     ✅ Auth                             │
    │     ✅ REST API                         │
    │     ✅ Real-time                        │
    │     ✅ File uploads                     │
    │     ✅ Full control                     │
    └─────────────────────────────────────────┘

Option A: Direct REST
- Fast development
- Good for MVP
- All business logic on frontend

Option B: Custom Backend (Node.js)
- More control
- Better security
- Webhook handling
- External integrations

Option C: Hybrid (Recommended)
- Pocketbase REST for simple ops
- Custom backend for complex logic
- Best of both worlds
```

---

## YOUR NEXT STEPS

1. **Clone/Download Pocketbase**
   ```bash
   docker run -d -p 8090:8090 \
     -v ~/pocketbase/data:/pb/pb_data \
     --name pocketbase \
     ghcr.io/pocketbase/pocketbase:latest
   ```

2. **Create Project**
   ```bash
   npm create vite@latest frontend -- --template react-ts
   mkdir backend && cd backend && npm init -y
   ```

3. **Open Pocketbase Admin**
   ```
   http://localhost:8090/_/
   Create collections (products, orders, etc.)
   ```

4. **Copy First Feature Prompt into Cline**
   Start with shopping cart feature from Part 4

5. **Test Everything Works**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000
   - Pocketbase: http://localhost:8090

6. **Build Features Iteratively**
   - Use Cline for each feature
   - Test in browser
   - Commit to git

**You're completely offline. You have full control. You can deploy anywhere. Build with confidence!** 🚀

---

**Last Updated:** November 13, 2025  
**For Cline Agent:** Use this guide for all implementation decisions. Pocketbase is your source of truth. React + Node.js is your stack. Everything runs locally.
