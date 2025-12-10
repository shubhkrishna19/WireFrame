@echo off
echo ================================================
echo MULARY ECOMMERCE - TEST AND BUILD SCRIPT
echo ================================================
echo.

echo [1/5] Checking Node.js and npm...
node --version
npm --version
echo.

echo [2/5] Installing Frontend Dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend dependencies installation failed!
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!
echo.

echo [3/5] Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend dependencies installation failed!
    cd ..
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
cd ..
echo.

echo [4/5] Building Frontend for Production...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)
echo Frontend built successfully! Files in dist/ folder.
echo.

echo [5/5] Building Backend for Production...
cd backend
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Backend build failed!
    cd ..
    pause
    exit /b 1
)
echo Backend built successfully! Files in backend/dist/ folder.
cd ..
echo.

echo ================================================
echo BUILD COMPLETE!
echo ================================================
echo.
echo Next Steps:
echo 1. Frontend build is in: dist/
echo 2. Backend build is in: backend/dist/
echo 3. Run 'deploy-to-hostinger.bat' to deploy
echo.
pause
