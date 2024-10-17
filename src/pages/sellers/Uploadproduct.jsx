import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../components/ui/Container";
import { useAddProductMutation } from "../../features/sellers/sellersApi";
import useAuth from "../../hooks/useAuth";
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

// UploadProductPage component for sellers to add new products
export default function UploadProductPage() {
  // Get user ID from authentication hook
  const { userId } = useAuth();
  // Use the addProduct mutation from the sellers API
  const [addProduct] = useAddProductMutation();
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // State for form fields
  const [productName, setProductName] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [additionalImages, setAdditionalImages] = useState([]);
  const [price, setPrice] = useState("");
  const [productDetails, setProductDetails] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  // State for image files
  const [featuredImageFile, setFeaturedImageFile] = useState(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);

  // State to track upload progress
  const [isUploading, setIsUploading] = useState(false);

  // Handler for featured image selection
  const handleFeaturedImageChange = (e) => {
    if (e.target.files[0]) {
      setFeaturedImageFile(e.target.files[0]);
      setFeaturedImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Handler for additional images selection
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

    // Validation checks
    if (!featuredImage) {
      toast.error("Please select a featured image.");
      setIsUploading(false);
      return;
    }

    if (additionalImages.length > 3) {
      toast.error("You can only upload up to 3 additional images.");
      setIsUploading(false);
      return;
    }

    if (selectedCategories.length > 3) {
      toast.error("You can select up to 3 categories.");
      setIsUploading(false);
      return;
    }

    try {
      // Attempt to add the product using the mutation
      const result = await addProduct({
        seller_id: userId,
        product_name: productName,
        product_price: parseFloat(price),
        product_desc: productDetails,
        featured_image: featuredImageFile,
        other_images: additionalImageFiles,
        product_category: selectedCategories,
      }).unwrap();

      // Show success message and navigate to seller products page
      toast.success("Product added successfully!");
      navigate("/seller/products");
    } catch (err) {
      // Handle errors
      toast.error("Failed to add product. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Render the upload product form
  return (
    <Container>
      <h1 className="mb-6 text-2xl font-bold">Upload New Product</h1>
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
            required
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
        <div className="mb-4">
          <button
            type="submit"
            className="flex items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-white"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <span className="mr-2">Uploading...</span>
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
              "Upload Product"
            )}
          </button>
        </div>
      </form>
    </Container>
  );
}
