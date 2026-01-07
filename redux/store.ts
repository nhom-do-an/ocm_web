import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import productsReducer from './slices/productsSlice';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import storeReducer from './slices/storeSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    ui: uiReducer,
    auth: authReducer,
    store: storeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
