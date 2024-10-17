// Import necessary dependencies
import React from "react";
import ProductCard from "../products/ProductCard";
import { useGetRelatedProductsQuery } from "../../features/products/productsApi";
import Loading from "../ui/Loading";
import Error from "../ui/Error";

// Define the RelatedProducts component
// This component displays a list of products related to the current product
export default function RelatedProducts({ product_id }) {
  // Fetch related products data using the useGetRelatedProductsQuery hook
  // This hook manages the API call and returns data, loading state, and error information
  const {
    data: relatedProducts,
    isLoading,
    isError,
    error,
  } = useGetRelatedProductsQuery(product_id, {
    skip: !product_id,
  });

  // Show loading spinner while data is being fetched
  if (isLoading) return <Loading />;

  // Display error message if there's an error fetching data
  if (isError) return <Error>{error.message}</Error>;

  // Render the RelatedProducts section
  return (
    <div className="space-y-3 py-5">
      {/* Related Products section title */}
      <div className="border-b py-2">
        <h2 className="text-2xl font-semibold text-primary">
          Related Products
        </h2>
      </div>

      {/* Grid layout for displaying related product cards */}
      <div className="grid grid-cols-1 gap-5 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {relatedProducts && relatedProducts.length > 0 ? (
          // Map through related products and render ProductCard for each
          relatedProducts.map((product) => (
            <ProductCard key={product.product_id} productData={product} />
          ))
        ) : (
          // Display message when no related products are found
          <div>No related products found.</div>
        )}
      </div>
    </div>
  );
}
