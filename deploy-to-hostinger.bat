@echo off
echo ================================================
echo MULARY ECOMMERCE - HOSTINGER DEPLOYMENT GUIDE
echo ================================================
echo.

echo This script will guide you through deploying to Hostinger.
echo.
echo PREREQUISITES:
echo 1. You have a Hostinger VPS or hosting plan
echo 2. You have SSH access enabled
echo 3. You have your domain configured
echo 4. You have a database created in Hostinger
echo.
pause

echo ================================================
echo DEPLOYMENT CHECKLIST
echo ================================================
echo.
echo [✓] 1. Backend is built (backend/dist/)
echo [✓] 2. Frontend is built (dist/)
echo [ ] 3. Database connection string ready
echo [ ] 4. Stripe/Razorpay keys ready
echo [ ] 5. Email SMTP credentials ready
echo [ ] 6. Cloudinary API keys ready
echo [ ] 7. SSH access to Hostinger ready
echo.
pause

echo ================================================
echo STEP 1: PREPARE ENVIRONMENT VARIABLES
echo ================================================
echo.
echo Create a .env file on your Hostinger server with these variables:
echo.
echo --- Copy this to your server's .env file ---
echo.
type backend\.env.example 2>nul
if %errorlevel% neq 0 (
    echo # Database
    echo DATABASE_URL=postgresql://username:password@localhost:5432/mulary_db
    echo.
    echo # JWT
    echo JWT_SECRET=your-super-secret-jwt-key-change-this
    echo JWT_REFRESH_SECRET=your-refresh-token-secret-change-this
    echo.
    echo # Email
    echo SMTP_HOST=smtp.gmail.com
    echo SMTP_PORT=587
    echo SMTP_USER=your-email@gmail.com
    echo SMTP_PASS=your-app-password
    echo.
    echo # Cloudinary
    echo CLOUDINARY_CLOUD_NAME=your-cloud-name
    echo CLOUDINARY_API_KEY=your-api-key
    echo CLOUDINARY_API_SECRET=your-api-secret
    echo.
    echo # Stripe
    echo STRIPE_SECRET_KEY=sk_test_your-stripe-key
    echo STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
    echo.
    echo # Razorpay
    echo RAZORPAY_KEY_ID=rzp_test_your-key
    echo RAZORPAY_KEY_SECRET=your-razorpay-secret
    echo.
    echo # App
    echo NODE_ENV=production
    echo PORT=5000
    echo FRONTEND_URL=https://yourdomain.com
)
echo.
echo -------------------------------------------
echo.
pause

echo ================================================
echo STEP 2: UPLOAD FILES TO HOSTINGER
echo ================================================
echo.
echo Method 1 - Using FileZilla or WinSCP:
echo   1. Connect to your Hostinger via SFTP
echo   2. Upload 'backend/dist/' folder to '/home/your-username/api/'
echo   3. Upload 'backend/package.json' to '/home/your-username/api/'
echo   4. Upload 'dist/' folder to '/home/your-username/public_html/'
echo.
echo Method 2 - Using SSH and Git:
echo   1. SSH into your Hostinger server
echo   2. Clone your repository
echo   3. Run 'npm install' in backend folder
echo   4. Copy files to correct locations
echo.
pause

echo ================================================
echo STEP 3: INSTALL DEPENDENCIES ON SERVER
echo ================================================
echo.
echo SSH into your server and run:
echo   cd ~/api
echo   npm install --production
echo.
pause

echo ================================================
echo STEP 4: SETUP DATABASE
echo ================================================
echo.
echo SSH into your server and run:
echo   cd ~/api
echo   npm run migrate
echo   npm run seed
echo.
pause

echo ================================================
echo STEP 5: START BACKEND WITH PM2
echo ================================================
echo.
echo Install PM2 globally:
echo   npm install -g pm2
echo.
echo Start your backend:
echo   cd ~/api
echo   pm2 start dist/server.js --name mulary-api
echo   pm2 save
echo   pm2 startup
echo.
pause

echo ================================================
echo STEP 6: CONFIGURE NGINX
echo ================================================
echo.
echo Create nginx config at /etc/nginx/sites-available/mulary
echo.
echo server {
echo     listen 80;
echo     server_name yourdomain.com www.yourdomain.com;
echo.
echo     # Frontend
echo     location / {
echo         root /home/your-username/public_html;
echo         try_files $uri $uri/ /index.html;
echo     }
echo.
echo     # Backend API
echo     location /api {
echo         proxy_pass http://localhost:5000;
echo         proxy_http_version 1.1;
echo         proxy_set_header Upgrade $http_upgrade;
echo         proxy_set_header Connection 'upgrade';
echo         proxy_set_header Host $host;
echo         proxy_cache_bypass $http_upgrade;
echo     }
echo }
echo.
echo Then enable it:
echo   sudo ln -s /etc/nginx/sites-available/mulary /etc/nginx/sites-enabled/
echo   sudo nginx -t
echo   sudo systemctl restart nginx
echo.
pause

echo ================================================
echo STEP 7: SETUP SSL WITH CERTBOT
echo ================================================
echo.
echo Install Certbot:
echo   sudo apt-get update
echo   sudo apt-get install certbot python3-certbot-nginx
echo.
echo Get SSL certificate:
echo   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
echo.
echo Certbot will automatically configure HTTPS!
echo.
pause

echo ================================================
echo STEP 8: UPDATE FRONTEND API URL
echo ================================================
echo.
echo Before uploading frontend, update .env.local:
echo   VITE_API_URL=https://yourdomain.com/api
echo.
echo Then rebuild:
echo   npm run build
echo.
echo Then upload the new dist/ folder.
echo.
pause

echo ================================================
echo DEPLOYMENT COMPLETE!
echo ================================================
echo.
echo Your site should now be live at: https://yourdomain.com
echo.
echo VERIFY:
echo 1. Visit your domain - frontend should load
echo 2. Try registering an account
echo 3. Try adding products to cart
echo 4. Test checkout flow
echo 5. Check admin dashboard
echo.
echo MONITORING:
echo   pm2 logs mulary-api
echo   pm2 status
echo   pm2 restart mulary-api
echo.
echo Need help? Check HOSTINGER_DEPLOYMENT.md for detailed guide.
echo.
pause
