// Import necessary dependencies
import { useGetProductQuery } from "../../features/products/productsApi";
import Loading from "../ui/Loading";
import Error from "../ui/Error";

// CartItem component: Displays a single item in the shopping cart
const CartItem = ({ productId, quantity, handleQuantityChange }) => {
  // Fetch product data using the useGetProductQuery hook
  const {
    data: productData,
    isLoading,
    isError,
    error,
  } = useGetProductQuery(productId);

  // Handle loading and error states
  if (isLoading) return <Loading />;
  if (isError) return <Error>{error.message}</Error>;
  if (!productData) return <Error>Product not found</Error>;

  return (
    <div className="mb-4 flex items-center justify-between rounded-lg border p-4 shadow-sm transition-shadow duration-300 hover:shadow-md">
      {/* Product image and details */}
      <div className="flex items-center space-x-4">
        <img
          src={productData.featured_image}
          alt={productData.product_name}
          className="h-20 w-20 rounded-md object-cover"
        />
        <div>
          <h3 className="text-lg font-semibold">{productData.product_name}</h3>
          <p className="text-gray-600">${productData.product_price}</p>
        </div>
      </div>

      {/* Quantity controls and remove button */}
      <div className="flex flex-col items-end space-y-2">
        <div className="flex items-center space-x-2">
          {/* Decrease quantity button */}
          <button
            onClick={() => handleQuantityChange(productId, quantity - 1)}
            className="rounded-full bg-gray-200 px-2 py-1 text-sm font-bold"
          >
            -
          </button>
          <span>{quantity}</span>
          {/* Increase quantity button */}
          <button
            onClick={() => handleQuantityChange(productId, quantity + 1)}
            className="rounded-full bg-gray-200 px-2 py-1 text-sm font-bold"
          >
            +
          </button>
        </div>
        {/* Remove item button */}
        <button
          onClick={() => handleQuantityChange(productId, 0)}
          className="text-sm font-medium text-red-500 hover:text-red-700"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
