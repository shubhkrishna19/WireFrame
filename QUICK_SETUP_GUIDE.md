# 🚀 QUICK SETUP GUIDE - Get Running in 10 Minutes!

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ Node.js 18+ installed
- ✅ PostgreSQL installed (or Docker)
- ✅ Git (optional)

---

## ⚡ OPTION 1: Automated Setup (EASIEST)

### Step 1: Run the Setup Script
```bash
START_LOCAL_TESTING.bat
```

This will:
1. Check Node.js installation
2. Install backend dependencies
3. Create .env file (if not exists)
4. Build TypeScript
5. Start the backend server

### Step 2: Setup Database (One-time)

Open another terminal and run:
```bash
cd backend
npm run migrate
npm run seed
```

### Step 3: Start Frontend
```bash
# In root directory
npm run dev
```

**Done! Visit:** http://localhost:5173

---

## 🔧 OPTION 2: Manual Setup (Full Control)

### Backend Setup:

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file
copy .env.example .env

# 4. Edit .env with your database credentials
notepad .env

# 5. Build TypeScript
npm run build

# 6. Setup database
npm run migrate
npm run seed

# 7. Start backend
npm run dev
```

Backend runs on: http://localhost:5000

### Frontend Setup:

```bash
# 1. Navigate to root
cd ..

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Frontend runs on: http://localhost:5173

---

## 🐘 PostgreSQL Setup

### Option A: Local PostgreSQL

**Windows:**
1. Download from: https://www.postgresql.org/download/windows/
2. Install with default settings
3. Remember the password you set for 'postgres' user
4. Create database:
```sql
CREATE DATABASE mulary_ecommerce;
```

**Update backend\.env:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mulary_ecommerce
DB_USER=postgres
DB_PASSWORD=your_password_here
```

### Option B: Docker PostgreSQL (EASIEST)

```bash
docker run --name mulary-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=mulary_ecommerce \
  -p 5432:5432 \
  -d postgres:15
```

**Update backend\.env:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mulary_ecommerce
DB_USER=postgres
DB_PASSWORD=postgres
```

### Option C: Cloud PostgreSQL (FREE)

**Supabase (Recommended for testing):**
1. Go to: https://supabase.com/
2. Create free account
3. Create new project
4. Get connection string from Settings → Database
5. Update backend\.env with the connection string

---

## 🧪 Testing the Setup

### Test Backend:
```bash
# Health check
curl http://localhost:5000/health

# Should return:
{
  "status": "ok",
  "timestamp": "..."
}
```

### Test Database Connection:
```bash
cd backend
npm run migrate
# Should show: "Migrations completed successfully"
```

### Test Frontend:
Open browser: http://localhost:5173
- You should see the Mulary homepage
- Try registering a new account
- Browse products

---

## 🔐 Test Accounts (After Seeding)

```
Admin Account:
Email: admin@mulary.com
Password: admin123

Customer Account:
Email: customer@test.com
Password: test123
```

---

## 🐛 Troubleshooting

### Backend won't start:
- **Check Node.js version:** `node --version` (should be 18+)
- **Check PostgreSQL:** Make sure it's running
- **Check .env:** Verify database credentials
- **Check logs:** Look at terminal output for errors

### Database connection error:
- **Test PostgreSQL:** `psql -U postgres` (enter password)
- **Check DB_HOST:** Should be 'localhost' for local setup
- **Check DB_PORT:** Default is 5432
- **Firewall:** Make sure port 5432 is not blocked

### Frontend not loading:
- **Check Node.js:** `node --version`
- **Clear cache:** Delete `node_modules` and run `npm install` again
- **Check port:** Make sure 5173 is not in use

### Port already in use:
```bash
# Windows: Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Then restart the server
```

---

## 🎯 What's Next?

Once everything is running:

1. **Explore the site** - Browse products, add to cart
2. **Test checkout** - (Payment is in test mode)
3. **Test admin panel** - Login as admin, manage products
4. **Provide feedback** - Report any issues or suggestions
5. **Ready for production deployment** - See HOSTINGER_DEPLOYMENT.md

---

## 📞 Need Help?

- Check logs in `backend/logs/` for errors
- Review backend\.env configuration
- Make sure PostgreSQL is running
- Try restarting both servers

---

## ✅ Quick Health Check

Run this to verify everything:

```bash
# Test backend
curl http://localhost:5000/health

# Test database (should list tables)
cd backend
npm run migrate

# Test frontend (open in browser)
start http://localhost:5173
```

---

**You're all set! Happy developing! 🚀**
