// Import necessary dependencies
import { apiSlice } from "../api/apiSlice";
import supabase from "../../configs/supabase";
import toast from "react-hot-toast";

// Define and export the sellersApi slice
// This slice contains endpoints for seller-related operations
export const sellersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint for getting the total number of products for a seller
    getSellerTotalProducts: builder.query({
      async queryFn(sellerId) {
        try {
          // Query Supabase for the count of products for the given seller
          const { count, error } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .eq("seller_id", sellerId);

          if (error) {
            toast.error("Failed to fetch total products");
            return { error: "Failed to fetch total products" };
          }

          return { data: count };
        } catch (error) {
          toast.error("An unexpected error occurred");
          return { error: "An unexpected error occurred" };
        }
      },
      // Provide tags for cache invalidation
      providesTags: (result, error, sellerId) => [
        { type: "SellerTotalProducts", id: sellerId },
      ],
    }),

    // Endpoint for getting the total sales for a seller
    getSellerTotalSales: builder.query({
      async queryFn(sellerId) {
        try {
          // Query Supabase for products and their sales data for the given seller
          const { data, error } = await supabase
            .from("products")
            .select("product_price, total_sales")
            .eq("seller_id", sellerId);

          if (error) {
            toast.error(`Supabase error: ${error.message}`);
            return { error: error.message };
          }

          // Calculate total sales
          const totalSales = data.reduce((sum, product) => {
            const productSales =
              Math.round(product.product_price * product.total_sales * 100) /
              100;
            return sum + productSales;
          }, 0);

          return { data: totalSales };
        } catch (error) {
          toast.error(`Unexpected error: ${error.message}`);
          return { error: error.message };
        }
      },
      // Provide tags for cache invalidation
      providesTags: (result, error, sellerId) => [
        { type: "SellerTotalSales", id: sellerId },
      ],
    }),

    // Endpoint for getting the total number of orders for a seller
    getTotalOrders: builder.query({
      async queryFn(sellerId) {
        try {
          // Query Supabase for the total sales of all products for the given seller
          const { data, error } = await supabase
            .from("products")
            .select("total_sales")
            .eq("seller_id", sellerId);

          if (error) {
            toast.error(`Supabase error: ${error.message}`);
            return { error: error.message };
          }

          // Sum up total orders
          const totalOrders = data.reduce(
            (sum, product) => sum + product.total_sales,
            0,
          );

          return { data: totalOrders };
        } catch (error) {
          toast.error(`Unexpected error: ${error.message}`);
          return { error: error.message };
        }
      },
      // Provide tags for cache invalidation
      providesTags: (result, error, sellerId) => [
        { type: "SellerTotalOrders", id: sellerId },
      ],
    }),

    // Endpoint for getting all products for a seller
    getSellerProducts: builder.query({
      async queryFn(sellerId) {
        try {
          // Query Supabase for all products of the given seller
          const { data, error } = await supabase
            .from("products")
            .select("product_name, product_price, total_sales, product_id")
            .eq("seller_id", sellerId);

          if (error) {
            toast.error(`Supabase error: ${error.message}`);
            return { error: error.message };
          }

          return { data };
        } catch (error) {
          toast.error(`Unexpected error: ${error.message}`);
          return { error: error.message };
        }
      },
      // Provide tags for cache invalidation
      providesTags: (result, error, sellerId) => [
        { type: "SellerProducts", id: sellerId },
        ...(result
          ? result.map(({ product_id }) => ({
              type: "Product",
              id: product_id,
            }))
          : []),
      ],
    }),

    // Endpoint for getting a specific product by ID
    getProductById: builder.query({
      async queryFn(productId) {
        try {
          // Query Supabase for a specific product
          const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("product_id", productId)
            .single();

          if (error) {
            if (error.code === "PGRST116") {
              // No product found
              return { data: null };
            }
            toast.error(`Supabase error: ${error.message}`);
            return { error: error.message };
          }

          return { data };
        } catch (error) {
          toast.error(`Unexpected error: ${error.message}`);
          return { error: error.message };
        }
      },
    }),

    // Endpoint for updating a product
    updateProduct: builder.mutation({
      async queryFn({ productId, updatedProduct }) {
        try {
          // Upload new featured image if provided
          let featuredImageUrl = updatedProduct.featured_image;
          if (updatedProduct.featured_image instanceof File) {
            const { data: featuredImageData, error: featuredImageError } =
              await supabase.storage
                .from("products")
                .upload(
                  `${productId}/featured_image`,
                  updatedProduct.featured_image,
                  {
                    upsert: true,
                  },
                );

            if (featuredImageError) {
              toast.error(
                `Error uploading featured image: ${featuredImageError.message}`,
              );
              return { error: featuredImageError.message };
            }

            featuredImageUrl = supabase.storage
              .from("products")
              .getPublicUrl(`${productId}/featured_image`).data.publicUrl;
          }

          // Upload new additional images if provided
          const otherImageUrls = [];
          for (let i = 0; i < updatedProduct.other_images.length; i++) {
            let imageUrl = updatedProduct.other_images[i];
            if (updatedProduct.other_images[i] instanceof File) {
              const { data: otherImageData, error: otherImageError } =
                await supabase.storage
                  .from("products")
                  .upload(
                    `${productId}/other_image_${i}`,
                    updatedProduct.other_images[i],
                    {
                      upsert: true,
                    },
                  );

              if (otherImageError) {
                toast.error(
                  `Error uploading other image ${i}: ${otherImageError.message}`,
                );
                return { error: otherImageError.message };
              }

              imageUrl = supabase.storage
                .from("products")
                .getPublicUrl(`${productId}/other_image_${i}`).data.publicUrl;
            }
            otherImageUrls.push(imageUrl);
          }

          // Update product in the database
          const { data, error } = await supabase
            .from("products")
            .update({
              product_name: updatedProduct.product_name,
              product_price: updatedProduct.product_price,
              featured_image: featuredImageUrl,
              other_images: otherImageUrls,
              product_desc: updatedProduct.product_desc,
              product_category: updatedProduct.product_category,
            })
            .eq("product_id", productId)
            .select();

          if (error) {
            toast.error(`Supabase error: ${error.message}`);
            return { error: error.message };
          }

          return { data: data[0] };
        } catch (error) {
          toast.error(`Unexpected error: ${error.message}`);
          return { error: error.message };
        }
      },
      // Invalidate relevant cache tags after update
      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
        "SellerProducts",
      ],
    }),

    // Endpoint for deleting a product
    deleteProduct: builder.mutation({
      async queryFn(productId) {
        try {
          // Delete the product from the database
          const { error } = await supabase
            .from("products")
            .delete()
            .eq("product_id", productId);

          if (error) {
            toast.error(`Supabase error: ${error.message}`);
            return { error: error.message };
          }

          return { data: { success: true } };
        } catch (error) {
          toast.error(`Unexpected error: ${error.message}`);
          return { error: error.message };
        }
      },
      // Invalidate relevant cache tags after deletion
      invalidatesTags: (result, error, productId) => [
        { type: "Product", id: productId },
        "SellerProducts",
        "SellerTotalProducts",
      ],
    }),

    // Endpoint for adding a new product
    addProduct: builder.mutation({
      async queryFn(productData) {
        try {
          // Get the last product ID
          const { data: lastProduct, error: lastProductError } = await supabase
            .from("products")
            .select("product_id")
            .order("product_id", { ascending: false })
            .limit(1);

          if (lastProductError) {
            toast.error("Failed to fetch last product ID");
            return { error: "Failed to fetch last product ID" };
          }

          // Generate new product ID
          let newProductId = "PRD00001";
          if (lastProduct && lastProduct.length > 0) {
            const lastId = parseInt(lastProduct[0].product_id.slice(3));
            newProductId = `PRD${String(lastId + 1).padStart(5, "0")}`;
          }

          // Upload featured image
          const { data: featuredImageData, error: featuredImageError } =
            await supabase.storage
              .from("products")
              .upload(
                `${newProductId}/featured_image`,
                productData.featured_image,
              );

          if (featuredImageError) {
            toast.error("Failed to upload featured image");
            return { error: "Failed to upload featured image" };
          }

          const featuredImageUrl = supabase.storage
            .from("products")
            .getPublicUrl(`${newProductId}/featured_image`).data.publicUrl;

          // Upload other images
          const otherImageUrls = [];
          for (let i = 0; i < productData.other_images.length; i++) {
            const { data: otherImageData, error: otherImageError } =
              await supabase.storage
                .from("products")
                .upload(
                  `${newProductId}/other_image_${i}`,
                  productData.other_images[i],
                );

            if (otherImageError) {
              toast.error("Failed to upload other images");
              return { error: "Failed to upload other images" };
            }

            const otherImageUrl = supabase.storage
              .from("products")
              .getPublicUrl(`${newProductId}/other_image_${i}`).data.publicUrl;
            otherImageUrls.push(otherImageUrl);
          }

          // Insert new product
          const { data, error } = await supabase
            .from("products")
            .insert({
              product_id: newProductId,
              seller_id: productData.seller_id,
              product_name: productData.product_name,
              product_price: productData.product_price,
              total_sales: 0,
              flash_sale: false,
              featured_image: featuredImageUrl,
              other_images: otherImageUrls,
              product_desc: productData.product_desc,
              product_category: productData.product_category,
            })
            .select();

          if (error) {
            toast.error("Failed to insert new product");
            return { error: "Failed to insert new product" };
          }

          return { data: data[0] };
        } catch (error) {
          toast.error("An unexpected error occurred");
          return { error: "An unexpected error occurred" };
        }
      },
      // Invalidate relevant cache tags after adding a new product
      invalidatesTags: ["SellerProducts", "SellerTotalProducts"],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetSellerTotalProductsQuery,
  useGetSellerTotalSalesQuery,
  useGetTotalOrdersQuery,
  useGetSellerProductsQuery,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useAddProductMutation,
} = sellersApi;
