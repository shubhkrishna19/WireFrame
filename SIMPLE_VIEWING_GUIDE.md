# 🚀 Simple Ways to View Your Mulary E-Commerce Project

## Method 1: Development Server (Recommended - Easiest)

### Step 1: Open Terminal
- Press `Windows Key + R`
- Type `cmd` or `powershell` and press Enter
- Or right-click in the project folder and select "Open in Terminal"

### Step 2: Navigate to Project
```bash
cd C:\Users\shubh\Downloads\ecommerce-app
```

### Step 3: Install Dependencies (if not done)
```bash
npm install
```

### Step 4: Start Development Server
```bash
npm run dev
```

### Step 5: Open Browser
- Wait for the message: `Local: http://localhost:5173/`
- Open your browser (Chrome, Firefox, Edge)
- Go to: **http://localhost:5173**

**That's it!** The site will auto-reload when you make changes.

---

## Method 2: Build and Serve (Production-like)

### Step 1: Build the Project
```bash
npm run build
```

### Step 2: Preview (Option A - Using Vite)
```bash
npm run preview
```
Then open: **http://localhost:4173**

### Step 3: Serve with Python (Option B)
```bash
cd dist
python -m http.server 8000
```
Then open: **http://localhost:8000**

### Step 4: Serve with Node.js (Option C)
```bash
# Install http-server globally (one time)
npm install -g http-server

# Then serve
cd dist
http-server -p 8000
```
Then open: **http://localhost:8000**

---

## Method 3: Quick Start Script

I'll create a simple batch file for you:

**Create `start.bat` file** in the project root:
```batch
@echo off
echo Starting Mulary E-Commerce App...
echo.
echo Installing dependencies...
call npm install
echo.
echo Starting development server...
echo.
echo Open http://localhost:5173 in your browser
echo.
call npm run dev
pause
```

**Just double-click `start.bat`** and it will:
1. Install dependencies
2. Start the server
3. Show you the URL

---

## Method 4: VS Code (If you use it)

1. Open the project folder in VS Code
2. Open Terminal in VS Code (`` Ctrl + ` ``)
3. Run: `npm run dev`
4. Click the link that appears in the terminal

---

## Troubleshooting

### "npm is not recognized"
- Install Node.js from: https://nodejs.org/
- Restart your terminal after installation

### "Port already in use"
- Close other programs using port 5173
- Or Vite will automatically use the next available port

### "Cannot find module"
- Run: `npm install`
- Make sure you're in the project directory

### "Build errors"
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run: `npm install` again

---

## What You'll See

1. **Products Page** - Browse 21+ products
2. **Product Detail** - Click any product to see full details
3. **Login/Register** - Create account or login
4. **Profile** - Manage your account

### Test Accounts:
- **Customer**: `customer@test.com` / `customer123`
- **Admin**: `admin@test.com` / `admin123`

---

## Quick Commands Reference

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install dependencies
npm install
```

---

## Need Help?

If you're still having issues:
1. Make sure Node.js is installed: `node --version`
2. Make sure npm is installed: `npm --version`
3. Check you're in the right directory
4. Try deleting `node_modules` and running `npm install` again

Let me know what happens when you try! 🎯

