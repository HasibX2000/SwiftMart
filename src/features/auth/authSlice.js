// Import necessary dependencies from Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";

// Helper function to load auth state from localStorage
const loadAuthState = () => {
  try {
    const serializedAuth = localStorage.getItem("auth");
    if (serializedAuth === null) {
      return undefined;
    }
    return JSON.parse(serializedAuth);
  } catch (err) {
    return undefined;
  }
};

// Helper function to save auth state to localStorage
const saveAuthState = (state) => {
  try {
    const serializedAuth = JSON.stringify(state);
    localStorage.setItem("auth", serializedAuth);
  } catch (err) {
    // Ignore write errors
  }
};

// Define the initial state for the auth slice
// If there's saved state in localStorage, use that; otherwise, use default values
const initialState = loadAuthState() || {
  user: null,
  token: null,
  isAuthenticated: false,
  isFirstLogin: false,
};

// Create the auth slice
// This slice manages the authentication state of the application
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Reducer for setting user credentials in the state
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isFirstLogin = true; // Set to true when user logs in
      saveAuthState(state);
    },
    // Reducer for clearing user credentials from the state
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isFirstLogin = false;
      localStorage.removeItem("auth");
    },
    // Reducer for updating user metadata
    updateUserMetadata: (state, action) => {
      if (state.user && state.user.user_metadata) {
        state.user.user_metadata = {
          ...state.user.user_metadata,
          ...action.payload,
        };
        saveAuthState(state);
      }
    },
    setFirstLoginComplete: (state) => {
      state.isFirstLogin = false;
    },
  },
});

// Export action creators
export const {
  setCredentials,
  clearCredentials,
  updateUserMetadata,
  setFirstLoginComplete,
} = authSlice.actions;

// Selector to get the current user from the state
export const selectCurrentUser = (state) => state.auth.user;

// Selector to get the current auth token from the state
export const selectCurrentToken = (state) => state.auth.token;

// Selector to get the current auth state from the state
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

// Selector to get the user metadata from the state
export const selectUserMetadata = (state) => state.auth.user?.user_metadata;

// Export the reducer
export default authSlice.reducer;
