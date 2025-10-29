import { apiClient } from './client';
import { API_ENDPOINTS } from '@/constants/api';
import { CartItem } from '@/types/product';
import { ApiResponse } from '@/types/api';

export const cartService = {
  // Get cart items
  getCart: async (): Promise<ApiResponse<CartItem[]>> => {
    return apiClient.get<CartItem[]>(API_ENDPOINTS.LEGACY.CART_ITEMS);
  },

  // Add item to cart
  addToCart: async (data: {
    productId: string;
    quantity: number;
    variantId?: number | string | null;
  }): Promise<ApiResponse<CartItem>> => {
    return apiClient.post<CartItem>(API_ENDPOINTS.LEGACY.ADD_TO_CART, data);
  },

  // Update cart item quantity
  updateCartItem: async (itemId: string, quantity: number): Promise<ApiResponse<CartItem>> => {
    return apiClient.patch<CartItem>(API_ENDPOINTS.LEGACY.UPDATE_CART_ITEM(itemId), { quantity });
  },

  // Remove item from cart
  removeFromCart: async (itemId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(API_ENDPOINTS.LEGACY.REMOVE_FROM_CART(itemId));
  },

  // Clear cart
  clearCart: async (): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(API_ENDPOINTS.LEGACY.CART);
  },

  // Apply coupon
  applyCoupon: async (couponCode: string): Promise<ApiResponse<any>> => {
    return apiClient.post<any>('/cart/coupon', { couponCode });
  },

  // Remove coupon
  removeCoupon: async (): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>('/cart/coupon');
  },
};
