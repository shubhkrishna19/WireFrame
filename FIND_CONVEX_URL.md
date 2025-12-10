# How to Find Your Convex URL

Since `npx convex dev` didn't show the URL, here's how to find it:

## Method 1: Convex Dashboard (Easiest)

1. **Go to:** https://dashboard.convex.dev
2. **Sign in** with your account
3. **Select your project** (it should be named something like "ecommerce-app" or similar)
4. **Look for:**
   - **Settings** tab → Find "Deployment URL"
   - OR **Overview** tab → Look for the URL at the top
   - OR **Functions** tab → The URL might be shown there

The URL will look like: `https://xxxxx.convex.cloud`

## Method 2: Check Terminal History

Scroll up in your PowerShell terminal where you ran `npx convex dev`. The URL might have been shown when you first set up the project.

## Method 3: Re-run Convex Dev

If you can't find it, you can:

1. **Stop** the current `npx convex dev` (press Ctrl+C)
2. **Run it again:**
   ```powershell
   npx convex dev
   ```
3. Look for a line that says something like:
   ```
   Deployment URL: https://xxxxx.convex.cloud
   ```
   or
   ```
   Your deployment URL is: https://xxxxx.convex.cloud
   ```

## Once You Have the URL

1. Create a file named `.env` in the project root
2. Add this line (replace with your actual URL):
   ```
   VITE_CONVEX_URL=https://xxxxx.convex.cloud
   ```
3. Save the file
4. Restart your dev server

## Still Can't Find It?

If you still can't find the URL, you might need to create a new Convex project:

1. Go to https://dashboard.convex.dev
2. Click "New Project"
3. Follow the setup wizard
4. It will give you a new URL

