// Import necessary dependencies
import supabase from "../../configs/supabase";
import { apiSlice } from "../api/apiSlice";
import {
  selectCartItems,
  updateCart,
  clearLocalCart,
  addToLocalCart,
} from "./cartSlice";
import { setFirstLoginComplete } from "../auth/authSlice";

// Define and export the cartApi slice
// This slice contains endpoints for cart-related operations
export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint for adding an item to the cart
    addToCart: builder.mutation({
      async queryFn({ productId, quantity = 1 }, { dispatch, getState }) {
        try {
          // Get current user
          const {
            data: { user },
          } = await supabase.auth.getUser();

          // If user is not logged in, add to local cart
          if (!user) {
            dispatch(addToLocalCart({ productId, quantity }));
            return { data: getState().cart.items };
          }

          // Update user's cart in Supabase
          let currentCart = user.user_metadata.cart || {};
          currentCart[productId] = (currentCart[productId] || 0) + quantity;

          const { data, error } = await supabase.auth.updateUser({
            data: { cart: currentCart },
          });

          if (error) throw error;

          // Update Redux store
          dispatch(updateCart(data.user.user_metadata.cart));

          return { data: data.user.user_metadata.cart };
        } catch (error) {
          return { error: "Failed to add item to cart" };
        }
      },
      // Optimistic update
      onQueryStarted({ productId, quantity }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cartApi.util.updateQueryData("fetchCartItems", undefined, (draft) => {
            const existingItem = draft[productId];
            if (existingItem) {
              existingItem.quantity += quantity;
            } else {
              draft[productId] = { quantity };
            }
          }),
        );
        queryFulfilled.catch(patchResult.undo);
      },
      invalidatesTags: ["Cart"],
    }),

    // Endpoint for fetching cart items
    fetchCartItems: builder.query({
      async queryFn() {
        try {
          // Get current user
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (!user) {
            throw new Error("User not authenticated");
          }

          // Return user's cart from metadata
          const currentCart = user.user_metadata.cart || {};
          return { data: currentCart };
        } catch (error) {
          return { error: "Failed to fetch cart items" };
        }
      },
      providesTags: (result) =>
        result
          ? [
              { type: "Cart", id: "LIST" },
              { type: "NavbarCart" },
              ...Object.keys(result).map((id) => ({ type: "CartItems", id })),
            ]
          : [{ type: "Cart", id: "LIST" }, { type: "NavbarCart" }],
    }),

    // Endpoint for updating cart item quantity
    updateCartItemQuantity: builder.mutation({
      async queryFn({ productId, quantity }, { dispatch }) {
        try {
          // Get current user
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (!user) {
            throw new Error("User not authenticated");
          }

          // Update cart in user metadata
          let currentCart = user.user_metadata.cart || {};

          if (quantity > 0) {
            currentCart[productId] = quantity;
          } else {
            delete currentCart[productId];
          }

          const { data, error } = await supabase.auth.updateUser({
            data: { cart: currentCart },
          });

          if (error) throw error;

          // Update Redux store
          dispatch(updateCart(data.user.user_metadata.cart));

          return { data: data.user.user_metadata.cart };
        } catch (error) {
          return { error: "Failed to update cart item quantity" };
        }
      },
      // Optimistic update
      onQueryStarted({ productId, quantity }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cartApi.util.updateQueryData("fetchCartItems", undefined, (draft) => {
            if (draft[productId]) {
              draft[productId].quantity = quantity;
            }
          }),
        );
        queryFulfilled.catch(patchResult.undo);
      },
      invalidatesTags: ["Cart"],
    }),

    // Endpoint for clearing the entire cart
    clearCart: builder.mutation({
      async queryFn(_, { dispatch }) {
        try {
          // Get current user
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (!user) {
            throw new Error("User not authenticated");
          }

          // Set cart to empty object in user metadata
          const { data, error } = await supabase.auth.updateUser({
            data: { cart: {} },
          });

          if (error) throw error;

          // Update Redux store
          dispatch(updateCart({}));

          return { data: {} };
        } catch (error) {
          return { error: "Failed to clear cart" };
        }
      },
      // Pessimistic update
      invalidatesTags: ["Cart"],
    }),

    // Endpoint for merging local cart with user's cart after login
    mergeLocalCart: builder.mutation({
      async queryFn(_, { dispatch, getState }) {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (!user) {
            throw new Error("User not authenticated");
          }

          let currentCart = user.user_metadata.cart || {};
          const localCart = selectCartItems(getState());

          Object.keys(localCart).forEach((id) => {
            currentCart[id] = (currentCart[id] || 0) + localCart[id];
          });

          const { data, error } = await supabase.auth.updateUser({
            data: { cart: currentCart },
          });

          if (error) throw error;

          dispatch(updateCart(data.user.user_metadata.cart));
          dispatch(clearLocalCart());
          dispatch(setFirstLoginComplete());

          return { data: data.user.user_metadata.cart };
        } catch (error) {
          return { error: "Failed to merge local cart" };
        }
      },
      invalidatesTags: ["Cart"],
    }),
  }),
});

// Export the generated hooks for use in components
export const {
  useAddToCartMutation,
  useFetchCartItemsQuery,
  useUpdateCartItemQuantityMutation,
  useClearCartMutation,
  useMergeLocalCartMutation,
} = cartApi;
