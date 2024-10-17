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
  const date = new Date(dateTimeString);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleString("en-US", options);
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
  const statusSteps = ["pending", "confirmed", "delivered"];

  const getStatusIndex = (status) => statusSteps.indexOf(status);

  const getStatusColor = (step, currentStatus) => {
    const currentIndex = getStatusIndex(currentStatus);
    const stepIndex = getStatusIndex(step);

    if (stepIndex < currentIndex) return "text-green-500";
    if (stepIndex === currentIndex) return "text-blue-500";
    return "text-gray-300";
  };

  return (
    <div className="my-5 rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Order Status: {orderId}</h2>
      <div className="mb-6 flex justify-between">
        <span className="font-medium">
          Status: <span className="text-blue-500">{orderState}</span>
        </span>
        <span className="text-gray-500">
          Order placed on: {formatDateTime(createdAt)}
        </span>
      </div>

      {orderState !== "cancelled" && orderState !== "returned" ? (
        <div className="relative mb-8">
          <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 transform bg-gray-200"></div>
          <div className="relative flex justify-between">
            {statusSteps.map((step, index) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-500 bg-white ${getStatusColor(step, orderState)}`}
                >
                  {index === 0 ? (
                    <Box size={20} />
                  ) : index === 1 ? (
                    <Truck size={20} />
                  ) : (
                    <CheckCircle size={20} />
                  )}
                </div>
                <div className="mt-2 text-center text-sm font-medium text-gray-500">
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-8 flex items-center justify-center">
          {orderState === "cancelled" ? (
            <>
              <XCircle size={32} className="mr-2 text-red-500" />
              <span className="font-medium text-red-500">Order Cancelled</span>
            </>
          ) : (
            <>
              <ArrowCounterclockwise
                size={32}
                className="mr-2 text-yellow-500"
              />
              <span className="font-medium text-yellow-500">
                Order Returned
              </span>
            </>
          )}
        </div>
      )}

      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold">Order Details</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-2">Product</th>
              <th className="pb-2">Quantity</th>
              <th className="pb-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.product_id} className="border-b">
                <td className="py-2">{product.product_name}</td>
                <td className="py-2">{product.quantity}</td>
                <td className="py-2">${formatPrice(product.product_price)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2" className="pt-4 text-right font-semibold">
                Total:
              </td>
              <td className="pt-4 font-semibold">
                ${formatPrice(totalAmount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default OrderTracker;
