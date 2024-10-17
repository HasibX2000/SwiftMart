// Import necessary dependencies and components
import React from "react";
import DashboardCard from "../../components/sellers/DashboardCard";
import {
  useGetSellerTotalProductsQuery,
  useGetSellerTotalSalesQuery,
  useGetTotalOrdersQuery,
} from "../../features/sellers/sellersApi";
import useAuth from "../../hooks/useAuth";
import Loading from "../../components/ui/Loading";

// SellerDashboard component to display key metrics for sellers
export default function SellerDashboard() {
  // Get the user ID from the authentication hook
  const { userId } = useAuth();

  // Fetch total products data using RTK Query
  const { data: totalProducts, isLoading: isLoadingTotalProducts } =
    useGetSellerTotalProductsQuery(userId);

  // Fetch total sales data using RTK Query
  const { data: totalSales, isLoading: isLoadingTotalSales } =
    useGetSellerTotalSalesQuery(userId);

  // Fetch total orders data using RTK Query
  const { data: totalOrders, isLoading: isLoadingTotalOrders } =
    useGetTotalOrdersQuery(userId);

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        Seller Dashboard
      </h1>

      {/* Show loading component while data is being fetched */}
      {isLoadingTotalProducts &&
        isLoadingTotalSales &&
        isLoadingTotalOrders && <Loading />}

      {/* Display dashboard cards when data is loaded */}
      {!isLoadingTotalProducts &&
        !isLoadingTotalSales &&
        !isLoadingTotalOrders && (
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Products Card */}
            <DashboardCard
              title="Total Products"
              value={totalProducts}
              color="#0088FE"
            />
            {/* Total Sales Card */}
            <DashboardCard
              title="Total Sales"
              value={`$ ${totalSales}`}
              color="#00C49F"
            />
            {/* Total Profit Card (calculated as 90% of total sales) */}
            <DashboardCard
              title="Total Profit"
              value={`$ ${(totalSales * 0.9).toFixed(2)}`}
              color="#FFBB28"
            />
            {/* Total Orders Card */}
            <DashboardCard
              title="Total Orders"
              value={totalOrders}
              color="#FF8042"
            />
          </div>
        )}
    </div>
  );
}
