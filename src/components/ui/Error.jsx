// Import necessary dependencies
import React from "react";

// Define the Error component
// This component displays an error message in a styled container
const Error = ({ children }) => {
  return (
    // Error message container
    // This div wraps the error message with appropriate styling for visibility
    <div className="bg-red-100 px-5 py-1 text-center text-lg font-semibold text-red-500">
      {/* Error message content */}
      {/* This section renders the error message passed as children to the component */}
      {children}
    </div>
  );
};

// Export the Error component for use in other parts of the application
export default Error;
