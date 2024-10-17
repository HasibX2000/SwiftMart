// Import necessary dependencies
import React, { useState, useEffect, useRef } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Sidebar from "../admin/Sidebar";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import { clearCredentials } from "../../features/auth/authSlice";
import useAuth from "../../hooks/useAuth";
import toast, { Toaster } from "react-hot-toast";

// Define the AdminMainLayout component
// This component serves as the main layout for the admin dashboard
export default function AdminMainLayout() {
  // State variables for managing sidebar, dropdown, and screen size
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Hooks for navigation, dispatch, and authentication
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { displayName, userAvatar } = useAuth();
  const dropdownRef = useRef(null);

  // Effect hook for handling screen size changes and click outside dropdown
  useEffect(() => {
    // Media query for detecting small screens
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const handleMediaQueryChange = (e) => {
      setSidebarExpanded(!e.matches);
      setIsSmallScreen(e.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    handleMediaQueryChange(mediaQuery);

    // Handler for closing dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup function
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to handle user logout
  const handleLogout = () => {
    dispatch(clearCredentials());
    toast.success("Logged out successfully!");
    navigate("/authentication");
  };

  // Render the AdminMainLayout
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar component */}
      <div
        className={`${sidebarExpanded ? "w-64" : "w-20"} flex-shrink-0 overflow-y-auto bg-white transition-all duration-300 ease-in-out`}
      >
        <Sidebar expanded={sidebarExpanded} />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header with toggle button and user dropdown */}
        <header className="flex items-center justify-between bg-white p-4 shadow">
          {/* Sidebar toggle button */}
          <button
            onClick={() =>
              !isSmallScreen && setSidebarExpanded(!sidebarExpanded)
            }
            className={`text-gray-500 focus:outline-none ${isSmallScreen ? "invisible" : ""}`}
          >
            {sidebarExpanded ? (
              <ChevronLeft size={24} />
            ) : (
              <ChevronRight size={24} />
            )}
          </button>

          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-gray-500 focus:outline-none"
            >
              <img
                src={userAvatar || "https://via.placeholder.com/100"}
                alt={displayName}
                className="h-10 w-10 rounded-full object-cover"
              />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg">
                <Link
                  to="/admin/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setDropdownOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
