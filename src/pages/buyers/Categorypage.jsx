// Import necessary dependencies
import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Container from "../../components/ui/Container";
import { useGetProductsByCategoryQuery } from "../../features/products/productsApi";
import ProductCard from "../../components/products/ProductCard";
import Error from "../../components/ui/Error";
import Loading from "../../components/ui/Loading";
import Pagination from "../../components/ui/Pagination";

// Define the CategoryPage component
// This component displays products for a specific category with pagination
export default function CategoryPage() {
  // Extract category name from URL parameters
  const { categoryName } = useParams();

  // Use search params for pagination
  // This allows for maintaining page state in the URL
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 5;

  // Fetch products for the current category and page
  // This query will re-run when the category, page, or pageSize changes
  const { data, isLoading, isError } = useGetProductsByCategoryQuery({
    categoryName,
    page: currentPage,
    pageSize,
  });

  // Extract products and total count from the query result
  // Provide default values to prevent errors if data is undefined
  const products = data?.products || [];
  const totalCount = data?.totalCount || 0;

  // Capitalize the first letter of the category name for display
  // Special handling for 'all' category
  const capitalizedCategoryName =
    categoryName === "all"
      ? "All"
      : categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  // Handle page change in pagination
  // Update the URL search params when the page changes
  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage.toString() });
  };

  // Show loading state while fetching data
  if (isLoading) {
    return <Loading />;
  }

  // Show error state if there's an issue fetching data
  if (isError) {
    return <div>Error loading products. Please try again later.</div>;
  }

  // Render the CategoryPage component
  return (
    <Container className="py-6">
      {/* Category title */}
      <h1 className="mb-6 text-center text-3xl font-bold text-primary">
        {capitalizedCategoryName} Products
      </h1>

      {/* Category description */}
      {products.length > 0 && (
        <p className="mb-6 text-center text-gray-600">
          Showing products for the{" "}
          {categoryName === "all"
            ? "all categories"
            : categoryName + " category"}
          .
        </p>
      )}

      {/* Grid of product cards */}
      <div className="mb-6 grid grid-cols-1 gap-5 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {products.map((product) => (
          <ProductCard key={product.product_id} productData={product} />
        ))}
      </div>

      {/* Show message if no products found */}
      {products.length === 0 && (
        <div className="mb-6">
          <Error>No products found in this category.</Error>
        </div>
      )}

      {/* Pagination component */}
      {totalCount > pageSize && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalCount / pageSize)}
          onPageChange={handlePageChange}
        />
      )}
    </Container>
  );
}
