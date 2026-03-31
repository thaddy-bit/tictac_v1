/**
 * Centralized Constants for TIC TAC Platform
 * Used in both Frontend and Backend (if possible, or mirrored)
 */

export const PLATFORM_CONSTANTS = {
  SEARCH_FEE: 300,
  CURRENCY: 'FCFA',
  POLLING_INTERVAL: 3000,
  MAX_POLLING_TIME: 120000, // 2 minutes
  JWT_COOKIE_NAME: 'token',
  STORAGE_KEYS: {
    SEARCH_ITEMS: 'tictac_search_items',
    STOCK_ALERTS: 'tictac_stock_alerts',
  }
};
