@echo off
echo ========================================
echo MULARY E-COMMERCE - LOCAL TESTING
echo ========================================
echo.

cd backend

echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install from: https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js found

echo.
echo [2/5] Installing dependencies (this may take a few minutes)...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)
echo ✓ Dependencies installed

echo.
echo [3/5] Checking .env file...
if not exist .env (
    echo WARNING: .env file not found!
    echo Copying from .env.example...
    copy .env.example .env
    echo.
    echo IMPORTANT: Edit backend\.env with your database credentials!
    echo Press any key to open .env in notepad...
    pause
    notepad .env
)
echo ✓ .env file exists

echo.
echo [4/5] Building TypeScript...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed! Check for TypeScript errors.
    pause
    exit /b 1
)
echo ✓ Build successful

echo.
echo [5/5] Starting development server...
echo.
echo ========================================
echo     SERVER STARTING...
echo ========================================
echo.
echo Backend will be available at:
echo   http://localhost:5000
echo.
echo Health check:
echo   http://localhost:5000/health
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

call npm run dev
