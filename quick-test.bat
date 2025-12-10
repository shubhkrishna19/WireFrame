@echo off
echo ================================================
echo MULARY - QUICK HEALTH CHECK
echo ================================================
echo.

echo [1] Testing if Node.js is installed...
node --version > nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] Node.js is installed
    node --version
) else (
    echo [✗] Node.js is NOT installed!
    echo Please install from: https://nodejs.org/
    pause
    exit /b 1
)
echo.

echo [2] Testing if dependencies are installed...
if exist "node_modules\" (
    echo [✓] Frontend dependencies installed
) else (
    echo [✗] Frontend dependencies NOT installed
    echo Run: npm install
)

if exist "backend\node_modules\" (
    echo [✓] Backend dependencies installed
) else (
    echo [✗] Backend dependencies NOT installed
    echo Run: cd backend ^&^& npm install
)
echo.

echo [3] Checking if builds exist...
if exist "dist\" (
    echo [✓] Frontend build exists
) else (
    echo [!] Frontend not built yet
    echo Run: npm run build
)

if exist "backend\dist\" (
    echo [✓] Backend build exists
) else (
    echo [!] Backend not built yet
    echo Run: cd backend ^&^& npm run build
)
echo.

echo [4] Checking environment files...
if exist ".env.local" (
    echo [✓] Frontend .env.local exists
) else (
    echo [!] Frontend .env.local missing
    echo Create it with: VITE_API_URL=http://localhost:5000/api
)

if exist "backend\.env" (
    echo [✓] Backend .env exists
) else (
    echo [!] Backend .env missing
    echo Copy from backend\.env.example
)
echo.

echo [5] Checking if frontend is running...
curl -s http://localhost:5173 > nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] Frontend is running on http://localhost:5173
) else (
    echo [!] Frontend is NOT running
    echo Start with: npm run dev
)
echo.

echo [6] Checking if backend is running...
curl -s http://localhost:5000/health > nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] Backend is running on http://localhost:5000
) else (
    echo [!] Backend is NOT running
    echo Start with: cd backend ^&^& npm run dev
)
echo.

echo ================================================
echo HEALTH CHECK COMPLETE
echo ================================================
echo.
pause
