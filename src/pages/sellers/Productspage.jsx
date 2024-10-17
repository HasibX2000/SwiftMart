// Import necessary dependencies and components
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircle, Pencil, Trash, Eye } from "react-bootstrap-icons";
import Container from "../../components/ui/Container";
import {
  useGetSellerProductsQuery,
  useDeleteProductMutation,
} from "../../features/sellers/sellersApi";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

// ConfirmationPopup component for delete confirmation
const ConfirmationPopup = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end">
          <button
            className="mr-2 rounded bg-gray-300 px-4 py-2 text-gray-800"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="rounded bg-red-500 px-4 py-2 text-white"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// ProductsPage component to display and manage seller's products
export default function ProductsPage() {
  // Get user ID from auth hook
  const { userId } = useAuth();
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Use RTK Query hooks for fetching products and deleting a product
  const [deleteProduct] = useDeleteProductMutation();
  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetSellerProductsQuery(userId);

  // State for managing confirmation popup
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Handler for delete button click
  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setIsConfirmOpen(true);
  };

  // Handler for confirming product deletion
  const handleConfirmDelete = async () => {
    try {
      await deleteProduct(productToDelete).unwrap();
      refetch();
      setIsConfirmOpen(false);
      toast.success("Product deleted successfully");
    } catch (err) {
      toast.error("Failed to delete the product. Please try again.");
    }
  };

  // Show loading state while fetching products
  if (isLoading) return <div>Loading...</div>;

  // Show error state if there's an error fetching products
  if (isError) {
    toast.error(`Error: ${error.message}`);
    return <div>Error occurred. Please try again.</div>;
  }

  // Render the products page
  return (
    <Container>
      {/* Header section with title and "Upload New Product" button */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Products</h1>
        <Link
          to="/seller/add-product"
          className="flex items-center rounded-md bg-blue-500 px-4 py-2 text-white"
        >
          <PlusCircle className="mr-2" />
          Upload New Product
        </Link>
      </div>

      {/* Products table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          {/* Table header */}
          <thead>
            <tr className="bg-gray-200 text-sm uppercase leading-normal text-gray-600">
              <th className="px-6 py-3 text-left">S.No</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-right">Price</th>
              <th className="px-6 py-3 text-right">Total Orders</th>
              <th className="px-6 py-3 text-right">Total Sales</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          {/* Table body */}
          <tbody className="text-sm font-light text-gray-600">
            {products.map((product, index) => (
              <tr
                key={product.product_id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="whitespace-nowrap px-6 py-3 text-left">
                  <ol start={index + 1}>
                    <li>{index + 1}</li>
                  </ol>
                </td>
                <td className="px-6 py-3 text-left">{product.product_name}</td>
                <td className="px-6 py-3 text-right">
                  ${product.product_price}
                </td>
                <td className="px-6 py-3 text-right">{product.total_sales}</td>
                <td className="px-6 py-3 text-right">
                  ${product.total_sales * product.product_price}
                </td>
                {/* Action buttons */}
                <td className="px-6 py-3 text-center">
                  <Link
                    to={`/product/${product.product_id}`}
                    className="mr-2 inline-flex items-center rounded bg-green-500 px-2 py-1 text-white"
                  >
                    <Eye className="mr-1" />
                  </Link>
                  <Link
                    to={`/seller/edit-product/${product.product_id}`}
                    className="mr-2 inline-flex items-center rounded bg-blue-500 px-2 py-1 text-white"
                  >
                    <Pencil className="mr-1" />
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(product.product_id)}
                    className="inline-flex items-center rounded bg-red-500 px-2 py-1 text-white"
                  >
                    <Trash className="mr-1" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation popup for product deletion */}
      <ConfirmationPopup
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this product?"
      />
    </Container>
  );
}
