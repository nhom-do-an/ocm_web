import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CartDetail, LineItemDetail } from '@/types/cart';
import { cartService } from '@/services/api/cart';


// Async thunks that call the cart API
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const res = await cartService.getCart();
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err?.message || 'Failed to fetch cart');
  }
});

export const addToCartApi = createAsyncThunk(
  'cart/addToCart',
  async (
    payload: { quantity: number; variant_id?: number | string | null; variantId?: number | string | null; productId?: number | string | null },
    { rejectWithValue }
  ) => {
    try {
      const req = { quantity: payload.quantity, variant_id: payload.variant_id ?? null };
      await cartService.addToCart(req);
      const refreshed = await cartService.getCart();
      return refreshed.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to add to cart');
    }
  }
);

export const updateLineItemApi = createAsyncThunk(
  'cart/updateLineItem',
  async (payload: { line_item_id: number | string; quantity: number }, { rejectWithValue }) => {
    try {
      const id = typeof payload.line_item_id === 'number' ? payload.line_item_id : parseInt(String(payload.line_item_id).replace(/^li-/, ''));
      await cartService.updateCartItem(id, payload.quantity);
      const refreshed = await cartService.getCart();
      return refreshed.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to update line item');
    }
  }
);

export const removeLineItemApi = createAsyncThunk(
  'cart/removeLineItem',
  async (payload: { line_item_id: number | string }, { rejectWithValue }) => {
    try {
      const id = typeof payload.line_item_id === 'number' ? payload.line_item_id : parseInt(String(payload.line_item_id).replace(/^li-/, ''));
      await cartService.removeFromCart(id);
      const refreshed = await cartService.getCart();
      return refreshed.data; 
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to remove line item');
    }
  }
);

export const clearCartApi = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
  try {
    const current = await cartService.getCart();
    const cart = current.data;
    const items = cart.line_items ?? [];
    if (items.length > 0) {
      await Promise.all(items.map((li) => cartService.removeFromCart(li.id)));
    }
    const refreshed = await cartService.getCart();
    return refreshed.data; 
  } catch (err: any) {
    return rejectWithValue(err?.message || 'Failed to clear cart');
  }
});

interface CartState {
  items: LineItemDetail[];
  isOpen: boolean;
  total: number;
  itemCount: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string | null;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  total: 0,
  itemCount: 0,
  status: 'idle',
  error: null,
};



const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        const cart: CartDetail = action.payload;
        state.items = cart.line_items ?? [];
        state.total =  cart.total_price ;
        state.itemCount = cart.item_count;
        state.status = 'succeeded';
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      .addCase(addToCartApi.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addToCartApi.fulfilled, (state, action) => {
        const cart: CartDetail = action.payload;
        state.items = cart.line_items ?? state.items;
        state.total = cart.total_price;
        state.itemCount = cart.item_count;
        state.status = 'succeeded';
      })
      .addCase(addToCartApi.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      .addCase(updateLineItemApi.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateLineItemApi.fulfilled, (state, action) => {
        const cart: CartDetail = action.payload;
        state.items = cart.line_items ?? state.items;
        state.total = cart.total_price;
        state.itemCount = cart.item_count;
        state.status = 'succeeded';
      })
      .addCase(updateLineItemApi.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      .addCase(removeLineItemApi.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(removeLineItemApi.fulfilled, (state, action) => {
        const cart: CartDetail = action.payload;
        state.items = cart.line_items ?? state.items;
        state.total = cart.total_price;
        state.itemCount = cart.item_count;
        state.status = 'succeeded';
      })
      .addCase(removeLineItemApi.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      .addCase(clearCartApi.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(clearCartApi.fulfilled, (state) => {
        state.items = [];
        state.total = 0;
        state.itemCount = 0;
        state.status = 'succeeded';
      })
      .addCase(clearCartApi.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { toggleCart, setCartOpen } = cartSlice.actions;

export default cartSlice.reducer;
