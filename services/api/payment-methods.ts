import { apiClient } from './client';
import { API_ENDPOINTS } from '@/constants/api';
import { PaymentMethodDetail, ApiResponse } from '@/types/api';

export class PaymentMethodsService {
  async getPaymentMethods(params?: {
    providers?: string;
    status?: 'active' | 'inactive';
  }): Promise<PaymentMethodDetail[]> {
    const queryParams = new URLSearchParams();
    if (params?.providers) queryParams.append('providers', params.providers);
    if (params?.status) queryParams.append('status', params.status);

    const url = queryParams.toString()
      ? `${API_ENDPOINTS.PAYMENT_METHODS.LIST}?${queryParams.toString()}`
      : API_ENDPOINTS.PAYMENT_METHODS.LIST;

    const response = await apiClient.get<PaymentMethodDetail[]>(url);
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to fetch payment methods');
    }
    return response.data;
  }

  async getPaymentMethod(id: number): Promise<PaymentMethodDetail> {
    const response = await apiClient.get<PaymentMethodDetail>(
      API_ENDPOINTS.PAYMENT_METHODS.DETAIL(id)
    );
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to fetch payment method');
    }
    return response.data;
  }
}

export const paymentMethodsService = new PaymentMethodsService();


