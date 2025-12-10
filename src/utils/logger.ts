// Simple logger for development vs production
// This will remove console.logs in production
const isDevelopment = import.meta.env.DEV;

// Conditional console logging
export const logger = {
    log: (...args: any[]) => {
        if (isDevelopment) console.log(...args);
    },
    info: (...args: any[]) => {
        if (isDevelopment) console.log(...args);
    },
    warn: (...args: any[]) => {
        if (isDevelopment) console.warn(...args);
    },
    error: (...args: any[]) => {
        console.error(...args); // Always log errors
    },
    debug: (...args: any[]) => {
        if (isDevelopment) console.debug(...args);
    },
};
