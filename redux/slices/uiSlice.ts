import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isLoading: boolean;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
  modals: {
    isProductQuickViewOpen: boolean;
    isCompareModalOpen: boolean;
    isWishlistModalOpen: boolean;
  };
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: number;
}

const initialState: UIState = {
  isLoading: false,
  isMobileMenuOpen: false,
  isSearchOpen: false,
  theme: 'light',
  notifications: [],
  modals: {
    isProductQuickViewOpen: false,
    isCompareModalOpen: false,
    isWishlistModalOpen: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },

    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileMenuOpen = action.payload;
    },

    toggleSearch: (state) => {
      state.isSearchOpen = !state.isSearchOpen;
    },

    setSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.isSearchOpen = action.payload;
    },

    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },

    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: `notification-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },

    clearNotifications: (state) => {
      state.notifications = [];
    },

    setModalOpen: (
      state,
      action: PayloadAction<{
        modal: keyof UIState['modals'];
        isOpen: boolean;
      }>
    ) => {
      const { modal, isOpen } = action.payload;
      state.modals[modal] = isOpen;
    },

    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((key) => {
        state.modals[key as keyof UIState['modals']] = false;
      });
    },
  },
});

export const {
  setLoading,
  toggleMobileMenu,
  setMobileMenuOpen,
  toggleSearch,
  setSearchOpen,
  setTheme,
  addNotification,
  removeNotification,
  clearNotifications,
  setModalOpen,
  closeAllModals,
} = uiSlice.actions;

export default uiSlice.reducer;
