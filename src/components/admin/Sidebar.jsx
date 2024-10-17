// Import necessary dependencies
import React from "react";
import { Link } from "react-router-dom";
import { House, Cart, Box } from "react-bootstrap-icons";
import MainLogo from "../../assets/_Main_Logo.png";
import SmallLogo from "../../assets/_Main_Icon.png";

// Define the SidebarItem component
// This component renders individual items in the sidebar
const SidebarItem = ({ to, icon: Icon, label, expanded }) => (
  <Link
    to={to}
    className={`flex items-center p-4 text-gray-700 hover:bg-gray-200 ${
      expanded ? "justify-start" : "justify-center"
    }`}
  >
    <Icon size={20} />
    {expanded && <span className="ml-4">{label}</span>}
  </Link>
);

// Define the main Sidebar component
// This component renders the entire sidebar for the admin panel
export default function Sidebar({ expanded }) {
  return (
    <nav className="h-full">
      {/* Logo section */}
      <div className="p-4">
        <Link to="/">
          {expanded ? (
            // Display full logo when sidebar is expanded
            <img src={MainLogo} alt="Site Logo" />
          ) : (
            // Display small logo when sidebar is collapsed
            <img src={SmallLogo} alt="Site Logo" />
          )}
        </Link>
      </div>

      {/* Navigation items */}
      <ul>
        {/* Dashboard link */}
        <li>
          <SidebarItem
            to="/admin"
            icon={House}
            label="Dashboard"
            expanded={expanded}
          />
        </li>
        {/* Products link */}
        <li>
          <SidebarItem
            to="/admin/products"
            icon={Box}
            label="Products"
            expanded={expanded}
          />
        </li>
        {/* Orders link */}
        <li>
          <SidebarItem
            to="/admin/orders"
            icon={Cart}
            label="Orders"
            expanded={expanded}
          />
        </li>
      </ul>
    </nav>
  );
}
