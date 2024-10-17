// Import necessary dependencies
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Camera } from "react-bootstrap-icons";
import Container from "../../components/ui/Container";
import {
  useGetBuyerProfileQuery,
  useUpdateBuyerProfileMutation,
  useGetBuyerOrdersQuery,
  useUpdateBuyerProfilePictureMutation,
} from "../../features/buyers/buyersApi";
import Loading from "../../components/ui/Loading";
import toast, { Toaster } from "react-hot-toast";
import Error from "../../components/ui/Error";

// Define the Dashboard component for buyers
// This component displays user profile, total spend, and order history
export default function Dashboard() {
  // Initialize state variables for managing editable fields
  const [editingField, setEditingField] = useState(null);
  const [editName, setEditName] = useState("");

  // Initialize navigation hook for programmatic routing
  const navigate = useNavigate();

  // Fetch buyer profile data using RTK Query
  const {
    data: user,
    isLoading: isLoadingUser,
    refetch: refetchProfile,
  } = useGetBuyerProfileQuery();

  // Fetch buyer orders data using RTK Query
  const {
    data: orderData,
    isLoading: isLoadingOrders,
    error: orderError,
  } = useGetBuyerOrdersQuery();

  // Initialize mutation hooks for updating profile and profile picture
  const [updateProfile] = useUpdateBuyerProfileMutation();
  const [updateProfilePicture, { isLoading: isUpdatingPicture }] =
    useUpdateBuyerProfilePictureMutation();

  // Create a ref for the file input element
  const fileInputRef = useRef(null);

  // Handle initiating the edit process for a field
  const handleEdit = (field) => {
    setEditingField(field);
    if (field === "name") {
      setEditName(user.name);
    }
  };

  // Handle saving the edited profile information
  const handleSave = async () => {
    try {
      await updateProfile({ name: editName });
      setEditingField(null);
      refetchProfile();
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  // Handle updating the profile picture
  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        await updateProfilePicture(file).unwrap();
        await refetchProfile();
        toast.success("Profile picture updated successfully!");
      } catch (error) {
        toast.error("Failed to update profile picture. Please try again.");
      }
    }
  };

  // Navigate to the order tracking page for a specific order
  const handleViewOrder = (orderId) => {
    navigate(`/order-tracking?orderId=${orderId}`);
  };

  // Show loading state while data is being fetched
  if (isLoadingUser || isLoadingOrders) {
    return <Loading />;
  }

  // Show error state if there's an issue loading orders
  if (orderError) {
    return <Error>Error loading orders: {orderError.message}</Error>;
  }

  // Destructure order data, providing default values if undefined
  const { orders = [], totalSpend = 0 } = orderData || {};

  // Render the Dashboard component
  return (
    <Container>
      <Toaster position="bottom-right" />
      <div className="px-4 py-8">
        {/* Profile Section */}
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Profile</h2>
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="mb-4 flex items-center">
                <div className="relative h-20 w-20">
                  <img
                    src={user.avatar_url || "/default-avatar.png"}
                    alt="Profile"
                    className="h-full w-full rounded-full object-cover"
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-0 right-0 rounded-full bg-primary p-1 text-white"
                    disabled={isUpdatingPicture}
                  >
                    <Camera size={16} />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleProfilePictureChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
                <div className="ml-4">
                  {editingField === "name" ? (
                    <div>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="rounded border p-1"
                      />
                      <button
                        onClick={handleSave}
                        className="ml-2 rounded bg-primary px-2 py-1 text-white"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <h3 className="text-xl font-semibold">{user.name}</h3>
                      <button
                        onClick={() => handleEdit("name")}
                        className="ml-2 text-gray-500"
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  )}
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Total Spend Section */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Total Spend</h2>
            <div className="rounded-lg bg-white p-6 shadow">
              <p className="text-3xl font-bold text-primary">
                $
                {totalSpend.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold">All Orders</h2>
          <div className="overflow-x-auto rounded-lg bg-white shadow">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Order ID</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Total</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.order_id} className="border-t">
                    <td className="px-4 py-2">{order.order_id}</td>
                    <td className="px-4 py-2">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      $
                      {order.total.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-4 py-2">{order.order_state}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleViewOrder(order.order_id)}
                        className="rounded bg-primary px-3 py-1 text-white"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Container>
  );
}
