// src/utils/colorMap.ts
// Simple mapping of common color names to hex codes for UI background usage.
export const getColorHex = (colorName: string): string => {
    const name = colorName.toLowerCase();
    const map: Record<string, string> = {
        black: '#000000',
        white: '#FFFFFF',
        red: '#EF4444',
        blue: '#3B82F6',
        green: '#10B981',
        yellow: '#F59E0B',
        orange: '#F97316',
        purple: '#8B5CF6',
        pink: '#EC4899',
        gray: '#6B7280',
        brown: '#A16207',
        navy: '#1E3A8A',
        teal: '#14B8A6',
        indigo: '#6366F1',
        lime: '#84CC16',
        cyan: '#06B6D4',
        // fallback
        default: '#F3F4F6',
    };
    return map[name] || map['default'];
};
