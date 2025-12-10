import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Navbar } from '../components/Navbar';
import { sanitizeEmail } from '../utils/sanitize';
import { sanitizeFormData } from '../utils/security';
import { usePageTracking } from '../hooks/usePageTracking';
import { SEO } from '../components/SEO';
import { pageMetadata } from '../utils/seoConfig';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const { theme } = useTheme();
  usePageTracking('Login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const redirectTo = searchParams.get('redirect') || '/profile';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Sanitize input
      const sanitizedEmail = sanitizeEmail(data.email);
      if (!sanitizedEmail) {
        setError('Invalid email address');
        setIsLoading(false);
        return;
      }

      const sanitizedData = sanitizeFormData({
        email: sanitizedEmail,
        password: data.password, // Don't sanitize password
        rememberMe: data.rememberMe,
      });

      await login(sanitizedData.email, sanitizedData.password, sanitizedData.rememberMe || false);
      navigate(redirectTo);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO
        title={pageMetadata.login.title}
        description={pageMetadata.login.description}
      />
      <div
        className="min-h-screen"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.backgroundPrimary} 0%, ${theme.colors.backgroundSecondary} 50%, ${theme.colors.backgroundPrimary} 100%)`,
          color: theme.colors.textPrimary,
        }}
      >
        <Navbar />
        <div className="flex items-center justify-center px-4 py-12 min-h-[calc(100vh-4rem)]">
          <div
            className="max-w-md w-full border-2 rounded-creative shadow-card p-8 lg:p-10"
            style={{
              backgroundColor: theme.colors.cardBackground,
              borderColor: theme.colors.borderPrimary,
            }}
          >
            <div className="text-center mb-8">
              <h1
                className="text-4xl font-bold mb-2"
                style={{ color: theme.colors.textPrimary }}
              >
                Welcome Back
              </h1>
              <p style={{ color: theme.colors.textSecondary }}>Sign in to your Bluewud account</p>
            </div>

            {error && (
              <div
                className="mb-6 p-5 border-2 rounded-creative shadow-sm"
                style={{
                  backgroundColor: '#FEE2E2',
                  borderColor: '#FCA5A5',
                }}
              >
                <p className="text-sm font-semibold" style={{ color: '#DC2626' }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.colors.textSecondary }}
                >
                  Email Address
                </label>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  className={`w-full px-5 py-4 border-2 rounded-creative focus:ring-2 transition-all font-medium ${errors.email ? 'border-red-300' : ''
                    }`}
                  style={{
                    backgroundColor: theme.colors.backgroundTertiary,
                    borderColor: errors.email ? '#FCA5A5' : theme.colors.borderPrimary,
                    color: theme.colors.textPrimary,
                  }}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm" style={{ color: '#DC2626' }}>{errors.email.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.colors.textSecondary }}
                >
                  Password
                </label>
                <input
                  {...register('password')}
                  type="password"
                  id="password"
                  className={`w-full px-5 py-4 border-2 rounded-creative focus:ring-2 transition-all font-medium ${errors.password ? 'border-red-300' : ''
                    }`}
                  style={{
                    backgroundColor: theme.colors.backgroundTertiary,
                    borderColor: errors.password ? '#FCA5A5' : theme.colors.borderPrimary,
                    color: theme.colors.textPrimary,
                  }}
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                />
                {errors.password && (
                  <p className="mt-1 text-sm" style={{ color: '#DC2626' }}>{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    {...register('rememberMe')}
                    type="checkbox"
                    className="h-4 w-4 rounded"
                    style={{
                      accentColor: theme.colors.buttonPrimary,
                      backgroundColor: theme.colors.backgroundTertiary,
                      borderColor: theme.colors.borderPrimary,
                    }}
                  />
                  <span
                    className="ml-2 text-sm"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    Remember me
                  </span>
                </label>
                <a
                  href="#"
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: theme.colors.buttonPrimary }}
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 rounded-creative font-extrabold uppercase tracking-wider text-lg focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-elegant hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.buttonPrimary} 0%, ${theme.colors.buttonSecondary} 100%)`,
                  color: '#FFFFFF',
                }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p
              className="mt-6 text-center text-sm"
              style={{ color: theme.colors.textSecondary }}
            >
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold transition-colors hover:opacity-80"
                style={{ color: theme.colors.buttonPrimary }}
              >
                Create one
              </Link>
            </p>

            <div
              className="mt-8 pt-6 border-t"
              style={{ borderColor: theme.colors.borderPrimary }}
            >
              <p
                className="text-xs text-center mb-2"
                style={{ color: theme.colors.textTertiary }}
              >
                Test Accounts:
              </p>
              <div
                className="text-xs text-center space-y-1"
                style={{ color: theme.colors.textSecondary }}
              >
                <p>Customer: customer@test.com / customer123</p>
                <p>Admin: admin@test.com / admin123</p>
                <p>Editor: editor@test.com / editor123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


