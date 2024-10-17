// Import necessary dependencies from React Redux and the auth slice
import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectUserMetadata,
} from "../features/auth/authSlice";

// Define the useAuth custom hook
// This hook provides easy access to authentication-related information
export default function useAuth() {
  // Select authentication state from the Redux store
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const userMetadata = useSelector(selectUserMetadata);

  // Return an object with authentication-related information and utility functions
  return {
    // Check if the user is logged in
    isLoggedIn: isAuthenticated,

    // Get the user's display name, fallback to email or "User"
    // This ensures a display name is always available, even if metadata is incomplete
    displayName: userMetadata?.display_name || user?.email || "User",

    // Get the user's avatar URL, or null if not available
    // This allows components to easily check if an avatar should be displayed
    userAvatar: userMetadata?.avatar_url || null,

    // Get the user's role from metadata
    // This can be used for role-based access control in the application
    userRole: userMetadata?.role || null,

    // Get the user's ID
    // This is useful for making user-specific API calls or routing
    userId: user?.id || null,
  };
}
