// Import necessary dependencies
import { apiSlice } from "../api/apiSlice";
import supabase from "../../configs/supabase";
import toast from "react-hot-toast";

// Define and export the sellersProfileApi slice
// This slice contains endpoints for seller profile-related operations
export const sellersProfileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint for getting the seller's profile information
    getSellerInfo: builder.query({
      async queryFn() {
        try {
          // Fetch the current user's data from Supabase
          const {
            data: { user },
            error,
          } = await supabase.auth.getUser();

          if (error) {
            toast.error("Failed to fetch seller info");
            return { error: "Failed to fetch seller info" };
          }

          // Return the seller's profile information
          return {
            data: {
              id: user.id,
              email: user.email,
              phone: user.phone,
              display_name: user.user_metadata.display_name || user.email,
              avatar_url: user.user_metadata.avatar_url,
            },
          };
        } catch (error) {
          toast.error("An unexpected error occurred");
          return { error: "An unexpected error occurred" };
        }
      },
      providesTags: ["SellerProfile"],
    }),

    // Endpoint for updating the seller's profile information
    updateSellerInfo: builder.mutation({
      async queryFn({ display_name, phone }) {
        try {
          // Update the user's metadata in Supabase
          const { data, error } = await supabase.auth.updateUser({
            data: { display_name, phone },
          });

          if (error) {
            toast.error(`Supabase error: ${error.message}`);
            return { error: error.message };
          }

          return { data: data.user.user_metadata };
        } catch (error) {
          toast.error(`Unexpected error: ${error.message}`);
          return { error: error.message };
        }
      },
      invalidatesTags: ["SellerProfile"],
    }),

    // Endpoint for updating the seller's password
    updateSellerPassword: builder.mutation({
      async queryFn({ newPassword }) {
        try {
          // Update the user's password in Supabase
          const { error } = await supabase.auth.updateUser({
            password: newPassword,
          });

          if (error) {
            toast.error(`Supabase error: ${error.message}`);
            return { error: error.message };
          }

          toast.success("Password updated successfully");
          return { data: { success: true } };
        } catch (error) {
          toast.error(`Unexpected error: ${error.message}`);
          return { error: error.message };
        }
      },
    }),

    // Endpoint for updating the seller's profile picture
    updateProfilePicture: builder.mutation({
      async queryFn(file) {
        try {
          // Get the current user
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();
          if (userError) throw userError;

          // Generate a unique filename for the new profile picture
          const fileName = `${user.id}-${Date.now()}.webp`;
          const filePath = `${fileName}`;

          // Upload the new profile picture to Supabase storage
          const { error: uploadError } = await supabase.storage
            .from("users")
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          // Get the public URL of the uploaded file
          const { data: urlData } = supabase.storage
            .from("users")
            .getPublicUrl(filePath);

          // Update the user's avatar URL in their metadata
          const { data, error: updateError } = await supabase.auth.updateUser({
            data: { avatar_url: urlData.publicUrl },
          });

          if (updateError) throw updateError;

          toast.success("Profile picture updated successfully");
          return { data: { avatar_url: urlData.publicUrl } };
        } catch (error) {
          toast.error(`Error updating profile picture: ${error.message}`);
          return { error: error.message };
        }
      },
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetSellerInfoQuery,
  useUpdateSellerInfoMutation,
  useUpdateSellerPasswordMutation,
  useUpdateProfilePictureMutation,
} = sellersProfileApi;
