// Import necessary dependencies
import React, { useState } from "react";
import { Truck } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import OrderTracker from "../../components/orders/OrderTracker";
import { useGetOrdersQuery } from "../../features/admins/adminsApi";
import AdminOrderTracker from "../../components/admin/AdminOrderTracker";

// Define the Orderspage component
// This component displays a list of orders with search, pagination, and tracking functionality
export default function Orderspage() {
  // State for managing current page, search term, and selected order
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const ordersPerPage = 20;
  const navigate = useNavigate();

  // Fetch orders data using the useGetOrdersQuery hook
  const {
    data: ordersData,
    isLoading,
    isError,
    error,
  } = useGetOrdersQuery({
    page: currentPage,
    limit: ordersPerPage,
    searchTerm,
  });

  // Handler for tracking an order
  const handleTrack = (order) => {
    setSelectedOrder(order);
  };

  // Handler for searching orders
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handler for updating order status (placeholder function)
  const handleUpdateStatus = async (orderId, newStatus) => {
    // Implement the logic to update the order status
    // This might involve calling an API endpoint
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
    // After successful update, you might want to refetch the orders
  };

  // Display loading message while data is being fetched
  if (isLoading) return <div>Loading...</div>;

  // Display error message if there's an error fetching data
  if (isError) return <div>Error: {error.toString()}</div>;

  // Destructure orders and totalPages from the fetched data
  const { orders, totalPages } = ordersData;

  // Render the orders table, search input, pagination, and order tracker
  return (
    <div className="container mx-auto px-4">
      <h1 className="mb-4 text-2xl font-bold">Orders</h1>
      {/* Search input */}
      <div className="mb-4 flex">
        <input
          type="text"
          placeholder="Search by Order ID..."
          value={searchTerm}
          onChange={handleSearch}
          className="mr-2 w-full rounded-md border px-4 py-2 focus:border-blue-500 focus:outline-none"
        />
      </div>
      {/* Orders table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-300">
            <tr>
              <th className="table-header">Order ID</th>
              <th className="table-header">Buyer ID</th>
              <th className="table-header">Total Amount</th>
              <th className="table-header">Order Date</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="whitespace-nowrap px-6 py-4">{order.id}</td>
                <td className="whitespace-nowrap px-6 py-4">{order.buyerId}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  ${order.totalAmount}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {order.orderDate}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <button
                    onClick={() => handleTrack(order)}
                    className="text-green-600 hover:text-green-900"
                  >
                    <Truck className="mr-1 inline-block" /> Track
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        {[...Array(totalPages).keys()].map((number) => (
          <button
            key={number + 1}
            className={`mx-1 rounded px-3 py-1 ${
              number + 1 === currentPage
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setCurrentPage(number + 1)}
          >
            {number + 1}
          </button>
        ))}
      </div>

      {/* Order tracker component */}
      {selectedOrder && <AdminOrderTracker orderId={selectedOrder.id} />}
    </div>
  );
}
