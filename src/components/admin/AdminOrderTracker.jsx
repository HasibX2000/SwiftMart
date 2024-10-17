// Import necessary dependencies
import React, { useState } from "react";
import {
  Truck,
  CheckCircle,
  XCircle,
  ArrowClockwise,
  BoxSeam,
  ArrowCounterclockwise,
} from "react-bootstrap-icons";
import {
  useGetAdminOrderTrackingQuery,
  useUpdateOrderStatusMutation,
} from "../../features/admins/adminsApi";
import toast from "react-hot-toast";

// Define the AdminOrderTracker component
// This component displays and manages the tracking information for a specific order
const AdminOrderTracker = ({ orderId }) => {
  // Fetch order tracking data using the useGetAdminOrderTrackingQuery hook
  const {
    data: order,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAdminOrderTrackingQuery(orderId);

  // Get the mutation function to update order status
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  // State to hold the new status when updating
  const [newStatus, setNewStatus] = useState("");

  // Display loading state while fetching order data
  if (isLoading) return <div>Loading...</div>;

  // Display error message if there's an error fetching order data
  if (isError)
    return (
      <div>
        Error loading order details: {error?.data?.message || "Unknown error"}
      </div>
    );

  // Display message if no order is found
  if (!order) return <div>No order found</div>;

  // Function to handle order status update
  const handleStatusUpdate = async () => {
    try {
      toast.loading(`Updating order ${orderId} status to ${newStatus}...`);
      const result = await updateOrderStatus({
        orderId: order.order_id,
        newStatus,
      });
      if (result.error) {
        toast.error(
          `Failed to update status: ${result.error.data.message || "Unknown error"}`,
        );
      } else {
        toast.success(`Order status updated to ${newStatus}`);
        refetch(); // Refetch the order details to update the UI
      }
    } catch (error) {
      toast.error(
        "An unexpected error occurred while updating the order status",
      );
    }
  };

  // Status options for admin to choose from
  const statusOptions = [
    "Pending",
    "Confirmed",
    "Delivered",
    "Returned",
    "Cancelled",
  ];

  // Helper function to format the shipping address
  const formatShippingAddress = (address) => {
    if (typeof address === "string") {
      try {
        address = JSON.parse(address);
      } catch (e) {
        toast.error("Error parsing shipping address");
        return address; // Return the original string if parsing fails
      }
    }

    if (typeof address === "object") {
      return (
        <div>
          <p>{address.fullName}</p>
          <p>{address.address}</p>
          <p>
            {address.city}, {address.postalCode}
          </p>
          <p>{address.country}</p>
        </div>
      );
    }

    return "Address not available";
  };

  // Helper function to get the appropriate icon for each status
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <BoxSeam className="text-2xl text-yellow-500" />;
      case "confirmed":
        return <Truck className="text-2xl text-blue-500" />;
      case "delivered":
        return <CheckCircle className="text-2xl text-green-500" />;
      case "returned":
        return <ArrowCounterclockwise className="text-2xl text-orange-500" />;
      case "cancelled":
        return <XCircle className="text-2xl text-red-500" />;
      default:
        return <ArrowClockwise className="text-2xl text-gray-500" />;
    }
  };

  // Render the AdminOrderTracker component
  return (
    <div className="mt-5 rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-bold">Order #{order.order_id}</h2>

      {/* Order details section */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <p>
            <strong>Buyer ID:</strong> {order.buyer_id}
          </p>
          <p>
            <strong>Order Date:</strong>{" "}
            {new Date(order.created_at).toLocaleString()}
          </p>
          <p>
            <strong>Total Amount:</strong> ${order.total_count}
          </p>
        </div>
        <div>
          <p>
            <strong>Current Status:</strong> {order.order_state}
          </p>
          <p>
            <strong>Payment Method:</strong> {order.payment_method}
          </p>
          <div>
            <strong>Shipping Address:</strong>{" "}
            {formatShippingAddress(order.shipping_address)}
          </div>
        </div>
      </div>

      {/* Product list section */}
      <h3 className="mb-2 text-xl font-semibold">Products</h3>
      {order.products && order.products.length > 0 ? (
        <ul className="mb-6 list-disc pl-5">
          {order.products.map((product) => (
            <li key={product.id}>
              {product.product_name} - ${product.product_price}
            </li>
          ))}
        </ul>
      ) : (
        <p>No products available</p>
      )}

      {/* Status update section */}
      <div className="flex items-center space-x-4">
        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          className="rounded border px-2 py-1"
        >
          <option value="">Select new status</option>
          {statusOptions.map((status, index) => (
            <option key={index} value={status.toLowerCase()}>
              {status}
            </option>
          ))}
        </select>
        <button
          onClick={handleStatusUpdate}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          disabled={!newStatus}
        >
          Update Status
        </button>
      </div>

      {/* Visual status tracker */}
      <div className="mt-8 flex items-center justify-between">
        {statusOptions.map((status, index) => (
          <div key={index} className="flex flex-col items-center">
            {getStatusIcon(status)}
            <span className="mt-2 text-sm">{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrderTracker;
