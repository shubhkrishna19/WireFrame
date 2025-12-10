import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
    calculateDeliveryEstimate,
    formatDeliveryEstimate,
    DeliveryEstimate,
} from '../utils/deliveryEstimate';

interface DeliveryEstimateDisplayProps {
    pincode?: string;
    isExpress?: boolean;
    compact?: boolean;
}

export const DeliveryEstimateDisplay: React.FC<DeliveryEstimateDisplayProps> = ({
    pincode,
    isExpress = false,
    compact = false,
}) => {
    const { theme } = useTheme();
    const [estimate, setEstimate] = useState<DeliveryEstimate | null>(null);
    const [pincodeInput, setPincodeInput] = useState(pincode || '');
    const [showPincodeInput, setShowPincodeInput] = useState(!pincode);

    useEffect(() => {
        if (pincodeInput && pincodeInput.length === 6) {
            const newEstimate = calculateDeliveryEstimate(pincodeInput, isExpress);
            setEstimate(newEstimate);
        }
    }, [pincodeInput, isExpress]);

    const handleCheckDelivery = () => {
        if (pincodeInput.length !== 6) {
            return;
        }
        const newEstimate = calculateDeliveryEstimate(pincodeInput, isExpress);
        setEstimate(newEstimate);
        setShowPincodeInput(false);
    };

    if (compact && estimate) {
        return (
            <div className="flex items-center gap-2">
                {estimate.isFastDelivery ? (
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 7H7v6h6V7z" />
                        <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                    </svg>
                )}
                <span className="text-sm font-semibold" style={{ color: estimate.isFastDelivery ? '#10B981' : theme.colors.textPrimary }}>
                    {formatDeliveryEstimate(estimate)}
                </span>
            </div>
        );
    }

    return (
        <div
            className="p-4 rounded-creative border-2"
            style={{
                backgroundColor: theme.colors.backgroundSecondary,
                borderColor: theme.colors.borderSecondary,
            }}
        >
            <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: theme.colors.textPrimary }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="font-bold" style={{ color: theme.colors.textPrimary }}>
                    Delivery Information
                </h3>
            </div>

            {showPincodeInput || !estimate ? (
                <div className="space-y-3">
                    <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                        Enter your pincode to check delivery availability
                    </p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={pincodeInput}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                setPincodeInput(value);
                            }}
                            placeholder="Enter pincode"
                            maxLength={6}
                            className="flex-1 px-4 py-2 rounded-lg border-2 font-semibold transition-all focus:outline-none focus:ring-2"
                            style={{
                                backgroundColor: theme.colors.backgroundPrimary,
                                borderColor: theme.colors.borderPrimary,
                                color: theme.colors.textPrimary,
                            }}
                        />
                        <button
                            onClick={handleCheckDelivery}
                            disabled={pincodeInput.length !== 6}
                            className="px-6 py-2 rounded-lg font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                            style={{
                                background: `linear-gradient(135deg, ${theme.colors.buttonPrimary} 0%, ${theme.colors.buttonSecondary} 100%)`,
                                color: '#FFFFFF',
                            }}
                        >
                            Check
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                {estimate.isFastDelivery && (
                                    <span className="px-2 py-1 rounded-lg text-xs font-bold bg-green-600 text-white">
                                        FAST DELIVERY
                                    </span>
                                )}
                                <span className="text-sm" style={{ color: theme.colors.textSecondary }}>
                                    Pincode: {pincodeInput}
                                </span>
                                <button
                                    onClick={() => setShowPincodeInput(true)}
                                    className="text-xs font-semibold hover:opacity-80"
                                    style={{ color: theme.colors.accentPrimary }}
                                >
                                    Change
                                </button>
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-lg" style={{ color: theme.colors.textPrimary }}>
                                    {formatDeliveryEstimate(estimate)}
                                </p>
                                <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                                    Expected by {estimate.estimatedDate}
                                </p>
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            {estimate.isFastDelivery ? (
                                <svg className="w-16 h-16 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                                </svg>
                            ) : (
                                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: theme.colors.textSecondary }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                            )}
                        </div>
                    </div>

                    {isExpress && (
                        <div className="pt-3 border-t-2" style={{ borderColor: theme.colors.borderSecondary }}>
                            <div className="flex items-center gap-2 text-sm text-green-600">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-semibold">Express delivery selected</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
