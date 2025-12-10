# Quick Setup Guide

## Step 1: Install Dependencies
```bash
npm install
```

## Step 2: Set Up Convex

1. **Initialize Convex:**
   ```bash
   npx convex dev
   ```
   
   This will:
   - Create a Convex account (if you don't have one)
   - Set up your Convex project
   - Generate the `_generated` folder
   - Start the Convex development server
   - Give you a deployment URL

2. **Copy the Convex URL:**
   - You'll see a URL like: `https://xxxxx.convex.cloud`
   - Create a `.env` file in the root directory:
     ```env
     VITE_CONVEX_URL=https://xxxxx.convex.cloud
     ```
   - Replace `xxxxx` with your actual deployment URL

## Step 3: Seed Test Data

After Convex is running, seed the test data:

**Using Convex Dashboard (Recommended)**
1. Go to https://dashboard.convex.dev
2. Select your project
3. Navigate to "Functions" in the sidebar
4. **Seed Users:** Find `seed:seedTestData` and click "Run"
5. **Seed Products:** Find `seedProducts:seedProducts` and click "Run"
6. This creates 2 test users and 20+ products across 5 categories

## Step 4: Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Step 5: Test the Application

### Test Accounts (after seeding):
- **Customer:** 
  - Email: `customer@test.com`
  - Password: `customer123`

- **Admin:**
  - Email: `admin@test.com`
  - Password: `admin123`

## Troubleshooting

### Convex URL not found
- Make sure you've run `npx convex dev` first
- Check that `.env` file exists with `VITE_CONVEX_URL`
- Restart the dev server after adding the `.env` file

### Seed function not working
- Make sure Convex dev server is running
- Check Convex dashboard for any errors
- Verify the schema is deployed (run `npx convex dev`)

### Build errors
- Make sure all dependencies are installed: `npm install`
- Clear node_modules and reinstall if needed
- Check TypeScript version compatibility

## Next Steps

1. **Customize JWT Secret:** Update `convex/auth.ts` with a strong secret for production
2. **Add File Storage:** Implement proper avatar upload to cloud storage
3. **Add Email Verification:** Implement email verification flow
4. **Add Password Reset:** Implement forgot password functionality

