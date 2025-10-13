import { apiClient } from './client';
import { API_ENDPOINTS } from '@/constants/api';
import { Order, Checkout } from '@/types/order';
import { ApiResponse } from '@/types/api';

export const orderService = {
  // Create new order
  createOrder: async (checkoutData: Checkout): Promise<ApiResponse<Order>> => {
    return apiClient.post<Order>(API_ENDPOINTS.LEGACY.CREATE_ORDER, checkoutData);
  },

  // Get user orders
  getUserOrders: async (page = 1, limit = 10): Promise<ApiResponse<Order[]>> => {
    return apiClient.get<Order[]>(`${API_ENDPOINTS.LEGACY.USER_ORDERS}?page=${page}&limit=${limit}`);
  },

  // Get order by ID
  getOrderById: async (orderId: string): Promise<ApiResponse<Order>> => {
    return apiClient.get<Order>(API_ENDPOINTS.LEGACY.ORDER_BY_ID(orderId));
  },

  // Cancel order
  cancelOrder: async (orderId: string, reason?: string): Promise<ApiResponse<Order>> => {
    return apiClient.patch<Order>(`/orders/${orderId}/cancel`, { reason });
  },

  // Track order
  trackOrder: async (orderNumber: string): Promise<ApiResponse<any>> => {
    return apiClient.get<any>(`/orders/track/${orderNumber}`);
  },
};
