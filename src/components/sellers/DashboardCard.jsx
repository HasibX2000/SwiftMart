// Import necessary dependencies
import React from "react";

// Define the DashboardCard component
// This component displays a card with a title and value, used for summarizing key metrics on a dashboard
const DashboardCard = ({ title, value, color }) => (
  <div className="rounded-lg bg-white p-6 shadow-md">
    {/* Title section */}
    {/* This section displays the title of the metric or data point */}
    <h3 className="mb-2 text-lg font-semibold text-gray-600">{title}</h3>

    {/* Value section */}
    {/* This section displays the main value of the metric with custom color */}
    <p className="text-3xl font-bold" style={{ color }}>
      {value}
    </p>
  </div>
);

export default DashboardCard;
