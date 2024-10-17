// Import necessary dependencies
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

// Define the SellerProtectedRoute component
// This component is used to protect routes that should only be accessible by seller users
const SellerProtectedRoute = ({ children }) => {
  // Use the custom useAuth hook to get authentication state and user role
  const { isLoggedIn, userRole } = useAuth();

  // Check if the user is not logged in or if their role is not "seller"
  if (!isLoggedIn || userRole !== "seller") {
    // If the user doesn't have seller access, redirect them to the home page
    // The 'replace' prop replaces the current entry in the history stack
    // This prevents the user from navigating back to the protected route
    return <Navigate to="/" replace />;
  }

  // If the user is logged in and has the seller role, render the child components
  // This allows the protected content to be displayed
  return children;
};

// Export the SellerProtectedRoute component for use in other parts of the application
export default SellerProtectedRoute;
