// Import necessary dependencies
import React, { useState, useEffect } from "react";
import { Trash, Eye, Lightning } from "react-bootstrap-icons";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useToggleFlashSaleMutation,
} from "../../features/admins/adminsApi";
import Loading from "../../components/ui/Loading";
import Error from "../../components/ui/Error";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Define the Productspage component
// This component displays a list of products with search and pagination functionality
export default function Productspage() {
  // State for managing current page, search term, and debounced search term
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const navigate = useNavigate();

  // Effect for debouncing the search term
  // This prevents excessive API calls while the user is typing
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Fetch products data using the useGetProductsQuery hook
  const { data, isLoading, isError, error, refetch } = useGetProductsQuery({
    page: currentPage,
    limit: 20, // Make sure this matches the limit in your API call
    searchTerm: debouncedSearchTerm,
  });

  // Hook for deleting a product
  const [deleteProduct] = useDeleteProductMutation();

  // Hook for toggling flash sale
  const [toggleFlashSale] = useToggleFlashSaleMutation();

  // Display loading component while data is being fetched
  if (isLoading) {
    return <Loading />;
  }

  // Display error component if there's an error fetching data
  if (isError) {
    toast.error(
      `Error fetching products: ${error?.data || "An unexpected error occurred"}`,
    );
    return (
      <Error>Error: {error?.data || "An unexpected error occurred"}</Error>
    );
  }

  // Display error component if no products are found
  if (!data || !data.products || data.products.length === 0) {
    return <Error>No products found</Error>;
  }

  // Handler for viewing a product
  const handleView = (id) => {
    navigate(`/product/${id}`);
  };

  // Handler for deleting a product
  const handleDelete = async (id) => {
    try {
      await deleteProduct(id).unwrap();
      toast.success("Product deleted successfully");
      // Optionally refetch the products or update the local state
    } catch (error) {
      toast.error(`Failed to delete product: ${error.message}`);
    }
  };

  // Handler for toggling flash sale
  const handleToggleFlashSale = async (id, currentStatus) => {
    try {
      await toggleFlashSale({ id, flash_sale: !currentStatus }).unwrap();
      toast.success(
        `Flash sale ${!currentStatus ? "enabled" : "disabled"} successfully`,
        {
          icon: !currentStatus ? "⚡" : "🚫",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        },
      );
      // Optionally refetch the products or update the local state
      refetch();
    } catch (error) {
      toast.error(`Failed to update flash sale status: ${error.message}`, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  // Render the products table and pagination
  return (
    <div className="container mx-auto px-4">
      <h1 className="mb-4 text-2xl font-bold">Products</h1>
      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded border p-2"
        />
      </div>
      {/* Products table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-300">
            <tr>
              <th className="table-header">ID</th>
              <th className="table-header">Name</th>
              <th className="table-header">Price</th>
              <th className="table-header">Seller ID</th>
              <th className="table-header">Flash Sale</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data?.products.map((product) => (
              <tr key={product.product_id}>
                <td className="whitespace-nowrap px-6 py-4">
                  {product.product_id}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {product.product_name}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  ${product.product_price}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {product.seller_id}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <button
                    onClick={() =>
                      handleToggleFlashSale(
                        product.product_id,
                        product.flash_sale,
                      )
                    }
                    className={`rounded px-3 py-1 ${
                      product.flash_sale
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {product.flash_sale ? (
                      <>
                        <Lightning className="mr-1 inline-block" />
                        Active
                      </>
                    ) : (
                      "Inactive"
                    )}
                  </button>
                </td>
                <td className="space-x-3 whitespace-nowrap px-6 py-4">
                  <button
                    onClick={() => handleDelete(product.product_id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash className="mr-1 inline-block" /> Delete
                  </button>
                  <button
                    onClick={() => handleView(product.product_id)}
                    className="text-green-600 hover:text-green-900"
                  >
                    <Eye className="mr-1 inline-block" /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        {[...Array(data?.totalPages).keys()].map((number) => (
          <button
            key={number + 1}
            className={`mx-1 rounded px-3 py-1 ${
              number + 1 === currentPage
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setCurrentPage(number + 1)}
          >
            {number + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
