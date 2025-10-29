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
