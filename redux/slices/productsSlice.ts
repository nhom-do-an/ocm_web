import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { productsService, collectionsService } from '@/services/api';
import { ProductDetail, ProductSearchParams } from '@/types';
import { CollectionDetail } from '@/types/collection';

interface ProductsState {
  products: ProductDetail[];
  currentProduct: ProductDetail | null;
  collections: CollectionDetail[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  totalProducts: number;
  filters: ProductSearchParams;
}

const initialState: ProductsState = {
  products: [],
  currentProduct: null,
  collections: [],
  loading: false,
  error: null,
  totalPages: 1,
  totalProducts: 0,
  filters: {
    page: 1,
    limit: 12,
  },
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params?: ProductSearchParams) => {
    const response = await productsService.getProducts(params);
    return response.data;
  }
);

export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (alias: string) => {
    const response = await productsService.getProductByAlias(alias);
    return response.data;
  }
);

export const fetchCollections = createAsyncThunk(
  'products/fetchCollections',
  async () => {
    const response = await collectionsService.getCollections();
    return response.data.collections;
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async ({ query, limit }: { query: string; limit?: number }) => {
    const params: ProductSearchParams = {
      key: [query],
      ...(limit && { limit })
    };
    const response = await productsService.getProducts(params);
    return response.data;
  }
);

export const fetchProductsByCollection = createAsyncThunk(
  'products/fetchProductsByCollection',
  async ({ collectionId, params }: { collectionId: string; params?: ProductSearchParams }) => {
    const filtersWithCollection = { ...params, collection_ids: [collectionId] };
    const response = await productsService.getProducts(filtersWithCollection);
    return response.data;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearProducts: (state) => {
      state.products = [];
    },
    setFilters: (state, action: PayloadAction<Partial<ProductSearchParams>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.count;
        // Calculate pages if limit is provided
        if (state.filters.limit) {
          state.totalPages = Math.ceil(action.payload.count / state.filters.limit);
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })

      // Fetch single product
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch product';
      })

      // Fetch collections
      .addCase(fetchCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.loading = false;
        state.collections = action.payload;
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch collections';
      })

      // Search products
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.count;
        if (state.filters.limit) {
          state.totalPages = Math.ceil(action.payload.count / state.filters.limit);
        }
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search products';
      })

      // Fetch products by collection
      .addCase(fetchProductsByCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCollection.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.count;
        if (state.filters.limit) {
          state.totalPages = Math.ceil(action.payload.count / state.filters.limit);
        }
      })
      .addCase(fetchProductsByCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch collection products';
      });
  },
});

export const {
  clearCurrentProduct,
  clearProducts,
  setFilters,
  clearFilters,
} = productsSlice.actions;

export default productsSlice.reducer;
