import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface StockIndicatorProps {
    stock: number;
    showViewCount?: boolean;
    showRecentSales?: boolean;
}

export const StockIndicator: React.FC<StockIndicatorProps> = ({
    stock,
    showViewCount = true,
    showRecentSales = true,
}) => {
    const { theme } = useTheme();
    const [viewCount, setViewCount] = useState(0);
    const [recentSales, setRecentSales] = useState(0);

    useEffect(() => {
        // Simulate live view count (3-15 people)
        setViewCount(Math.floor(Math.random() * 13) + 3);

        // Simulate recent sales (5-25 in last 24h)
        setRecentSales(Math.floor(Math.random() * 21) + 5);

        // Update view count every 10 seconds
        const interval = setInterval(() => {
            setViewCount(prev => Math.max(1, prev + (Math.random() > 0.5 ? 1 : -1)));
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const getStockStatus = () => {
        if (stock === 0) {
            return {
                text: 'Out of Stock',
                color: '#EF4444',
                bgColor: 'rgba(239, 68, 68, 0.1)',
                urgent: true,
            };
        } else if (stock < 5) {
            return {
                text: `Only ${stock} left in stock - Order soon!`,
                color: '#EF4444',
                bgColor: 'rgba(239, 68, 68, 0.1)',
                urgent: true,
            };
        } else if (stock < 10) {
            return {
                text: `${stock} in stock`,
                color: '#F59E0B',
                bgColor: 'rgba(245, 158, 11, 0.1)',
                urgent: false,
            };
        } else {
            return {
                text: 'In Stock',
                color: '#10B981',
                bgColor: 'rgba(16, 185, 129, 0.1)',
                urgent: false,
            };
        }
    };

    const stockStatus = getStockStatus();

    return (
        <div className="space-y-3">
            {/* Stock Status */}
            <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm"
                style={{
                    color: stockStatus.color,
                    backgroundColor: stockStatus.bgColor,
                }}
            >
                {stock > 0 ? '✓' : '✗'} {stockStatus.text}
            </div>

            {/* Social Proof Indicators */}
            {stock > 0 && (
                <div className="flex flex-wrap gap-3 text-sm">
                    {showViewCount && viewCount > 0 && (
                        <div
                            className="flex items-center gap-1.5"
                            style={{ color: theme.colors.textSecondary }}
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                            <span className="font-medium">
                                {viewCount} {viewCount === 1 ? 'person' : 'people'} viewing
                            </span>
                        </div>
                    )}

                    {showRecentSales && recentSales > 0 && (
                        <div
                            className="flex items-center gap-1.5"
                            style={{ color: theme.colors.textSecondary }}
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>
                            <span className="font-medium">
                                {recentSales} sold in last 24 hours
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Urgency Message */}
            {stockStatus.urgent && stock > 0 && (
                <p
                    className="text-xs font-semibold animate-pulse"
                    style={{ color: stockStatus.color }}
                >
                    ⚡ High demand - Limited stock available!
                </p>
            )}
        </div>
    );
};
