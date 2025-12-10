@echo off
cls
color 0B
echo.
echo     ╔═══════════════════════════════════════════════════════════╗
echo     ║     MULARY ECOMMERCE - CUSTOM BACKEND SETUP               ║
echo     ╚═══════════════════════════════════════════════════════════╝
echo.

echo This script will setup your custom Express.js backend.
echo.
echo Prerequisites:
echo   - Node.js installed
echo   - PostgreSQL installed (or Docker)
echo   - Port 5000 available
echo.
pause

echo ════════════════════════════════════════════════════════════
echo STEP 1: Checking Prerequisites
echo ════════════════════════════════════════════════════════════
echo.

echo [1.1] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] Node.js is installed
    node --version
) else (
    echo [✗] Node.js NOT found!
    echo Please install from: https://nodejs.org/
    pause
    exit /b 1
)
echo.

echo [1.2] Checking npm...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] npm is installed
    npm --version
) else (
    echo [✗] npm NOT found!
    pause
    exit /b 1
)
echo.

echo [1.3] Checking PostgreSQL...
psql --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] PostgreSQL is installed
    psql --version
) else (
    echo [!] PostgreSQL not found in PATH
    echo.
    echo Options:
    echo   A. Install PostgreSQL from: https://www.postgresql.org/download/
    echo   B. Use Docker: docker run --name mulary-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15
    echo.
    choice /c AB /n /m "Choose option (A=Install, B=Docker): "
    if %errorlevel% equ 2 (
        echo.
        echo Starting PostgreSQL in Docker...
        docker run --name mulary-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15
        if %errorlevel% equ 0 (
            echo [✓] PostgreSQL started in Docker
            timeout /t 5 /nobreak > nul
        ) else (
            echo [✗] Docker failed! Please install PostgreSQL manually.
            pause
            exit /b 1
        )
    ) else (
        echo.
        echo Please install PostgreSQL and run this script again.
        pause
        exit /b 1
    )
)
echo.

echo ════════════════════════════════════════════════════════════
echo STEP 2: Backend Dependencies
echo ════════════════════════════════════════════════════════════
echo.

echo [2.1] Checking if backend folder exists...
if not exist "backend\" (
    echo [✗] Backend folder not found!
    echo Please ensure you're in the correct directory.
    pause
    exit /b 1
)
echo [✓] Backend folder found
echo.

echo [2.2] Installing backend dependencies...
cd backend
if not exist "package.json" (
    echo [✗] package.json not found in backend folder!
    cd ..
    pause
    exit /b 1
)

call npm install
if %errorlevel% neq 0 (
    echo [✗] Failed to install dependencies!
    cd ..
    pause
    exit /b 1
)
echo [✓] Dependencies installed successfully
cd ..
echo.

echo ════════════════════════════════════════════════════════════
echo STEP 3: Environment Configuration
echo ════════════════════════════════════════════════════════════
echo.

echo [3.1] Creating .env file...
if exist "backend\.env" (
    echo [!] .env file already exists
    choice /c YN /n /m "Overwrite? (Y/N): "
    if %errorlevel% equ 2 (
        echo [!] Keeping existing .env file
        goto :skip_env
    )
)

if exist "backend\.env.example" (
    copy "backend\.env.example" "backend\.env" >nul
    echo [✓] Created .env from template
) else (
    echo [!] No .env.example found, creating basic .env...
    (
        echo # Database
        echo DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mulary_ecommerce
        echo.
        echo # JWT Secrets - CHANGE THESE!
        echo JWT_SECRET=your-super-secret-jwt-key-change-this-NOW
        echo JWT_REFRESH_SECRET=your-refresh-token-secret-different-from-above
        echo.
        echo # Server
        echo NODE_ENV=development
        echo PORT=5000
        echo FRONTEND_URL=http://localhost:5173
        echo.
        echo # Email
        echo SMTP_HOST=smtp.gmail.com
        echo SMTP_PORT=587
        echo SMTP_USER=your-email@gmail.com
        echo SMTP_PASS=your-app-password
        echo EMAIL_FROM=noreply@mulary.com
        echo.
        echo # Cloudinary
        echo CLOUDINARY_CLOUD_NAME=your-cloud-name
        echo CLOUDINARY_API_KEY=your-api-key
        echo CLOUDINARY_API_SECRET=your-api-secret
        echo.
        echo # Stripe
        echo STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
        echo STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
        echo.
        echo # Razorpay
        echo RAZORPAY_KEY_ID=rzp_test_your_key_id
        echo RAZORPAY_KEY_SECRET=your_razorpay_secret
        echo.
        echo # Redis
        echo REDIS_HOST=localhost
        echo REDIS_PORT=6379
    ) > "backend\.env"
    echo [✓] Created basic .env file
)

:skip_env
echo.
echo [!] IMPORTANT: Edit backend\.env and set your credentials!
echo.
echo Required values:
echo   - DATABASE_URL (PostgreSQL connection string)
echo   - JWT_SECRET (unique random string)
echo   - JWT_REFRESH_SECRET (different unique random string)
echo.
choice /c YN /n /m "Edit .env now? (Y/N): "
if %errorlevel% equ 1 (
    notepad "backend\.env"
)
echo.

echo ════════════════════════════════════════════════════════════
echo STEP 4: Database Setup
echo ════════════════════════════════════════════════════════════
echo.

echo [4.1] Creating database...
echo.
echo Attempting to create 'mulary_ecommerce' database...
echo.

createdb -U postgres mulary_ecommerce >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] Database created successfully
) else (
    echo [!] Database might already exist or credentials incorrect
    echo.
    echo If using Docker: docker exec -it mulary-db createdb -U postgres mulary_ecommerce
    echo.
    choice /c YN /n /m "Continue anyway? (Y/N): "
    if %errorlevel% equ 2 (
        echo.
        echo Setup cancelled. Please fix database issues and try again.
        pause
        exit /b 1
    )
)
echo.

echo [4.2] Running database migrations...
cd backend
call npm run migrate
if %errorlevel% neq 0 (
    echo [✗] Migrations failed!
    echo.
    echo Common issues:
    echo   - Database not running
    echo   - Wrong credentials in .env
    echo   - Database doesn't exist
    echo.
    echo Please fix and run: cd backend ^&^& npm run migrate
    cd ..
    pause
    exit /b 1
)
echo [✓] Migrations completed successfully
cd ..
echo.

echo [4.3] Seeding initial data (optional)...
choice /c YN /n /m "Seed test data? (Y/N): "
if %errorlevel% equ 1 (
    cd backend
    call npm run seed
    if %errorlevel% equ 0 (
        echo [✓] Test data seeded successfully
    ) else (
        echo [!] Seeding failed or not configured
    )
    cd ..
)
echo.

echo ════════════════════════════════════════════════════════════
echo STEP 5: Build Backend
echo ════════════════════════════════════════════════════════════
echo.

echo [5.1] Building TypeScript to JavaScript...
cd backend
call npm run build
if %errorlevel% neq 0 (
    echo [✗] Build failed!
    cd ..
    pause
    exit /b 1
)
echo [✓] Backend built successfully
cd ..
echo.

echo ════════════════════════════════════════════════════════════
echo STEP 6: Start Backend Server
echo ════════════════════════════════════════════════════════════
echo.

echo Starting backend in development mode...
echo.
echo Server will start on: http://localhost:5000
echo API endpoints: http://localhost:5000/api
echo Health check: http://localhost:5000/health
echo.
echo Press Ctrl+C to stop the server
echo.
pause

start "Mulary Backend Server" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo.
echo [✓] Backend server started!
echo.

echo ════════════════════════════════════════════════════════════
echo SETUP COMPLETE! 🎉
echo ════════════════════════════════════════════════════════════
echo.
echo Your custom backend is now running!
echo.
echo Next steps:
echo.
echo 1. Test backend health:
echo    Visit: http://localhost:5000/health
echo.
echo 2. Update frontend .env.local:
echo    Uncomment: VITE_API_URL=http://localhost:5000/api
echo    Comment out: VITE_CONVEX_URL line
echo.
echo 3. Restart frontend:
echo    npm run dev
echo.
echo 4. Test the integration:
echo    Register, login, add to cart, etc.
echo.
echo Useful commands:
echo   - View logs: Check the backend server window
echo   - Stop backend: Press Ctrl+C in server window
echo   - Restart: cd backend ^&^& npm run dev
echo.
echo For deployment, see: PRODUCTION_FINAL_CHECKLIST.md
echo.
pause
