import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface TrustBadge {
    icon: string;
    text: string;
    subtext: string;
}

const trustBadges: TrustBadge[] = [
    {
        icon: '🔒',
        text: 'Secure Payment',
        subtext: '256-bit SSL encrypted',
    },
    {
        icon: '📦',
        text: 'Free Shipping',
        subtext: 'On orders above ₹10,000',
    },
    {
        icon: '↩️',
        text: 'Easy Returns',
        subtext: '30-day return policy',
    },
    {
        icon: '✓',
        text: 'Quality Assured',
        subtext: '1-year warranty',
    },
];

export const TrustSignals: React.FC = () => {
    const { theme } = useTheme();

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
            {trustBadges.map((badge, index) => (
                <div
                    key={index}
                    className="flex flex-col items-center text-center p-4 rounded-lg border transition-all hover:shadow-md"
                    style={{
                        backgroundColor: theme.colors.backgroundSecondary,
                        borderColor: theme.colors.borderPrimary,
                    }}
                >
                    <span className="text-3xl mb-2">{badge.icon}</span>
                    <p
                        className="font-bold text-sm mb-1"
                        style={{ color: theme.colors.textPrimary }}
                    >
                        {badge.text}
                    </p>
                    <p
                        className="text-xs"
                        style={{ color: theme.colors.textSecondary }}
                    >
                        {badge.subtext}
                    </p>
                </div>
            ))}
        </div>
    );
};
