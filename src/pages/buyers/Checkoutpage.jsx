// Import necessary dependencies
import React, { useState } from "react";
import Container from "../../components/ui/Container";
import {
  useFetchCartItemsQuery,
  useClearCartMutation,
} from "../../features/cart/cartApi";
import { useGetMultipleProductsQuery } from "../../features/products/productsApi";
import { usePlaceOrderMutation } from "../../features/buyers/buyersApi";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import PaymentForm from "../../components/buyers/PaymentForm";
import toast from "react-hot-toast";

// Define the CheckoutPage component
// This component handles the checkout process, including shipping information, payment, and order placement
export default function CheckoutPage() {
  // Initialize state for shipping information
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  // Initialize state for payment method and details
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [paymentDetails, setPaymentDetails] = useState({});

  // Initialize navigation hook for programmatic routing
  const navigate = useNavigate();

  // Fetch cart items using RTK Query
  const { data: cartItems, isLoading: isCartLoading } =
    useFetchCartItemsQuery();
  const cartItemsArray = Object.entries(cartItems || {});
  const productIds = cartItemsArray.map(([productId]) => productId);

  // Fetch product details for items in the cart
  const { data: products, isLoading: isProductsLoading } =
    useGetMultipleProductsQuery(productIds);

  // Calculate total price of items in the cart
  const calculateTotal = () => {
    if (!products) return 0;
    return cartItemsArray.reduce((total, [productId, quantity]) => {
      const product = products.find((p) => p.product_id === productId);
      return total + (product?.product_price || 0) * quantity;
    }, 0);
  };

  // Handle changes in shipping information inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Handle changes in payment method
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  // Handle changes in payment details
  const handlePaymentDetailsChange = (details) => {
    setPaymentDetails(details);
  };

  // Initialize mutations for placing order and clearing cart
  const [placeOrder, { isLoading: isPlacingOrder }] = usePlaceOrderMutation();
  const [clearCart] = useClearCartMutation();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        productIds: cartItemsArray.map(([productId]) => productId),
        totalAmount: calculateTotal(),
        shippingInfo,
        paymentMethod,
        paymentDetails,
      };

      const result = await placeOrder(orderData).unwrap();
      await clearCart().unwrap();
      toast.success("Order placed successfully!");
      navigate(`/order-confirmation/${result.orderId}`);
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    }
  };

  // Show loading state while fetching data
  if (isCartLoading || isProductsLoading) {
    return <div className="mt-8 text-center">Loading...</div>;
  }

  // Show message if cart is empty
  if (cartItemsArray.length === 0) {
    return (
      <Container className="my-8">
        <div className="mt-8 text-center">
          <h2 className="mb-4 text-2xl font-bold">Your cart is empty</h2>
          <Button variant="primary" onClick={() => navigate("/")}>
            Continue Shopping
          </Button>
        </div>
      </Container>
    );
  }

  // Render the CheckoutPage component
  return (
    <Container className="my-8">
      <h1 className="mb-6 text-3xl font-bold text-primary">Checkout</h1>
      <div className="flex flex-col md:flex-row md:space-x-8">
        {/* Shipping and Payment Form */}
        <div className="md:w-2/3">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipping Information Section */}
            <h2 className="text-xl font-semibold">Shipping Information</h2>
            {/* Shipping information form fields */}
            {/* ... (shipping form fields) ... */}

            {/* Payment Form Component */}
            <PaymentForm
              onPaymentMethodChange={handlePaymentMethodChange}
              onPaymentDetailsChange={handlePaymentDetailsChange}
            />

            {/* Submit Order Button */}
            <button
              type="submit"
              className="hover:bg-primary-dark w-full rounded bg-primary px-4 py-2 text-white"
            >
              Place Order
            </button>
          </form>
        </div>

        {/* Order Summary Section */}
        <div className="mt-8 md:mt-0 md:w-1/3">
          <div className="rounded-lg border border-gray-200 p-6">
            <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
            <ul className="space-y-2">
              {/* Display cart items */}
              {cartItemsArray.map(([productId, quantity]) => {
                const product = products?.find(
                  (p) => p.product_id === productId,
                );
                return (
                  <li key={productId} className="flex justify-between">
                    <span>
                      {product?.product_name} x {quantity}
                    </span>
                    <span>
                      ${((product?.product_price || 0) * quantity).toFixed(2)}
                    </span>
                  </li>
                );
              })}
            </ul>
            {/* Display total price */}
            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
              <h3 className="text-lg font-bold">Total:</h3>
              <p className="text-lg font-bold">${calculateTotal()}</p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
