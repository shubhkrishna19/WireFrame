import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Navbar } from '../components/Navbar';
import { sanitizeEmail, sanitizePhone } from '../utils/sanitize';
import { sanitizeFormData, validatePassword } from '../utils/security';
import { usePageTracking } from '../hooks/usePageTracking';
import { SEO } from '../components/SEO';
import { pageMetadata } from '../utils/seoConfig';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const { theme } = useTheme();
  usePageTracking('Register');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Validate password strength
      const passwordValidation = validatePassword(data.password);
      if (!passwordValidation.valid) {
        setError(passwordValidation.errors.join(', '));
        setIsLoading(false);
        return;
      }

      // Sanitize inputs
      const sanitizedEmail = sanitizeEmail(data.email);
      if (!sanitizedEmail) {
        setError('Invalid email address');
        setIsLoading(false);
        return;
      }

      const sanitizedName = sanitizeFormData({ name: data.name }).name;
      const sanitizedPhone = data.phone ? sanitizePhone(data.phone) : undefined;

      await registerUser(sanitizedEmail, data.password, sanitizedName, sanitizedPhone);
      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO
        title={pageMetadata.register.title}
        description={pageMetadata.register.description}
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
                className="text-3xl font-bold mb-2"
                style={{ color: theme.colors.textPrimary }}
              >
                Create Account
              </h1>
              <p style={{ color: theme.colors.textSecondary }}>Join the Bluewud furniture family</p>
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
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.colors.textSecondary }}
                >
                  Full Name
                </label>
                <input
                  {...register('name')}
                  type="text"
                  id="name"
                  className={`w-full px-5 py-4 border-2 rounded-creative focus:ring-2 transition-all font-medium ${errors.name ? '' : ''
                    }`}
                  style={{
                    backgroundColor: theme.colors.backgroundTertiary,
                    borderColor: errors.name ? '#FCA5A5' : theme.colors.borderPrimary,
                    color: theme.colors.textPrimary,
                  }}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-1 text-sm" style={{ color: '#DC2626' }}>{errors.name.message}</p>
                )}
              </div>

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
                  className={`w-full px-5 py-4 border-2 rounded-creative focus:ring-2 transition-all font-medium ${errors.email ? '' : ''
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
                  htmlFor="phone"
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.colors.textSecondary }}
                >
                  Phone Number (Optional)
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  id="phone"
                  className="w-full px-5 py-4 border-2 rounded-creative focus:ring-2 transition-all font-medium"
                  style={{
                    backgroundColor: theme.colors.backgroundTertiary,
                    borderColor: theme.colors.borderPrimary,
                    color: theme.colors.textPrimary,
                  }}
                  placeholder="+1234567890"
                />
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
                  className={`w-full px-5 py-4 border-2 rounded-creative focus:ring-2 transition-all font-medium ${errors.password ? '' : ''
                    }`}
                  style={{
                    backgroundColor: theme.colors.backgroundTertiary,
                    borderColor: errors.password ? '#FCA5A5' : theme.colors.borderPrimary,
                    color: theme.colors.textPrimary,
                  }}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-sm" style={{ color: '#DC2626' }}>{errors.password.message}</p>
                )}
                <p
                  className="mt-1 text-xs"
                  style={{ color: theme.colors.textTertiary }}
                >
                  Must contain: 8+ chars, uppercase, lowercase, number, special char
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.colors.textSecondary }}
                >
                  Confirm Password
                </label>
                <input
                  {...register('confirmPassword')}
                  type="password"
                  id="confirmPassword"
                  className={`w-full px-5 py-4 border-2 rounded-creative focus:ring-2 transition-all font-medium ${errors.confirmPassword ? '' : ''
                    }`}
                  style={{
                    backgroundColor: theme.colors.backgroundTertiary,
                    borderColor: errors.confirmPassword ? '#FCA5A5' : theme.colors.borderPrimary,
                    color: theme.colors.textPrimary,
                  }}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm" style={{ color: '#DC2626' }}>{errors.confirmPassword.message}</p>
                )}
              </div>

              <div>
                <label className="flex items-start">
                  <input
                    {...register('terms')}
                    type="checkbox"
                    className="mt-1 mr-2 h-4 w-4 rounded"
                    style={{
                      accentColor: theme.colors.buttonPrimary,
                      backgroundColor: theme.colors.backgroundTertiary,
                      borderColor: theme.colors.borderPrimary,
                    }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    I agree to the{' '}
                    <a
                      href="#"
                      className="transition-colors hover:opacity-80"
                      style={{ color: theme.colors.buttonPrimary }}
                    >
                      Terms & Conditions
                    </a>
                  </span>
                </label>
                {errors.terms && (
                  <p className="mt-1 text-sm" style={{ color: '#DC2626' }}>{errors.terms.message}</p>
                )}
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
                    Creating Account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <p
              className="mt-6 text-center text-sm"
              style={{ color: theme.colors.textSecondary }}
            >
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold transition-colors hover:opacity-80"
                style={{ color: theme.colors.buttonPrimary }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

