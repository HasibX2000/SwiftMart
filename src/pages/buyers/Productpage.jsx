// Import necessary dependencies and components
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/ui/Button";
import Container from "../../components/ui/Container";
import { useGetProductQuery } from "../../features/products/productsApi";
import Loading from "../../components/ui/Loading";
import Error from "../../components/ui/Error";
import { useAddToCartMutation } from "../../features/cart/cartApi";
import toast from "react-hot-toast";
import { addToLocalCart } from "../../features/cart/cartSlice";
import useAuth from "../../hooks/useAuth";
import RelatedProducts from "../../components/buyers/RelatedProducts";

// Define colors for category tags
const categoryColors = [
  "rgba(255, 99, 71, 0.2)",
  "rgba(100, 149, 237, 0.2)",
  "rgba(50, 205, 50, 0.2)",
];

export default function ProductPage() {
  // Get productId from URL parameters
  const { productId } = useParams();

  // Fetch product data using RTK Query
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useGetProductQuery(productId);

  // State for main product image and quantity
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Mutation hook for adding to cart
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  // Hooks for navigation and Redux dispatch
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get authentication state and user role
  const { isLoggedIn, userRole } = useAuth();

  // Set main image when product data is loaded
  useEffect(() => {
    if (product) {
      setMainImage(product.featured_image);
    }
  }, [product]);

  // Check if the user is a seller or admin
  const isSellerOrAdmin = userRole === "seller" || userRole === "admin";

  // Handle adding product to cart
  const handleAddToCart = async () => {
    if (isSellerOrAdmin) {
      toast.error("Sellers and admins cannot add items to cart.");
      return;
    }

    try {
      if (isLoggedIn) {
        // Add to server cart for logged-in users
        await addToCart({ productId: product.product_id, quantity }).unwrap();
      } else {
        // Add to local cart for non-logged-in users
        dispatch(addToLocalCart({ productId: product.product_id, quantity }));
      }
      toast.success("Product added to cart successfully!");
    } catch (error) {
      toast.error("Failed to add product to cart. Please try again.");
    }
  };

  // Handle "Buy Now" action
  const handleBuyNow = async () => {
    if (isSellerOrAdmin) {
      toast.error("Sellers and admins cannot purchase items.");
      return;
    }

    try {
      if (isLoggedIn) {
        // Add to cart and navigate to cart page for logged-in users
        await addToCart({ productId: product.product_id, quantity }).unwrap();
        navigate("/cart");
      } else {
        // Add to local cart and navigate to authentication page for non-logged-in users
        dispatch(addToLocalCart({ productId: product.product_id, quantity }));
        navigate("/authentication", {
          state: { from: `/product/${product.product_id}`, action: "buy-now" },
        });
      }
    } catch (error) {
      toast.error("Failed to process your request. Please try again.");
    }
  };

  // Calculate total price
  const totalPrice = product ? product.product_price * quantity : 0;

  // Clean category name for display and URL
  const cleanCategoryName = (name) => {
    return name.replace(/[\[\]'"]/g, "").trim();
  };

  let content = null;

  // Show loading state while fetching product data
  if (isLoading) {
    content = <Loading />;
  } else if (isError) {
    // Show error state if there's an issue fetching product data
    content = <Error>{error.message}</Error>;
  } else if (!product) {
    // Show not found state if product doesn't exist
    content = <Error>Product not found</Error>;
  } else {
    // Prepare all product images for display
    const allImages = [
      product.featured_image,
      ...(product.other_images ? parseOtherImages(product.other_images) : []),
    ];

    // Render product details
    content = (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_2fr]">
        {/* Image section */}
        <div className="space-y-4">
          <div className="aspect-w-1 aspect-h-1 w-full">
            <img
              src={mainImage}
              alt={product.product_name}
              className="aspect-square rounded-lg object-cover shadow-md"
            />
          </div>
          <div className="flex space-x-2">
            {allImages.map((img, index) => (
              <div key={index} className="aspect-w-1 aspect-h-1 h-20 w-20">
                <img
                  src={img}
                  alt={`${product.product_name} ${index + 1}`}
                  className="h-full w-full cursor-pointer rounded-md object-cover"
                  onClick={() => setMainImage(img)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product details section */}
        <div className="space-y-4">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-primary">
              {product.product_name}
            </h1>

            {/* Display categories */}
            <div className="flex flex-wrap gap-2">
              {Array.isArray(product.product_category)
                ? product.product_category.map((category, index) => (
                    <Link
                      key={index}
                      to={`/category/${cleanCategoryName(category).toLowerCase()}`}
                      style={{
                        backgroundColor:
                          categoryColors[index % categoryColors.length],
                      }}
                      className="inline-block rounded-md px-2 py-1 text-sm text-primary"
                    >
                      {cleanCategoryName(category)}
                    </Link>
                  ))
                : product.product_category.split(",").map((category, index) => (
                    <Link
                      key={index}
                      to={`/category/${cleanCategoryName(category).toLowerCase()}`}
                      style={{
                        backgroundColor:
                          categoryColors[index % categoryColors.length],
                      }}
                      className="inline-block rounded-md px-2 py-1 text-sm text-black"
                    >
                      {cleanCategoryName(category)}
                    </Link>
                  ))}
            </div>
          </div>

          <p className="text-2xl font-semibold text-primary">
            Price: ${product.product_price}
          </p>

          {/* Quantity selector */}
          <div className="flex items-center space-x-4">
            <label htmlFor="quantity" className="font-medium">
              Quantity:
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="rounded-full bg-gray-200 px-2 py-1 text-sm font-bold"
              >
                -
              </button>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-16 rounded border px-2 py-1 text-center"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="rounded-full bg-gray-200 px-2 py-1 text-sm font-bold"
              >
                +
              </button>
            </div>
          </div>

          <p className="text-xl font-semibold text-primary">
            Total: ${(Math.round(totalPrice * 100) / 100).toString()}
          </p>

          {/* Action buttons */}
          <div className="flex space-x-4">
            <Button
              variant="primary"
              onClick={handleAddToCart}
              disabled={isAddingToCart || isSellerOrAdmin}
            >
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </Button>
            <Button
              variant="secondary"
              onClick={handleBuyNow}
              disabled={isAddingToCart || isSellerOrAdmin}
            >
              Buy Now
            </Button>
          </div>

          {/* Product description */}
          <div
            className="text-gray-700"
            dangerouslySetInnerHTML={{
              __html: product.product_desc,
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <Container className="mt-5">
      {content}
      {product && <RelatedProducts product_id={product.product_id} />}
    </Container>
  );
}

// Helper function to parse other_images
function parseOtherImages(otherImages) {
  if (typeof otherImages === "string") {
    try {
      return JSON.parse(otherImages);
    } catch (error) {
      toast.error(
        "Error parsing product images. Please try refreshing the page.",
      );
      return [];
    }
  } else if (Array.isArray(otherImages)) {
    return otherImages;
  } else {
    toast.error(
      "Invalid product image format. Please try refreshing the page.",
    );
    return [];
  }
}
