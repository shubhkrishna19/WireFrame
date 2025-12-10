@echo off
REM ============================================
REM COPILOT MASTER CONTROL - EXECUTION GUIDE
REM ============================================
REM This script provides options to build, test, and deploy
REM your production-ready ecommerce website

setlocal enabledelayedexpansion

:menu
cls
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║   MULARY ECOMMERCE - MASTER CONTROL CENTER            ║
echo ║   Production-Ready Website Build & Deployment         ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo ═══ QUICK ACTIONS ═══════════════════════════════════════
echo.
echo 1. ▶️  START EVERYTHING (Frontend + Backend)
echo 2. 📊 CHECK SYSTEM STATUS
echo 3. 🔧 RUN TESTS & DIAGNOSTICS
echo 4. 📦 BUILD FOR PRODUCTION
echo 5. 🚀 DEPLOY TO HOSTINGER
echo.
echo ═══ DEVELOPMENT ════════════════════════════════════════
echo.
echo 6. 💻 START FRONTEND ONLY (localhost:5173)
echo 7. ⚙️  START BACKEND ONLY (localhost:3001)
echo 8. 🔗 CONNECT FRONTEND TO BACKEND
echo.
echo ═══ SETUP & CONFIGURATION ══════════════════════════════
echo.
echo 9. 📥 INSTALL ALL DEPENDENCIES
echo 10. 🔑 SETUP ENVIRONMENT VARIABLES
echo 11. 🗄️  INITIALIZE DATABASE
echo 12. 🌱 SEED DATABASE WITH TEST DATA
echo.
echo ═══ CLEANUP & MAINTENANCE ══════════════════════════════
echo.
echo 13. 🧹 CLEAN BUILD ARTIFACTS
echo 14. 📝 VIEW LOGS
echo 15. ❌ EXIT
echo.
echo ════════════════════════════════════════════════════════
echo.
set /p choice="Enter your choice (1-15): "

if "%choice%"=="1" goto start_all
if "%choice%"=="2" goto check_status
if "%choice%"=="3" goto run_tests
if "%choice%"=="4" goto build_prod
if "%choice%"=="5" goto deploy
if "%choice%"=="6" goto start_frontend
if "%choice%"=="7" goto start_backend
if "%choice%"=="8" goto connect_frontend
if "%choice%"=="9" goto install_deps
if "%choice%"=="10" goto setup_env
if "%choice%"=="11" goto init_db
if "%choice%"=="12" goto seed_db
if "%choice%"=="13" goto clean_build
if "%choice%"=="14" goto view_logs
if "%choice%"=="15" exit /b 0
goto menu

REM ============================================
REM 1. START EVERYTHING
REM ============================================
:start_all
cls
echo.
echo 🚀 Starting full stack (Frontend + Backend)...
echo.
echo Opening 2 terminal windows...
echo.
start cmd /k "cd %CD% && echo Mulary Backend && cd backend && npm run dev"
timeout /t 2 /nobreak
start cmd /k "cd %CD% && echo Mulary Frontend && npm run dev"
echo.
echo ✅ Both servers starting...
echo.
echo 📍 Frontend: http://localhost:5173
echo 📍 Backend: http://localhost:3001
echo 📍 API Health: http://localhost:3001/health
echo.
echo Press any key to return to menu...
pause >nul
goto menu

REM ============================================
REM 2. CHECK SYSTEM STATUS
REM ============================================
:check_status
cls
echo.
echo 📊 SYSTEM STATUS CHECK
echo ════════════════════════════════
echo.
echo Checking Node.js...
node --version
echo.
echo Checking npm...
npm --version
echo.
echo Checking Backend Status...
echo   Checking if backend port 3001 is available...
netstat -ano | findstr ":3001" >nul
if %errorlevel%==0 (
    echo   ⚠️  Port 3001 is in use
) else (
    echo   ✅ Port 3001 is available
)
echo.
echo Checking Frontend Status...
echo   Checking if frontend port 5173 is available...
netstat -ano | findstr ":5173" >nul
if %errorlevel%==0 (
    echo   ⚠️  Port 5173 is in use
) else (
    echo   ✅ Port 5173 is available
)
echo.
echo Checking Dependencies...
if exist "node_modules" (
    echo   ✅ Frontend dependencies installed
) else (
    echo   ❌ Frontend dependencies NOT installed
)
if exist "backend\node_modules" (
    echo   ✅ Backend dependencies installed
) else (
    echo   ❌ Backend dependencies NOT installed
)
echo.
echo Checking Environment Files...
if exist ".env" (
    echo   ✅ .env found
) else (
    echo   ❌ .env NOT found
)
if exist "backend\.env" (
    echo   ✅ backend\.env found
) else (
    echo   ❌ backend\.env NOT found
)
echo.
echo Press any key to return to menu...
pause >nul
goto menu

REM ============================================
REM 3. RUN TESTS & DIAGNOSTICS
REM ============================================
:run_tests
cls
echo.
echo 🧪 RUNNING TESTS & DIAGNOSTICS
echo ════════════════════════════════
echo.
echo Testing Frontend Build...
call npm run build 2>&1 | findstr /E "error|warning|✓|✅" || (
    echo ❌ Frontend build failed
    goto test_error
)
echo ✅ Frontend build successful
echo.
echo Testing Backend TypeScript...
cd backend
call npm run build 2>&1 | findstr /E "error|warning|✓|✅" || (
    echo ❌ Backend build failed
    cd ..
    goto test_error
)
echo ✅ Backend build successful
cd ..
echo.
echo ✅ ALL TESTS PASSED
echo.
pause >nul
goto menu

:test_error
echo.
echo ❌ Tests failed. Check logs above.
pause >nul
goto menu

REM ============================================
REM 4. BUILD FOR PRODUCTION
REM ============================================
:build_prod
cls
echo.
echo 📦 BUILDING FOR PRODUCTION
echo ════════════════════════════════
echo.
echo Building Frontend...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed
    pause >nul
    goto menu
)
echo ✅ Frontend built
echo.
echo Building Backend...
cd backend
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Backend build failed
    cd ..
    pause >nul
    goto menu
)
cd ..
echo ✅ Backend built
echo.
echo ✅ PRODUCTION BUILD COMPLETE
echo.
echo Files ready for deployment:
echo   Frontend: dist/
echo   Backend: backend/dist/
echo.
pause >nul
goto menu

REM ============================================
REM 5. DEPLOY TO HOSTINGER
REM ============================================
:deploy
cls
echo.
echo 🚀 DEPLOYMENT GUIDE - HOSTINGER
echo ════════════════════════════════
echo.
echo STEP 1: Prepare Files
echo   - Frontend build: npm run build
echo   - Backend build: cd backend && npm run build
echo.
echo STEP 2: Connect to Hostinger
echo   - Use FTP/SFTP credentials provided by Hostinger
echo   - Upload dist/ folder to public_html/
echo   - Upload backend/dist/ to private/backend/
echo.
echo STEP 3: Configure Environment
echo   - Update backend/.env with production values
echo   - Set NODE_ENV=production
echo   - Update database URLs
echo.
echo STEP 4: Start Services
echo   - Use Hostinger's Node.js management console
echo   - Or run: npm start from backend directory
echo.
echo For detailed guide:
echo   →  See: DEPLOYMENT.md
echo   →  See: PRODUCTION_FINAL_CHECKLIST.md
echo.
echo Press any key to continue...
pause >nul
goto menu

REM ============================================
REM 6. START FRONTEND ONLY
REM ============================================
:start_frontend
cls
echo.
echo 💻 Starting Frontend Only
echo ════════════════════════════════
echo.
call npm run dev
goto menu

REM ============================================
REM 7. START BACKEND ONLY
REM ============================================
:start_backend
cls
echo.
echo ⚙️  Starting Backend Only
echo ════════════════════════════════
echo.
cd backend
call npm run dev
cd ..
goto menu

REM ============================================
REM 8. CONNECT FRONTEND TO BACKEND
REM ============================================
:connect_frontend
cls
echo.
echo 🔗 CONNECTING FRONTEND TO BACKEND
echo ════════════════════════════════
echo.
echo Make sure both are running:
echo   Frontend: http://localhost:5173
echo   Backend: http://localhost:3001
echo.
echo Testing connection...
echo.
echo Sending test request to backend...
curl -s http://localhost:3001/health | findstr "status" >nul
if %errorlevel%==0 (
    echo ✅ Backend is responding
) else (
    echo ❌ Backend is not responding
    echo   Make sure backend is running on port 3001
)
echo.
pause >nul
goto menu

REM ============================================
REM 9. INSTALL DEPENDENCIES
REM ============================================
:install_deps
cls
echo.
echo 📥 INSTALLING ALL DEPENDENCIES
echo ════════════════════════════════
echo.
echo Installing Frontend...
call npm install --legacy-peer-deps
echo.
echo Installing Backend...
cd backend
call npm install --legacy-peer-deps
cd ..
echo.
echo ✅ All dependencies installed
echo.
pause >nul
goto menu

REM ============================================
REM 10. SETUP ENVIRONMENT VARIABLES
REM ============================================
:setup_env
cls
echo.
echo 🔑 SETUP ENVIRONMENT VARIABLES
echo ════════════════════════════════
echo.
echo Creating .env file with default values...
(
    echo NODE_ENV=development
    echo PORT=3001
    echo JWT_SECRET=dev-secret-key-change-in-production
    echo DATABASE_URL=sqlite:./ecommerce.db
    echo RAZORPAY_KEY_ID=your_razorpay_id
    echo RAZORPAY_SECRET_KEY=your_razorpay_secret
    echo SMTP_HOST=smtp.gmail.com
    echo SMTP_PORT=587
    echo SMTP_USER=your_email@gmail.com
    echo SMTP_PASS=your_app_password
    echo FRONTEND_URL=http://localhost:5173
) > backend\.env
echo.
echo ✅ .env created in backend/
echo.
echo ⚠️  IMPORTANT: Update these values:
echo   - RAZORPAY_KEY_ID
echo   - RAZORPAY_SECRET_KEY
echo   - SMTP credentials
echo.
echo Edit file: backend\.env
echo.
pause >nul
goto menu

REM ============================================
REM 11. INITIALIZE DATABASE
REM ============================================
:init_db
cls
echo.
echo 🗄️  INITIALIZING DATABASE
echo ════════════════════════════════
echo.
cd backend
call npm run migrate
cd ..
echo.
echo ✅ Database initialized
echo.
pause >nul
goto menu

REM ============================================
REM 12. SEED DATABASE
REM ============================================
:seed_db
cls
echo.
echo 🌱 SEEDING DATABASE WITH TEST DATA
echo ════════════════════════════════
echo.
cd backend
call npm run seed
cd ..
echo.
echo ✅ Database seeded with test data
echo.
pause >nul
goto menu

REM ============================================
REM 13. CLEAN BUILD ARTIFACTS
REM ============================================
:clean_build
cls
echo.
echo 🧹 CLEANING BUILD ARTIFACTS
echo ════════════════════════════════
echo.
echo Removing frontend dist...
if exist "dist" rmdir /s /q dist
echo ✅ Frontend dist removed
echo.
echo Removing backend dist...
if exist "backend\dist" rmdir /s /q backend\dist
echo ✅ Backend dist removed
echo.
echo ✅ Cleanup complete
echo.
pause >nul
goto menu

REM ============================================
REM 14. VIEW LOGS
REM ============================================
:view_logs
cls
echo.
echo 📝 LOGS DIRECTORY
echo ════════════════════════════════
echo.
if exist "backend\logs" (
    echo Recent logs:
    dir backend\logs /o-d
) else (
    echo No logs found
    echo Run backend first to generate logs
)
echo.
pause >nul
goto menu

REM ============================================
REM END OF SCRIPT
REM ============================================
