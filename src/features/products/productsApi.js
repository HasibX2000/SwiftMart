// Import necessary dependencies
import supabase from "../../configs/supabase";
import { apiSlice } from "../api/apiSlice";

/**
 * Products API slice
 * Extends the main API slice with product-related endpoints
 */
export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get products for flash sale
     */
    getFlashSaleProducts: builder.query({
      queryFn: async () => {
        try {
          // Fetch products marked for flash sale from Supabase
          const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("flash_sale", true)
            .limit(6);

          if (error) throw error;
          return { data };
        } catch (error) {
          return { error: { status: error.code, data: error.message } };
        }
      },
      providesTags: ["FlashSaleProducts"],
    }),

    /**
     * Get products for "Just For You" section
     */
    getJustForYouProducts: builder.query({
      queryFn: async () => {
        try {
          // Fetch a limited number of products for the "Just For You" section
          const { data, error } = await supabase
            .from("products")
            .select("*")
            .limit(10);

          if (error) throw error;
          return { data };
        } catch (error) {
          return { error: { status: error.code, data: error.message } };
        }
      },
      providesTags: ["JustForYouProducts"],
    }),

    /**
     * Get a single product by ID
     */
    getProduct: builder.query({
      queryFn: async (product_id) => {
        if (!product_id) {
          return { error: "Product ID is required" };
        }

        try {
          // Fetch a single product by its ID
          const { data, error } = await supabase
            .from("products")
            .select(
              "product_id, seller_id, product_name, product_price, featured_image, other_images, product_desc, product_category",
            )
            .eq("product_id", product_id)
            .single();

          if (error) throw error;
          return { data };
        } catch (error) {
          return { error: "Failed to fetch product" };
        }
      },
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    /**
     * Get related products
     */
    getRelatedProducts: builder.query({
      queryFn: async (product_id) => {
        if (!product_id) {
          return {
            error: { status: 400, data: { message: "Product ID is required" } },
          };
        }

        try {
          // Fetch the category of the given product
          const { data: product, error: productError } = await supabase
            .from("products")
            .select("product_category")
            .eq("product_id", product_id)
            .single();

          if (productError) throw productError;

          // Parse the categories
          const categories = product.product_category
            .slice(1, -1)
            .split(",")
            .map((cat) => cat.trim().replace(/^'|'$/g, ""));

          // Build a query to fetch related products
          let query = supabase
            .from("products")
            .select("*")
            .neq("product_id", product_id);

          categories.forEach((category, index) => {
            if (index === 0) {
              query = query.ilike("product_category", `%${category}%`);
            } else {
              query = query.or(`product_category.ilike.%${category}%`);
            }
          });

          // Execute the query
          const { data: relatedProducts, error: relatedError } =
            await query.limit(6);

          if (relatedError) throw relatedError;

          return { data: relatedProducts };
        } catch (error) {
          return {
            error: { status: 500, data: { message: error.message } },
          };
        }
      },
      providesTags: (result, error, id) => [{ type: "RelatedProducts", id }],
    }),

    /**
     * Get products by category
     */
    getProductsByCategory: builder.query({
      queryFn: async ({ categoryName, page = 1, pageSize = 20 }) => {
        try {
          let query = supabase.from("products").select("*", { count: "exact" });

          // Apply category filter if not "all"
          if (categoryName !== "all") {
            query = query.ilike("product_category", `%${categoryName}%`);
          }

          // Apply pagination
          const { data, error, count } = await query
            .range((page - 1) * pageSize, page * pageSize - 1)
            .order("product_name", { ascending: true });

          if (error) throw error;
          return { data: { products: data, totalCount: count } };
        } catch (error) {
          return { error: { status: error.code, data: error.message } };
        }
      },
      providesTags: (result, error, arg) => [
        { type: "ProductsByCategory", id: arg.categoryName },
        ...(result?.products?.map(({ product_id }) => ({
          type: "Product",
          id: product_id,
        })) || []),
      ],
    }),

    /**
     * Search products
     */
    searchProducts: builder.query({
      queryFn: async ({ query, filters }) => {
        try {
          let supabaseQuery = supabase
            .from("products")
            .select("*")
            .ilike("product_name", `%${query}%`);

          // Apply category filter
          if (filters.category) {
            supabaseQuery = supabaseQuery.ilike(
              "product_category",
              `%${filters.category}%`,
            );
          }

          // Apply price range filter
          if (filters.priceRange) {
            const [min, max] = filters.priceRange.split("-");
            if (min && max) {
              supabaseQuery = supabaseQuery
                .gte("product_price", min)
                .lte("product_price", max);
            } else if (min) {
              supabaseQuery = supabaseQuery.gte("product_price", min);
            }
          }

          // Apply sorting
          if (filters.sortBy) {
            switch (filters.sortBy) {
              case "price-low-high":
                supabaseQuery = supabaseQuery.order("product_price", {
                  ascending: true,
                });
                break;
              case "price-high-low":
                supabaseQuery = supabaseQuery.order("product_price", {
                  ascending: false,
                });
                break;
              // For "relevance", we don't need to change the order
            }
          }

          const { data, error } = await supabaseQuery;

          if (error) throw error;
          return { data };
        } catch (error) {
          return { error: { status: error.code, data: error.message } };
        }
      },
      providesTags: ["SearchResults"],
    }),

    /**
     * Get multiple products by their IDs
     */
    getMultipleProducts: builder.query({
      queryFn: async (productIds) => {
        if (!productIds || productIds.length === 0) {
          return { data: [] };
        }
        try {
          const { data, error } = await supabase
            .from("products")
            .select("*")
            .in("product_id", productIds);

          if (error) throw error;
          return { data };
        } catch (error) {
          return { error: { status: error.code, data: error.message } };
        }
      },
      providesTags: (result) =>
        result
          ? result.map(({ product_id }) => ({
              type: "Product",
              id: product_id,
            }))
          : [],
    }),
  }),
});

// Export the generated hooks for use in components
export const {
  useGetFlashSaleProductsQuery,
  useGetJustForYouProductsQuery,
  useGetProductQuery,
  useGetRelatedProductsQuery,
  useGetProductsByCategoryQuery,
  useSearchProductsQuery,
  useGetMultipleProductsQuery,
} = productsApi;
