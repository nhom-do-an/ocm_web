import { PaginationRequest, PaginationResponse } from "./api";
import { DetailAttachment } from "./product";

// Collection types theo data thật
export interface CollectionDetail {
  id: number;
  name: string;
  store_id: number;
  alias: string;
  description: string;
  meta_title: string;
  meta_description: string;
  sort_order: string;
  type: CollectionType;
  disjunctive: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  image: DetailAttachment | null;
  rules: Rule[];
}

export interface Rule {
  collection_id: number;
  column: RuleColumn;
  condition: string;
  id: number;
  relation: RuleRelation;
}

export enum CollectionType {
  Smart = "smart",
  Manual = "manual",
}

export enum RuleColumn {
  Price = "price",
  Name = "name",
}

export enum RuleRelation {
  Equal = "equal",
  NotEqual = "not_equal",
  Greater = "greater",
  Less = "less",
  Contains = "contains",
  StartsWith = "starts_with",
  EndsWith = "ends_with",
}

// Request types
export interface GetListCollectionRequest extends PaginationRequest {
  key?: string;
  store_id?: number;
  type?: CollectionType;
}

export interface GetListCollectionResponse extends PaginationResponse {
  collections: CollectionDetail[];
}

// Collection Product Type Detail
export interface CollectionProductTypeDetail {
  collection_id: number;
  id: number;
  name: string;
  product_type_id: number;
}


// Basic Collection (không có rules và attachments)
export interface Collection {
  alias: string;
  created_at: string;
  description: string;
  disjunctive: boolean;
  id: number;
  meta_description: string;
  meta_title: string;
  name: string;
  sort_order: string;
  store_id: number;
  type: CollectionType;
  updated_at: string;
}