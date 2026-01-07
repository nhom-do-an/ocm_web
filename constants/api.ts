
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/admin/customers/auth/login',
    LOGIN_WITH_GOOGLE: '/admin/customers/auth/login-with-google',
    REGISTER: '/admin/customers/auth/register',
    ME: '/admin/customers/auth/me',
  },

  // Customer addresses endpoints
  ADDRESSES: {
    LIST: '/admin/customers/addresses',
    CREATE: '/admin/customers/addresses',
    UPDATE: '/admin/customers/addresses',
    DETAIL: (id: number) => `/admin/customers/addresses/${id}`,
  },

  // Products endpoints  
  PRODUCTS: {
    LIST: '/admin/products',
    DETAIL: '/admin/products', // + /{alias}
    VENDORS: '/admin/products/vendors/list',
    PRODUCT_TYPES: '/admin/products/product_types/list',
    TAGS: '/admin/products/tags/list',
    CREATE: '/admin/products',
  },

  // Collections endpoints
  COLLECTIONS: {
    LIST: '/admin/collections',
    DETAIL_BY_ALIAS: '/admin/collections', // + /{alias}
    DETAIL_BY_ID: '/admin/collections/detail', // + /{id}
    PRODUCT_TYPES: '/admin/collections/product-types', // + /{collection_id}
    CREATE: '/admin/collections',
  },

  // Variants endpoints
  VARIANTS: {
    LIST: '/admin/variants',
  },

  // Locations endpoints
  LOCATIONS: {
    LIST: '/admin/locations',
  },

  // Store endpoints
  STORE: {
    DETAIL: '/admin/store/detail',
  },

  // File upload endpoints
  FILE: {
    UPLOAD: '/admin/file/upload',
  },

  // Region endpoints
  REGION: {
    LIST: '/region/list',
    OLD_LIST: '/old-region/list',
    CONVERT: '/region/convert',
  },

  // Cart endpoints (new non-legacy)
  CART: {
    BASE: '/carts',
    ADD: '/carts/add',
    CHANGE: '/carts/change',
  },

  // Checkout endpoints
  CHECKOUT: {
    BY_CART: '/checkouts/by-cart',
    DETAIL: (token: string) => `/checkouts/${token}`,
    UPDATE: (token: string) => `/checkouts/${token}/update`,
    SHIPPING_RATES: (token: string) => `/checkouts/${token}/shipping-rates`,
    COMPLETE: (token: string) => `/checkouts/${token}/complete`,
  },

  // Orders endpoints (Customer)
  ORDERS: {
    LIST: '/orders',
    DETAIL: (id: number | string) => `/orders/${id}`,
    QR_PAYMENT: (orderId: number | string) => `/orders/${orderId}/qr-payment`,
  },

  // Payment methods endpoints
  PAYMENT_METHODS: {
    LIST: '/admin/payment-methods',
    DETAIL: (id: number) => `/admin/payment-methods/${id}`,
  },

  // Beneficiary accounts endpoints
  BENEFICIARY_ACCOUNTS: {
    LIST: '/admin/beneficiary-accounts',
  },

  // AI endpoints
  AI: {
    TRENDING: '/ai/trending',
    RECOMMENDATIONS: '/ai/recommendations',
    NEXT_ITEMS: '/ai/next-items',
  },

  // Banner endpoints
  BANNERS: {
    LIST: '/admin/banners',
  },

  // Contact endpoints
  CONTACTS: {
    LIST: '/admin/contacts',
  },

  // Legacy endpoints for backward compatibility
  LEGACY: {
    ORDERS: '/orders',
    ORDER_BY_ID: (orderId: string) => `/admin/orders/${orderId}`,
    CREATE_ORDER: '/orders',
    USER_PROFILE: '/user/profile',
    USER_ORDERS: '/user/orders',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    CHECKOUT: '/checkout',
    PAYMENT: '/payment',
    VERIFY_PAYMENT: '/payment/verify',
  },
} as const;

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const;

// Request Headers
export const REQUEST_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  ORIGIN: 'Origin',
} as const;

// Content Types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  FORM_URLENCODED: 'application/x-www-form-urlencoded',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Request timeout
export const REQUEST_TIMEOUT = 10000;

// API Response Types
export const API_RESPONSE_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
} as const;
