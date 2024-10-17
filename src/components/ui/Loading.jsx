// Import necessary dependencies
import React from "react";

// Define the Loading component
// This component displays a loading spinner to indicate that content is being loaded
const Loading = () => {
  return (
    // Container for centering the loading spinner
    // This div ensures the spinner is centered both horizontally and vertically
    <div className="flex h-[calc(100vh-200px)] items-center justify-center">
      {/* Loading spinner */}
      {/* This div creates the visual spinning effect using CSS animations and border styles */}
      <div className="loader h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-primary"></div>
    </div>
  );
};

// Export the Loading component for use in other parts of the application
export default Loading;
