// Import necessary dependencies
import React, { useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useFetchCartItemsQuery,
  useUpdateCartItemQuantityMutation,
  useClearCartMutation,
  useMergeLocalCartMutation,
} from "../../features/cart/cartApi";
import { useGetMultipleProductsQuery } from "../../features/products/productsApi";
import {
  selectCartItems,
  updateLocalCartItemQuantity,
  clearLocalCart,
} from "../../features/cart/cartSlice";
import useAuth from "../../hooks/useAuth";
import CartItem from "../../components/buyers/CartItem";
import Container from "../../components/ui/Container";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { setFirstLoginComplete } from "../../features/auth/authSlice";

// Define the Cart component
// This component displays the user's shopping cart, allowing them to view, update, and proceed with their selected items
export default function Cart() {
  // Initialize hooks for state management and navigation
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, isFirstLogin, userRole } = useAuth();

  // Get cart items from Redux store for non-logged-in users
  const localCartItems = useSelector(selectCartItems);

  // Fetch cart items for logged-in users
  const {
    data: cartItems,
    isLoading: isCartLoading,
    isError: isCartError,
    error: cartError,
  } = useFetchCartItemsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: !isLoggedIn,
  });

  // Initialize mutations for updating cart item quantity and clearing cart
  const [updateCartItemQuantity] = useUpdateCartItemQuantityMutation();
  const [clearCart] = useClearCartMutation();
  const [mergeLocalCart] = useMergeLocalCartMutation();

  // Create an array of cart items based on user's login status
  const cartItemsArray = useMemo(
    () => Object.entries(isLoggedIn ? cartItems || {} : localCartItems),
    [isLoggedIn, cartItems, localCartItems],
  );

  // Extract product IDs from cart items
  const productIds = useMemo(
    () => cartItemsArray.map(([productId]) => productId),
    [cartItemsArray],
  );

  // Fetch product details for items in the cart
  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: productsError,
  } = useGetMultipleProductsQuery(productIds);

  // Calculate total price of items in the cart
  const totalPrice = useMemo(() => {
    if (!products) return 0;
    return cartItemsArray.reduce((total, [productId, quantity]) => {
      const product = products.find((p) => p.product_id === productId);
      return total + (product?.product_price || 0) * quantity;
    }, 0);
  }, [cartItemsArray, products]);

  // Handle quantity change for cart items
  const handleQuantityChange = async (productId, newQuantity) => {
    if (isLoggedIn) {
      try {
        await updateCartItemQuantity({
          productId,
          quantity: newQuantity,
        }).unwrap();
        toast.success("Quantity updated successfully!");
      } catch (error) {
        toast.error("Failed to update quantity. Please try again.");
      }
    } else {
      dispatch(
        updateLocalCartItemQuantity({ productId, quantity: newQuantity }),
      );
      toast.success("Quantity updated successfully!");
    }
  };

  // Handle clearing the entire cart
  const handleClearCart = async () => {
    if (isLoggedIn) {
      try {
        await clearCart().unwrap();
        toast.success("Cart cleared successfully!");
      } catch (error) {
        toast.error("Failed to clear cart. Please try again.");
      }
    } else {
      dispatch(clearLocalCart());
      toast.success("Cart cleared successfully!");
    }
  };

  // Handle checkout process
  const handleCheckout = () => {
    if (isLoggedIn) {
      navigate("/checkout");
    } else {
      toast.error("Please log in to proceed with checkout", { icon: "🔒" });
      navigate("/authentication", { state: { redirectTo: "/cart" } });
    }
  };

  // Merge local cart with database cart when user logs in for the first time
  useEffect(() => {
    const mergeCartsIfNeeded = async () => {
      if (isLoggedIn && isFirstLogin && userRole === "buyer") {
        try {
          await mergeLocalCart().unwrap();
          dispatch(setFirstLoginComplete());
          dispatch(clearLocalCart());
        } catch (error) {
          console.error("Failed to merge carts:", error);
        }
      }
    };

    mergeCartsIfNeeded();
  }, [isLoggedIn, isFirstLogin, mergeLocalCart, dispatch, userRole]);

  // Render the Cart component
  return (
    <Container>
      <h1 className="my-6 text-center text-2xl font-bold text-primary">
        Your Cart
      </h1>
      {cartItemsArray.length > 0 ? (
        <>
          {/* Display cart items */}
          <div className="space-y-4">
            {cartItemsArray.map(([productId, quantity]) => (
              <CartItem
                key={productId}
                productId={productId}
                quantity={quantity}
                handleQuantityChange={handleQuantityChange}
              />
            ))}
          </div>
          {/* Display total price */}
          <div className="mt-6 text-right">
            <p className="text-xl font-bold">
              Total: ${totalPrice.toFixed(2).replace(/\.00$/, "")}
            </p>
          </div>
          {/* Cart action buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            <Button variant="secondary" onClick={handleClearCart}>
              Clear Cart
            </Button>
            <Button variant="primary" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
          </div>
        </>
      ) : (
        // Display empty cart message
        <div className="mb-5 flex flex-col items-center justify-center space-y-2">
          <h3 className="text-lg font-semibold">Your cart is empty</h3>
          <img
            src="https://vvdmymflefdesejxmuen.supabase.co/storage/v1/object/public/products/empty-cart.png"
            alt=""
            className="mx-auto w-1/4"
          />
          <Button variant="primary" onClick={() => navigate("/category/all")}>
            Add some products
          </Button>
        </div>
      )}
    </Container>
  );
}
