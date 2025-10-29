import { apiClient } from './client';
import { API_ENDPOINTS } from '@/constants/api';
import { GetListProductsResponse, ProductDetail, ProductSearchParams, ProductTag, ProductType, ProductVendor } from '@/types';
import { ApiResponse } from '@/types/api';

export const productsService = {
  // Get products list with search/filter
  getProducts: async (params?: ProductSearchParams): Promise<ApiResponse<GetListProductsResponse>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.size) queryParams.append('size', params.size.toString());
    if (params?.key?.length) {
      params.key.forEach(k => queryParams.append('key', k));
    }
    if (params?.vendors?.length) {
      params.vendors.forEach(v => queryParams.append('vendors', v));
    }
    if (params?.product_types?.length) {
      params.product_types.forEach(pt => queryParams.append('product_types', pt));
    }
    if (params?.tags?.length) {
      params.tags.forEach(t => queryParams.append('tags', t));
    }
    if (params?.types?.length) {
      params.types.forEach(type => queryParams.append('types', type));
    }
    if (params?.statuses?.length) {
      params.statuses.forEach(s => queryParams.append('statuses', s));
    }
    if (params?.collection_ids?.length) {
      params.collection_ids.forEach(c => queryParams.append('collection_ids', c));
    }
    if (params?.sort_field) queryParams.append('sort_field', params.sort_field);
    if (params?.sort_type) queryParams.append('sort_type', params.sort_type);
    if (params?.max_price) queryParams.append('max_price', params.max_price.toString());
    if (params?.min_price) queryParams.append('min_price', params.min_price.toString());
    if (params?.min_created_at) queryParams.append('min_created_at', params.min_created_at.toString());
    if (params?.max_created_at) queryParams.append('max_created_at', params.max_created_at.toString());

    const url = queryParams.toString() 
      ? `${API_ENDPOINTS.PRODUCTS.LIST}?${queryParams.toString()}`
      : API_ENDPOINTS.PRODUCTS.LIST;
    
    return apiClient.get<GetListProductsResponse>(url);
  },

  // Get product detail by alias
  getProductByAlias: async (alias: string): Promise<ApiResponse<ProductDetail>> => {
    return apiClient.get<ProductDetail>(`${API_ENDPOINTS.PRODUCTS.DETAIL}/${alias}`);
  },

  // Get vendors list
  getVendors: async (): Promise<ApiResponse<ProductVendor[]>> => {
    return apiClient.get<ProductVendor[]>(API_ENDPOINTS.PRODUCTS.VENDORS);
  },

  // Get product types list
  getProductTypes: async (): Promise<ApiResponse<ProductType[]>> => {
    return apiClient.get<ProductType[]>(API_ENDPOINTS.PRODUCTS.PRODUCT_TYPES);
  },

  // Get tags list
  getTags: async (type?: string): Promise<ApiResponse<ProductTag[]>> => {
    const queryParams = new URLSearchParams();
    if (type) queryParams.append('type', type);

    const url = queryParams.toString() 
      ? `${API_ENDPOINTS.PRODUCTS.TAGS}?${queryParams.toString()}`
      : API_ENDPOINTS.PRODUCTS.TAGS;
    
    return apiClient.get<ProductTag[]>(url);
  },
};
