// Import necessary dependencies
import { apiSlice } from "../api/apiSlice";
import supabase from "../../configs/supabase";

// Define and export the authApi slice
// This slice contains endpoints for authentication-related operations
export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint for user sign up
    signUp: builder.mutation({
      async queryFn({ email, password, displayName, role }) {
        try {
          // Generate Gravatar URL for user avatar
          const avatarUrl = getGravatarUrl(email);

          // Check if user already exists
          const { data: existingUser, error: checkError } = await supabase
            .from("users")
            .select("email")
            .eq("email", email)
            .single();

          if (checkError && checkError.code !== "PGRST116") {
            return { error: "Failed to check existing user" };
          }

          if (existingUser) {
            return { error: { status: 409, data: "User already exists" } };
          }

          // Attempt to sign up the user with Supabase
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                display_name: displayName,
                role: role,
                avatar_url: avatarUrl,
              },
            },
          });

          if (error) {
            return { error: "Failed to sign up" };
          }

          // If sign up successful, automatically sign in the user
          if (data.user) {
            const { data: signInData, error: signInError } =
              await supabase.auth.signInWithPassword({
                email,
                password,
              });
            if (signInError) return { error: "Failed to sign in after signup" };
            return { data: signInData };
          }

          return { data };
        } catch (error) {
          return { error: "An unexpected error occurred during sign up" };
        }
      },
    }),

    // Endpoint for user sign in
    signIn: builder.mutation({
      async queryFn({ email, password }) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          return { data };
        } catch (error) {
          return { error: error.message || "Failed to sign in" };
        }
      },
    }),

    // Endpoint for user sign out
    signOut: builder.mutation({
      async queryFn() {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          return { data: null };
        } catch (error) {
          return { error: "Failed to sign out" };
        }
      },
    }),

    // Endpoint for getting the current session
    getSession: builder.query({
      async queryFn() {
        try {
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;
          return { data };
        } catch (error) {
          return { error: "Failed to get session" };
        }
      },
    }),
  }),
});

// Helper function to generate Gravatar URL
const getGravatarUrl = (email) => {
  const hash = md5(email.toLowerCase().trim());
  return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
};

// Export the generated hooks for use in components
export const {
  useSignUpMutation,
  useSignInMutation,
  useSignOutMutation,
  useGetSessionQuery,
} = authApi;
