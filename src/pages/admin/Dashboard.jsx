// Import necessary dependencies
import React from "react";
import { Box, Cart, CurrencyDollar } from "react-bootstrap-icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import StatCard from "../../components/admin/StatCard";
import { useGetAdminStatsQuery } from "../../features/admins/adminsApi";
import Loading from "../../components/ui/Loading";
import Error from "../../components/ui/Error";

// Define the Dashboard component
// This component displays an overview of key statistics and a sales chart for the admin
export default function Dashboard() {
  // Fetch admin statistics using the useGetAdminStatsQuery hook
  const {
    data: adminStats,
    isLoading,
    isError,
    error,
  } = useGetAdminStatsQuery();

  // Display loading component while data is being fetched
  if (isLoading) {
    return <Loading />;
  }

  // Display error component if there's an error fetching data
  if (isError || !adminStats) {
    return <Error>{error}</Error>;
  }

  // Destructure the required statistics from the fetched data
  const { productCount, orderCount, totalSales, last30DaysSales } = adminStats;

  // Render the dashboard with statistics cards and sales chart
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>

      {/* Statistics cards grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Products card */}
        <StatCard
          icon={<Box className="h-8 w-8" />}
          title="Total Products"
          value={productCount}
        />
        {/* Total Orders card */}
        <StatCard
          icon={<Cart className="h-8 w-8" />}
          title="Total Orders"
          value={orderCount}
        />
        {/* Total Sales card */}
        <StatCard
          icon={<CurrencyDollar className="h-8 w-8" />}
          title="Total Sales"
          value={`$${totalSales.toLocaleString()}`}
        />
        {/* Total Profit card (calculated as 25% of total sales) */}
        <StatCard
          icon={<CurrencyDollar className="h-8 w-8" />}
          title="Total Profit"
          value={`$${Math.round(totalSales * 0.25).toLocaleString()}`}
        />
      </div>

      {/* Sales chart section */}
      <div className="mt-12">
        <h2 className="mb-4 text-2xl font-semibold">Last 30 Days Sales</h2>
        <div className="rounded-lg bg-white p-4 shadow-md">
          {/* Responsive container for the BarChart */}
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={last30DaysSales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#F74B00" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
