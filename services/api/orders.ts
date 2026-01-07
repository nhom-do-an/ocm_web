import { apiClient } from './client';
import { API_ENDPOINTS } from '@/constants/api';
import { Order, OrderDetail, GetListOrdersResponse, ApiResponse, OrderQRPaymentRequest, OrderQRPaymentResponse } from '@/types/api';

export const orderService = {
  // GET /orders - Lấy danh sách đơn hàng (Customer)
  getOrders: async (params?: {
    page?: number;
    size?: number;
    statuses?: string;
    financial_statuses?: string;
    fulfillment_statuses?: string;
    min_created_at?: number;
    max_created_at?: number;
    min_confirmed_at?: number;
    max_confirmed_at?: number;
    sort_field?: string;
    sort_type?: 'asc' | 'desc';
  }): Promise<GetListOrdersResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.size) queryParams.append('size', params.size.toString());
    if (params?.statuses) queryParams.append('statuses', params.statuses);
    if (params?.financial_statuses)
      queryParams.append('financial_statuses', params.financial_statuses);
    if (params?.fulfillment_statuses)
      queryParams.append('fulfillment_statuses', params.fulfillment_statuses);
    if (params?.min_created_at)
      queryParams.append('min_created_at', params.min_created_at.toString());
    if (params?.max_created_at)
      queryParams.append('max_created_at', params.max_created_at.toString());
    if (params?.min_confirmed_at)
      queryParams.append('min_confirmed_at', params.min_confirmed_at.toString());
    if (params?.max_confirmed_at)
      queryParams.append('max_confirmed_at', params.max_confirmed_at.toString());
    if (params?.sort_field)
      queryParams.append('sort_field', params.sort_field);
    if (params?.sort_type) queryParams.append('sort_type', params.sort_type);

    const url = queryParams.toString()
      ? `${API_ENDPOINTS.ORDERS.LIST}?${queryParams.toString()}`
      : API_ENDPOINTS.ORDERS.LIST;

    const response = await apiClient.get<GetListOrdersResponse>(url);
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to fetch orders');
    }
    return response.data;
  },

  // GET /orders/{id} - Lấy chi tiết đơn hàng theo ID (Customer)
  getOrderById: async (id: number | string): Promise<OrderDetail> => {
    const response = await apiClient.get<OrderDetail>(
      API_ENDPOINTS.ORDERS.DETAIL(id)
    );
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to fetch order');
    }
    return response.data;
  },

  // Legacy methods for backward compatibility
  createOrder: async (checkoutData: any): Promise<ApiResponse<Order>> => {
    return apiClient.post<Order>(API_ENDPOINTS.LEGACY.CREATE_ORDER, checkoutData);
  },

  getUserOrders: async (page = 1, limit = 10): Promise<ApiResponse<Order[]>> => {
    return apiClient.get<Order[]>(
      `${API_ENDPOINTS.LEGACY.USER_ORDERS}?page=${page}&limit=${limit}`
    );
  },

  cancelOrder: async (orderId: string, reason?: string): Promise<ApiResponse<Order>> => {
    return apiClient.patch<Order>(`/orders/${orderId}/cancel`, { reason });
  },

  trackOrder: async (orderNumber: string): Promise<ApiResponse<any>> => {
    return apiClient.get<any>(`/orders/track/${orderNumber}`);
  },

  // GET /orders/{orderId}/qr-payment - Lấy mã QR thanh toán cho đơn hàng
  getOrderQRPayment: async (orderId: number | string, params: OrderQRPaymentRequest): Promise<OrderQRPaymentResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append('beneficiary_account_id', params.beneficiary_account_id.toString());

    const url = `${API_ENDPOINTS.ORDERS.QR_PAYMENT(orderId)}?${queryParams.toString()}`;
    const response = await apiClient.get<OrderQRPaymentResponse>(url);
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to fetch QR payment');
    }
    return response.data;
  },
};
