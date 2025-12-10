import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useCurrency } from '../contexts/CurrencyContext';

interface FreeDeliveryProgressProps {
    cartTotal: number;
    threshold?: number;
}

export const FreeDeliveryProgress: React.FC<FreeDeliveryProgressProps> = ({
    cartTotal,
    threshold = 10000,
}) => {
    const { theme } = useTheme();
    const { formatPrice } = useCurrency();

    const remaining = Math.max(0, threshold - cartTotal);
    const progress = Math.min(100, (cartTotal / threshold) * 100);
    const isUnlocked = cartTotal >= threshold;

    return (
        <div
            className="rounded-lg border-2 p-4"
            style={{
                backgroundColor: theme.colors.backgroundSecondary,
                borderColor: theme.colors.borderPrimary,
            }}
        >
            {/* Progress Bar */}
            <div className="relative h-3 rounded-full overflow-hidden mb-3" style={{ backgroundColor: theme.colors.backgroundTertiary }}>
                <div
                    className="h-full transition-all duration-500 ease-out rounded-full"
                    style={{
                        width: `${progress}%`,
                        backgroundColor: isUnlocked ? '#10B981' : theme.colors.buttonPrimary,
                    }}
                />
            </div>

            {/* Message */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">
                        {isUnlocked ? '✓' : '📦'}
                    </span>
                    <div>
                        {isUnlocked ? (
                            <p
                                className="font-bold text-sm"
                                style={{ color: '#10B981' }}
                            >
                                🎉 Free Delivery Unlocked!
                            </p>
                        ) : (
                            <>
                                <p
                                    className="font-bold text-sm"
                                    style={{ color: theme.colors.textPrimary }}
                                >
                                    Add {formatPrice(remaining)} more for FREE delivery
                                </p>
                                <p
                                    className="text-xs mt-0.5"
                                    style={{ color: theme.colors.textSecondary }}
                                >
                                    Free shipping on orders above {formatPrice(threshold)}
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* Progress Percentage */}
                <div
                    className="text-lg font-black"
                    style={{ color: isUnlocked ? '#10B981' : theme.colors.textPrimary }}
                >
                    {Math.round(progress)}%
                </div>
            </div>
        </div>
    );
};
