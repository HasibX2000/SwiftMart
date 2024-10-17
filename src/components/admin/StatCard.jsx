// Import React for component creation
import React from "react";

// Define the StatCard component
// This component displays a statistic card with an icon, title, and value
export default function StatCard({ icon, title, value }) {
  return (
    // Main container for the stat card
    <div className="rounded-lg bg-white p-6 shadow-md">
      {/* Flex container for icon and text content */}
      <div className="flex items-center">
        {/* Icon container */}
        <div className="mr-4 rounded-full bg-orange-100 p-3 text-primary">
          {icon}
        </div>
        {/* Text content container */}
        <div>
          {/* Title of the statistic */}
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
          {/* Value of the statistic */}
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
