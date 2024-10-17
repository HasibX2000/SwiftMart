// Import necessary dependencies and components
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "../../components/ui/Container";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../../features/sellers/sellersApi";
import toast from "react-hot-toast";

// Define available product categories
const categories = [
  "Audio",
  "Automotive",
  "Cameras",
  "Computers",
  "Fashion",
  "Gaming",
  "Groceries",
  "Home & Furniture",
  "Home & Lighting",
  "Phones",
  "Speakers",
  "Tools & Hardware",
  "Toys",
  "TVs",
  "Wearables",
];

// EditProductPage component for editing existing products
export default function EditProductPage() {
  // Get productId from URL parameters
  const { productId } = useParams();
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Fetch product data using RTK Query
  const {
    data: product,
    isLoading,
    isError,
  } = useGetProductByIdQuery(productId);

  // Mutation hook for updating product
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  // State for form fields
  const [productName, setProductName] = useState("");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [price, setPrice] = useState("");
  const [productDetails, setProductDetails] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [featuredImageFile, setFeaturedImageFile] = useState(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Effect to populate form fields when product data is fetched
  useEffect(() => {
    if (product) {
      setProductName(product.product_name);
      setFeaturedImage(product.featured_image);
      setAdditionalImages(product.other_images || []);
      setPrice(product.product_price?.toString() || "");
      setProductDetails(product.product_desc || "");
      setSelectedCategories(product.product_category || []);
    }
  }, [product]);

  // Handler for featured image change
  const handleFeaturedImageChange = (e) => {
    if (e.target.files[0]) {
      setFeaturedImageFile(e.target.files[0]);
      setFeaturedImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Handler for additional images change
  const handleAdditionalImagesChange = (e) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).slice(0, 3);
      setAdditionalImageFiles(newImages);
      setAdditionalImages(newImages.map(URL.createObjectURL));
    }
  };

  // Handler for category selection
  const handleCategoryChange = (e) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setSelectedCategories(selected.slice(0, 3));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      // Attempt to update the product using the mutation
      await updateProduct({
        productId,
        updatedProduct: {
          product_name: productName,
          product_price: parseFloat(price),
          product_desc: productDetails,
          featured_image: featuredImageFile || featuredImage,
          other_images:
            additionalImageFiles.length > 0
              ? additionalImageFiles
              : additionalImages,
          product_category: selectedCategories,
        },
      }).unwrap();

      // Show success message and navigate to seller products page
      toast.success("Product updated successfully!");
      navigate("/seller/products");
    } catch (err) {
      // Handle errors
      toast.error("Failed to update product. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Show loading state while fetching product data
  if (isLoading) return <div>Loading...</div>;
  // Show error state if there's an error fetching product data
  if (isError) return <div>Error loading product</div>;
  // Show not found state if product doesn't exist
  if (!product) return <div>Product not found</div>;

  // Render the edit product form
  return (
    <Container>
      <h1 className="mb-6 text-2xl font-bold">Edit Product</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl">
        {/* Product Name Input */}
        <div className="mb-4">
          <label
            htmlFor="productName"
            className="mb-2 block font-bold text-gray-700"
          >
            Product Name
          </label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
            required
          />
        </div>

        {/* Featured Image Input */}
        <div className="mb-4">
          <label
            htmlFor="featuredImage"
            className="mb-2 block font-bold text-gray-700"
          >
            Featured Image
          </label>
          <input
            type="file"
            id="featuredImage"
            onChange={handleFeaturedImageChange}
            className="w-full rounded-md border px-3 py-2"
            accept="image/*"
          />
          {featuredImage && (
            <img
              src={featuredImage}
              alt="Featured"
              className="mt-2 h-40 w-40 object-cover"
            />
          )}
        </div>

        {/* Additional Images Input */}
        <div className="mb-4">
          <label
            htmlFor="additionalImages"
            className="mb-2 block font-bold text-gray-700"
          >
            Additional Images (up to 3)
          </label>
          <input
            type="file"
            id="additionalImages"
            onChange={handleAdditionalImagesChange}
            className="w-full rounded-md border px-3 py-2"
            accept="image/*"
            multiple
          />
          <div className="mt-2 flex space-x-2">
            {additionalImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Additional ${index + 1}`}
                className="h-40 w-40 object-cover"
              />
            ))}
          </div>
        </div>

        {/* Price Input */}
        <div className="mb-4">
          <label htmlFor="price" className="mb-2 block font-bold text-gray-700">
            Price
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
            step="0.01"
            min="0"
            required
          />
        </div>

        {/* Product Details Input */}
        <div className="mb-4">
          <label
            htmlFor="productDetails"
            className="mb-2 block font-bold text-gray-700"
          >
            Product Details
          </label>
          <textarea
            id="productDetails"
            value={productDetails}
            onChange={(e) => setProductDetails(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
            rows="4"
            required
          ></textarea>
        </div>

        {/* Categories Selection */}
        <div className="mb-4">
          <label
            htmlFor="categories"
            className="mb-2 block font-bold text-gray-700"
          >
            Categories (select up to 3)
          </label>
          <select
            id="categories"
            multiple
            value={selectedCategories}
            onChange={handleCategoryChange}
            className="w-full rounded-md border px-3 py-2"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="mb-4 flex items-center">
          <button
            type="submit"
            className="flex items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-white"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <span className="mr-2">Updating...</span>
                <div
                  className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                >
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                    Loading...
                  </span>
                </div>
              </>
            ) : (
              "Update Product"
            )}
          </button>
        </div>
      </form>
    </Container>
  );
}
