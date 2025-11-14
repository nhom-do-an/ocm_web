import { apiClient } from './client';
import { API_ENDPOINTS } from '@/constants/api';
import { 
  AddressDetail, 
  CreateCustomerAddressRequest, 
  UpdateCustomerAddressRequest,
  ApiResponse 
} from '@/types/api';

export class AddressService {
  async getAddresses(): Promise<AddressDetail[]> {
    const response = await apiClient.get<AddressDetail[]>(API_ENDPOINTS.ADDRESSES.LIST);
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to fetch addresses');
    }
    return response.data;
  }

  async getAddress(id: number): Promise<AddressDetail> {
    const response = await apiClient.get<AddressDetail>(API_ENDPOINTS.ADDRESSES.DETAIL(id));
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to fetch address');
    }
    return response.data;
  }

  async createAddress(data: CreateCustomerAddressRequest): Promise<AddressDetail> {
    const response = await apiClient.post<AddressDetail>(API_ENDPOINTS.ADDRESSES.CREATE, data);
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to create address');
    }
    return response.data;
  }

  async updateAddress(data: UpdateCustomerAddressRequest): Promise<AddressDetail> {
    const response = await apiClient.put<AddressDetail>(API_ENDPOINTS.ADDRESSES.UPDATE, data);
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to update address');
    }
    return response.data;
  }

  async deleteAddress(id: number): Promise<void> {
    const response = await apiClient.delete(API_ENDPOINTS.ADDRESSES.DETAIL(id));
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to delete address');
    }
  }
}

export const addressService = new AddressService();







