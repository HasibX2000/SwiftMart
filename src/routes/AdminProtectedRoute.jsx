// Import necessary dependencies
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

// Define the AdminProtectedRoute component
// This component is used to protect routes that should only be accessible by admin users
const AdminProtectedRoute = ({ children }) => {
  // Use the custom useAuth hook to get authentication state and user role
  const { isLoggedIn, userRole } = useAuth();

  // Check if the user is not logged in or if their role is not "admin"
  if (!isLoggedIn || userRole !== "admin") {
    // If the user doesn't have admin access, redirect them to the home page
    // The 'replace' prop replaces the current entry in the history stack
    // This prevents the user from navigating back to the protected route
    return <Navigate to="/" replace />;
  }

  // If the user is logged in and has the admin role, render the child components
  // This allows the protected content to be displayed
  return children;
};

// Export the AdminProtectedRoute component for use in other parts of the application
export default AdminProtectedRoute;
