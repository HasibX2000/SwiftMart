// Import necessary dependencies
import { apiSlice } from "../api/apiSlice";
import supabase from "../../configs/supabase";
import imageCompression from "browser-image-compression";
import toast from "react-hot-toast";

/**
 * Buyers API slice
 * Extends the main API slice with buyer-related endpoints
 */
export const buyersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get the buyer's profile information
     */
    getBuyerProfile: builder.query({
      queryFn: async () => {
        try {
          // Fetch the current user's data from Supabase
          const {
            data: { user },
            error,
          } = await supabase.auth.getUser();
          if (error) return { error: error.message };
          if (!user) return { error: "User not authenticated" };

          // Return the user's profile information
          return {
            data: {
              id: user.id,
              email: user.email,
              phone: user.phone,
              name: user.user_metadata.display_name || user.email,
              avatar_url: user.user_metadata.avatar_url,
            },
          };
        } catch (error) {
          return { error: "Failed to fetch buyer profile" };
        }
      },
      providesTags: ["BuyerProfile"],
    }),

    /**
     * Update the buyer's profile information
     */
    updateBuyerProfile: builder.mutation({
      queryFn: async ({ name }) => {
        try {
          // Update the user's metadata in Supabase
          const { data, error } = await supabase.auth.updateUser({
            data: { display_name: name },
          });

          if (error) return { error: error.message };
          return { data: data.user };
        } catch (error) {
          return { error: "Failed to update buyer profile" };
        }
      },
      // Optimistically update the local cache
      async onQueryStarted({ name }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          buyersApi.util.updateQueryData(
            "getBuyerProfile",
            undefined,
            (draft) => {
              if (draft) {
                draft.name = name;
              }
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    /**
     * Update the buyer's profile picture
     */
    updateBuyerProfilePicture: builder.mutation({
      async queryFn(file) {
        try {
          // Compress the image file
          const compressedFile = await compressImage(file);

          // Get the current user
          const {
            data: { user },
            error: authError,
          } = await supabase.auth.getUser();
          if (authError) throw authError;

          // Generate a unique filename
          const fileName = `${user.id}-${Date.now()}.webp`;
          const filePath = `${fileName}`;

          // Upload the compressed file to Supabase storage
          const { error: uploadError } = await supabase.storage
            .from("users")
            .upload(filePath, compressedFile);

          if (uploadError) throw uploadError;

          // Get the public URL of the uploaded file
          const { data: urlData, error: urlError } = supabase.storage
            .from("users")
            .getPublicUrl(filePath);

          if (urlError) throw urlError;

          // Update the user's avatar URL in their metadata
          const { data, error: updateError } = await supabase.auth.updateUser({
            data: { avatar_url: urlData.publicUrl },
          });

          if (updateError) throw updateError;

          return { data: data.user };
        } catch (error) {
          return { error: error.message };
        }
      },
      invalidatesTags: ["BuyerProfile"],
    }),

    /**
     * Get the buyer's order history with product details and total spend
     */
    getBuyerOrders: builder.query({
      queryFn: async () => {
        try {
          // Get the current user
          const {
            data: { user },
            error: authError,
          } = await supabase.auth.getUser();
          if (authError) return { error: authError.message };
          if (!user) return { error: "User not authenticated" };

          // Fetch the user's orders
          const { data: orders, error: orderError } = await supabase
            .from("orders")
            .select("*")
            .eq("buyer_id", user.id);

          if (orderError) {
            return { error: "Failed to fetch orders" };
          }

          // Get unique product IDs from all orders
          const productIds = [
            ...new Set(
              orders.flatMap((order) => JSON.parse(order.products_id)),
            ),
          ];

          // Fetch product details for all products in the orders
          const { data: products, error: productError } = await supabase
            .from("products")
            .select("product_id, product_price")
            .in("product_id", productIds);

          if (productError) {
            return { error: "Failed to fetch product details" };
          }

          // Create a map of product prices
          const productPrices = Object.fromEntries(
            products.map((product) => [
              product.product_id,
              product.product_price,
            ]),
          );

          // Calculate total for each order and overall total spend
          const ordersWithTotals = orders.map((order) => {
            const orderProducts = JSON.parse(order.products_id);
            const total = orderProducts.reduce(
              (sum, productId) => sum + (productPrices[productId] || 0),
              0,
            );
            return {
              ...order,
              total: total,
            };
          });

          const totalSpend = ordersWithTotals.reduce(
            (sum, order) => sum + order.total,
            0,
          );

          return {
            data: {
              orders: ordersWithTotals,
              totalSpend: totalSpend,
            },
          };
        } catch (error) {
          return { error: "An unexpected error occurred" };
        }
      },
    }),

    /**
     * Get order tracking information
     */
    getOrderTracking: builder.query({
      queryFn: async (orderId, { getState }) => {
        try {
          const state = getState();
          const user = state.auth.user;

          if (!user) {
            return {
              error: {
                status: 401,
                data: { message: "User not authenticated" },
              },
            };
          }

          // Fetch the order details
          const { data, error } = await supabase
            .from("orders")
            .select(
              "order_id, order_state, created_at, buyer_id, total_count, products_id",
            )
            .eq("order_id", orderId)
            .single();

          if (error) {
            return { error: { status: 500, data: { message: error.message } } };
          }

          // Check if the order belongs to the current user
          if (data.buyer_id !== user.id) {
            return {
              error: {
                status: 403,
                data: {
                  message: "You don't have permission to view this order.",
                },
              },
            };
          }

          // Fetch product details for the order
          const productIds = JSON.parse(data.products_id);
          const { data: products, error: productError } = await supabase
            .from("products")
            .select("product_id, product_name, product_price")
            .in("product_id", productIds);

          if (productError) {
            return {
              error: { status: 500, data: { message: productError.message } },
            };
          }

          // Create a map of product details
          const productMap = Object.fromEntries(
            products.map((product) => [product.product_id, product]),
          );

          // Combine order data with product details
          const orderWithProducts = {
            ...data,
            products: productIds.map((id) => ({
              ...productMap[id],
              quantity: 1, // Assuming quantity is always 1, adjust if needed
            })),
          };

          return { data: orderWithProducts };
        } catch (error) {
          return { error: "An unexpected error occurred" };
        }
      },
    }),

    /**
     * Place a new order
     */
    placeOrder: builder.mutation({
      async queryFn(orderData, { getState }) {
        try {
          const state = getState();
          const user = state.auth.user;

          if (!user) {
            throw new Error("User not authenticated");
          }

          // Get the latest order ID to generate a new one
          const { data: latestOrder, error: latestOrderError } = await supabase
            .from("orders")
            .select("order_id")
            .order("created_at", { ascending: false })
            .limit(1);

          if (latestOrderError) throw latestOrderError;

          // Generate a new order ID
          let newOrderId = "ORD00001";
          if (latestOrder && latestOrder.length > 0) {
            const latestOrderNumber = parseInt(
              latestOrder[0].order_id.slice(3),
            );
            newOrderId = `ORD${String(latestOrderNumber + 1).padStart(5, "0")}`;
          }

          // Insert the new order into the database
          const { data, error } = await supabase.from("orders").insert({
            order_id: newOrderId,
            created_at: new Date().toISOString(),
            products_id: JSON.stringify(orderData.productIds),
            buyer_id: user.id,
            order_state: "pending",
            total_count: orderData.totalAmount,
            shipping_address: JSON.stringify(orderData.shippingInfo),
            payment_method: orderData.paymentMethod,
          });

          if (error) throw error;

          return { data: { orderId: newOrderId } };
        } catch (error) {
          return { error: "Failed to place order" };
        }
      },
    }),
  }),
});

/**
 * Compress and convert image to WebP format
 * @param {File} file - The image file to compress
 * @returns {Promise<File>} - A promise that resolves to the compressed image file
 */
async function compressImage(file) {
  const options = {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: "image/webp",
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    toast.error(`Error compressing image: ${error.message}`);
    throw error;
  }
}

// Export the generated hooks for use in components
export const {
  useGetBuyerProfileQuery,
  useUpdateBuyerProfileMutation,
  useGetBuyerOrdersQuery,
  useUpdateBuyerProfilePictureMutation,
  useGetOrderTrackingQuery,
  usePlaceOrderMutation,
} = buyersApi;
