import React, { useState, useEffect } from "react";
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

const AdminOrderTracker = ({ orderId }) => {
  const {
    data: orderData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAdminOrderTrackingQuery(orderId, {
    skip: !orderId,
  });

  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    if (orderData) {
      setNewStatus(orderData.order_state.toLowerCase());
    }
  }, [orderData]);

  if (!orderId) return <div>No order ID provided</div>;
  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return (
      <div>
        Error loading order details: {error?.data?.message || "Unknown error"}
      </div>
    );
  if (!orderData) return <div>No order found</div>;

  const {
    order_id,
    created_at,
    buyer_id,
    order_state,
    payment_method,
    shipping_address,
    total_count,
    products,
  } = orderData;

  const handleStatusUpdate = async () => {
    try {
      await updateOrderStatus({
        orderId: order_id,
        newStatus,
      }).unwrap();
      toast.success(`Order status updated to ${newStatus}`);
      refetch();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(
        `Failed to update status: ${error.data?.message || "Unknown error"}`,
      );
    }
  };

  const statusOptions = [
    "Pending",
    "Confirmed",
    "Delivered",
    "Returned",
    "Cancelled",
  ];

  const formatShippingAddress = (address) => {
    if (typeof address === "string") {
      try {
        address = JSON.parse(address);
      } catch (e) {
        toast.error("Error parsing shipping address");
        return address;
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

  return (
    <div className="mt-5 rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-bold">Order #{order_id}</h2>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <p>
            <strong>Buyer ID:</strong> {buyer_id}
          </p>
          <p>
            <strong>Order Date:</strong> {new Date(created_at).toLocaleString()}
          </p>
          <p>
            <strong>Total Amount:</strong> ${total_count}
          </p>
        </div>
        <div>
          <p>
            <strong>Current Status:</strong> {order_state}
          </p>
          <p>
            <strong>Payment Method:</strong> {payment_method}
          </p>
          <div>
            <strong>Shipping Address:</strong>{" "}
            {formatShippingAddress(shipping_address)}
          </div>
        </div>
      </div>

      <h3 className="mb-2 text-xl font-semibold">Products</h3>
      {products && products.length > 0 ? (
        <ul className="mb-6 list-disc pl-5">
          {products.map((product) => (
            <li key={product.product_id}>
              {product.product_name} - ${product.product_price}
            </li>
          ))}
        </ul>
      ) : (
        <p>No products available</p>
      )}

      <div className="flex items-center space-x-4">
        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          className="rounded border px-2 py-1"
        >
          {statusOptions.map((status, index) => (
            <option key={index} value={status.toLowerCase()}>
              {status}
            </option>
          ))}
        </select>
        <button
          onClick={handleStatusUpdate}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          disabled={newStatus === order_state.toLowerCase()}
        >
          Update Status
        </button>
      </div>

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
