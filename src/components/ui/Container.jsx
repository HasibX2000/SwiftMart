// Import necessary dependencies
import React from "react";

// Define the Container component
// This component provides a consistent layout wrapper for content across the application
const Container = ({ children, className }) => {
  return (
    // Container wrapper
    // This div applies base container styles and any additional classes passed as props
    <div className={`container mx-auto px-2 py-2 sm:px-0 ${className}`}>
      {/* Content area */}
      {/* This section renders the child components passed to the Container */}
      {children}
    </div>
  );
};

export default Container;
