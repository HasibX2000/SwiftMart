// Import necessary dependencies
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

// Define the BuyerProtectedRoute component
// This component allows access to non-logged-in users and buyers, but restricts sellers
const BuyerProtectedRoute = ({ children }) => {
  // Use the custom useAuth hook to get authentication state and user role
  const { isLoggedIn, userRole } = useAuth();

  // Allow access if the user is not logged in or if their role is "buyer"
  if (!isLoggedIn || userRole === "buyer") {
    return children;
  }

  // If the user is logged in and their role is not "buyer" (i.e., they are a seller),
  // redirect them to the home page
  return <Navigate to="/" replace />;
};

// Export the BuyerProtectedRoute component for use in other parts of the application
export default BuyerProtectedRoute;
