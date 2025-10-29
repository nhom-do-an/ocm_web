import { ProductDetail } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '@/types';
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
    // Prefer stored unitPrice on the cart item (stable price), fall back to selectedVariant price, then first variant
    const price = item.unitPrice ?? item.selectedVariant?.price ?? item.product.variants?.[0]?.price ?? 0;
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
        selectedVariant?: any;
      }>
    ) => {
      const { product, quantity = 1, selectedVariant } = action.payload;

      // Identify existing items by selectedVariant id when available, otherwise by product id + no variant
      let existingItemIndex = -1;
      if (selectedVariant && selectedVariant.id != null) {
        existingItemIndex = state.items.findIndex(
          (item) => item.product.id === product.id && item.selectedVariant?.id === selectedVariant.id
        );
      } else {
        existingItemIndex = state.items.findIndex((item) => item.product.id === product.id && !item.selectedVariant);
      }

      const unitPrice = selectedVariant?.price ?? product.variants?.[0]?.price ?? 0;

      if (existingItemIndex !== -1) {
        state.items[existingItemIndex].quantity += quantity;
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}-${Math.random()}`,
          product,
          quantity,
          selectedVariant,
          unitPrice,
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
