import { apiClient } from './client';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types/api';
import { ConvertRegionRequest, OldRegion, Region, RegionType } from '@/types/region';

export const regionsService = {
  // Get regions list
  getRegions: async (parentCode?: string, type?: RegionType): Promise<ApiResponse<Region[]>> => {
    const queryParams = new URLSearchParams();
    if (parentCode) queryParams.append('parent_code', parentCode);
    if (type) queryParams.append('type', type.toString());

    const url = queryParams.toString() 
      ? `${API_ENDPOINTS.REGION.LIST}?${queryParams.toString()}`
      : API_ENDPOINTS.REGION.LIST;
    
    return apiClient.get<Region[]>(url);
  },

  // Get old regions list
  getOldRegions: async (parentCode?: string, type?: RegionType): Promise<ApiResponse<OldRegion[]>> => {
    const queryParams = new URLSearchParams();
    if (parentCode) queryParams.append('parent_code', parentCode);
    if (type) queryParams.append('type', type.toString());

    const url = queryParams.toString() 
      ? `${API_ENDPOINTS.REGION.OLD_LIST}?${queryParams.toString()}`
      : API_ENDPOINTS.REGION.OLD_LIST;
    
    return apiClient.get<OldRegion[]>(url);
  },

  // Convert old region to new region
  convertRegion: async (data: ConvertRegionRequest): Promise<ApiResponse<Region>> => {
    return apiClient.post<Region>(API_ENDPOINTS.REGION.CONVERT, data);
  },
};