// Import necessary dependencies from Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";

// Helper function to load cart data from localStorage
const loadCartFromLocalStorage = () => {
  const savedCart = localStorage.getItem("cart");
  return savedCart ? JSON.parse(savedCart) : {};
};

// Helper function to save cart data to localStorage
const saveCartToLocalStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Create the cart slice
// This slice manages the cart state of the application
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    // Initialize cart items from localStorage
    items: loadCartFromLocalStorage(),
  },
  reducers: {
    // Update the entire cart
    updateCart: (state, action) => {
      state.items = action.payload;
      saveCartToLocalStorage(action.payload);
    },
    // Add an item to the local cart
    addToLocalCart: (state, action) => {
      const { productId, quantity } = action.payload;
      state.items[productId] = (state.items[productId] || 0) + quantity;
      saveCartToLocalStorage(state.items);
    },
    // Update the quantity of an item in the local cart
    updateLocalCartItemQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      if (quantity > 0) {
        state.items[productId] = quantity;
      } else {
        // Remove the item if quantity is 0 or negative
        delete state.items[productId];
      }
      saveCartToLocalStorage(state.items);
    },
    // Clear all items from the local cart
    clearLocalCart: (state) => {
      state.items = {};
      saveCartToLocalStorage(state.items);
    },
  },
});

// Export action creators
export const {
  updateCart,
  addToLocalCart,
  updateLocalCartItemQuantity,
  clearLocalCart,
} = cartSlice.actions;

// Export the reducer
export default cartSlice.reducer;

// Selector to get cart items from the state
export const selectCartItems = (state) => state.cart.items;
