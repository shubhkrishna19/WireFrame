/**
 * Guest Session Management Store
 * Handles guest user sessions, cart persistence, and order tracking
 */

export interface GuestSession {
    id: string;
    email?: string;
    createdAt: number;
    expiresAt: number;
    orders: string[]; // Order IDs placed by this guest
}

const GUEST_SESSION_KEY = 'bluewud_guest_session';
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

/**
 * Get or create a guest session ID
 * Returns existing session if valid, creates new one if expired or missing
 */
export const getOrCreateGuestSession = (): GuestSession => {
    const stored = localStorage.getItem(GUEST_SESSION_KEY);

    if (stored) {
        try {
            const session: GuestSession = JSON.parse(stored);

            // Check if session is still valid
            if (session.expiresAt > Date.now()) {
                return session;
            }
        } catch (error) {
            console.error('Error parsing guest session:', error);
        }
    }

    // Create new session
    const newSession: GuestSession = {
        id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
        expiresAt: Date.now() + SESSION_DURATION,
        orders: [],
    };

    localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(newSession));
    return newSession;
};

/**
 * Get current guest session (returns null if none exists or expired)
 */
export const getGuestSession = (): GuestSession | null => {
    const stored = localStorage.getItem(GUEST_SESSION_KEY);

    if (!stored) return null;

    try {
        const session: GuestSession = JSON.parse(stored);

        // Check if session is still valid
        if (session.expiresAt > Date.now()) {
            return session;
        }

        // Session expired, remove it
        clearGuestSession();
        return null;
    } catch (error) {
        console.error('Error parsing guest session:', error);
        return null;
    }
};

/**
 * Update guest session with email (when guest provides email during checkout)
 */
export const updateGuestEmail = (email: string): void => {
    const session = getOrCreateGuestSession();
    session.email = email;
    localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(session));
};

/**
 * Add order ID to guest session
 */
export const addGuestOrder = (orderId: string): void => {
    const session = getOrCreateGuestSession();
    if (!session.orders.includes(orderId)) {
        session.orders.push(orderId);
        localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(session));
    }
};

/**
 * Get all order IDs for current guest session
 */
export const getGuestOrders = (): string[] => {
    const session = getGuestSession();
    return session?.orders || [];
};

/**
 * Clear guest session (called after account creation or manual logout)
 */
export const clearGuestSession = (): void => {
    localStorage.removeItem(GUEST_SESSION_KEY);
};

/**
 * Check if user is currently in guest mode
 */
export const isGuestMode = (): boolean => {
    return getGuestSession() !== null;
};

/**
 * Get guest session ID for API calls
 */
export const getGuestSessionId = (): string | null => {
    const session = getGuestSession();
    return session?.id || null;
};

export default {
    getOrCreateGuestSession,
    getGuestSession,
    updateGuestEmail,
    addGuestOrder,
    getGuestOrders,
    clearGuestSession,
    isGuestMode,
    getGuestSessionId,
};

