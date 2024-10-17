// Import necessary dependencies
import React from "react";
import ProductCard from "../products/ProductCard";
import { useGetFlashSaleProductsQuery } from "../../features/products/productsApi";
import Loading from "../ui/Loading";
import Error from "../ui/Error";

// FlashSale component: Displays a grid of products currently on flash sale
export default function FlashSale() {
  // Fetch flash sale products data using the useGetFlashSaleProductsQuery hook
  const {
    data: products,
    isLoading,
    error,
    isError,
  } = useGetFlashSaleProductsQuery();

  // Show loading spinner while data is being fetched
  if (isLoading) return <Loading />;

  // Display error message if there's an error fetching data
  if (error) return <Error> {error.message}</Error>;

  return (
    <div className="space-y-5 py-5">
      {/* Flash Sale section title */}
      <h2 className="border-b py-2 text-2xl font-semibold text-primary">
        Flash Sale OnGoing!
      </h2>

      {/* Grid layout for displaying product cards */}
      <div className="grid grid-cols-1 gap-5 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {/* Render ProductCard components for each product if data is loaded successfully */}
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
