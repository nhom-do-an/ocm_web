import { apiClient } from './client';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse, StoreDetail } from '@/types/api';

export const storeService = {
  // Get store detail
  getStoreDetail: async (): Promise<ApiResponse<StoreDetail>> => {
    return apiClient.get<StoreDetail>(API_ENDPOINTS.STORE.DETAIL);
  },
};
