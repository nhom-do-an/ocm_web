import { apiClient } from './client';
import { API_ENDPOINTS } from '@/constants/api';
import {
  CreateCheckoutRequest,
  UpdateCheckoutInfoRequest,
  CheckoutDetail,
  ShippingRate,
  Order,
  ApiResponse,
} from '@/types/api';

export class CheckoutService {
  // POST /checkouts/by-cart - Lấy checkout token từ cart
  async getCheckoutByCart(data: CreateCheckoutRequest): Promise<CheckoutDetail> {
    const response = await apiClient.post<CheckoutDetail>(
      API_ENDPOINTS.CHECKOUT.BY_CART,
      data
    );
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to create checkout');
    }
    return response.data;
  }

  // GET /checkouts/{token} - Lấy thông tin checkout theo token
  async getCheckout(token: string): Promise<CheckoutDetail> {
    const response = await apiClient.get<CheckoutDetail>(
      API_ENDPOINTS.CHECKOUT.DETAIL(token)
    );
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to get checkout');
    }
    return response.data;
  }

  // PUT /checkouts/{token}/update - Cập nhật thông tin checkout
  async updateCheckout(
    token: string,
    data: UpdateCheckoutInfoRequest
  ): Promise<CheckoutDetail> {
    const response = await apiClient.put<CheckoutDetail>(
      API_ENDPOINTS.CHECKOUT.UPDATE(token),
      data
    );
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to update checkout');
    }
    return response.data;
  }

  // GET /checkouts/{token}/shipping-rates - Lấy phí vận chuyển
  async getShippingRates(token: string): Promise<ShippingRate[]> {
    const response = await apiClient.get<ShippingRate[]>(
      API_ENDPOINTS.CHECKOUT.SHIPPING_RATES(token)
    );
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to get shipping rates');
    }
    return response.data;
  }

  // POST /checkouts/{token}/complete - Hoàn tất checkout
  async completeCheckout(token: string): Promise<Order> {
    const response = await apiClient.post<Order>(
      API_ENDPOINTS.CHECKOUT.COMPLETE(token)
    );
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to complete checkout');
    }
    return response.data;
  }
}

export const checkoutService = new CheckoutService();

