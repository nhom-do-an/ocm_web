import { apiClient } from './client';
import { API_ENDPOINTS } from '@/constants/api';
import { GetListVariantResponse, VariantSearchParams } from '@/types';
import { ApiResponse } from '@/types/api';

export const variantsService = {
  // Get variants list
  getVariants: async (params?: VariantSearchParams): Promise<ApiResponse<GetListVariantResponse>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.key?.length) {
      params.key.forEach(k => queryParams.append('key', k));
    }
    if (params?.product_ids?.length) {
      params.product_ids.forEach(id => queryParams.append('product_ids', id));
    }
    if (params?.sort_field) queryParams.append('sort_field', params.sort_field);
    if (params?.sort_type) queryParams.append('sort_type', params.sort_type);

    const url = queryParams.toString() 
      ? `${API_ENDPOINTS.VARIANTS.LIST}?${queryParams.toString()}`
      : API_ENDPOINTS.VARIANTS.LIST;
    
    return apiClient.get<GetListVariantResponse>(url);
  },
};