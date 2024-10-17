// Import necessary dependencies from Redux Toolkit
import { configureStore } from "@reduxjs/toolkit";

// Import the API slice and other reducers
import { apiSlice } from "../features/api/apiSlice";
import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";

// Configure and export the Redux store
export const store = configureStore({
  // Define the root reducer object
  reducer: {
    // Add the API slice reducer using the reducerPath as the key
    [apiSlice.reducerPath]: apiSlice.reducer,
    // Add the authentication reducer
    auth: authReducer,
    // Add the shopping cart reducer
    cart: cartReducer,
    // Add any other reducers here as needed
  },

  // Configure middleware
  middleware: (getDefaultMiddleware) =>
    // Combine default middleware with the API middleware
    getDefaultMiddleware().concat(apiSlice.middleware),

  // Enable Redux DevTools in development, disable in production
  devTools: process.env.NODE_ENV !== "production",
});
