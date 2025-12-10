# Mulary - Fashion E-Commerce Platform

A modern e-commerce fashion platform built with React, TypeScript, and Tailwind CSS. Currently runs as a standalone frontend with localStorage, ready to be connected to a backend.

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
# Serve the dist folder with any HTTP server
cd dist
python -m http.server 8000
```

## 📚 Documentation

- **[HOW_TO_RUN.md](./HOW_TO_RUN.md)** - How to run the app locally
- **[NEXT_STEPS.md](./NEXT_STEPS.md)** - Roadmap and next steps
- **[BACKEND_SETUP.md](./BACKEND_SETUP.md)** - Guide to add a production backend
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment guide

## 🎯 Current Features

✅ User authentication (localStorage-based)
✅ Product catalog with 21+ products
✅ Advanced search and filtering
✅ Category navigation
✅ Sorting options
✅ User profile management
✅ Address management
✅ Password change
✅ Responsive design

## Features

### 1. User Registration
- Email validation
- Strong password requirements (8+ chars, uppercase, lowercase, number, special char)
- Terms & conditions checkbox
- Form validation with error messages
- Real-time validation feedback

### 2. User Login
- Email/password authentication
- "Remember me" functionality (stores token in localStorage vs sessionStorage)
- Error handling for invalid credentials
- Loading states

### 3. User Profile
- View profile information
- Edit name, phone, email
- Multiple addresses management (add/edit/delete)
- User avatar upload (base64 for demo, can be extended to use cloud storage)
- Password change functionality
- Tabbed interface for better UX

### 4. Database (Convex)
- **users table**: email, passwordHash, name, phone, role (customer/admin), avatar, createdAt, updatedAt
- **userAddresses table**: userId, type (home/work/other), street, city, state, zipCode, isDefault, createdAt, updatedAt

### 5. Security
- Password hashing using bcryptjs
- JWT token-based authentication
- Secure session management (localStorage/sessionStorage)
- Protected routes

### 6. Styling
- React with TypeScript
- Tailwind CSS for styling
- Fully responsive (mobile, tablet, desktop)
- Loading states while processing
- Clear error messages
- Modern, professional UI

## Test Accounts

The seed script creates two test users:

1. **Customer Account**
   - Email: `customer@test.com`
   - Password: `customer123`

2. **Admin Account**
   - Email: `admin@test.com`
   - Password: `admin123`

## Product Catalog

The app includes a comprehensive product catalog with:
- **5 Categories**: Men, Women, Kids, Accessories, Shoes
- **20+ Products** across all categories
- Product details: images, prices, ratings, sizes, colors
- Category filtering and search functionality
- Pagination (20 products per page)

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Convex account (free tier available)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Convex:**
   ```bash
   npx convex dev
   ```
   This will:
   - Create a new Convex project (if you don't have one)
   - Generate the necessary files
   - Start the Convex development server
   - Provide you with a deployment URL

3. **Configure environment variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_CONVEX_URL=your-convex-deployment-url
   ```
   You'll get this URL from step 2.

4. **Seed test data:**
   After Convex is set up, you can seed the test data by calling the seed functions. You can do this through the Convex dashboard.

   To seed via Convex dashboard:
   - Go to your Convex dashboard
   - Navigate to Functions
   - **First, seed users:** Find `seed:seedTestData` and click "Run"
   - **Then, seed products:** Find `seedProducts:seedProducts` and click "Run"
   - This will create 2 test users and 20+ products across 5 categories

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## Project Structure

```
mulary-app/
├── convex/
│   ├── schema.ts          # Database schema definitions
│   ├── auth.ts            # Authentication mutations and queries
│   ├── addresses.ts       # Address management mutations and queries
│   └── seed.ts            # Test data seeding
├── src/
│   ├── components/
│   │   ├── ProtectedRoute.tsx
│   │   ├── AddressManagement.tsx
│   │   └── PasswordChange.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── Profile.tsx
│   ├── App.tsx
│   ├── main.tsx
│   ├── convexClient.ts
│   └── index.css
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run convex:dev` - Start Convex development server
- `npm run convex:deploy` - Deploy Convex functions

## Security Notes

⚠️ **Important for Production:**

1. **JWT Secret**: Change the JWT_SECRET in `convex/auth.ts` to a strong, random secret. Consider using environment variables.

2. **Password Requirements**: The current password requirements are enforced. Adjust as needed for your use case.

3. **Avatar Upload**: Currently uses base64 encoding. For production, implement proper file storage (e.g., AWS S3, Cloudinary, or Convex file storage).

4. **HTTPS**: Always use HTTPS in production.

5. **Environment Variables**: Never commit `.env` files with sensitive data.

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Convex** - Backend-as-a-Service (database, auth, real-time)
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Tailwind CSS** - Styling
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT token generation

## Features in Detail

### Registration Form
- Real-time validation
- Password strength requirements
- Email format validation
- Terms & conditions checkbox (required)
- Clear error messages
- Loading states

### Login Form
- Email/password authentication
- Remember me checkbox (affects token storage)
- Forgot password link (UI only, can be extended)
- Error handling
- Loading states

### Profile Page
- Three tabs: Profile, Addresses, Password
- Profile editing with validation
- Avatar upload (base64)
- Address management (CRUD operations)
- Password change with current password verification
- Responsive design

### Address Management
- Add multiple addresses
- Edit existing addresses
- Delete addresses
- Set default address
- Address types: Home, Work, Other
- Form validation

## Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] Social login (Google, Facebook, etc.)
- [ ] Profile picture upload to cloud storage
- [ ] Activity log
- [ ] Account deletion
- [ ] Admin dashboard

## License

MIT

