import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useCurrency } from '../contexts/CurrencyContext';

interface StickyMobileCartBarProps {
    price: number;
    onAddToCart: () => void;
    isOutOfStock?: boolean;
}

export const StickyMobileCartBar: React.FC<StickyMobileCartBarProps> = ({
    price,
    onAddToCart,
    isOutOfStock = false,
}) => {
    const { theme } = useTheme();
    const { formatPrice } = useCurrency();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show bar after scrolling 300px
            setIsVisible(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 z-40 transform transition-transform duration-300 md:hidden ${isVisible ? 'translate-y-0' : 'translate-y-full'
                }`}
            style={{
                backgroundColor: theme.colors.cardBackground,
                boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.15)',
            }}
        >
            <div className="flex items-center justify-between p-4 gap-4">
                {/* Price */}
                <div>
                    <p className="text-xs font-medium" style={{ color: theme.colors.textSecondary }}>
                        Price
                    </p>
                    <p className="text-2xl font-black" style={{ color: theme.colors.textPrimary }}>
                        {formatPrice(price)}
                    </p>
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={onAddToCart}
                    disabled={isOutOfStock}
                    className="flex-1 max-w-xs py-4 px-6 rounded-lg font-bold uppercase tracking-wider transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                        backgroundColor: isOutOfStock ? '#9CA3AF' : theme.colors.buttonPrimary,
                        color: '#FFFFFF',
                    }}
                >
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>

            {/* Safe area for notched phones */}
            <div className="h-safe-area-inset-bottom" />
        </div>
    );
};
