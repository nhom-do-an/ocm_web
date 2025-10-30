import { PaginationResponse } from "./api";
import { Collection } from "./collection";
// Address type - cho shipping/billing
export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  zipCode?: string;
  isDefault?: boolean;
}

// Product types
export interface ProductDetail {
  alias: string;
  collections: Collection[];
  attributes: ProductAttributeDetail[];
  content: string;
  created_at: string;
  id: number;
  images: ProductAttachmentDetail[];
  meta_description: string;
  meta_title: string;
  name: string;
  product_type: string;
  published_on: string;
  status: ProductStatus;
  summary: string;
  tags: string[];
  type: PType;
  updated_at: string;
  variants: VariantDetail[];
  vendor: string;
}

export interface ProductAttributeDetail {
  id: number;
  name: string;
  position: number;
  values: string[];
}

export interface ProductAttachmentDetail {
  category: Category;
  created_at: string;
  file_path: string;
  file_size: number;
  filename: string;
  id: number;
  mime_type: string;
  position: number;
  status: AttachmentStatus;
  updated_at: string;
  url: string; // URL để hiển thị ảnh
}

export interface VariantDetail {
  barcode: string;
  compare_at_price: number;
  cost_price: number;
  created_at: string;
  id: number;
  image: DetailAttachment;
  image_id: number;
  inventory_quantity: number;
  lot_management: boolean;
  option1: string;
  option2: string;
  option3: string;
  position: number;
  price: number;
  product_id: number;
  product_name: string;
  requires_shipping: boolean;
  sku: string;
  sold: number;
  title: string;
  tracked: boolean;
  type: PType;
  unit: string;
  updated_at: string;
  weight: number;
  weight_unit: string;
}

export interface DetailAttachment {
  category: Category;
  created_at: string;
  file_path: string;
  file_size: number;
  filename: string;
  id: number;
  mime_type: string;
  status: AttachmentStatus;
  updated_at: string;
  url: string;
  deleted_at: string | null;
}

// Basic Attachment (without url)
export interface Attachment {
  category: Category;
  created_at: string;
  file_path: string;
  file_size: number;
  filename: string;
  id: number;
  mime_type: string;
  status: AttachmentStatus;
  updated_at: string;
}

export enum ProductStatus {
  Active = "active",
  Inactive = "inactive",
}

export enum PType {
  Normal = "normal",
  Combo = "combo",
  Packsize = "packsize",
}

export enum Category {
  Product = "product",
  User = "user",
  Collection = "collection",
}

export enum AttachmentStatus {
  Draft = 1,
  InUsed = 2,
}

export interface InventoryQuantityRequest {
  available: number;
  location_id: number;
  on_hand: number;
}

export interface GetListProductsResponse extends PaginationResponse {
  products: ProductDetail[];
}

export interface GetListVariantResponse extends PaginationResponse {
  variants: VariantDetail[];
}

// Product search/filter params
export interface ProductSearchParams {
  key?: string[];
  vendors?: string[];
  product_types?: string[];
  tags?: string[];
  types?: string[];
  statuses?: string[];
  collection_ids?: string[];
  page?: number;
  size?: number;
  sort_field?: string;
  sort_type?: string;
  max_price?: number;
  min_price?: number;
  min_created_at?: number;
  max_created_at?: number;
}

// Variant search params
export interface VariantSearchParams {
  key?: string[];
  product_ids?: string[];
  page?: number;
  size?: number;
  sort_field?: string;
  sort_type?: string;
}

// Tag and Vendor types
export interface ProductTag {
  id: number;
  name: string;
  type: string;
}

export interface ProductVendor {
  id: number;
  name: string;
}

export interface ProductType {
  id: number;
  name: string;
}