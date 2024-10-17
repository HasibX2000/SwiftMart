// Import necessary dependencies
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Container from "../../components/ui/Container";
import { useDispatch } from "react-redux";
import { clearLocalCart } from "../../features/cart/cartSlice";
import { useClearCartMutation } from "../../features/cart/cartApi";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

// Define the OrderConfirmation component
// This component is responsible for displaying the order confirmation page
// and clearing the user's cart after a successful purchase
export default function OrderConfirmation() {
  // Extract orderId from URL parameters
  const { orderId } = useParams();

  // Initialize dispatch function from Redux
  const dispatch = useDispatch();

  // Get authentication status using custom hook
  const { isLoggedIn } = useAuth();

  // Mutation hook for clearing the server-side cart
  const [clearServerCart] = useClearCartMutation();

  // Effect to clear the cart after successful order
  useEffect(() => {
    // Define an async function to clear carts
    const clearCarts = async () => {
      if (isLoggedIn) {
        // Clear server cart for logged-in users
        try {
          await clearServerCart().unwrap();
        } catch (err) {
          toast.error("Failed to clear server cart. Please try again.");
        }
      } else {
        // Clear local cart for non-logged-in users
        dispatch(clearLocalCart());
      }
    };

    // Call the clearCarts function
    clearCarts();
  }, [dispatch, clearServerCart, isLoggedIn]);

  // Render the order confirmation page
  return (
    <Container>
      <div className="mx-auto my-16 max-w-2xl text-center">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h1 className="mb-6 text-3xl font-bold text-primary">
            Order Confirmed!
          </h1>
          <p className="mb-4 text-xl">Thank you for your purchase.</p>
          <p className="mb-6">
            Your order number is:{" "}
            <span className="font-semibold text-primary">{orderId}</span>
          </p>

          <div className="space-y-4">
            {/* Link to track the order */}
            <Link
              to={`/order-tracking?orderId=${orderId}`}
              className="hover:bg-primary-dark block w-full rounded-md bg-primary px-4 py-2 text-white transition duration-300"
            >
              Track Your Order
            </Link>
            {/* Link to continue shopping */}
            <Link
              to="/"
              className="block w-full rounded-md border border-primary px-4 py-2 text-primary transition duration-300 hover:bg-primary hover:text-white"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
