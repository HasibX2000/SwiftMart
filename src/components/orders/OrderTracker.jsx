// Import necessary dependencies
import React from "react";
import {
  Truck,
  Box,
  CheckCircle,
  XCircle,
  ArrowCounterclockwise,
} from "react-bootstrap-icons";

// Helper function to format price without using toFixed
const formatPrice = (price) => {
  return (Math.round(price * 100) / 100).toString();
};

// Helper function to format date without using toLocaleString
const formatDateTime = (dateTimeString) => {
  // ... (existing code)
};

// Define the OrderTracker component
// This component displays the current status and details of an order
const OrderTracker = ({
  orderId,
  orderState,
  createdAt,
  products,
  totalAmount,
}) => {
  // ... (existing code for statusSteps, getStatusIndex, and getStatusColor)

  return (
    <div className="my-5 rounded-lg bg-white p-6 shadow-md">
      {/* Order ID and status section */}
      {/* This section displays the order ID, current status, and order creation date */}
      <h2 className="mb-4 text-xl font-semibold">Order Status: {orderId}</h2>
      {/* ... (existing code for status and order placed date) */}

      {/* Order status tracker */}
      {/* This section visually represents the current status of the order */}
      {orderState !== "cancelled" && orderState !== "returned" ? (
        <div className="relative">
          {/* ... (existing code for status steps) */}
        </div>
      ) : orderState === "cancelled" ? (
        <div className="flex items-center justify-center">
          <XCircle size={32} className="mr-2 text-red-500" />
          <span className="font-medium text-red-500">Order Cancelled</span>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <ArrowCounterclockwise size={32} className="mr-2 text-yellow-500" />
          <span className="font-medium text-yellow-500">Order Returned</span>
        </div>
      )}

      {/* Product list section */}
      {/* This section displays a detailed table of products in the order */}
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold">Order Details</h3>
        <table className="w-full">
          {/* ... (existing code for table header, body, and footer) */}
        </table>
      </div>
    </div>
  );
};

export default OrderTracker;
