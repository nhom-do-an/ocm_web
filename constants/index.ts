// Storage keys for localStorage/sessionStorage
export const STORAGE_KEYS = {
  CART: 'ocm_cart',
  USER: 'ocm_user',
  WISHLIST: 'ocm_wishlist',
  RECENT_VIEWED: 'ocm_recent_viewed',
  AUTH_TOKEN: 'ocm_auth_token',
  SEARCH_HISTORY: 'ocm_search_history',
} as const;

// App-wide constants
export const APP_CONFIG = {
  ITEMS_PER_PAGE: 12,
  MAX_CART_ITEMS: 50,
  MAX_WISHLIST_ITEMS: 100,
  SEARCH_DEBOUNCE_TIME: 500,
  IMAGE_PLACEHOLDER: '/images/placeholder.jpg',
  CURRENCY: 'VND',
  LOCALE: 'vi-VN',
} as const;

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Animation durations
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;


// Order status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPING: 'shipping',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

// Payment methods
export const PAYMENT_METHODS = {
  COD: 'cod',
  BANK_TRANSFER: 'bank_transfer',
  MOMO: 'momo',
  ZALOPAY: 'zalopay',
  VNPAY: 'vnpay',
  CREDIT_CARD: 'credit_card',
} as const;

// Shipping methods
export const SHIPPING_METHODS = {
  STANDARD: 'standard',
  EXPRESS: 'express',
  SAME_DAY: 'same_day',
} as const;

