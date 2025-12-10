import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useCurrency } from '../contexts/CurrencyContext';

interface EnhancedPriceDisplayProps {
    currentPrice: number;
    originalPrice?: number;
    showSavings?: boolean;
}

export const EnhancedPriceDisplay: React.FC<EnhancedPriceDisplayProps> = ({
    currentPrice,
    originalPrice,
    showSavings = true,
}) => {
    const { theme } = useTheme();
    const { formatPrice } = useCurrency();

    const hasDiscount = originalPrice && originalPrice > currentPrice;
    const discountPercent = hasDiscount
        ? Math.round(((originalPrice! - currentPrice) / originalPrice!) * 100)
        : 0;
    const savings = hasDiscount ? originalPrice! - currentPrice : 0;

    return (
        <div className="space-y-2">
            {/* Price Row */}
            <div className="flex items-baseline gap-3 flex-wrap">
                {/* Current Price */}
                <span
                    className="text-4xl font-black"
                    style={{ color: theme.colors.textPrimary }}
                >
                    {formatPrice(currentPrice)}
                </span>

                {/* Original Price (Strikethrough) */}
                {hasDiscount && (
                    <span
                        className="text-xl line-through font-semibold"
                        style={{ color: theme.colors.textTertiary }}
                    >
                        {formatPrice(originalPrice!)}
                    </span>
                )}

                {/* Discount Badge */}
                {hasDiscount && discountPercent > 0 && (
                    <span
                        className="px-3 py-1 rounded-full text-sm font-bold"
                        style={{
                            backgroundColor: '#10B981',
                            color: '#FFFFFF',
                        }}
                    >
                        {discountPercent}% OFF
                    </span>
                )}
            </div>

            {/* Savings Text */}
            {hasDiscount && showSavings && savings > 0 && (
                <p
                    className="text-sm font-semibold"
                    style={{ color: '#10B981' }}
                >
                    You save {formatPrice(savings)} ({discountPercent}% off)
                </p>
            )}
            {/* Inclusive Tax Message */}
            <p
                className="text-xs"
                style={{ color: theme.colors.textSecondary }}
            >
                Inclusive of all taxes
            </p>
        </div>
    );
};
