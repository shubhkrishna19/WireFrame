# How to View Your Mulary E-Commerce Site

## Step 1: Start the Development Server

Open your terminal in the project directory and run:

```bash
npm run dev
```

You should see output like:
```
  VITE v5.4.21  ready in 241 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Step 2: Open in Browser

1. **Open your web browser** (Chrome, Firefox, Edge, etc.)
2. **Navigate to:** `http://localhost:5173`
3. You should see the **Products page** (homepage)

## Step 3: Explore the Site

### Available Pages:

1. **Products Page** (`/products` or `/`)
   - Browse 21+ products
   - Use search bar
   - Apply filters (price, category, brand, etc.)
   - Sort products
   - Click on products to view details (coming soon)

2. **Login Page** (`/login`)
   - Test accounts:
     - **Customer**: `customer@test.com` / `customer123`
     - **Admin**: `admin@test.com` / `admin123`
   - Or create a new account

3. **Register Page** (`/register`)
   - Create a new account
   - All data stored in browser localStorage

4. **Profile Page** (`/profile`) - Requires login
   - View/edit profile information
   - Manage addresses
   - Change password
   - Upload avatar

## Step 4: Test Features

### Authentication Flow:
1. Click "Sign Up" or go to `/register`
2. Create an account
3. You'll be redirected to profile page
4. Logout and login again

### Product Browsing:
1. Go to `/products`
2. Try the search bar
3. Use filters on the left (desktop) or filter button (mobile)
4. Change sorting options
5. Navigate through pages

### Profile Management:
1. Login to your account
2. Go to Profile page
3. Edit your information
4. Add/edit addresses
5. Change password

## Step 5: Check Responsive Design

Test on different screen sizes:
- **Desktop**: Full layout with sidebar filters
- **Tablet**: Responsive grid, collapsible filters
- **Mobile**: Stacked layout, drawer filters

Use browser DevTools (F12) to test:
- Chrome: Toggle device toolbar (Ctrl+Shift+M)
- Firefox: Responsive Design Mode (Ctrl+Shift+M)

## Troubleshooting

### If the server doesn't start:
```bash
# Make sure you're in the project directory
cd C:\Users\shubh\Downloads\ecommerce-app

# Install dependencies if needed
npm install

# Try again
npm run dev
```

### If you see errors:
1. Check the terminal for error messages
2. Make sure all dependencies are installed
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try a different browser

### Port already in use:
If port 5173 is busy, Vite will automatically use the next available port. Check the terminal output for the actual URL.

## What to Look For

### ✅ Things That Should Work:
- Page loads without errors
- Navigation between pages works
- Search and filters work
- Login/Register works
- Profile editing works
- Responsive design on mobile

### ⚠️ Things to Note:
- Product images use placeholder URLs (from Unsplash)
- Clicking "Add to Cart" shows an alert (cart not implemented yet)
- Product detail pages not implemented yet
- Data persists only in your browser (localStorage)

## Next: Review and Suggest Changes

After viewing the site, I'll help you:
1. Identify areas for improvement
2. Fix any bugs you find
3. Add missing features
4. Improve UI/UX
5. Optimize performance

Let me know what you see and what you'd like to change! 🚀

