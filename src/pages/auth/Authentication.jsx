// Import necessary dependencies
import React, { useState } from "react";
import {
  Lock,
  Envelope,
  PersonFill,
  ShopWindow,
  Cart,
} from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  useSignUpMutation,
  useSignInMutation,
} from "../../features/auth/authApi";
import { setCredentials } from "../../features/auth/authSlice";
import Error from "../../components/ui/Error";
import toast, { Toaster } from "react-hot-toast";
import SiteLogo from "../../assets/_Main_Logo.png";
import { useMergeLocalCartMutation } from "../../features/cart/cartApi";

// Define the Authentication component
// This component handles both sign-in and sign-up functionality
export default function Authentication() {
  // State to toggle between login and signup forms
  const [isLogin, setIsLogin] = useState(true);

  // State to manage form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    role: "buyer",
  });

  // State to manage error messages
  const [error, setError] = useState(null);

  // Initialize hooks for state management and navigation
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path and action from location state
  const { from, action } = location.state || { from: "/", action: null };

  // Mutation hooks for signup, signin, and merging local cart
  const [signUp] = useSignUpMutation();
  const [signIn] = useSignInMutation();
  const [mergeLocalCart] = useMergeLocalCartMutation();

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      let result;
      if (isLogin) {
        result = await signIn({
          email: formData.email,
          password: formData.password,
        }).unwrap();
      } else {
        result = await signUp({
          email: formData.email,
          password: formData.password,
          displayName: formData.displayName,
          role: formData.role,
        }).unwrap();
      }

      // Extract user and session from the result
      const user = result?.user;
      const session = result?.session || result?.data?.session;

      if (user && session) {
        // Set user credentials in Redux store
        dispatch(
          setCredentials({
            user: user,
            token: session.access_token,
          }),
        );
        // Merge local cart with user's cart
        await mergeLocalCart();
        // Navigate to the appropriate page
        navigate(from);
        if (action === "buy-now") {
          navigate("/cart");
        }
        // Show success message
        toast.success(
          isLogin ? "Successfully signed in!" : "Account created successfully!",
        );
      } else {
        // Show error message if user or session is missing
        const errorMessage = result?.error?.data;
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error;
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Render the Authentication component
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Toaster position="bottom-right" />
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-2xl">
        {/* Logo and title section */}
        <div>
          <Link to="/" className="block text-center">
            <img src={SiteLogo} alt="Logo" className="mx-auto h-12 w-auto" />
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? "Welcome back" : "Create your account"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 font-medium text-indigo-600 hover:text-indigo-500"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
        {/* Authentication form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Conditional rendering for signup-specific fields */}
            {!isLogin && (
              <>
                {/* Display name input */}
                <div>
                  <label htmlFor="displayName" className="sr-only">
                    Display Name
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <PersonFill className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="displayName"
                      name="displayName"
                      type="text"
                      autoComplete="nickname"
                      required
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 pl-10 placeholder-gray-500 focus:outline-none sm:text-sm"
                      placeholder="Display Name"
                      value={formData.displayName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                {/* Role selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <div className="mt-1 space-y-2">
                    <div className="flex items-center">
                      <input
                        id="buyer"
                        name="role"
                        type="radio"
                        value="buyer"
                        checked={formData.role === "buyer"}
                        onChange={handleInputChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600"
                      />
                      <label htmlFor="buyer" className="ml-3 flex items-center">
                        <Cart className="mr-2 h-5 w-5 text-gray-400" />
                        <span className="block text-sm font-medium text-gray-700">
                          Buyer
                        </span>
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="seller"
                        name="role"
                        type="radio"
                        value="seller"
                        checked={formData.role === "seller"}
                        onChange={handleInputChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600"
                      />
                      <label
                        htmlFor="seller"
                        className="ml-3 flex items-center"
                      >
                        <ShopWindow className="mr-2 h-5 w-5 text-gray-400" />
                        <span className="block text-sm font-medium text-gray-700">
                          Seller
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* Email input */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Envelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 pl-10 placeholder-gray-500 focus:outline-none sm:text-sm"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/* Password input */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 pl-10 placeholder-gray-500 focus:outline-none sm:text-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/* Confirm password input for signup */}
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 pl-10 placeholder-gray-500 focus:outline-none sm:text-sm"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}
          </div>
          {/* Submit button */}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              {isLogin ? "Sign in" : "Sign up"}
            </button>
          </div>
          {/* Error display */}
          {error && <Error>{error}</Error>}
        </form>
      </div>
    </div>
  );
}
