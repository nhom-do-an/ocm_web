import { apiClient } from './client';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types/api';
import { Banner } from '@/types/banner';

export const bannersService = {
  getBanners: async (): Promise<ApiResponse<Banner[]>> => {
    return apiClient.get<Banner[]>(API_ENDPOINTS.BANNERS.LIST);
  },
};
