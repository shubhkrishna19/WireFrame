@echo off
cls
color 0E
:menu
cls
echo.
echo     ╔═══════════════════════════════════════════════════════════════╗
echo     ║                                                               ║
echo     ║         MULARY ECOMMERCE - MASTER CONTROL DASHBOARD          ║
echo     ║                    Version 1.0.0                              ║
echo     ║                                                               ║
echo     ╚═══════════════════════════════════════════════════════════════╝
echo.
echo     Current Status:
echo     ───────────────────────────────────────────────────────────────

REM Check if frontend is running
netstat -an | find "LISTENING" | find ":5173" > nul 2>&1
if %errorlevel% equ 0 (
    echo     Frontend:  [✓] RUNNING on http://localhost:5173
) else (
    echo     Frontend:  [○] Not running
)

REM Check if backend is running
netstat -an | find "LISTENING" | find ":5000" > nul 2>&1
if %errorlevel% equ 0 (
    echo     Backend:   [✓] RUNNING on http://localhost:5000
) else (
    echo     Backend:   [○] Not running
)

REM Check dependencies
if exist "node_modules\" (
    echo     Frontend:  [✓] Dependencies installed
) else (
    echo     Frontend:  [!] Dependencies missing
)
if exist "backend\node_modules\" (
    echo     Backend:   [✓] Dependencies installed
) else (
    echo     Backend:   [!] Dependencies missing
)

echo.
echo     ═══════════════════════════════════════════════════════════════
echo.
echo     📋 QUICK ACTIONS
echo     ───────────────────────────────────────────────────────────────
echo.
echo       [1] 🚀 Start Full Stack (Frontend + Backend)
echo       [2] 🌐 Start Frontend Only
echo       [3] 🔧 Start Backend Only  
echo       [4] 📊 Check Detailed Status
echo       [5] 🛠️  Setup Custom Backend (First Time)
echo       [6] 📦 Build for Production
echo       [7] 🚢 Deploy to Hostinger
echo       [8] 🧪 Run Tests
echo.
echo     ═══════════════════════════════════════════════════════════════
echo.
echo     📚 DOCUMENTATION
echo     ───────────────────────────────────────────────────────────────
echo.
echo       [D] 📖 Open START_HERE.md
echo       [I] 🔄 View Integration Status
echo       [P] ✅ Production Checklist
echo       [H] 🏠 Hostinger Deployment Guide
echo.
echo     ═══════════════════════════════════════════════════════════════
echo.
echo       [0] ❌ Exit
echo.
echo     ═══════════════════════════════════════════════════════════════
echo.
choice /c 123456780DIPH /n /m "     Select an option: "

if %errorlevel% equ 1 goto start_fullstack
if %errorlevel% equ 2 goto start_frontend
if %errorlevel% equ 3 goto start_backend
if %errorlevel% equ 4 goto check_status
if %errorlevel% equ 5 goto setup_backend
if %errorlevel% equ 6 goto build_production
if %errorlevel% equ 7 goto deploy
if %errorlevel% equ 8 goto run_tests
if %errorlevel% equ 9 goto exit_script
if %errorlevel% equ 10 goto open_start_here
if %errorlevel% equ 11 goto open_integration
if %errorlevel% equ 12 goto open_production
if %errorlevel% equ 13 goto open_hostinger

:start_fullstack
cls
echo.
echo ════════════════════════════════════════════════════════════
echo Starting Full Stack Application...
echo ════════════════════════════════════════════════════════════
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:5173
echo.
echo Press any key to start...
pause >nul

start "Mulary Backend API" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul
start "Mulary Frontend" cmd /k "npm run dev"

echo.
echo [✓] Both servers are starting!
echo.
echo Open your browser to: http://localhost:5173
echo.
timeout /t 5 /nobreak
goto menu

:start_frontend
cls
echo.
echo ════════════════════════════════════════════════════════════
echo Starting Frontend...
echo ════════════════════════════════════════════════════════════
echo.
start "Mulary Frontend" cmd /k "npm run dev"
echo.
echo [✓] Frontend is starting!
echo Open: http://localhost:5173
echo.
timeout /t 3 /nobreak
goto menu

:start_backend
cls
echo.
echo ════════════════════════════════════════════════════════════
echo Starting Backend API...
echo ════════════════════════════════════════════════════════════
echo.
if not exist "backend\.env" (
    echo [!] Warning: backend\.env not found!
    echo Run option [5] to setup backend first.
    echo.
    pause
    goto menu
)
start "Mulary Backend API" cmd /k "cd backend && npm run dev"
echo.
echo [✓] Backend is starting!
echo Health check: http://localhost:5000/health
echo.
timeout /t 3 /nobreak
goto menu

:check_status
cls
call check-status.bat
goto menu

:setup_backend
cls
call setup-custom-backend.bat
goto menu

:build_production
cls
call test-and-build.bat
goto menu

:deploy
cls
call deploy-to-hostinger.bat
goto menu

:run_tests
cls
echo.
echo ════════════════════════════════════════════════════════════
echo Running Tests...
echo ════════════════════════════════════════════════════════════
echo.
call quick-test.bat
goto menu

:open_start_here
start notepad START_HERE.md
goto menu

:open_integration
start notepad INTEGRATION_STATUS.md
goto menu

:open_production
start notepad PRODUCTION_FINAL_CHECKLIST.md
goto menu

:open_hostinger
if exist "HOSTINGER_DEPLOYMENT.md" (
    start notepad HOSTINGER_DEPLOYMENT.md
) else (
    start notepad DEPLOYMENT_GUIDE.md
)
goto menu

:exit_script
cls
echo.
echo ════════════════════════════════════════════════════════════
echo Thank you for using Mulary Ecommerce!
echo ════════════════════════════════════════════════════════════
echo.
echo Your servers may still be running.
echo Close their windows to stop them.
echo.
echo Happy selling! 🛍️
echo.
timeout /t 3 /nobreak
exit /b 0
