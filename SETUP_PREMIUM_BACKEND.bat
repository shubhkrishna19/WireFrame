@echo off
echo ============================================
echo   PREMIUM FEATURES BACKEND SETUP
echo ============================================
echo.
echo This script will:
echo 1. Install backend dependencies
echo 2. Setup email service
echo 3. Configure BNPL integration
echo 4. Setup analytics
echo 5. Configure AI chat
echo.
pause

echo.
echo [1/5] Installing Backend Dependencies...
echo ----------------------------------------
cd backend
call npm install nodemailer @sendgrid/mail node-cron razorpay ws
call npm install @types/node-cron @types/nodemailer --save-dev

if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies!
    pause
    exit /b 1
)

echo.
echo [2/5] Installing Frontend Dependencies...
echo ----------------------------------------
cd ..
call npm install framer-motion recharts socket.io-client axios lucide-react react-hot-toast

if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies!
    pause
    exit /b 1
)

echo.
echo [3/5] Creating Environment Configuration...
echo ----------------------------------------
cd backend

if not exist ".env" (
    echo Creating .env file...
    (
        echo # Backend Configuration
        echo NODE_ENV=development
        echo PORT=3001
        echo.
        echo # Database
        echo DATABASE_URL=postgresql://user:password@localhost:5432/mulary
        echo.
        echo # JWT Secrets
        echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
        echo JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
        echo.
        echo # Email Configuration ^(Gmail example^)
        echo SMTP_HOST=smtp.gmail.com
        echo SMTP_PORT=587
        echo SMTP_USER=your-email@gmail.com
        echo SMTP_PASS=your-app-password
        echo.
        echo # Payment Gateways
        echo RAZORPAY_KEY_ID=your_razorpay_key
        echo RAZORPAY_KEY_SECRET=your_razorpay_secret
        echo STRIPE_SECRET_KEY=your_stripe_secret_key
        echo.
        echo # OpenAI ^(for AI Chat^)
        echo OPENAI_API_KEY=your_openai_api_key
        echo.
        echo # Frontend URL
        echo FRONTEND_URL=http://localhost:5173
        echo.
        echo # Cloudinary ^(for image uploads^)
        echo CLOUDINARY_CLOUD_NAME=your_cloud_name
        echo CLOUDINARY_API_KEY=your_api_key
        echo CLOUDINARY_API_SECRET=your_api_secret
    ) > .env
    
    echo ✅ .env file created!
    echo ⚠️  IMPORTANT: Edit backend/.env with your actual API keys!
) else (
    echo ℹ️  .env file already exists
)

cd ..

echo.
echo [4/5] Updating Backend App Configuration...
echo ----------------------------------------

cd backend\src

if not exist "app.ts" (
    echo Creating app.ts...
    (
        echo import express from 'express'^;
        echo import cors from 'cors'^;
        echo import helmet from 'helmet'^;
        echo import morgan from 'morgan'^;
        echo.
        echo // Import routes
        echo import socialProofRoutes from './routes/socialProof.routes'^;
        echo import recommendationsRoutes from './routes/recommendations.routes'^;
        echo import gamificationRoutes from './routes/gamification.routes'^;
        echo import membershipRoutes from './routes/membership.routes'^;
        echo import abandonedCartRoutes from './routes/abandonedCart.routes'^;
        echo import bnplRoutes from './routes/bnpl.routes'^;
        echo.
        echo const app = express(^)^;
        echo.
        echo // Middleware
        echo app.use(cors(^)^)^;
        echo app.use(helmet(^)^)^;
        echo app.use(morgan('dev'^)^)^;
        echo app.use(express.json(^)^)^;
        echo.
        echo // Health check
        echo app.get('/health', ^(req, res^) =^> {
        echo   res.json^({ status: 'OK', timestamp: new Date(^).toISOString(^) }^)^;
        echo }^)^;
        echo.
        echo // API Routes
        echo app.use('/api/social-proof', socialProofRoutes^)^;
        echo app.use('/api/recommendations', recommendationsRoutes^)^;
        echo app.use('/api/gamification', gamificationRoutes^)^;
        echo app.use('/api/membership', membershipRoutes^)^;
        echo app.use('/api/abandoned-cart', abandonedCartRoutes^)^;
        echo app.use('/api/bnpl', bnplRoutes^)^;
        echo.
        echo export default app^;
    ) > app.ts
    echo ✅ app.ts created!
)

cd ..\..

echo.
echo [5/5] Creating Start Script...
echo ----------------------------------------

(
    echo @echo off
    echo echo Starting Mulary Backend Server...
    echo echo.
    echo cd backend
    echo call npm run dev
) > START_BACKEND.bat

echo ✅ START_BACKEND.bat created!

echo.
echo ============================================
echo   SETUP COMPLETE! ✅
echo ============================================
echo.
echo NEXT STEPS:
echo.
echo 1. Edit backend/.env with your API keys:
echo    - Email service credentials
echo    - Razorpay keys
echo    - OpenAI API key (optional)
echo.
echo 2. Start the backend:
echo    Run: START_BACKEND.bat
echo.
echo 3. Start the frontend:
echo    Run: npm run dev
echo.
echo 4. Open your browser:
echo    http://localhost:5173
echo.
echo ============================================
echo.
echo Press any key to edit .env file now...
pause >nul

notepad backend\.env

echo.
echo Ready to start? (Y/N)
set /p start="Start servers now? (Y/N): "

if /i "%start%"=="Y" (
    echo.
    echo Starting backend server...
    start cmd /k "cd backend && npm run dev"
    timeout /t 3 /nobreak >nul
    
    echo Starting frontend server...
    start cmd /k "npm run dev"
    timeout /t 3 /nobreak >nul
    
    echo.
    echo ✅ Servers started!
    echo Backend: http://localhost:3001
    echo Frontend: http://localhost:5173
    echo.
    timeout /t 3 /nobreak >nul
    start http://localhost:5173
)

echo.
echo Done! Check the browser.
pause
