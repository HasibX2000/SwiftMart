// Import necessary dependencies
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

// Define the ProtectedRoute component
// This component is used to protect routes that should only be accessible by authenticated users
const ProtectedRoute = ({ children }) => {
  // Use the custom useAuth hook to get authentication state
  const { isLoggedIn } = useAuth();

  // Check if the user is not logged in
  if (!isLoggedIn) {
    // If the user isn't authenticated, redirect them to the authentication page
    // The 'replace' prop replaces the current entry in the history stack
    // This prevents the user from navigating back to the protected route
    return <Navigate to="/authentication" replace />;
  }

  // If the user is logged in, render the child components or the Outlet
  // This allows the protected content to be displayed
  return children ? children : <Outlet />;
};

// Export the ProtectedRoute component for use in other parts of the application
export default ProtectedRoute;
