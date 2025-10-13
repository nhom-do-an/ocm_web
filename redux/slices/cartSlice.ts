import { ProductDetail } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  product: ProductDetail;
  quantity: number;
  selectedVariants?: Record<string, string>;
  addedAt?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  total: number;
  itemCount: number;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  total: 0,
  itemCount: 0,
};

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    // Get price from the first variant or use 0 as fallback
    const price = item.product.variants?.[0]?.price || 0;
    return total + price * item.quantity;
  }, 0);
};

const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        product: ProductDetail;
        quantity?: number;
        selectedVariants?: Record<string, string>;
      }>
    ) => {
      const { product, quantity = 1, selectedVariants } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.product.id === product.id &&
          JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants)
      );

      if (existingItemIndex !== -1) {
        state.items[existingItemIndex].quantity += quantity;
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}-${Math.random()}`,
          product,
          quantity,
          selectedVariants,
          addedAt: new Date().toISOString(),
        };
        state.items.push(newItem);
      }

      state.total = calculateTotal(state.items);
      state.itemCount = calculateItemCount(state.items);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.total = calculateTotal(state.items);
      state.itemCount = calculateItemCount(state.items);
    },

    updateQuantity: (state, action: PayloadAction<{ itemId: string; quantity: number }>) => {
      const { itemId, quantity } = action.payload;
      const itemIndex = state.items.findIndex((item) => item.id === itemId);

      if (itemIndex !== -1) {
        if (quantity <= 0) {
          state.items.splice(itemIndex, 1);
        } else {
          state.items[itemIndex].quantity = quantity;
        }
      }

      state.total = calculateTotal(state.items);
      state.itemCount = calculateItemCount(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },

    loadCartFromStorage: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.total = calculateTotal(state.items);
      state.itemCount = calculateItemCount(state.items);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  setCartOpen,
  loadCartFromStorage,
} = cartSlice.actions;

export default cartSlice.reducer;
