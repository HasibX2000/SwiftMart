// Import necessary dependencies
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search } from "react-bootstrap-icons";
import OrderTracker from "../../components/orders/OrderTracker";
import { useGetOrderTrackingQuery } from "../../features/buyers/buyersApi";
import Container from "../../components/ui/Container";
import useAuth from "../../hooks/useAuth";
import Error from "../../components/ui/Error";

// Define the OrderTrackingPage component
// This component allows users to track their orders and displays order information
export default function OrderTrackingPage() {
  // State for managing order number input and tracked order ID
  const [orderNumber, setOrderNumber] = useState("");
  const [trackedOrderId, setTrackedOrderId] = useState(null);

  // Hooks for navigation and accessing URL parameters
  const location = useLocation();
  const navigate = useNavigate();

  // Use the custom useAuth hook to get authentication state
  const { isLoggedIn } = useAuth();

  // Fetch order tracking data using RTK Query
  const {
    data: orderTracking,
    isLoading,
    isError,
    error,
  } = useGetOrderTrackingQuery(trackedOrderId, {
    skip: !trackedOrderId || !isLoggedIn,
  });

  // Effect to set the order ID from URL parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get("orderId");
    if (orderId) {
      setOrderNumber(orderId);
      setTrackedOrderId(orderId);
    }
  }, [location]);

  // Handle form submission for order tracking
  const handleSubmit = (e) => {
    e.preventDefault();
    setTrackedOrderId(orderNumber);
    navigate(`/order-tracking?orderId=${orderNumber}`);
  };

  // Render the OrderTrackingPage component
  return (
    <Container className="my-32">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-primary">
          Track Your Order
        </h1>
        {/* Order tracking form */}
        <form onSubmit={handleSubmit} className="mb-8">
          {/* ... form input and button ... */}
        </form>
        {/* Display error if user is not logged in */}
        {!isLoggedIn && <Error>Please log in to track your order.</Error>}
        {/* Display loading state */}
        {isLoading && <p>Loading order tracking information...</p>}
        {/* Display error if order tracking fails */}
        {isError && <Error>Enter valid order id!</Error>}
        {/* Display order tracking information */}
        {!isError && !isLoading && orderTracking && (
          <OrderTracker
            orderId={orderTracking.order_id}
            orderState={orderTracking.order_state}
            createdAt={orderTracking.created_at}
            products={orderTracking.products}
            totalAmount={orderTracking.total_count}
          />
        )}
      </div>
    </Container>
  );
}
