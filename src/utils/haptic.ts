/**
 * Haptic Feedback Utility
 * Provides tactile feedback for touch interactions on mobile devices
 */

export class HapticFeedback {
    /**
     * Check if haptic feedback is supported
     */
    static isSupported(): boolean {
        return (
            'vibrate' in navigator &&
            typeof navigator.vibrate === 'function'
        );
    }

    /**
     * Light tap feedback (10ms)
     * Use for: Button taps, toggle switches, checkboxes
     */
    static light(): void {
        if (this.isSupported()) {
            navigator.vibrate(10);
        }
    }

    /**
     * Medium tap feedback (20ms)
     * Use for: Card selections, adding to cart, navigation
     */
    static medium(): void {
        if (this.isSupported()) {
            navigator.vibrate(20);
        }
    }

    /**
     * Heavy tap feedback (40ms)
     * Use for: Deleting items, errors, important actions
     */
    static heavy(): void {
        if (this.isSupported()) {
            navigator.vibrate(40);
        }
    }

    /**
     * Success pattern (short-short-long: 10ms, 10ms, 30ms)
     * Use for: Successfully added to cart, order placed
     */
    static success(): void {
        if (this.isSupported()) {
            navigator.vibrate([10, 50, 10, 50, 30]);
        }
    }

    /**
     * Error pattern (long-short-long: 50ms, 30ms, 50ms)
     * Use for: Form errors, failed actions
     */
    static error(): void {
        if (this.isSupported()) {
            navigator.vibrate([50, 100, 30, 100, 50]);
        }
    }

    /**
     * Warning pattern (medium-medium: 25ms, 25ms)
     * Use for: Warnings, confirmations needed
     */
    static warning(): void {
        if (this.isSupported()) {
            navigator.vibrate([25, 100, 25]);
        }
    }

    /**
     * Selection pattern (quick double tap: 5ms, 5ms)
     * Use for: Selecting items, toggling states
     */
    static selection(): void {
        if (this.isSupported()) {
            navigator.vibrate([5, 30, 5]);
        }
    }

    /**
     * Impact feedback for drag operations
     * Use for: Swipe-to-delete reaching threshold
     */
    static impact(): void {
        if (this.isSupported()) {
            navigator.vibrate(15);
        }
    }
}

/**
 * Convenience hook-like function for React components
 */
export const useHaptic = () => {
    return {
        light: () => HapticFeedback.light(),
        medium: () => HapticFeedback.medium(),
        heavy: () => HapticFeedback.heavy(),
        success: () => HapticFeedback.success(),
        error: () => HapticFeedback.error(),
        warning: () => HapticFeedback.warning(),
        selection: () => HapticFeedback.selection(),
        impact: () => HapticFeedback.impact(),
        isSupported: () => HapticFeedback.isSupported(),
    };
};
