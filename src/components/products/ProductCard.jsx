// Import necessary dependencies
import React from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import { useAddToCartMutation } from "../../features/cart/cartApi";
import { useDispatch, useSelector } from "react-redux";
import { updateCart } from "../../features/cart/cartSlice";
import useAuth from "../../hooks/useAuth";

// Define the ProductCard component
// This component displays individual product information and add to cart functionality
export default function ProductCard({ productData, isLoading }) {
  // Destructure product data
  const {
    product_id,
    flash_sale,
    featured_image,
    product_name,
    product_price,
  } = productData;

  const dispatch = useDispatch();
  // Get cart items from Redux store
  const cartItems = useSelector((state) => state.cart.items);
  // Check if user is logged in
  const { isLoggedIn, userRole } = useAuth();
  // Mutation hook for adding item to cart
  const [addToCartMutation, { isLoading: isAddingToCart }] =
    useAddToCartMutation();

  // Handle adding product to cart
  const handleAddToCart = async () => {
    try {
      // Optimistically update the local state
      const updatedCart = { ...cartItems };
      updatedCart[product_id] = (updatedCart[product_id] || 0) + 1;
      dispatch(updateCart(updatedCart));

      if (isLoggedIn) {
        // If user is logged in, send request to server
        const result = await addToCartMutation({
          productId: product_id,
          quantity: 1,
        }).unwrap();

        if (result) {
          toast.success("Item added to cart successfully!", {
            duration: 3000,
            position: "bottom-right",
          });
        }
      } else {
        // If user is not logged in, just show success message
        toast.success("Item added to cart successfully!", {
          duration: 3000,
          position: "bottom-right",
        });
      }
    } catch (error) {
      toast.error("Failed to add item to cart. Please try again.", {
        duration: 3000,
        position: "bottom-right",
      });
      // Revert the optimistic update
      dispatch(updateCart(cartItems));
    }
  };

  // Check if the user is a seller or admin
  const isSellerOrAdmin = userRole === "seller" || userRole === "admin";

  return (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl">
      {/* Product image and link */}
      {/* This section displays the product image and links to the product detail page */}
      <Link to={`/product/${product_id}`}>
        <div className="relative">
          <img
            src={featured_image}
            alt={product_name}
            className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Flash sale badge */}
          {flash_sale && (
            <div className="rounded-bg-primary absolute right-2 top-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
              Flash Sale
            </div>
          )}
        </div>
      </Link>

      {/* Product details section */}
      {/* This section displays the product name, price, and add to cart button */}
      <div className="p-4">
        {/* Product name and link */}
        <Link to={`/product/${product_id}`}>
          <h3 className="mb-3 text-lg font-semibold text-gray-800 transition-colors duration-300 group-hover:text-primary">
            {product_name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          {/* Product price */}
          <p className="text-lg font-bold text-primary">${product_price}</p>
          {/* Add to cart button */}
          <Button
            size="sm"
            variant="primary"
            onClick={handleAddToCart}
            disabled={isLoading || isAddingToCart || isSellerOrAdmin}
          >
            {isLoading || isAddingToCart ? "Adding..." : "Add To Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
