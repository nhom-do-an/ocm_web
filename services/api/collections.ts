import { apiClient } from './client';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types/api';
import { CollectionDetail, CollectionProductTypeDetail, GetListCollectionRequest, GetListCollectionResponse } from '@/types/collection';

export const collectionsService = {
  // Get collections list
  getCollections: async (params?: GetListCollectionRequest): Promise<ApiResponse<GetListCollectionResponse>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.size) queryParams.append('size', params.size.toString());
    if (params?.key) queryParams.append('key', params.key);
    if (params?.store_id) queryParams.append('store_id', params.store_id.toString());
    if (params?.type) queryParams.append('type', params.type);

    const url = queryParams.toString() 
      ? `${API_ENDPOINTS.COLLECTIONS.LIST}?${queryParams.toString()}`
      : API_ENDPOINTS.COLLECTIONS.LIST;
    
    return apiClient.get<GetListCollectionResponse>(url);
  },

  // Get collection detail by alias
  getCollectionByAlias: async (alias: string): Promise<ApiResponse<CollectionDetail>> => {
    return apiClient.get<CollectionDetail>(`${API_ENDPOINTS.COLLECTIONS.DETAIL}/${alias}`);
  },

  // Get product types in collection
  getCollectionProductTypes: async (collectionId: number): Promise<ApiResponse<CollectionProductTypeDetail[]>> => {
    return apiClient.get<CollectionProductTypeDetail[]>(`${API_ENDPOINTS.COLLECTIONS.PRODUCT_TYPES}/${collectionId}`);
  },
};