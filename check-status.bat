@echo off
cls
color 0A
echo.
echo     ╔═══════════════════════════════════════════════════════════╗
echo     ║     MULARY ECOMMERCE - LIVE STATUS DASHBOARD              ║
echo     ╚═══════════════════════════════════════════════════════════╝
echo.
timeout /t 1 /nobreak > nul

echo [SYSTEM CHECK]
echo ─────────────────────────────────────────────────────────────
node --version 2>nul && echo [✓] Node.js installed || echo [✗] Node.js NOT installed
npm --version 2>nul && echo [✓] npm installed || echo [✗] npm NOT installed
echo.

echo [DEPENDENCIES]
echo ─────────────────────────────────────────────────────────────
if exist "node_modules\" (
    echo [✓] Frontend dependencies installed
) else (
    echo [✗] Frontend dependencies missing - Run: npm install
)
if exist "backend\node_modules\" (
    echo [✓] Backend dependencies installed
) else (
    echo [✗] Backend dependencies missing - Run: cd backend ^&^& npm install
)
echo.

echo [ENVIRONMENT FILES]
echo ─────────────────────────────────────────────────────────────
if exist ".env.local" (
    echo [✓] Frontend .env.local exists
) else (
    echo [!] Create .env.local with: VITE_API_URL=http://localhost:5000/api
)
if exist "backend\.env" (
    echo [✓] Backend .env exists
) else (
    echo [!] Backend .env missing - Copy from backend\.env.example
)
echo.

echo [BUILD STATUS]
echo ─────────────────────────────────────────────────────────────
if exist "dist\" (
    echo [✓] Frontend production build exists
    for /f %%a in ('dir /b /s "dist\*.js" 2^>nul ^| find /c /v ""') do set /a jscount=%%a
    echo     ^> JavaScript files: %jscount%
) else (
    echo [!] Frontend not built - Run: npm run build
)
if exist "backend\dist\" (
    echo [✓] Backend production build exists
    for /f %%a in ('dir /b /s "backend\dist\*.js" 2^>nul ^| find /c /v ""') do set /a bkcount=%%a
    echo     ^> JavaScript files: %bkcount%
) else (
    echo [!] Backend not built - Run: cd backend ^&^& npm run build
)
echo.

echo [SERVERS RUNNING]
echo ─────────────────────────────────────────────────────────────
netstat -an | find "LISTENING" | find ":5173" > nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] Frontend running on http://localhost:5173
) else (
    echo [○] Frontend NOT running - Start: npm run dev
)

netstat -an | find "LISTENING" | find ":5000" > nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] Backend running on http://localhost:5000
) else (
    echo [○] Backend NOT running - Start: cd backend ^&^& npm run dev
)
echo.

echo [QUICK ACTIONS]
echo ─────────────────────────────────────────────────────────────
echo   1. run-full-stack.bat    - Start both servers
echo   2. test-and-build.bat    - Build for production
echo   3. quick-test.bat        - Detailed health check
echo   4. deploy-to-hostinger.bat - Deployment guide
echo.
echo ═════════════════════════════════════════════════════════════
echo   Status: Last checked %date% %time:~0,5%
echo ═════════════════════════════════════════════════════════════
echo.
pause
