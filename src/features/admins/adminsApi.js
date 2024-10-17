// Import necessary dependencies
import { apiSlice } from "../api/apiSlice";
import supabase from "../../configs/supabase";
import toast from "react-hot-toast";

// Define and export the adminsApi slice
// This slice contains endpoints for various admin-related operations
export const adminsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint for fetching admin statistics
    getAdminStats: builder.query({
      queryFn: async () => {
        try {
          // Calculate the date 30 days ago for filtering recent data
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          const formattedDate = thirtyDaysAgo.toISOString();

          // Fetch multiple datasets concurrently using Promise.all
          const [
            { count: productCount },
            { count: orderCount },
            { data: salesData },
            { data: last30DaysData },
          ] = await Promise.all([
            // Fetch total product count
            supabase
              .from("products")
              .select("*", { count: "exact", head: true }),
            // Fetch total order count
            supabase.from("orders").select("*", { count: "exact", head: true }),
            // Fetch all order totals
            supabase.from("orders").select("total_count"),
            // Fetch orders from the last 30 days
            supabase
              .from("orders")
              .select("created_at, total_count")
              .gte("created_at", formattedDate)
              .order("created_at"),
          ]);

          // Calculate total sales
          const totalSales = salesData.reduce(
            (sum, order) => sum + (order.total_count || 0),
            0,
          );

          // Group sales by day for the last 30 days
          const salesByDay = last30DaysData.reduce((acc, order) => {
            const day = new Date(order.created_at).toISOString().split("T")[0];
            acc[day] = (acc[day] || 0) + (order.total_count || 0);
            return acc;
          }, {});

          // Format sales data for the last 30 days
          const last30DaysSales = Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const day = date.toISOString().split("T")[0];
            return {
              day: `Day ${30 - i}`,
              date: day,
              sales: salesByDay[day] || 0,
            };
          }).reverse();

          // Return the compiled statistics
          return {
            data: {
              productCount,
              orderCount,
              totalSales,
              last30DaysSales,
            },
          };
        } catch (error) {
          return { error: "Failed to fetch admin stats" };
        }
      },
    }),

    // Endpoint for fetching products with pagination and search
    getProducts: builder.query({
      queryFn: async ({ page = 1, limit = 20, searchTerm = "" }) => {
        try {
          let query = supabase.from("products").select("*", { count: "exact" });

          // Apply search filter if a search term is provided
          if (searchTerm) {
            query = query.ilike("product_name", `%${searchTerm}%`);
          }

          // Fetch products with pagination
          const { data, count, error } = await query
            .range((page - 1) * limit, page * limit - 1)
            .order("product_id", { ascending: true });

          if (error) {
            toast.error(`Supabase error: ${error.message}`);
            return {
              error: {
                status: error.code,
                data: error.message,
                details: error.details,
              },
            };
          }

          if (!data) {
            toast.error("No data returned from Supabase");
            return { error: { status: 404, data: "No data found" } };
          }

          // Return formatted product data with pagination info
          return {
            data: {
              products: data,
              totalCount: count || 0,
              currentPage: page,
              totalPages: Math.ceil((count || 0) / limit),
            },
          };
        } catch (error) {
          toast.error(`Unexpected error in getProducts: ${error.message}`);
          return {
            error: { status: 500, data: error.message, stack: error.stack },
          };
        }
      },
    }),

    // Endpoint for deleting a product
    deleteProduct: builder.mutation({
      queryFn: async (productId) => {
        try {
          const { error } = await supabase
            .from("products")
            .delete()
            .eq("id", productId);

          if (error) throw error;

          return { data: { success: true, id: productId } };
        } catch (error) {
          toast.error(`Error in deleteProduct: ${error.message}`);
          return { error: { status: 500, data: error.message } };
        }
      },
    }),

    // ... (other endpoints like getOrders, getOrderDetails, etc.)
  }),
});

// Export the auto-generated hooks for use in components
export const {
  useGetAdminStatsQuery,
  useGetProductsQuery,
  useDeleteProductMutation,
  useGetOrdersQuery,
  useGetAdminOrderTrackingQuery,
  useUpdateOrderStatusMutation,
} = adminsApi;
