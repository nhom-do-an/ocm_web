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

// Product filters
export const PRODUCT_FILTERS = {
  SORT_OPTIONS: [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'price_asc', label: 'Giá thấp đến cao' },
    { value: 'price_desc', label: 'Giá cao đến thấp' },
    { value: 'name_asc', label: 'Tên A-Z' },
    { value: 'name_desc', label: 'Tên Z-A' },
    { value: 'best_selling', label: 'Bán chạy nhất' },
  ],
  PRICE_RANGES: [
    { min: 0, max: 500000, label: 'Dưới 500.000đ' },
    { min: 500000, max: 1000000, label: '500.000đ - 1.000.000đ' },
    { min: 1000000, max: 2000000, label: '1.000.000đ - 2.000.000đ' },
    { min: 2000000, max: 5000000, label: '2.000.000đ - 5.000.000đ' },
    { min: 5000000, max: null, label: 'Trên 5.000.000đ' },
  ],
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

