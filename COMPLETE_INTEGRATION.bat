@echo off
echo ========================================
echo   COMPLETE PREMIUM FEATURES INTEGRATION
echo ========================================
echo.

echo Step 1: Installing Required Dependencies...
echo.
call npm install framer-motion recharts socket.io-client axios lucide-react react-hot-toast

echo.
echo Step 2: Checking Backend Status...
cd backend
if exist "package.json" (
    echo Backend found. Installing dependencies...
    call npm install
    echo.
    echo Step 3: Starting Backend Server...
    start cmd /k "cd /d %CD% && npm run dev"
    timeout /t 5 /nobreak >nul
) else (
    echo Backend not found. Will use Convex.
)

cd ..

echo.
echo Step 4: Starting Frontend Development Server...
start cmd /k "npm run dev"

echo.
echo ========================================
echo   INTEGRATION COMPLETE!
echo ========================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:3001 (if using custom backend)
echo.
echo Press any key to open dashboard...
pause >nul

start http://localhost:5173

echo.
echo Done! Check the browser windows.
pause
