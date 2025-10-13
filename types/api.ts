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
export interface UserLoginRequest {
  phone: string;
  password: string;
}

export interface UserRegisterRequest {
  name: string;
  password: string;
  phone: string;
  province_code: string;
  store_name: string;
}

export interface UserAuthResponse {
  access_token: string;
  refresh_token: string;
  active: boolean;
  created_at: string;
  email: string;
  first_name: string;
  id: number;
  is_owner: boolean;
  last_login: string;
  last_name: string;
  login_method: LoginMethod;
  name: string;
  phone: string;
  store_id: number;
  updated_at: string;
  username: string;
  verified_email: boolean;
}

export enum LoginMethod {
  Email = 1,
  Phone = 2,
  Google = 3,
  Facebook = 4,
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
