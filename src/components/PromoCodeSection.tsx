import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { PROMO_CODES, validatePromoCode } from '../utils/promoCodes';
import { useToast } from './Toast';

interface PromoCodeSectionProps {
    orderTotal: number;
    onPromoApplied: (discount: number, code: string) => void;
}

export const PromoCodeSection: React.FC<PromoCodeSectionProps> = ({
    orderTotal,
    onPromoApplied,
}) => {
    const { theme } = useTheme();
    const toast = useToast();
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
    const [showAvailable, setShowAvailable] = useState(false);

    const handleApplyPromo = () => {
        if (!promoCode.trim()) {
            toast.warning('Please enter a promo code');
            return;
        }

        const result = validatePromoCode(promoCode, orderTotal);
        if (result.valid) {
            setAppliedPromo(promoCode);
            onPromoApplied(result.discount, promoCode);
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    };

    const handleRemovePromo = () => {
        setAppliedPromo(null);
        setPromoCode('');
        onPromoApplied(0, '');
        toast.info('Promo code removed');
    };

    const availablePromos = PROMO_CODES.filter(
        (promo) =>
            promo.isActive &&
            (!promo.minOrderValue || orderTotal >= promo.minOrderValue)
    );

    return (
        <div className="space-y-4">
            {/* Promo Input */}
            <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: theme.colors.textPrimary }}>
                    Have a promo code?
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        disabled={!!appliedPromo}
                        className="flex-1 px-4 py-3 rounded-creative border-2 font-semibold uppercase transition-all focus:outline-none focus:ring-2"
                        style={{
                            backgroundColor: theme.colors.backgroundPrimary,
                            borderColor: theme.colors.borderPrimary,
                            color: theme.colors.textPrimary,
                        }}
                    />
                    {appliedPromo ? (
                        <button
                            onClick={handleRemovePromo}
                            className="px-6 py-3 rounded-creative font-semibold border-2 transition-all hover:opacity-80"
                            style={{
                                borderColor: theme.colors.borderPrimary,
                                color: '#EF4444',
                            }}
                        >
                            Remove
                        </button>
                    ) : (
                        <button
                            onClick={handleApplyPromo}
                            className="px-6 py-3 rounded-creative font-semibold transition-all hover:opacity-90"
                            style={{
                                background: `linear-gradient(135deg, ${theme.colors.buttonPrimary} 0%, ${theme.colors.buttonSecondary} 100%)`,
                                color: '#FFFFFF',
                            }}
                        >
                            Apply
                        </button>
                    )}
                </div>
            </div>

            {/* Available Promos Toggle */}
            {availablePromos.length > 0 && !appliedPromo && (
                <div>
                    <button
                        onClick={() => setShowAvailable(!showAvailable)}
                        className="text-sm font-semibold flex items-center gap-2 hover:opacity-80 transition-opacity"
                        style={{ color: theme.colors.accentPrimary }}
                    >
                        <svg className={`w-4 h-4 transition-transform ${showAvailable ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        View {availablePromos.length} available promo code{availablePromos.length > 1 ? 's' : ''}
                    </button>

                    {showAvailable && (
                        <div className="mt-3 space-y-2">
                            {availablePromos.map((promo) => (
                                <div
                                    key={promo.code}
                                    className="p-3 rounded-lg border-2 flex items-center justify-between hover:bg-opacity-80 transition-all cursor-pointer"
                                    style={{
                                        backgroundColor: theme.colors.backgroundSecondary,
                                        borderColor: theme.colors.borderSecondary,
                                    }}
                                    onClick={() => {
                                        setPromoCode(promo.code);
                                        setShowAvailable(false);
                                    }}
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-2 py-1 rounded-lg text-xs font-bold" style={{ backgroundColor: theme.colors.accentPrimary, color: '#FFFFFF' }}>
                                                {promo.code}
                                            </span>
                                            {promo.type === 'percentage' && (
                                                <span className="text-sm font-semibold" style={{ color: '#10B981' }}>
                                                    {promo.discount}% OFF
                                                </span>
                                            )}
                                            {promo.type === 'fixed' && (
                                                <span className="text-sm font-semibold" style={{ color: '#10B981' }}>
                                                    FLAT ₹{promo.discount} OFF
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
                                            {promo.description}
                                        </p>
                                    </div>
                                    <button
                                        className="ml-3 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                                        style={{
                                            backgroundColor: theme.colors.accentPrimary,
                                            color: '#FFFFFF',
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPromoCode(promo.code);
                                            handleApplyPromo();
                                            setShowAvailable(false);
                                        }}
                                    >
                                        Apply
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Applied Promo Badge */}
            {appliedPromo && (
                <div
                    className="p-3 rounded-lg border-2 flex items-center gap-3 animate-fade-in"
                    style={{
                        backgroundColor: '#10B98110',
                        borderColor: '#10B981',
                    }}
                >
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="flex-1 font-semibold text-green-700">
                        Promo code "{appliedPromo}" applied!
                    </span>
                </div>
            )}

            <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};
