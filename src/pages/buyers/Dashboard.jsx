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

  // Calculate the total spend manually
  const calculatedTotalSpend = orders.reduce(
    (sum, order) => sum + order.total_count,
    0,
  );

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
              {/* Profile content */}
            </div>
          </div>

          {/* Total Spend Section */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Total Spend</h2>
            <div className="rounded-lg bg-white p-6 shadow">
              <p className="text-3xl font-bold text-primary">
                ${calculatedTotalSpend}
              </p>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold">All Orders</h2>
          <div className="overflow-hidden rounded-lg bg-white shadow">
            {/* Orders table */}
          </div>
        </div>
      </div>
    </Container>
  );
}
