import { apiClient } from './client';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse, Location } from '@/types/api';

export const locationsService = {
  // Get locations list
  getLocations: async (): Promise<ApiResponse<Location[]>> => {
    return apiClient.get<Location[]>(API_ENDPOINTS.LOCATIONS.LIST);
  },
};