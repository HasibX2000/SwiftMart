import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import Container from "../../components/ui/Container";
import Loading from "../../components/ui/Loading";
import {
  useGetSellerInfoQuery,
  useUpdateSellerInfoMutation,
  useUpdateSellerPasswordMutation,
  useUpdateProfilePictureMutation,
} from "../../features/sellers/sellersProfileApi";
import { toast } from "react-hot-toast";
import { Camera, Pencil } from "react-bootstrap-icons";
import useAuth from "../../hooks/useAuth";
import { updateUserMetadata } from "../../features/auth/authSlice";

export default function SettingsPage() {
  // Import necessary dependencies and components
  const dispatch = useDispatch();
  const { userAvatar } = useAuth();

  // Fetch seller info using RTK Query hook
  const {
    data: sellerInfo,
    isLoading,
    refetch: refetchProfile,
  } = useGetSellerInfoQuery();

  // Initialize mutation hooks for updating seller information
  const [updateSellerInfo] = useUpdateSellerInfoMutation();
  const [updateSellerPassword] = useUpdateSellerPasswordMutation();
  const [updateProfilePicture, { isLoading: isUpdatingPicture }] =
    useUpdateProfilePictureMutation();

  // State for managing form fields and UI interactions
  const [editingField, setEditingField] = useState(null);
  const [editDisplayName, setEditDisplayName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Ref for file input and state for local avatar URL
  const fileInputRef = useRef(null);
  const [localAvatarUrl, setLocalAvatarUrl] = useState(userAvatar);

  // Effect to update display name when seller info is fetched
  useEffect(() => {
    if (sellerInfo) {
      setEditDisplayName(sellerInfo.display_name || "");
    }
  }, [sellerInfo]);

  // Handler for initiating edit mode for a field
  const handleEdit = (field) => {
    setEditingField(field);
    if (field === "display_name") {
      setEditDisplayName(sellerInfo.display_name);
    }
  };

  // Handler for saving updated display name
  const handleSave = async () => {
    try {
      await updateSellerInfo({ display_name: editDisplayName }).unwrap();
      setEditingField(null);
      refetchProfile();
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  // Handler for profile picture change
  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const result = await updateProfilePicture(file).unwrap();
        if (result.avatar_url) {
          dispatch(updateUserMetadata({ avatar_url: result.avatar_url }));
          setLocalAvatarUrl(result.avatar_url);
          await refetchProfile();
          toast.success("Profile picture updated successfully!");
        } else {
          throw new Error("Failed to update profile picture");
        }
      } catch (error) {
        toast.error("Failed to update profile picture. Please try again.");
      }
    }
  };

  // Handler for password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await updateSellerPassword({ newPassword }).unwrap();
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated successfully");
    } catch (error) {
      toast.error("Error updating password: " + error.message);
    }
  };

  // Show loading component while fetching seller info
  if (isLoading) return <Loading />;

  // Render the settings page
  return (
    <Container>
      <h1 className="mb-6 text-2xl font-bold">Seller Settings</h1>
      <div className="rounded-lg bg-white p-6 shadow">
        {/* Profile picture and display name section */}
        <div className="flex flex-col items-center sm:flex-row">
          {/* Profile picture upload */}
          <div className="mb-4 sm:mb-0 sm:mr-6">
            <div className="relative inline-block">
              <img
                src={localAvatarUrl || "https://via.placeholder.com/100"}
                alt="Profile"
                className="aspect-square size-40 rounded-full border-[5px] border-primary object-cover"
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="hover:bg-primary-dark absolute bottom-0 right-0 rounded-full border-2 border-primary bg-white p-2 text-primary"
                disabled={isUpdatingPicture}
              >
                <Camera />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleProfilePictureChange}
                className="hidden"
                accept="image/*"
                disabled={isUpdatingPicture}
              />
            </div>
          </div>

          {/* Display name and email section */}
          <div className="flex-grow text-center sm:text-left">
            {/* Display name field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Display Name
              </label>
              {editingField === "display_name" ? (
                <div>
                  <input
                    type="text"
                    value={editDisplayName}
                    onChange={(e) => setEditDisplayName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none"
                  />
                  <div className="mt-2">
                    <button
                      onClick={handleSave}
                      className="hover:bg-primary-dark mr-2 rounded bg-primary px-3 py-1 text-white"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingField(null)}
                      className="rounded bg-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center sm:justify-between">
                  <span>{sellerInfo.display_name}</span>
                  <button
                    onClick={() => handleEdit("display_name")}
                    className="hover:text-primary-dark ml-2 text-primary sm:ml-0"
                  >
                    <Pencil />
                  </button>
                </div>
              )}
            </div>
            {/* Email field (read-only) */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="flex items-center justify-center sm:justify-between">
                <span>{sellerInfo.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password update section */}
      <div className="mt-8 rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Update Password</h2>
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div>
            <label
              htmlFor="newPassword"
              className="block font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none"
              required
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="hover:bg-primary-dark inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-offset-2"
          >
            Update Password
          </button>
        </form>
      </div>
    </Container>
  );
}
