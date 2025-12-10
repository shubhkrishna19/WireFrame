@echo off
REM ============================================
REM BACKEND INTEGRATION & SETUP SCRIPT
REM Production-Ready Ecommerce Backend
REM ============================================

setlocal enabledelayedexpansion

echo.
echo ========================================
echo MULARY ECOMMERCE - BACKEND SETUP
echo ========================================
echo.

REM Set colors
for /F %%a in ('copy /Z "%~f0" nul') do set "BS=%%a"

REM Check if Node is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo %BS%[91mERROR: Node.js not installed%BS%[0m
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo %BS%[92m✓ Node.js detected%BS%[0m
node --version

REM Navigate to project root
cd /d "%~dp0"

REM Step 1: Install Frontend Dependencies
echo.
echo %BS%[94m[1/5] Installing Frontend Dependencies...%BS%[0m
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo %BS%[91mERROR: Failed to install frontend dependencies%BS%[0m
    pause
    exit /b 1
)
echo %BS%[92m✓ Frontend dependencies installed%BS%[0m

REM Step 2: Check Backend Directory
echo.
echo %BS%[94m[2/5] Checking Backend Structure...%BS%[0m
if not exist "backend" (
    echo %BS%[93mCreating backend directory...%BS%[0m
    mkdir backend
    cd backend
    call npm init -y
    cd ..
)
echo %BS%[92m✓ Backend directory ready%BS%[0m

REM Step 3: Install Backend Dependencies
echo.
echo %BS%[94m[3/5] Installing Backend Dependencies...%BS%[0m
cd backend
if not exist "package.json" (
    call npm init -y
)
call npm install express cors dotenv uuid axios socket.io nodemailer bcryptjs jsonwebtoken zod --legacy-peer-deps
call npm install --save-dev typescript ts-node @types/node @types/express nodemon
if %errorlevel% neq 0 (
    echo %BS%[91mERROR: Failed to install backend dependencies%BS%[0m
    cd ..
    pause
    exit /b 1
)
echo %BS%[92m✓ Backend dependencies installed%BS%[0m
cd ..

REM Step 4: Create Backend Structure
echo.
echo %BS%[94m[4/5] Creating Backend Structure...%BS%[0m

if not exist "backend\src" mkdir backend\src
if not exist "backend\src\routes" mkdir backend\src\routes
if not exist "backend\src\controllers" mkdir backend\src\controllers
if not exist "backend\src\services" mkdir backend\src\services
if not exist "backend\src\middleware" mkdir backend\src\middleware
if not exist "backend\src\models" mkdir backend\src\models
if not exist "backend\src\utils" mkdir backend\src\utils
if not exist "backend\config" mkdir backend\config
if not exist "backend\logs" mkdir backend\logs

echo %BS%[92m✓ Backend structure created%BS%[0m

REM Step 5: Create Environment Files
echo.
echo %BS%[94m[5/5] Setting Up Environment Files...%BS%[0m

if not exist ".env" (
    echo Creating .env file...
    (
        echo NODE_ENV=development
        echo PORT=3001
        echo JWT_SECRET=your-super-secret-jwt-key-change-in-production
        echo DATABASE_URL=sqlite:./ecommerce.db
        echo RAZORPAY_KEY_ID=your_razorpay_key_id
        echo RAZORPAY_SECRET_KEY=your_razorpay_secret_key
        echo SMTP_HOST=smtp.gmail.com
        echo SMTP_PORT=587
        echo SMTP_USER=your-email@gmail.com
        echo SMTP_PASS=your-app-password
        echo FRONTEND_URL=http://localhost:5173
    ) > .env
    echo %BS%[92m✓ .env file created%BS%[0m
) else (
    echo %BS%[93m.env already exists%BS%[0m
)

if not exist ".env.local" (
    copy .env .env.local >nul
    echo %BS%[92m✓ .env.local created%BS%[0m
)

echo.
echo ========================================
echo %BS%[92mBACKEND SETUP COMPLETE!%BS%[0m
echo ========================================
echo.
echo Next Steps:
echo 1. Update .env file with your actual credentials
echo 2. Create/update backend files in backend\src\
echo 3. Run: npm run dev (to start both frontend and backend)
echo.
echo Backend will run on: http://localhost:3001
echo Frontend will run on: http://localhost:5173
echo.
pause
