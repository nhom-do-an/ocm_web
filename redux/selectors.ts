import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './store';

// Products selectors
export const selectProducts = (state: RootState) => state.products.products;
export const selectCurrentProduct = (state: RootState) => state.products.currentProduct;
export const selectProductsLoading = (state: RootState) => state.products.loading;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectTotalPages = (state: RootState) => state.products.totalPages;
export const selectTotalProducts = (state: RootState) => state.products.totalProducts;
export const selectProductsFilters = (state: RootState) => state.products.filters;

// Memoized selectors for products
export const selectFeaturedProducts = createSelector(
  [selectProducts],
  (products) => products.slice(0, 8)
);

// Cart selectors
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) => state.cart.total;
export const selectCartItemCount = (state: RootState) => state.cart.itemCount;
export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectCartError = (state: RootState) => state.cart.error;
export const selectCartOpen = (state: RootState) => state.cart.isOpen;

// Memoized selectors for cart
export const selectCartItemsCount = createSelector(
  [selectCartItems],
  (items) => items.reduce((total, item) => total + item.quantity, 0)
);

// Auth selectors
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthRestored = (state: RootState) => state.auth.restored;

// Memoized selectors for auth
export const selectDisplayName = createSelector(
  [selectAuthUser],
  (user) => {
    if (!user) return '';
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.first_name || user.email || user.phone || '';
  }
);

// UI selectors
export const selectUI = (state: RootState) => state.ui;

