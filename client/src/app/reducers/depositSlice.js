import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { depositApi } from "../depositApi";
import { updateProduct } from "./productsSlice";

export const loadUserDeposit = createAsyncThunk("deposit/loadUserDeposit", async () => {
  const response = await depositApi.getMe();
  return response.data.me;
});

export const addDepositToUser = createAsyncThunk("deposit/addDepositToUser", async (deposit) => {
  const response = await depositApi.addDeposit(deposit);
  return response.data;
});

export const resetUserDeposit = createAsyncThunk("deposit/resetUserDeposit", async () => {
  const response = await depositApi.resetDeposit();
  return response.data;
});

export const buyProduct = createAsyncThunk("deposit/buyProduct", async (product, { getState, rejectWithValue, dispatch }) => {
  const actualDeposit = selectDeposit(getState());

  if (actualDeposit < product.cost) {
    return rejectWithValue(product);
  }

  const buyData = (await depositApi.buyProduct(product.id)).data;
  dispatch(updateProduct(buyData.product));
  return buyData;
});

const initialState = {
  initializing: true,
  loading: true,
  deposit: 0,
  products: [],
  error: null,
};

export const depositSlice = createSlice({
  name: "deposit",
  initialState,
  reducers: {
    addDeposit: (state, action) => {
      state.deposit = state.deposit + action.payload;
    },
    hideError: (state, action) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadUserDeposit.pending, (state, action) => {
      state.initializing = true;
    });

    // load user deposit
    builder.addCase(loadUserDeposit.fulfilled, (state, action) => {
      state.deposit = action.payload.deposit;
      state.initializing = false;
    });

    // add deposit to usere
    builder.addCase(addDepositToUser.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(addDepositToUser.fulfilled, (state, action) => {
      state.deposit = action.payload.deposit;
      state.loading = false;
    });

    builder.addCase(resetUserDeposit.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(resetUserDeposit.fulfilled, (state, action) => {
      state.deposit = action.payload.deposit;
      state.loading = false;
    });

    builder.addCase(buyProduct.rejected, (state, action) => {
      state.error = action.payload;
    });
    builder.addCase(buyProduct.pending, (state, action) => {
      state.error = null;
    });
    builder.addCase(buyProduct.fulfilled, (state, action) => {
      state.deposit = action.payload.deposit;
      state.loading = false;
    });
  },
});

export const selectDeposit = (state) => state?.deposit?.deposit;
export const depositLoading = (state) => state?.deposit?.loading;
export const depositInitializing = (state) => state?.deposit?.initializing;
export const buyError = (state) => state?.deposit?.error;
// Action creators are generated for each case reducer function
export const { hideError } = depositSlice.actions;

export default depositSlice.reducer;
