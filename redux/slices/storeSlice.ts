import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { storeService, locationsService } from '@/services/api';
import { StoreDetail, Location } from '@/types/api';

interface StoreState {
  store: StoreDetail | null;
  locations: Location[];
  loading: boolean;
  locationsLoading: boolean;
  error: string | null;
  initialized: boolean;
  locationsInitialized: boolean;
}

const initialState: StoreState = {
  store: null,
  locations: [],
  loading: false,
  locationsLoading: false,
  error: null,
  initialized: false,
  locationsInitialized: false,
};

// Async thunk to fetch store detail
export const fetchStoreDetail = createAsyncThunk(
  'store/fetchStoreDetail',
  async (_, { rejectWithValue }) => {
    try {
      const response = await storeService.getStoreDetail();
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to fetch store detail');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch store detail');
    }
  }
);

// Async thunk to fetch locations (branches)
export const fetchLocations = createAsyncThunk(
  'store/fetchLocations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await locationsService.getLocations();
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to fetch locations');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch locations');
    }
  }
);

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    clearStoreError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch store detail
    builder
      .addCase(fetchStoreDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.initialized = true;
      })
      .addCase(fetchStoreDetail.fulfilled, (state, action: PayloadAction<StoreDetail>) => {
        state.loading = false;
        state.store = action.payload;
      })
      .addCase(fetchStoreDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch locations
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.locationsLoading = true;
        state.locationsInitialized = true;
      })
      .addCase(fetchLocations.fulfilled, (state, action: PayloadAction<Location[]>) => {
        state.locationsLoading = false;
        state.locations = action.payload;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.locationsLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearStoreError } = storeSlice.actions;
export default storeSlice.reducer;
