@echo off
echo ============================================
echo MULARY ECOMMERCE - COMPLETE BACKEND SETUP
echo ============================================
echo.

echo [1/6] Creating backend directory structure...
if not exist backend mkdir backend
if not exist backend\src mkdir backend\src
if not exist backend\src\routes mkdir backend\src\routes
if not exist backend\src\controllers mkdir backend\src\controllers
if not exist backend\src\models mkdir backend\src\models
if not exist backend\src\middleware mkdir backend\src\middleware
if not exist backend\src\services mkdir backend\src\services
if not exist backend\src\config mkdir backend\src\config
if not exist backend\src\utils mkdir backend\src\utils
if not exist backend\uploads mkdir backend\uploads
if not exist backend\logs mkdir backend\logs

echo [2/6] Creating package.json...
(
echo {
echo   "name": "mulary-backend",
echo   "version": "1.0.0",
echo   "description": "Mulary Ecommerce Backend API",
echo   "main": "src/app.ts",
echo   "scripts": {
echo     "dev": "tsx watch src/app.ts",
echo     "build": "tsc",
echo     "start": "node dist/app.js",
echo     "test": "jest"
echo   },
echo   "dependencies": {
echo     "express": "^4.18.2",
echo     "cors": "^2.8.5",
echo     "dotenv": "^16.3.1",
echo     "helmet": "^7.1.0",
echo     "express-rate-limit": "^7.1.5",
echo     "bcryptjs": "^2.4.3",
echo     "jsonwebtoken": "^9.0.2",
echo     "zod": "^3.22.4",
echo     "uuid": "^9.0.1",
echo     "nodemailer": "^6.9.7",
echo     "razorpay": "^2.9.2",
echo     "sqlite3": "^5.1.6",
echo     "socket.io": "^4.6.1"
echo   },
echo   "devDependencies": {
echo     "@types/node": "^20.10.0",
echo     "@types/express": "^4.17.21",
echo     "@types/cors": "^2.8.17",
echo     "@types/bcryptjs": "^2.4.6",
echo     "@types/jsonwebtoken": "^9.0.5",
echo     "@types/nodemailer": "^6.4.14",
echo     "@types/uuid": "^9.0.7",
echo     "typescript": "^5.3.2",
echo     "tsx": "^4.7.0"
echo   }
echo }
) > backend\package.json

echo [3/6] Creating TypeScript configuration...
(
echo {
echo   "compilerOptions": {
echo     "target": "ES2020",
echo     "module": "commonjs",
echo     "lib": ["ES2020"],
echo     "outDir": "./dist",
echo     "rootDir": "./src",
echo     "strict": true,
echo     "esModuleInterop": true,
echo     "skipLibCheck": true,
echo     "forceConsistentCasingInFileNames": true,
echo     "resolveJsonModule": true,
echo     "moduleResolution": "node"
echo   },
echo   "include": ["src/**/*"],
echo   "exclude": ["node_modules", "dist"]
echo }
) > backend\tsconfig.json

echo [4/6] Creating environment file...
(
echo PORT=3001
echo NODE_ENV=development
echo JWT_SECRET=your-secret-key-change-in-production
echo CORS_ORIGIN=http://localhost:5173
echo DATABASE_PATH=./database.sqlite
echo RAZORPAY_KEY_ID=your_razorpay_key
echo RAZORPAY_KEY_SECRET=your_razorpay_secret
echo EMAIL_HOST=smtp.gmail.com
echo EMAIL_PORT=587
echo EMAIL_USER=your_email@gmail.com
echo EMAIL_PASS=your_email_password
) > backend\.env

echo [5/6] Installing dependencies...
cd backend
call npm install
cd ..

echo [6/6] Backend setup complete!
echo.
echo ============================================
echo NEXT STEPS:
echo ============================================
echo 1. Update backend\.env with your credentials
echo 2. Run: cd backend && npm run dev
echo 3. Backend will start on: http://localhost:3001
echo.
echo Press any key to exit...
pause >nul
