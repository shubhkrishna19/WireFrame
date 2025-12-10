import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams } from 'react-router-dom';
import { AddressManagement } from '../components/AddressManagement';
import { PasswordChange } from '../components/PasswordChange';
import { OrderHistory } from '../components/OrderHistory';
import { Navbar } from '../components/Navbar';
import { useTheme } from '../contexts/ThemeContext';

import { Footer } from '../components/Footer';
import { usePageTracking } from '../hooks/usePageTracking';
import { SEO } from '../components/SEO';
import { pageMetadata } from '../utils/seoConfig';
import { LoadingSpinner } from '../components/LoadingSpinner';
import * as dataStore from '../store/dataStore';
import { Breadcrumb } from '../components/Breadcrumb';
import { Order } from '../data/orderTypes';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { theme } = useTheme();

  usePageTracking('Profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'password' | 'orders'>('profile');
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'orders' || tab === 'addresses' || tab === 'password') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const loadOrders = () => {
    if (user) {
      try {
        const allOrders = JSON.parse(localStorage.getItem('bluewud_orders') || '[]') as Order[];
        const userOrders = allOrders
          .filter((order: Order) => order.userId === user._id)
          .sort((a: Order, b: Order) => b.createdAt - a.createdAt);
        setOrders(userOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
        setOrders([]);
      }
    }
  };

  useEffect(() => {
    if (user && activeTab === 'orders') {
      loadOrders();
    }
  }, [user, activeTab]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  React.useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      dataStore.updateUser(user._id, {
        name: data.name,
        email: data.email,
        phone: data.phone,
      });
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      // Refresh user in context
      refreshUser();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.[0]) return;

    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        dataStore.updateUser(user._id, {
          avatar: reader.result as string,
        });
        setSuccess('Avatar updated successfully!');
        refreshUser();
      } catch (err: any) {
        setError(err.message || 'Failed to update avatar.');
      }
    };
    reader.readAsDataURL(file);
  };

  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.backgroundPrimary} 0%, ${theme.colors.backgroundSecondary} 50%, ${theme.colors.backgroundPrimary} 100%)`,
        }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <SEO
        title={pageMetadata.profile.title}
        description={pageMetadata.profile.description}
      />
      <div
        className="min-h-screen"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.backgroundPrimary} 0%, ${theme.colors.backgroundSecondary} 50%, ${theme.colors.backgroundPrimary} 100%)`,
          color: theme.colors.textPrimary,
        }}
      >
        <Navbar />

        {/* Breadcrumb */}
        <div
          className="border-b-2"
          style={{
            backgroundColor: theme.colors.backgroundSecondary,
            borderColor: theme.colors.borderPrimary,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Breadcrumb items={[{ label: 'Profile' }]} />
          </div>
        </div>

        <div className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div
              className="border-2 rounded-creative shadow-card overflow-hidden"
              style={{
                backgroundColor: theme.colors.cardBackground,
                borderColor: theme.colors.borderPrimary,
              }}
            >
              <div
                className="px-6 py-8"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.buttonPrimary} 0%, ${theme.colors.buttonSecondary} 100%)`,
                  color: '#FFFFFF',
                }}
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="relative">
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold"
                      style={{
                        backgroundColor: '#FFFFFF',
                        color: theme.colors.buttonPrimary,
                      }}
                    >
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full object-cover" loading="lazy" />
                      ) : (
                        user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <label
                      className="absolute bottom-0 right-0 rounded-full p-2 cursor-pointer transition-colors hover:opacity-80"
                      style={{
                        backgroundColor: theme.colors.backgroundTertiary,
                      }}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: theme.colors.textPrimary }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </label>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
                    <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{user.email}</p>
                    <span
                      className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: '#FFFFFF',
                      }}
                    >
                      {user.role === 'admin' ? 'Admin' : 'Customer'}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="border-b"
                style={{ borderColor: theme.colors.borderPrimary }}
              >
                <nav className="flex -mb-px">
                  {(['profile', 'addresses', 'orders', 'password'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="px-6 py-4 text-sm font-medium capitalize border-b-4 transition-colors"
                      style={{
                        borderColor: activeTab === tab
                          ? theme.colors.buttonPrimary
                          : 'transparent',
                        color: activeTab === tab
                          ? theme.colors.textPrimary
                          : theme.colors.textTertiary,
                      }}
                      onMouseEnter={(e) => {
                        if (activeTab !== tab) {
                          e.currentTarget.style.color = theme.colors.textSecondary;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activeTab !== tab) {
                          e.currentTarget.style.color = theme.colors.textTertiary;
                        }
                      }}
                    >
                      {tab} {tab === 'orders' && orders.length > 0 && `(${orders.length})`}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {error && (
                  <div
                    className="mb-4 p-5 border-2 rounded-creative shadow-sm"
                    style={{
                      backgroundColor: '#FEE2E2',
                      borderColor: '#FCA5A5',
                    }}
                  >
                    <p className="text-sm font-semibold" style={{ color: '#DC2626' }}>{error}</p>
                  </div>
                )}

                {success && (
                  <div
                    className="mb-4 p-5 border-2 rounded-creative shadow-sm"
                    style={{
                      backgroundColor: '#D1FAE5',
                      borderColor: '#86EFAC',
                    }}
                  >
                    <p className="text-sm font-semibold" style={{ color: '#059669' }}>{success}</p>
                  </div>
                )}

                {activeTab === 'profile' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2
                        className="text-xl font-semibold"
                        style={{ color: theme.colors.textPrimary }}
                      >
                        Profile Information
                      </h2>
                      {!isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-6 py-3 rounded-creative font-extrabold uppercase tracking-wider transition-all shadow-elegant transform hover:scale-105"
                          style={{
                            background: `linear-gradient(135deg, ${theme.colors.buttonPrimary} 0%, ${theme.colors.buttonSecondary} 100%)`,
                            color: '#FFFFFF',
                          }}
                        >
                          Edit Profile
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                          disabled={!isEditing}
                          className={`w-full px-5 py-4 border-2 rounded-creative focus:ring-2 transition-all font-medium ${errors.name ? '' : ''
                            }`}
                          style={{
                            backgroundColor: !isEditing
                              ? theme.colors.backgroundTertiary
                              : theme.colors.cardBackground,
                            borderColor: errors.name ? '#FCA5A5' : theme.colors.borderPrimary,
                            color: theme.colors.textPrimary,
                          }}
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
                          disabled={!isEditing}
                          className={`w-full px-5 py-4 border-2 rounded-creative focus:ring-2 transition-all font-medium ${errors.email ? '' : ''
                            }`}
                          style={{
                            backgroundColor: !isEditing
                              ? theme.colors.backgroundTertiary
                              : theme.colors.cardBackground,
                            borderColor: errors.email ? '#FCA5A5' : theme.colors.borderPrimary,
                            color: theme.colors.textPrimary,
                          }}
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
                          Phone Number
                        </label>
                        <input
                          {...register('phone')}
                          type="tel"
                          id="phone"
                          disabled={!isEditing}
                          className={`w-full px-5 py-4 border-2 rounded-creative focus:ring-2 transition-all font-medium ${errors.phone ? '' : ''
                            }`}
                          style={{
                            backgroundColor: !isEditing
                              ? theme.colors.backgroundTertiary
                              : theme.colors.cardBackground,
                            borderColor: errors.phone ? '#FCA5A5' : theme.colors.borderPrimary,
                            color: theme.colors.textPrimary,
                          }}
                        />
                        {errors.phone && (
                          <p className="mt-1 text-sm" style={{ color: '#DC2626' }}>{errors.phone.message}</p>
                        )}
                      </div>

                      {isEditing && (
                        <div className="flex gap-3">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="px-8 py-4 rounded-creative font-extrabold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-elegant transform hover:scale-105 disabled:transform-none"
                            style={{
                              background: `linear-gradient(135deg, ${theme.colors.buttonPrimary} 0%, ${theme.colors.buttonSecondary} 100%)`,
                              color: '#FFFFFF',
                            }}
                          >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditing(false);
                              reset();
                              setError(null);
                              setSuccess(null);
                            }}
                            className="px-8 py-4 rounded-creative font-extrabold uppercase tracking-wider transition-all shadow-sm transform hover:scale-105"
                            style={{
                              backgroundColor: theme.colors.backgroundTertiary,
                              color: theme.colors.textPrimary,
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </form>
                  </div>
                )}

                {activeTab === 'addresses' && <AddressManagement userId={user._id} />}

                {activeTab === 'orders' && (
                  <OrderHistory orders={orders} onOrderUpdate={loadOrders} />
                )}

                {activeTab === 'password' && <PasswordChange userId={user._id} />}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

