import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userSlice";
import depositReducer from "./reducers/depositSlice";
import productsReducer from "./reducers/productsSlice";
import { reduxBatch } from "@manaflair/redux-batch";

export const store = configureStore({
  reducer: {
    user: userReducer,
    deposit: depositReducer,
    products: productsReducer,
  },
  enhancers: [reduxBatch],
});
