# 🚀 HOSTINGER DEPLOYMENT GUIDE

## 📋 PREREQUISITES

### What You Need:
- ✅ Hostinger account with domain
- ✅ VPS or Business Hosting plan (Node.js support required)
- ✅ SSH access enabled
- ✅ Domain already configured

### Recommended Hostinger Plan:
- **VPS 1** ($5.99/month) - Best for starting
- **Business Hosting** ($3.99/month) - If Node.js supported
- **VPS 2** ($8.99/month) - For growth

---

## 🎯 OPTION 1: VPS DEPLOYMENT (RECOMMENDED)

### Step 1: Connect to Your VPS

```bash
# From your local machine
ssh root@your-vps-ip
# Or use Hostinger's browser SSH terminal
```

### Step 2: Install Required Software

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install PM2 (Process Manager)
npm install -g pm2

# Install Nginx (Reverse Proxy)
apt install -y nginx

# Install Certbot (SSL)
apt install -y certbot python3-certbot-nginx

# Verify installations
node --version  # Should show v18.x
npm --version
psql --version
```

### Step 3: Setup PostgreSQL Database

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE mulary_ecommerce;
CREATE USER mulary_user WITH ENCRYPTED PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE mulary_ecommerce TO mulary_user;
\q

# Test connection
psql -U mulary_user -d mulary_ecommerce -h localhost -W
```

### Step 4: Clone and Setup Backend

```bash
# Create app directory
mkdir -p /var/www
cd /var/www

# Clone your repository
git clone https://github.com/your-username/mulary-backend.git
cd mulary-backend/backend

# Install dependencies
npm install

# Create .env file
nano .env
```

**Copy this into .env:**
```env
NODE_ENV=production
PORT=5000
API_URL=https://api.yourdomain.com
CLIENT_URL=https://yourdomain.com

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mulary_ecommerce
DB_USER=mulary_user
DB_PASSWORD=your_secure_password_here

# JWT (Generate new keys!)
JWT_SECRET=your_64_char_random_string_here
JWT_EXPIRES_IN=7d

# Email (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Stripe
STRIPE_SECRET_KEY=sk_live_your_live_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Razorpay
RAZORPAY_KEY_ID=rzp_live_your_key
RAZORPAY_KEY_SECRET=your_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Save with `Ctrl+O`, exit with `Ctrl+X`

### Step 5: Build and Run Database Migrations

```bash
# Build TypeScript
npm run build

# Run database migrations
npm run migrate

# Run premium features migrations
psql -U mulary_user -d mulary_ecommerce -h localhost -f src/db/schema_premium.sql

# (Optional) Seed test data
npm run seed
```

### Step 6: Start Backend with PM2

```bash
# Start the app
pm2 start dist/server.js --name mulary-backend

# Configure PM2 to start on boot
pm2 startup
pm2 save

# Check status
pm2 status
pm2 logs mulary-backend

# Other useful PM2 commands:
# pm2 restart mulary-backend
# pm2 stop mulary-backend
# pm2 delete mulary-backend
```

### Step 7: Configure Nginx (Reverse Proxy)

```bash
# Create Nginx config
nano /etc/nginx/sites-available/mulary
```

**Paste this configuration:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com yourdomain.com www.yourdomain.com;

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend (if serving from same server)
    location / {
        root /var/www/mulary-frontend/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/mulary /etc/nginx/sites-enabled/

# Test Nginx config
nginx -t

# Restart Nginx
systemctl restart nginx
```

### Step 8: Setup SSL Certificate (HTTPS)

```bash
# Get SSL certificate from Let's Encrypt
certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Follow prompts, select:
# - Enter email
# - Agree to terms
# - Redirect HTTP to HTTPS (option 2)

# Auto-renewal is set up automatically
# Test renewal:
certbot renew --dry-run
```

### Step 9: Setup Firewall

```bash
# Allow SSH, HTTP, HTTPS
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable

# Check status
ufw status
```

### Step 10: Test Your Deployment

```bash
# Test health endpoint
curl https://yourdomain.com/api/health

# Should return: {"status":"ok","timestamp":"..."}
```

---

## 🎯 OPTION 2: SHARED/BUSINESS HOSTING (Node.js Support)

### If Hostinger Supports Node.js:

1. **Upload Files via FTP/File Manager**
   - Upload backend folder to `public_html/api` or similar

2. **Setup Node.js Application** (in Hostinger Panel)
   - Go to: Website → Manage → Node.js
   - Set Node version: 18.x
   - Set Application Root: `/public_html/api`
   - Set Application URL: `api.yourdomain.com`
   - Set Application Startup File: `dist/server.js`

3. **Setup Environment Variables** (in Hostinger Panel)
   - Add all variables from `.env.example`

4. **Setup Database**
   - Create PostgreSQL database in Hostinger Panel
   - Import `schema.sql` and `schema_premium.sql`

5. **Start Application** (in Hostinger Panel)
   - Click "Start" in Node.js section

---

## 🔄 AUTO-DEPLOYMENT (GitHub Actions)

### Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Hostinger

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/mulary-backend/backend
            git pull origin main
            npm install
            npm run build
            pm2 restart mulary-backend
```

**Add secrets in GitHub:**
- `HOST`: Your VPS IP
- `USERNAME`: SSH username (usually `root`)
- `SSH_KEY`: Your private SSH key

---

## 📊 MONITORING & MAINTENANCE

### PM2 Monitoring:
```bash
# View logs
pm2 logs mulary-backend

# Monitor resources
pm2 monit

# View status
pm2 status
```

### Database Backup:
```bash
# Create backup script
nano /root/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/backups"
mkdir -p $BACKUP_DIR

pg_dump -U mulary_user -d mulary_ecommerce > $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

```bash
# Make executable
chmod +x /root/backup-db.sh

# Schedule daily backup (crontab)
crontab -e
# Add: 0 2 * * * /root/backup-db.sh
```

### Log Rotation:
```bash
# Logs are managed by PM2 automatically
# Check: ~/.pm2/logs/
```

---

## 🐛 TROUBLESHOOTING

### Backend not starting:
```bash
# Check logs
pm2 logs mulary-backend --lines 50

# Check if port is in use
netstat -tulpn | grep 5000

# Restart
pm2 restart mulary-backend
```

### Database connection error:
```bash
# Test connection
psql -U mulary_user -d mulary_ecommerce -h localhost

# Check PostgreSQL status
systemctl status postgresql

# Restart PostgreSQL
systemctl restart postgresql
```

### Nginx issues:
```bash
# Test config
nginx -t

# Check logs
tail -f /var/log/nginx/error.log

# Restart
systemctl restart nginx
```

### SSL issues:
```bash
# Renew certificate
certbot renew

# Check certificate
certbot certificates
```

---

## 📈 PERFORMANCE OPTIMIZATION

### Enable Gzip in Nginx:
```nginx
# Add to /etc/nginx/nginx.conf
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

### Setup Redis (Optional - for caching):
```bash
apt install redis-server
systemctl enable redis-server
systemctl start redis-server

# Add to .env:
# REDIS_URL=redis://localhost:6379
```

### PM2 Cluster Mode (Multi-core):
```bash
# Instead of single instance:
pm2 start dist/server.js -i max --name mulary-backend
```

---

## 💰 COST BREAKDOWN (Hostinger)

### Initial Setup:
- Domain: $9.99/year (if not owned)
- VPS 1: $5.99/month
- SSL: Free (Let's Encrypt)
- **Total: ~$6/month**

### Add-ons (Optional):
- VPS 2 (upgrade): $8.99/month
- Redis Cloud: $0-10/month
- Backup Storage: $2/month

---

## ✅ POST-DEPLOYMENT CHECKLIST

- ✅ Backend accessible at `https://yourdomain.com/api/health`
- ✅ SSL certificate installed and working
- ✅ Database migrations run successfully
- ✅ PM2 configured to start on boot
- ✅ Nginx reverse proxy working
- ✅ Environment variables set correctly
- ✅ Payment webhooks configured
- ✅ Email sending tested
- ✅ Cloudinary uploads working
- ✅ Database backups scheduled
- ✅ Firewall configured
- ✅ Monitoring setup (PM2)

---

## 🎯 NEXT STEPS AFTER DEPLOYMENT

1. **Test All Endpoints** (use Postman/Thunder Client)
2. **Deploy Frontend** (React app)
3. **Configure Payment Webhooks** (Stripe, Razorpay)
4. **Setup Email Templates**
5. **Add Monitoring** (UptimeRobot, Sentry)
6. **Create Admin User**
7. **Add Initial Products**
8. **Test Complete User Journey**
9. **Launch! 🚀**

---

## 🆘 NEED HELP?

- Hostinger Support: https://www.hostinger.com/contact
- Documentation: Check project README.md
- Community: Stack Overflow, GitHub Issues

---

**YOU'RE READY TO DEPLOY! 🎉**
