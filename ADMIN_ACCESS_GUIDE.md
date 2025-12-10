# 🔐 Admin Dashboard Access Guide

## Admin Account Credentials

### Admin Account
- **Email:** `admin@test.com`
- **Password:** `admin123`

### Editor Account (Company Employee)
- **Email:** `editor@test.com`
- **Password:** `editor123` (Note: You may need to add this to the password validation)

### Customer Account (For Testing)
- **Email:** `customer@test.com`
- **Password:** `customer123`

---

## How to Access Admin Dashboard

### Step 1: Start the Development Server
```bash
npm run dev
```

### Step 2: Open the Website
Navigate to: **http://localhost:5173**

### Step 3: Login as Admin
1. Click **"Sign In"** in the top right corner
2. Enter:
   - Email: `admin@test.com`
   - Password: `admin123`
3. Check "Remember me" if you want to stay logged in
4. Click **"Sign In"**

### Step 4: Access Admin Dashboard
After logging in, you'll see an **"Admin"** link in the navigation bar (only visible to admin users).

Click on **"Admin"** to access the dashboard.

**OR** directly navigate to: **http://localhost:5173/admin**

---

## Admin Dashboard Features

### 1. **All Products Tab**
- View all products in a table
- See product details: name, SKU, price, stock, status
- View product on site
- Edit product (coming soon)

### 2. **Add New Product Tab**
- Complete product creation form
- Add all product details including:
  - Basic info (name, description, category, brand)
  - Pricing (price, original price, discount)
  - Images (thumbnail and multiple images)
  - Sizes and colors
  - Stock and SKU
  - Detailed specifications (GSM, fabric, care instructions, etc.)

### 3. **Account Management** (Coming Soon)
- Add company employees
- Manage user roles (customer, editor, admin)
- Activate/deactivate accounts
- View all users

---

## Role Permissions

### **Customer** Role
- ✅ Browse products
- ✅ Place orders
- ❌ Edit products
- ❌ Access admin dashboard
- ❌ Manage users

### **Editor** Role (Company Employee)
- ✅ Browse products
- ✅ Place orders
- ✅ Edit products
- ✅ Access admin dashboard
- ✅ Manage orders
- ❌ Manage users/accounts

### **Admin** Role
- ✅ Browse products
- ✅ Place orders
- ✅ Edit products
- ✅ Access admin dashboard
- ✅ Manage orders
- ✅ Manage users/accounts (full access)

---

## Security Notes

⚠️ **Important:** 
- Customer accounts **CANNOT** access the admin dashboard
- Only users with `admin` or `editor` roles can access `/admin`
- If a customer tries to access `/admin`, they will be redirected to the home page
- The Admin link in the navbar only appears for admin/editor users

---

## Troubleshooting

### Can't see Admin link?
- Make sure you're logged in with an admin account
- Check that your user role is `admin` or `editor`
- Try logging out and logging back in

### Access Denied message?
- You're logged in as a customer account
- Log out and log in with admin credentials

### Dashboard not loading?
- Check browser console for errors
- Make sure the development server is running
- Try refreshing the page

---

## Quick Test Checklist

- [ ] Login with admin account
- [ ] See "Admin" link in navbar
- [ ] Access `/admin` route
- [ ] View products table
- [ ] Switch to "Add New Product" tab
- [ ] Try adding a product
- [ ] Verify product appears in products list

---

**Need Help?** Check the browser console (F12) for any error messages.

