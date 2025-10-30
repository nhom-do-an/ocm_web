import { apiClient } from './client';
import { API_ENDPOINTS } from '@/constants/api';
import { CartDetail, UpdateLineItemRequest } from '@/types/cart';
import { ApiResponse } from '@/types/api';

export const cartService = {
  // Get cart detail (contains line items)
  getCart: async (): Promise<ApiResponse<CartDetail>> => {
    return apiClient.get<CartDetail>(API_ENDPOINTS.CART.BASE);
  },

  // Add item to cart
  addToCart: async (data: {
    quantity: number;
    variant_id?: number | string | null;
  }): Promise<ApiResponse<CartDetail>> => {
    return apiClient.post<CartDetail>(API_ENDPOINTS.CART.ADD, data);
  },

  // Update cart item quantity
  // Update cart item quantity (use change endpoint)
  updateCartItem: async (itemId: number, quantity: number): Promise<ApiResponse<CartDetail>> => {
    const payload: UpdateLineItemRequest = { line_item_id: itemId, quantity };
    return apiClient.put<CartDetail>(API_ENDPOINTS.CART.CHANGE, payload);
  },

  // Remove item from cart
  // Remove item from cart (set quantity to 0 via change endpoint)
  removeFromCart: async (itemId: number): Promise<ApiResponse<CartDetail>> => {
    const payload: UpdateLineItemRequest = { line_item_id: itemId, quantity: 0 };
    return apiClient.put<CartDetail>(API_ENDPOINTS.CART.CHANGE, payload);
  },
};
