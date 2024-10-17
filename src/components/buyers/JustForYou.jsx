// Import necessary dependencies
import React from "react";
import ProductCard from "../products/ProductCard";
import { useGetJustForYouProductsQuery } from "../../features/products/productsApi";
import Loading from "../ui/Loading";
import Error from "../ui/Error";

// Define the JustForYou component
// This component displays personalized product recommendations for the user
export default function JustForYou() {
  // Use the custom hook to fetch personalized product recommendations
  // This hook manages the API call and returns data, loading state, and error information
  const {
    data: products,
    isLoading,
    error,
    isError,
  } = useGetJustForYouProductsQuery();

  // If the data is still loading, display a loading spinner
  if (isLoading) return <Loading />;

  // If there's an error fetching the data, display an error message
  if (error) return <Error> {error.message}</Error>;

  // Render the JustForYou section with personalized product recommendations
  return (
    <div className="space-y-5 py-5">
      {/* Section title */}
      <div className="border-b py-2">
        <h2 className="text-2xl font-semibold text-primary">Just For You</h2>
      </div>

      {/* Grid layout for product cards */}
      <div className="grid grid-cols-1 gap-5 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {/* Render ProductCard components for each recommended product */}
        {!isLoading &&
          !isError &&
          products.map((product) => (
            <ProductCard
              key={product.product_id}
              productData={product}
              isLoading={isLoading}
            />
          ))}
      </div>
    </div>
  );
}
