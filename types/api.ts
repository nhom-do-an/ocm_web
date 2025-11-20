import { DetailAttachment } from "./product";

//  API Response types theo doc
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
  success: boolean;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

// Pagination
export interface PaginationRequest {
  page?: number;
  limit?: number;
  size?: number;
}

export interface PaginationResponse {
  count: number;
}

// Auth types
export interface LoginCustomerRequest {
  /** Either email or phone is accepted by the customer login endpoint */
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterCustomerRequest {
  first_name: string;
  last_name: string;
  password: string;
  /** optional contact fields */
  phone?: string;
  email?: string;
}

// Login with Google payload for customer auth endpoint
export interface LoginWithGoogleRequest {
  id_token: string;
}

export interface CustomerAuthResponse {
  access_token: string;
  created_at: string;
  dob: string;
  email: string;
  first_name: string;
  gender: string;
  id: number;
  last_name: string;
  note: string;
  phone: string;
  refresh_token: string;
  status: CustomerStatus;
  store_id: number;
  updated_at: string;
  verified_email: boolean;
}

export enum LoginMethod {
  Email = 1,
  Phone = 2,
  Google = 3,
  Facebook = 4,
}


export enum CustomerStatus {
  Enabled = "enabled",
  Disabled = "disabled",
}



// Location types
export interface Location {
  address: string;
  code: string;
  created_at: string;
  default_location: boolean;
  email: string;
  fulfill_order: boolean;
  id: number;
  inventory_management: boolean;
  name: string;
  phone: string;
  status: LocationStatus;
  store_id: number;
  updated_at: string;
  zip: string;
}

export enum LocationStatus {
  Active = "active",
  Inactive = "inactive",
}

// File upload
export interface FileUploadResponse {
  files: DetailAttachment[];
}

// Address types
export interface Address {
  id: number;
  customer_id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  address: string;
  zip: string;
  default_address: boolean;
  is_new_region: boolean;
  created_at: string;
  updated_at: string;
}

export interface AddressDetail extends Address {
  province_code: string;
  province_name: string;
  district_code: string;
  district_name: string;
  ward_code: string;
  ward_name: string;
}

export interface CreateCustomerAddressRequest {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  address: string;
  zip?: string;
  province_code: string;
  district_code: string;
  ward_code: string;
  is_default?: boolean;
  is_new_address?: boolean;
}

export interface UpdateCustomerAddressRequest {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  address: string;
  zip?: string;
  province_code: string;
  district_code: string;
  ward_code: string;
  is_default?: boolean;
  is_new_address?: boolean;
  is_province_changed?: boolean;
  is_district_changed?: boolean;
  is_ward_changed?: boolean;
}

// Change password
export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

// Checkout types
export interface CreateCheckoutRequest {
  line_items_checked?: number[];
}

export interface UpdateCheckoutInfoRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  province_code?: string;
  district_code?: string;
  ward_code?: string;
  payment_method_id?: number;
  shipping_rate_id?: number;
  shipping_address_id?: number | null;
  billing_address_id?: number | null;
  note?: string;
  line_items?: any[];
}

export enum CheckoutStatus {
  Open = 'open',
  Completed = 'completed',
  Canceled = 'canceled',
}

export enum CheckoutEmailState {
  Sent = 'sent',
  NotSent = 'not_sent',
}

export interface CheckoutDetail {
  id: number;
  token: string;
  cart_token: string;
  customer_id?: number;
  store_id: number;
  channel_id: number;
  status: CheckoutStatus;
  email_state: CheckoutEmailState;
  email_sent_on?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  line_items: any[]; // LineItemDetail[]
  item_count: number;
  total_price: number;
  total_weight: number;
  requires_shipping: boolean;
  shipping_address?: AddressDetail;
  shipping_address_id?: number;
  shipping_rate?: ShippingRate;
  shipping_rate_id?: number;
  billing_address?: AddressDetail;
  billing_address_id?: number;
  payment_method?: PaymentMethodDetail;
  payment_method_id?: number;
  note?: string;
  order_id?: number;
}

// Shipping types
export interface ShippingRate {
  id: number;
  shipping_area_id: number;
  name: string;
  price: number;
  type: string;
  created_at: string;
  updated_at: string;
}

// Payment method types
export enum PaymentMethodStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export interface PaymentProvider {
  id: number;
  name: string;
  description?: string;
}

export interface PaymentMethod {
  id: number;
  name: string;
  description?: string;
  provider_id: number;
  beneficiary_account_id?: number;
  status: PaymentMethodStatus;
  auto_posting_receipt: boolean;
  store_id: number;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethodDetail extends PaymentMethod {
  provider: PaymentProvider;
  beneficiary_account?: BeneficiaryAccountDetail;
}

// Beneficiary account types
export interface BeneficiaryAccount {
  id: number;
  account_name: string;
  account_number: string;
  bank_id: number;
  note?: string;
  store_id: number;
  created_at: string;
  updated_at: string;
}

export interface BeneficiaryAccountDetail extends BeneficiaryAccount {
  bank_name: string;
  bank_short_name?: string;
  bank_bin?: string;
  bank_logo?: string;
}

// Order types
export enum OrderStatus {
  Open = 'open',
  Confirmed = 'confirmed',
  Completed = 'completed',
  Canceled = 'canceled',
  Closed = 'closed',
}

export enum FinancialStatus {
  Unpaid = 'unpaid',
  PartialPaid = 'partial_paid',
  Paid = 'paid',
}

export enum FulfillmentStatus {
  Pending = 'pending',
  PartialPending = 'partial_pending',
  Fulfilled = 'fulfilled',
}

export interface Order {
  id: number;
  name: string;
  order_number: number;
  customer_id?: number;
  store_id: number;
  channel_id: number;
  status: OrderStatus;
  financial_status: FinancialStatus;
  fulfillment_status: FulfillmentStatus;
  checkout_token?: string;
  cart_token?: string;
  shipping_address_id?: number;
  billing_address_id?: number;
  location_id?: number;
  note?: string;
  created_at: string;
  updated_at: string;
  confirmed_on?: string;
  completed_on?: string;
  canceled_on?: string;
  closed_on?: string;
}

export interface OrderDetail extends Order {
  shipping_address?: AddressDetail;
  billing_address?: AddressDetail;
  line_items?: any[];
  shipping_lines?: any[];
  payment_method_lines?: any[];
  total_price?: number;
  subtotal_price?: number;
  total_shipping_price?: number;
  total_tax?: number;
  total_discount?: number;
}

export interface GetListOrdersResponse {
  orders: Order[];
  count: number;
}
