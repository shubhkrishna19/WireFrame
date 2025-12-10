@echo off
REM Quick Start - Full Stack Development

cd /d "%~dp0"

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║         MULARY ECOMMERCE - QUICK START                ║
echo ║            Starting Full Stack...                      ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📥 Installing frontend dependencies...
    call npm install --legacy-peer-deps
)

if not exist "backend\node_modules" (
    echo 📥 Installing backend dependencies...
    cd backend
    call npm install --legacy-peer-deps
    cd ..
)

echo.
echo 🚀 Starting services in separate windows...
echo.

REM Start backend in new window
start cmd /k "cd %CD%\backend && echo ⚙️  BACKEND (localhost:3001) && npm run dev"

REM Wait for backend to start
timeout /t 3 /nobreak

REM Start frontend in new window
start cmd /k "cd %CD% && echo 💻 FRONTEND (localhost:5173) && npm run dev"

echo.
echo ════════════════════════════════════════════════════════
echo ✅ Services starting...
echo.
echo 📍 Frontend:     http://localhost:5173
echo 📍 Backend:      http://localhost:3001
echo 📍 Health Check: http://localhost:3001/health
echo.
echo 💡 Tip: Keep both terminal windows open while developing
echo ════════════════════════════════════════════════════════
echo.

timeout /t 5 /nobreak
