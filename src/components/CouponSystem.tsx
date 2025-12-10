import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useCurrency } from '../contexts/CurrencyContext';

interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumPurchase?: number;
  maximumDiscount?: number;
  validFrom: Date;
  validUntil: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  applicableCategories?: string[];
  applicableProducts?: string[];
}

interface CouponSystemProps {
  subtotal: number;
  appliedCoupons: Coupon[];
  onApplyCoupon: (coupon: Coupon) => void;
  onRemoveCoupon: (couponId: string) => void;
}

export const CouponSystem: React.FC<CouponSystemProps> = ({
  subtotal,
  appliedCoupons,
  onApplyCoupon,
  onRemoveCoupon
}) => {
  const { theme } = useTheme();
  const { formatPrice } = useCurrency();
  const [couponCode, setCouponCode] = useState('');
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [showAllCoupons, setShowAllCoupons] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // Mock coupons data (in real app, this would come from API)
  useEffect(() => {
    const mockCoupons: Coupon[] = [
      {
        id: 'welcome10',
        code: 'WELCOME10',
        description: '10% off on your first purchase',
        discountType: 'percentage',
        discountValue: 10,
        minimumPurchase: 999,
        maximumDiscount: 500,
        validFrom: new Date('2025-01-01'),
        validUntil: new Date('2025-12-31'),
        usageLimit: 1,
        usedCount: 0,
        isActive: true,
      },
      {
        id: 'flash50',
        code: 'FLASH50',
        description: 'â‚¹50 off on orders above â‚¹799',
        discountType: 'fixed',
        discountValue: 50,
        minimumPurchase: 799,
        validFrom: new Date('2025-11-19'),
        validUntil: new Date('2025-11-20'),
        usageLimit: 1000,
        usedCount: 234,
        isActive: true,
      },
      {
        id: 'bogo20',
        code: 'BOGO20',
        description: '20% off on buy one get one',
        discountType: 'percentage',
        discountValue: 20,
        minimumPurchase: 1499,
        validFrom: new Date('2025-11-15'),
        validUntil: new Date('2025-11-30'),
        usageLimit: 500,
        usedCount: 89,
        isActive: true,
      },
      {
        id: 'student15',
        code: 'STUDENT15',
        description: '15% off for students',
        discountType: 'percentage',
        discountValue: 15,
        minimumPurchase: 599,
        maximumDiscount: 300,
        validFrom: new Date('2025-01-01'),
        validUntil: new Date('2025-12-31'),
        usageLimit: 10000,
        usedCount: 1247,
        isActive: true,
      },
      {
        id: 'loyalty25',
        code: 'LOYALTY25',
        description: '25% off for loyal customers',
        discountType: 'percentage',
        discountValue: 25,
        minimumPurchase: 1999,
        maximumDiscount: 1000,
        validFrom: new Date('2025-01-01'),
        validUntil: new Date('2025-12-31'),
        usageLimit: 1000,
        usedCount: 456,
        isActive: true,
      },
    ];

    setAvailableCoupons(mockCoupons);
  }, []);

  const calculateDiscount = (coupon: Coupon, amount: number): number => {
    if (coupon.discountType === 'percentage') {
      const discount = (amount * coupon.discountValue) / 100;
      return coupon.maximumDiscount ? Math.min(discount, coupon.maximumDiscount) : discount;
    } else {
      return coupon.discountValue;
    }
  };

  const isCouponValid = (coupon: Coupon): boolean => {
    const now = new Date();
    const isWithinDateRange = now >= coupon.validFrom && now <= coupon.validUntil;
    const isWithinUsageLimit = !coupon.usageLimit || coupon.usedCount < coupon.usageLimit;
    const meetsMinimumPurchase = !coupon.minimumPurchase || subtotal >= coupon.minimumPurchase;
    const isNotApplied = !appliedCoupons.some(applied => applied.id === coupon.id);

    return coupon.isActive && isWithinDateRange && isWithinUsageLimit && meetsMinimumPurchase && isNotApplied;
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsApplying(true);

    // Simulate API call delay
    setTimeout(() => {
      const coupon = availableCoupons.find(
        c => c.code.toLowerCase() === couponCode.toLowerCase() && isCouponValid(c)
      );

      if (coupon) {
        onApplyCoupon(coupon);
        setCouponCode('');
      } else {
        // Show error (in real app, this would be handled by parent component)
        alert('Invalid or expired coupon code');
      }

      setIsApplying(false);
    }, 1000);
  };

  const getTotalDiscount = (): number => {
    return appliedCoupons.reduce((total, coupon) => total + calculateDiscount(coupon, subtotal), 0);
  };

  const formatTimeLeft = (validUntil: Date): string => {
    const now = new Date();
    const diff = validUntil.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} days left`;
    if (hours > 0) return `${hours} hours left`;
    return 'Expires soon';
  };

  const visibleCoupons = showAllCoupons ? availableCoupons : availableCoupons.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Applied Coupons */}
      {appliedCoupons.length > 0 && (
        <div
          className="border-2 rounded-creative p-4"
          style={{
            backgroundColor: theme.colors.backgroundSecondary,
            borderColor: theme.colors.borderPrimary,
          }}
        >
          <h3
            className="text-lg font-bold mb-3"
            style={{ color: theme.colors.textPrimary }}
          >
            Applied Coupons
          </h3>
          <div className="space-y-2">
            {appliedCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{
                  backgroundColor: theme.colors.cardBackground,
                  border: `1px solid ${theme.colors.borderPrimary}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: theme.colors.stateSuccess }}
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p
                      className="font-semibold text-sm"
                      style={{ color: theme.colors.textPrimary }}
                    >
                      {coupon.code}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      {coupon.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="font-bold text-green-600"
                  >
                    -{formatPrice(calculateDiscount(coupon, subtotal))}
                  </span>
                  <button
                    onClick={() => onRemoveCoupon(coupon.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    aria-label={`Remove ${coupon.code} coupon`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t" style={{ borderColor: theme.colors.borderPrimary }}>
            <div className="flex justify-between items-center">
              <span
                className="font-semibold"
                style={{ color: theme.colors.textPrimary }}
              >
                Total Savings:
              </span>
              <span
                className="text-xl font-bold text-green-600"
              >
                {formatPrice(getTotalDiscount())}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Coupon Input */}
      <div
        className="border-2 rounded-creative p-4"
        style={{
          backgroundColor: theme.colors.cardBackground,
          borderColor: theme.colors.borderPrimary,
        }}
      >
        <h3
          className="text-lg font-bold mb-3"
          style={{ color: theme.colors.textPrimary }}
        >
          Have a Coupon Code?
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            className="flex-1 px-4 py-3 border-2 rounded-lg text-sm uppercase font-mono"
            style={{
              backgroundColor: theme.colors.backgroundSecondary,
              borderColor: theme.colors.borderPrimary,
              color: theme.colors.textPrimary,
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleApplyCoupon();
              }
            }}
          />
          <button
            onClick={handleApplyCoupon}
            disabled={!couponCode.trim() || isApplying}
            className="px-6 py-3 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            style={{
              backgroundColor: theme.colors.buttonPrimary,
              color: '#FFFFFF',
            }}
          >
            {isApplying ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Applying...
              </div>
            ) : (
              'Apply'
            )}
          </button>
        </div>
      </div>

      {/* Available Coupons */}
      <div
        className="border-2 rounded-creative p-4"
        style={{
          backgroundColor: theme.colors.cardBackground,
          borderColor: theme.colors.borderPrimary,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-lg font-bold"
            style={{ color: theme.colors.textPrimary }}
          >
            Available Coupons
          </h3>
          <button
            onClick={() => setShowAllCoupons(!showAllCoupons)}
            className="text-sm font-semibold transition-colors hover:opacity-80"
            style={{ color: theme.colors.buttonPrimary }}
          >
            {showAllCoupons ? 'Show Less' : 'View All'}
          </button>
        </div>

        <div className="space-y-3">
          {visibleCoupons.map((coupon) => {
            const isValid = isCouponValid(coupon);
            const isApplied = appliedCoupons.some(applied => applied.id === coupon.id);

            return (
              <div
                key={coupon.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isValid && !isApplied ? 'hover:shadow-md cursor-pointer' : 'opacity-60'
                }`}
                style={{
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: isValid && !isApplied ? theme.colors.buttonPrimary : theme.colors.borderPrimary,
                }}
                onClick={() => {
                  if (isValid && !isApplied) {
                    onApplyCoupon(coupon);
                  }
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <code
                        className="px-2 py-1 text-sm font-bold rounded"
                        style={{
                          backgroundColor: theme.colors.cardBackground,
                          color: theme.colors.textPrimary,
                        }}
                      >
                        {coupon.code}
                      </code>
                      {coupon.discountType === 'percentage' ? (
                        <span
                          className="px-2 py-1 text-xs font-bold rounded-full"
                          style={{
                            backgroundColor: theme.colors.stateSuccess,
                            color: '#FFFFFF',
                          }}
                        >
                          {coupon.discountValue}% OFF
                        </span>
                      ) : (
                        <span
                          className="px-2 py-1 text-xs font-bold rounded-full"
                          style={{
                            backgroundColor: theme.colors.brandDark,
                            color: '#FFFFFF',
                          }}
                        >
                          â‚¹{coupon.discountValue} OFF
                        </span>
                      )}
                    </div>
                    <p
                      className="text-sm mb-2"
                      style={{ color: theme.colors.textPrimary }}
                    >
                      {coupon.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      {coupon.minimumPurchase && (
                        <span style={{ color: theme.colors.textSecondary }}>
                          Min. purchase: {formatPrice(coupon.minimumPurchase)}
                        </span>
                      )}
                      <span style={{ color: theme.colors.textTertiary }}>
                        {formatTimeLeft(coupon.validUntil)}
                      </span>
                      {coupon.usageLimit && (
                        <span style={{ color: theme.colors.textTertiary }}>
                          {coupon.usedCount}/{coupon.usageLimit} used
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="ml-4">
                    {isApplied ? (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: theme.colors.stateSuccess }}
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : isValid ? (
                      <button
                        className="px-4 py-2 text-sm font-semibold rounded-lg transition-all hover:scale-105"
                        style={{
                          backgroundColor: theme.colors.buttonPrimary,
                          color: '#FFFFFF',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onApplyCoupon(coupon);
                        }}
                      >
                        Apply
                      </button>
                    ) : (
                      <span
                        className="text-xs font-semibold px-2 py-1 rounded"
                        style={{
                          backgroundColor: theme.colors.brandPrimary,
                          color: '#FFFFFF',
                        }}
                      >
                        Invalid
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!showAllCoupons && availableCoupons.length > 3 && (
          <button
            onClick={() => setShowAllCoupons(true)}
            className="w-full mt-4 py-3 text-sm font-semibold rounded-lg transition-colors hover:opacity-80"
            style={{
              backgroundColor: theme.colors.backgroundSecondary,
              color: theme.colors.buttonPrimary,
              border: `1px solid ${theme.colors.borderPrimary}`,
            }}
          >
            View {availableCoupons.length - 3} More Coupons
          </button>
        )}
      </div>
    </div>
  );
};

