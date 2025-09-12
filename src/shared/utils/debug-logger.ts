/**
 * Debug Logger Utility
 * Provides a centralized logging system for development debugging
 */

interface DebugLogger {
  info: (message: string, data?: any) => void;
  warn: (message: string, data?: any) => void;
  error: (message: string, data?: any) => void;
  debug: (message: string, data?: any) => void;
}

/**
 * Creates a debug logger that works both in development and production
 * In development, it uses the global debugLogger if available, otherwise falls back to console
 * In production, it's a no-op to avoid performance impact
 */
const createDebugLogger = (): DebugLogger => {
  const isDev = import.meta.env.DEV;

  if (!isDev) {
    // No-op in production
    return {
      info: () => {},
      warn: () => {},
      error: () => {},
      debug: () => {},
    };
  }

  // In development, try to use global debugLogger first, then fallback to console
  const globalDebugLogger = (window as any)?.debugLogger;

  return {
    info: (message: string, data?: any) => {
      if (globalDebugLogger?.info) {
        globalDebugLogger.info(message, data);
      } else {
        // eslint-disable-next-line no-console
        console.info("[DEBUG] " + message, data || "");
      }
    },
    warn: (message: string, data?: any) => {
      if (globalDebugLogger?.warn) {
        globalDebugLogger.warn(message, data);
      } else {
        // eslint-disable-next-line no-console
        console.warn("[DEBUG] " + message, data || "");
      }
    },
    error: (message: string, data?: any) => {
      if (globalDebugLogger?.error) {
        globalDebugLogger.error(message, data);
      } else {
        // eslint-disable-next-line no-console
        console.error("[DEBUG] " + message, data || "");
      }
    },
    debug: (message: string, data?: any) => {
      if (globalDebugLogger?.debug) {
        globalDebugLogger.debug(message, data);
      } else {
        // eslint-disable-next-line no-console
        console.debug("[DEBUG] " + message, data || "");
      }
    },
  };
};

export const debugLogger = createDebugLogger();
