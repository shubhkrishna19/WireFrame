import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTheme } from '../contexts/ThemeContext';
import { sanitizeFormData } from '../utils/security';

// Validation schema allowing 5 or 6 digit ZIP codes
const guestCheckoutSchema = z.object({
    email: z.string().email('Invalid email address'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    street: z.string().min(5, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zipCode: z.string().regex(/^\d{5,6}$/, 'ZIP code must be 5 or 6 digits'),
});

export type GuestCheckoutData = z.infer<typeof guestCheckoutSchema>;

interface GuestCheckoutFormProps {
    onSubmit: (data: GuestCheckoutData) => void;
    initialData?: Partial<GuestCheckoutData>;
}

export const GuestCheckoutForm: React.FC<GuestCheckoutFormProps> = ({ onSubmit, initialData }) => {
    const { theme } = useTheme();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<GuestCheckoutData>({
        resolver: zodResolver(guestCheckoutSchema),
        defaultValues: initialData,
    });

    const handleFormSubmit = (data: GuestCheckoutData) => {
        const sanitized = sanitizeFormData(data);
        onSubmit(sanitized as GuestCheckoutData);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
            {/* Contact Information */}
            <div>
                <h3 className="text-lg font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
                    Contact Information
                </h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="guest-email" className="block text-sm font-medium mb-1" style={{ color: theme.colors.textSecondary }}>
                            Email Address *
                        </label>
                        <input
                            {...register('email')}
                            type="email"
                            id="guest-email"
                            className="w-full px-4 py-3 border-2 rounded-creative focus:ring-2 transition-all"
                            style={{
                                backgroundColor: theme.colors.backgroundTertiary,
                                borderColor: errors.email ? '#FCA5A5' : theme.colors.borderPrimary,
                                color: theme.colors.textPrimary,
                            }}
                            placeholder="john@example.com"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm" style={{ color: '#DC2626' }}>
                                {errors.email.message}
                            </p>
                        )}
                        <p className="mt-1 text-xs" style={{ color: theme.colors.textTertiary }}>
                            We'll send your order confirmation here
                        </p>
                    </div>
                    <div>
                        <label htmlFor="guest-name" className="block text-sm font-medium mb-1" style={{ color: theme.colors.textSecondary }}>
                            Full Name *
                        </label>
                        <input
                            {...register('name')}
                            type="text"
                            id="guest-name"
                            className="w-full px-4 py-3 border-2 rounded-creative focus:ring-2 transition-all"
                            style={{
                                backgroundColor: theme.colors.backgroundTertiary,
                                borderColor: errors.name ? '#FCA5A5' : theme.colors.borderPrimary,
                                color: theme.colors.textPrimary,
                            }}
                            placeholder="John Doe"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm" style={{ color: '#DC2626' }}>
                                {errors.name.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="guest-phone" className="block text-sm font-medium mb-1" style={{ color: theme.colors.textSecondary }}>
                            Phone Number *
                        </label>
                        <input
                            {...register('phone')}
                            type="tel"
                            id="guest-phone"
                            className="w-full px-4 py-3 border-2 rounded-creative focus:ring-2 transition-all"
                            style={{
                                backgroundColor: theme.colors.backgroundTertiary,
                                borderColor: errors.phone ? '#FCA5A5' : theme.colors.borderPrimary,
                                color: theme.colors.textPrimary,
                            }}
                            placeholder="+91 98765 43210"
                        />
                        {errors.phone && (
                            <p className="mt-1 text-sm" style={{ color: '#DC2626' }}>
                                {errors.phone.message}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Shipping Address */}
            <div>
                <h3 className="text-lg font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
                    Shipping Address
                </h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="guest-street" className="block text-sm font-medium mb-1" style={{ color: theme.colors.textSecondary }}>
                            Street Address *
                        </label>
                        <input
                            {...register('street')}
                            type="text"
                            id="guest-street"
                            className="w-full px-4 py-3 border-2 rounded-creative focus:ring-2 transition-all"
                            style={{
                                backgroundColor: theme.colors.backgroundTertiary,
                                borderColor: errors.street ? '#FCA5A5' : theme.colors.borderPrimary,
                                color: theme.colors.textPrimary,
                            }}
                            placeholder="123 Main Street, Apt 4B"
                        />
                        {errors.street && (
                            <p className="mt-1 text-sm" style={{ color: '#DC2626' }}>
                                {errors.street.message}
                            </p>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="guest-city" className="block text-sm font-medium mb-1" style={{ color: theme.colors.textSecondary }}>
                                City *
                            </label>
                            <input
                                {...register('city')}
                                type="text"
                                id="guest-city"
                                className="w-full px-4 py-3 border-2 rounded-creative focus:ring-2 transition-all"
                                style={{
                                    backgroundColor: theme.colors.backgroundTertiary,
                                    borderColor: errors.city ? '#FCA5A5' : theme.colors.borderPrimary,
                                    color: theme.colors.textPrimary,
                                }}
                                placeholder="Mumbai"
                            />
                            {errors.city && (
                                <p className="mt-1 text-sm" style={{ color: '#DC2626' }}>
                                    {errors.city.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="guest-state" className="block text-sm font-medium mb-1" style={{ color: theme.colors.textSecondary }}>
                                State *
                            </label>
                            <input
                                {...register('state')}
                                type="text"
                                id="guest-state"
                                className="w-full px-4 py-3 border-2 rounded-creative focus:ring-2 transition-all"
                                style={{
                                    backgroundColor: theme.colors.backgroundTertiary,
                                    borderColor: errors.state ? '#FCA5A5' : theme.colors.borderPrimary,
                                    color: theme.colors.textPrimary,
                                }}
                                placeholder="Maharashtra"
                            />
                            {errors.state && (
                                <p className="mt-1 text-sm" style={{ color: '#DC2626' }}>
                                    {errors.state.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="guest-zipCode" className="block text-sm font-medium mb-1" style={{ color: theme.colors.textSecondary }}>
                            ZIP Code *
                        </label>
                        <input
                            {...register('zipCode')}
                            type="text"
                            id="guest-zipCode"
                            className="w-full px-4 py-3 border-2 rounded-creative focus:ring-2 transition-all"
                            style={{
                                backgroundColor: theme.colors.backgroundTertiary,
                                borderColor: errors.zipCode ? '#FCA5A5' : theme.colors.borderPrimary,
                                color: theme.colors.textPrimary,
                            }}
                            placeholder="400001"
                        />
                        {errors.zipCode && (
                            <p className="mt-1 text-sm" style={{ color: '#DC2626' }}>
                                {errors.zipCode.message}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
};
