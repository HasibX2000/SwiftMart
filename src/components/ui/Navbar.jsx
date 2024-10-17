// Import necessary dependencies
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useFetchCartItemsQuery,
  useMergeLocalCartMutation,
  useClearCartOnLogoutMutation,
} from "../../features/cart/cartApi";
import Container from "./Container";
import SiteLogo from "../../assets/_Main_Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { Cart2, List, X, Search } from "react-bootstrap-icons";
import Button from "./Button";
import useAuth from "../../hooks/useAuth";
import {
  clearCredentials,
  setFirstLoginComplete,
} from "../../features/auth/authSlice";
import toast from "react-hot-toast";
import { updateCart } from "../../features/cart/cartSlice";
import supabase from "../../configs/supabase";

// Define the Navbar component
// This component renders the main navigation bar of the application
export default function Navbar() {
  // Initialize hooks and state
  const dispatch = useDispatch();
  const cartItemsRedux = useSelector((state) => state.cart.items);
  const { data: cartItemsFromDb, isLoading: isCartLoading } =
    useFetchCartItemsQuery();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn, userRole, userAvatar, isFirstLogin } = useAuth();
  const dropdownRef = useRef(null);
  const [mergeLocalCart] = useMergeLocalCartMutation();
  const [clearCartOnLogout] = useClearCartOnLogoutMutation();

  // Calculate total number of items in the cart
  const totalCartItems = useMemo(() => {
    if (!cartItemsRedux) return 0;
    return Object.values(cartItemsRedux).reduce(
      (sum, quantity) => sum + quantity,
      0,
    );
  }, [cartItemsRedux]);

  // Effect to handle click outside dropdown and fetch initial cart data
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Fetch initial cart data
    const fetchInitialCart = async () => {
      if (isLoggedIn && cartItemsFromDb) {
        dispatch(updateCart(cartItemsFromDb));
      }
    };

    fetchInitialCart();
  }, [dispatch, isLoggedIn, cartItemsFromDb]);

  useEffect(() => {
    const mergeCartsIfNeeded = async () => {
      if (isLoggedIn && isFirstLogin) {
        try {
          await mergeLocalCart().unwrap();
          dispatch(setFirstLoginComplete());
        } catch (error) {
          console.error("Failed to merge carts:", error);
        }
      }
    };

    mergeCartsIfNeeded();
  }, [isLoggedIn, isFirstLogin, mergeLocalCart, dispatch]);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Toggle user dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      await clearCartOnLogout().unwrap();
      dispatch(clearCredentials());
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  // Close user dropdown
  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Modify the getDashboardLink function to include a check for the seller role
  const getDashboardLink = () => {
    switch (userRole) {
      case "admin":
        return "/admin";
      case "seller":
        return "/seller/dashboard";
      case "buyer":
      default:
        return "/dashboard";
    }
  };

  // Add a new function to check if the cart should be displayed
  const shouldShowCart = () => {
    return userRole !== "admin" && userRole !== "seller";
  };

  // Add a new function to check if order tracking should be displayed
  const shouldShowOrderTracking = () => {
    return userRole === "buyer";
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-bright shadow-sm">
      <Container>
        <div className="flex items-center justify-between gap-5 py-4">
          {/* Logo and Avatar/Hamburger for Small Screens */}
          <div className="flex w-full items-center justify-between sm:w-auto">
            <Link to="/" className="flex items-center">
              <img src={SiteLogo} alt="Site Logo" className="h-8" />
            </Link>
            <div className="flex items-center sm:hidden">
              {shouldShowCart() && (
                <Link to="/cart" className="mr-4 text-gray-600">
                  <Cart2 size={24} />
                  {totalCartItems > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-bright">
                      {totalCartItems}
                    </span>
                  )}
                </Link>
              )}
              <button onClick={toggleMenu} className="text-gray-600">
                {isMenuOpen ? <X size={24} /> : <List size={24} />}
              </button>
            </div>
          </div>

          {/* Full Navbar for Larger Screens */}
          <div className="hidden w-full items-center justify-between sm:flex">
            {/* Search Box */}
            {/* This component allows users to search for products */}
            <div className="mx-4 flex-grow">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-full border border-gray-300 bg-gray-100 py-2 pl-4 pr-10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 mr-3 mt-2 text-gray-400 hover:text-gray-600"
                >
                  <Search size={20} />
                </button>
              </form>
            </div>

            {/* Cart Icon and Login/Profile Picture */}
            <div className="flex items-center space-x-6">
              {shouldShowCart() && (
                <Link to="/cart" className="relative text-gray-600">
                  <Cart2 size={24} />
                  {totalCartItems > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-bright">
                      {totalCartItems}
                    </span>
                  )}
                </Link>
              )}
              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2"
                  >
                    <img
                      src={userAvatar || "https://via.placeholder.com/40"}
                      alt="User Avatar"
                      className="h-8 w-8 rounded-full"
                    />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                      <Link
                        to={getDashboardLink()}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                      {shouldShowOrderTracking() && (
                        <Link
                          to="/order-tracking"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Order Tracking
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button onClick={() => navigate("/authentication")}>
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </Container>

      {/* Full-Screen Overlay Menu for Small Screens */}
      {/* This section displays a full-screen menu on mobile devices when the menu is toggled */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 sm:hidden">
          <div className="h-full w-64 bg-white p-4">
            <div className="mb-4 flex justify-between">
              <img src={SiteLogo} alt="Site Logo" className="h-8" />
              <button onClick={toggleMenu}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSearch} className="mb-4">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </form>
            <div className="space-y-2">
              <Link
                to="/"
                className="block rounded-md p-2 hover:bg-gray-100"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link
                to="/search"
                className="block rounded-md p-2 hover:bg-gray-100"
                onClick={toggleMenu}
              >
                Search
              </Link>
              {isLoggedIn ? (
                <>
                  <Link
                    to={getDashboardLink()}
                    className="block rounded-md p-2 hover:bg-gray-100"
                    onClick={toggleMenu}
                  >
                    Dashboard
                  </Link>
                  {shouldShowOrderTracking() && (
                    <Link
                      to="/order-tracking"
                      className="block rounded-md p-2 hover:bg-gray-100"
                      onClick={toggleMenu}
                    >
                      Order Tracking
                    </Link>
                  )}
                  {shouldShowCart() && (
                    <Link
                      to="/cart"
                      className="block rounded-md p-2 hover:bg-gray-100"
                      onClick={toggleMenu}
                    >
                      Cart
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="block w-full rounded-md p-2 text-left hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/authentication"
                  className="block rounded-md p-2 hover:bg-gray-100"
                  onClick={toggleMenu}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
