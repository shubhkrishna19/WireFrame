import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { CompareProvider } from './contexts/CompareContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { AnalyticsWrapper } from './components/AnalyticsWrapper';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { AbandonedCartRecovery } from './components/AbandonedCartRecovery';
import { CartAbandonmentModal } from './components/CartAbandonmentModal';
import { StylingAssistant } from './components/StylingAssistant';
import { BackToTop } from './components/BackToTop';
import { RecentlyViewedBar } from './components/RecentlyViewedBar';
import { LoadingSpinner } from './components/LoadingSpinner';
import { PageTransition } from './components/PageTransition';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const Register = lazy(() => import('./pages/Register').then(module => ({ default: module.Register })));
const Profile = lazy(() => import('./pages/Profile').then(module => ({ default: module.Profile })));
const Products = lazy(() => import('./pages/Products').then(module => ({ default: module.Products })));
const ProductDetail = lazy(() => import('./pages/ProductDetail').then(module => ({ default: module.ProductDetail })));
const Cart = lazy(() => import('./pages/Cart').then(module => ({ default: module.Cart })));
const Checkout = lazy(() => import('./pages/Checkout').then(module => ({ default: module.Checkout })));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation').then(module => ({ default: module.OrderConfirmation })));
const Wishlist = lazy(() => import('./pages/Wishlist').then(module => ({ default: module.Wishlist })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const NotFound = lazy(() => import('./pages/NotFound').then(module => ({ default: module.NotFound })));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy').then(module => ({ default: module.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./pages/TermsOfService').then(module => ({ default: module.TermsOfService })));
const ReturnsPolicy = lazy(() => import('./pages/ReturnsPolicy').then(module => ({ default: module.ReturnsPolicy })));
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy').then(module => ({ default: module.ShippingPolicy })));
const ContactUs = lazy(() => import('./pages/ContactUs').then(module => ({ default: module.ContactUs })));
const AboutUs = lazy(() => import('./pages/AboutUs').then(module => ({ default: module.AboutUs })));
const SizeGuide = lazy(() => import('./pages/SizeGuide').then(module => ({ default: module.SizeGuide })));
const FAQ = lazy(() => import('./pages/FAQ').then(module => ({ default: module.FAQ })));
const Lookbook = lazy(() => import('./pages/Lookbook').then(module => ({ default: module.Lookbook })));
const ProductComparison = lazy(() => import('./pages/ProductComparison').then(module => ({ default: module.ProductComparison })));
const CategoryPage = lazy(() => import('./pages/CategoryPage').then(module => ({ default: module.CategoryPage })));

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/profile" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/profile" replace /> : <Register />}
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
          {/* Category Routes */}
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/category/:category/:subcategory" element={<CategoryPage />} />
          {/* Legacy collection routes redirect to category */}
          <Route path="/collections/:category" element={<CategoryPage />} />
          <Route path="/collections/:category/:subcategory" element={<CategoryPage />} />
          <Route path="/products/:slug" element={<PageTransition><ProductDetail /></PageTransition>} />
          <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/returns-policy" element={<ReturnsPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/lookbook" element={<Lookbook />} />
          <Route path="/compare" element={<ProductComparison />} />
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <CurrencyProvider>
            <ToastProvider>
              <CompareProvider>
                <BrowserRouter>
                  <AnalyticsWrapper>
                    <AppRoutes />
                    <AbandonedCartRecovery />
                    <CartAbandonmentModal />
                    <StylingAssistant />
                    <BackToTop />
                    <RecentlyViewedBar />
                  </AnalyticsWrapper>
                </BrowserRouter>
              </CompareProvider>
            </ToastProvider>
          </CurrencyProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
