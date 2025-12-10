@echo off
echo ========================================
echo MULARY BACKEND SETUP
echo ========================================
echo.
echo Creating backend directory structure...
echo.

REM Create main backend directory
mkdir backend 2>nul

REM Create source directories
mkdir backend\src 2>nul
mkdir backend\src\config 2>nul
mkdir backend\src\controllers 2>nul
mkdir backend\src\routes 2>nul
mkdir backend\src\services 2>nul
mkdir backend\src\middleware 2>nul
mkdir backend\src\models 2>nul
mkdir backend\src\utils 2>nul
mkdir backend\src\types 2>nul
mkdir backend\src\db 2>nul

REM Create other directories
mkdir backend\logs 2>nul
mkdir backend\uploads 2>nul

echo ✓ Directory structure created
echo.
echo Next steps:
echo 1. Run this script (setup-backend.bat)
echo 2. I'll create all the backend files
echo 3. cd backend
echo 4. npm install
echo 5. Copy .env.example to .env and configure
echo 6. npm run dev
echo.
echo ========================================
echo Setup complete!
echo ========================================
pause
