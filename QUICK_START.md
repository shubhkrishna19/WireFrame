# Quick Start Guide - Mulary E-Commerce App

Follow these steps to see your development result:

## Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required packages (React, Convex, Tailwind CSS, etc.)

## Step 2: Set Up Convex Backend

1. **Initialize Convex:**
   ```bash
   npx convex dev
   ```

2. **What happens:**
   - If you don't have a Convex account, it will prompt you to create one (free)
   - It will create a new Convex project
   - It will generate the `_generated` folder with TypeScript types
   - It will start the Convex development server
   - **IMPORTANT:** You'll see a URL like `https://xxxxx.convex.cloud` - copy this!

3. **Create `.env` file:**
   - Create a file named `.env` in the root directory (same level as `package.json`)
   - Add this line (replace with your actual URL from step 2):
     ```
     VITE_CONVEX_URL=https://xxxxx.convex.cloud
     ```
   - Save the file

4. **Keep Convex running:**
   - Leave the `npx convex dev` terminal window running
   - This syncs your database schema and functions to Convex

## Step 3: Seed Test Data

You need to seed both users and products:

### Option A: Using Convex Dashboard (Recommended)

1. Go to https://dashboard.convex.dev
2. Sign in and select your project
3. Click on "Functions" in the left sidebar
4. Find `seed:seedTestData` and click the "Run" button
   - This creates 2 test users (customer and admin)
5. Find `seedProducts:seedProducts` and click the "Run" button
   - This creates 20+ products across 5 categories

### Option B: Using Browser Console (Alternative)

1. Start the dev server first (Step 4)
2. Open your browser console (F12)
3. The seed functions will be available through the Convex client

## Step 4: Start Development Server

Open a **NEW terminal window** (keep Convex running in the first one) and run:

```bash
npm run dev
```

This will:
- Start the Vite development server
- Usually runs on `http://localhost:5173`
- The terminal will show you the exact URL

## Step 5: Open in Browser

1. Open your browser
2. Navigate to the URL shown in the terminal (usually `http://localhost:5173`)
3. You should see the Mulary homepage with products!

## Test Accounts

After seeding, you can login with:

**Customer Account:**
- Email: `customer@test.com`
- Password: `customer123`

**Admin Account:**
- Email: `admin@test.com`
- Password: `admin123`

## Troubleshooting

### "Cannot find module 'convex/...'"
- Make sure you've run `npx convex dev` first
- Wait for it to finish generating files

### "VITE_CONVEX_URL is not defined"
- Make sure you created the `.env` file
- Make sure the URL is correct (no quotes, no spaces)
- Restart the dev server after creating `.env`

### "No products showing"
- Make sure you've seeded the products data
- Check Convex dashboard for any errors
- Refresh the browser

### Port already in use
- If port 5173 is busy, Vite will suggest another port
- Use the URL shown in the terminal

### Convex connection errors
- Make sure `npx convex dev` is still running
- Check your `.env` file has the correct URL
- Restart both Convex and the dev server

## What You'll See

1. **Homepage (`/products`):**
   - Product grid with 20+ fashion items
   - Search bar at the top
   - Filter sidebar (desktop) or filter button (mobile)
   - Sort dropdown
   - Product cards with images, prices, ratings

2. **Search & Filters:**
   - Type in search bar to see suggestions
   - Use filters to narrow down products
   - See active filters as chips
   - URL updates with your filters

3. **Authentication:**
   - Click "Sign In" or "Sign Up" in navbar
   - Register new users
   - Login with test accounts
   - Access profile page

4. **Profile Page:**
   - View/edit profile information
   - Manage addresses
   - Change password
   - Upload avatar

## Development Tips

- **Hot Reload:** Changes to code automatically refresh the browser
- **Two Terminals:** Keep both `npx convex dev` and `npm run dev` running
- **Convex Dashboard:** Great for viewing data and debugging
- **Browser DevTools:** Use F12 to see console logs and network requests

## Next Steps

Once everything is running:
1. Try the search functionality
2. Test different filters
3. Try sorting options
4. Login and check the profile page
5. Add/edit addresses
6. Share filtered product URLs

Enjoy exploring your Mulary e-commerce platform! 🛍️

