import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface RatingDistributionProps {
    rating: number;
    reviewCount: number;
    distribution?: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
}

export const RatingDistribution: React.FC<RatingDistributionProps> = ({
    rating,
    reviewCount,
    distribution,
}) => {
    const { theme } = useTheme();

    // Default distribution if not provided (realistic pattern)
    const defaultDistribution = {
        5: Math.round(reviewCount * 0.68),
        4: Math.round(reviewCount * 0.20),
        3: Math.round(reviewCount * 0.08),
        2: Math.round(reviewCount * 0.03),
        1: Math.round(reviewCount * 0.01),
    };

    const ratingData = distribution || defaultDistribution;

    // Calculate percentages
    const getPercentage = (count: number) => {
        return reviewCount > 0 ? (count / reviewCount) * 100 : 0;
    };

    const renderStars = (count: number, filled: number) => {
        return (
            <div className="flex">
                {[...Array(count)].map((_, i) => (
                    <svg
                        key={i}
                        className="w-3 h-3"
                        fill={i < filled ? '#F59E0B' : '#D1D5DB'}
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    return (
        <div
            className="rounded-lg border-2 p-6"
            style={{
                backgroundColor: theme.colors.cardBackground,
                borderColor: theme.colors.borderPrimary,
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3
                    className="text-xl font-black uppercase tracking-wider"
                    style={{ color: theme.colors.textPrimary }}
                >
                    Customer Reviews
                </h3>
                <a
                    href="#reviews"
                    className="text-sm font-semibold underline transition-opacity hover:opacity-80"
                    style={{ color: theme.colors.buttonPrimary }}
                >
                    Write a review
                </a>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Overall Rating */}
                <div className="flex flex-col items-center justify-center md:w-1/3 py-4">
                    <div
                        className="text-6xl font-black mb-2"
                        style={{ color: theme.colors.textPrimary }}
                    >
                        {rating.toFixed(1)}
                    </div>
                    <div className="flex mb-2">
                        {renderStars(5, Math.round(rating))}
                    </div>
                    <p
                        className="text-sm font-medium"
                        style={{ color: theme.colors.textSecondary }}
                    >
                        Based on {reviewCount.toLocaleString()} reviews
                    </p>
                </div>

                {/* Rating Distribution */}
                <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => {
                        const count = ratingData[stars as keyof typeof ratingData];
                        const percentage = getPercentage(count);

                        return (
                            <div key={stars} className="flex items-center gap-3">
                                <div className="flex items-center gap-1 w-16">
                                    <span
                                        className="text-sm font-semibold"
                                        style={{ color: theme.colors.textPrimary }}
                                    >
                                        {stars}
                                    </span>
                                    {renderStars(1, 1)}
                                </div>

                                {/* Progress Bar */}
                                <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ backgroundColor: theme.colors.backgroundTertiary }}>
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${percentage}%`,
                                            backgroundColor: stars >= 4 ? '#10B981' : stars === 3 ? '#F59E0B' : '#EF4444',
                                        }}
                                    />
                                </div>

                                {/* Percentage & Count */}
                                <div className="flex items-center gap-2 w-24">
                                    <span
                                        className="text-sm font-semibold"
                                        style={{ color: theme.colors.textSecondary }}
                                    >
                                        {percentage.toFixed(0)}%
                                    </span>
                                    <span
                                        className="text-xs"
                                        style={{ color: theme.colors.textTertiary }}
                                    >
                                        ({count})
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t-2" style={{ borderColor: theme.colors.borderPrimary }}>
                <div className="text-center">
                    <div
                        className="text-2xl font-black"
                        style={{ color: theme.colors.buttonPrimary }}
                    >
                        {Math.round((ratingData[5] + ratingData[4]) / reviewCount * 100)}%
                    </div>
                    <p className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
                        Recommend this product
                    </p>
                </div>
                <div className="text-center">
                    <div
                        className="text-2xl font-black"
                        style={{ color: theme.colors.buttonPrimary }}
                    >
                        {Math.round(ratingData[5] / reviewCount * 100)}%
                    </div>
                    <p className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
                        5-star ratings
                    </p>
                </div>
                <div className="text-center">
                    <div
                        className="text-2xl font-black"
                        style={{ color: theme.colors.buttonPrimary }}
                    >
                        {reviewCount >= 100 ? '1M+' : reviewCount >= 10 ? '100K+' : '10K+'}
                    </div>
                    <p className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
                        Global customers
                    </p>
                </div>
            </div>
        </div>
    );
};
