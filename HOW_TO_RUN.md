# How to Run Mulary E-Commerce App

This is now a **standalone frontend application** that works without any backend server. You can run it locally using any simple HTTP server.

## Quick Start Options

### Option 1: Using Python (Easiest)

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Navigate to the dist folder:**
   ```bash
   cd dist
   ```

3. **Start Python server:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Or Python 2
   python -m SimpleHTTPServer 8000
   ```

4. **Open in browser:**
   ```
   http://localhost:8000
   ```

### Option 2: Using Node.js http-server

1. **Install http-server globally (one time):**
   ```bash
   npm install -g http-server
   ```

2. **Build the app:**
   ```bash
   npm run build
   ```

3. **Serve the dist folder:**
   ```bash
   cd dist
   http-server -p 8000
   ```

4. **Open in browser:**
   ```
   http://localhost:8000
   ```

### Option 3: Using Vite Dev Server (Development)

For development with hot reload:

```bash
npm run dev
```

Then open `http://localhost:5173` (or the port shown)

### Option 4: Using Vite Preview (Production Build)

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Preview:**
   ```bash
   npm run preview
   ```

## Test Accounts

The app comes with pre-loaded test accounts:

**Customer:**
- Email: `customer@test.com`
- Password: `customer123`

**Admin:**
- Email: `admin@test.com`
- Password: `admin123`

## Features Available

✅ **All features work locally:**
- User registration and login (stored in localStorage)
- Product browsing with 20+ products
- Advanced search and filtering
- Category navigation
- Sorting options
- User profile management
- Address management
- Password change
- Avatar upload (base64)

## Data Storage

All data is stored in **localStorage**:
- User accounts
- User addresses
- Authentication tokens
- Current session

**Note:** Data persists in your browser but is not shared across devices or browsers.

## For Production Deployment

After building (`npm run build`), upload the `dist` folder to any static hosting:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Any web server

No backend required! 🎉

