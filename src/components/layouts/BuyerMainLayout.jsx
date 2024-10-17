// Import necessary dependencies
import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../ui/Footer";
import Navbar from "../ui/Navbar";

// Define the BuyerMainLayout component
// This component serves as the main layout structure for buyer pages
export default function BuyerMainLayout() {
  return (
    <>
      {/* Navigation bar component */}
      {/* This component typically contains links, search functionality, and user account options */}
      <Navbar />

      {/* Main content area */}
      {/* The Outlet component renders the child routes defined for buyer pages */}
      <Outlet />

      {/* Footer component */}
      {/* This component usually contains links, copyright information, and other relevant details */}
      <Footer />
    </>
  );
}
