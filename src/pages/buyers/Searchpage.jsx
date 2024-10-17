import React, { useState, useEffect } from "react";
import { useSearchProductsQuery } from "../../features/products/productsApi";
import Container from "../../components/ui/Container";
import Loading from "../../components/ui/Loading";
import Error from "../../components/ui/Error";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../../components/products/ProductCard";

export default function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const [filters, setFilters] = useState({
    category: "",
    priceRange: "",
    sortBy: "relevance",
  });

  const {
    data: searchResults,
    isLoading,
    isError,
    error,
  } = useSearchProductsQuery({ query: searchQuery, filters });

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  if (isLoading) return <Loading />;
  if (isError)
    return <Error message={error?.data?.message || "An error occurred"} />;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = searchResults?.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalPages = Math.ceil((searchResults?.length || 0) / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterType]: value }));
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <Container>
      <h1 className="mb-6 text-2xl font-bold">
        Search Results for "{searchQuery}"
      </h1>

      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-md border border-gray-300 p-2"
        />
      </form>

      <div className="mb-4 flex flex-wrap gap-4">
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          className="rounded-md border border-gray-300 p-2"
        >
          <option value="">All Categories</option>
          {/* Add category options here */}
        </select>

        <select
          value={filters.priceRange}
          onChange={(e) => handleFilterChange("priceRange", e.target.value)}
          className="rounded-md border border-gray-300 p-2"
        >
          <option value="">All Prices</option>
          <option value="0-50">$0 - $50</option>
          <option value="50-100">$50 - $100</option>
          <option value="100-">$100+</option>
        </select>

        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange("sortBy", e.target.value)}
          className="rounded-md border border-gray-300 p-2"
        >
          <option value="relevance">Relevance</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-5 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {currentProducts?.map((product, index) => (
          <ProductCard productData={product} key={index} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`mx-1 rounded px-3 py-1 ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </Container>
  );
}
