@echo off
echo ========================================
echo   Mulary E-Commerce App - Quick Start
echo ========================================
echo.

echo [1/3] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install from: https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js found!

echo.
echo [2/3] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [3/3] Starting development server...
echo.
echo ========================================
echo   Server starting...
echo   Open: http://localhost:5173
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev

pause

