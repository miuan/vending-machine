import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { depositApi } from "../depositApi";

export const loadAllProducts = createAsyncThunk("products/loadAllProducts", async (filter) => {
  const response = await depositApi.loadProducts(filter);
  return response.data.allProduct;
});

const initialState = {
  loading: true,
  products: [],
  error: null,
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    updateProduct: (state, action) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      state.products[index] = action.payload;
    },
  },
  extraReducers: {
    [loadAllProducts.pending]: (state, action) => {
      state.loading = true;
    },

    [loadAllProducts.fulfilled]: (state, action) => {
      state.products = action.payload;
      state.loading = false;
    },
  },
});

export const loadedProducts = (state) => state?.products?.products;
export const loadingProducts = (state) => state?.products?.loading;

export const { updateProduct } = productsSlice.actions;

export default productsSlice.reducer;
