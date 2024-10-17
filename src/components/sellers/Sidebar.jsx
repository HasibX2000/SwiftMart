// Import necessary dependencies
import React from "react";
import { Link } from "react-router-dom";
import { House, Box, Cart, Gear, PlusSquare } from "react-bootstrap-icons";
import MainLogo from "../../assets/_Main_Logo.png";
import SmallLogo from "../../assets/_Main_Icon.png";

// Define the SidebarItem component
// This component renders a single item in the sidebar, including an icon and label
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

// Define the Sidebar component
// This component renders the entire sidebar, including the logo and navigation items
export default function Sidebar({ expanded }) {
  return (
    <nav className="h-full">
      {/* Logo section */}
      {/* This section displays either the full logo or a small icon based on the sidebar's expanded state */}
      <div className="p-4">
        <Link to="/">
          {expanded ? (
            <img src={MainLogo} alt="Site Logo" />
          ) : (
            <img src={SmallLogo} alt="Site Logo" />
          )}
        </Link>
      </div>

      {/* Navigation items */}
      {/* This section lists all the navigation items in the sidebar */}
      <ul>
        <li>
          <SidebarItem
            to="/seller/dashboard"
            icon={House}
            label="Dashboard"
            expanded={expanded}
          />
        </li>
        <li>
          <SidebarItem
            to="/seller/products"
            icon={Box}
            label="Products"
            expanded={expanded}
          />
        </li>
        <li>
          <SidebarItem
            to="/seller/add-product"
            icon={PlusSquare}
            label="Add New"
            expanded={expanded}
          />
        </li>
        <li>
          <SidebarItem
            to="/seller/settings"
            icon={Gear}
            label="Settings"
            expanded={expanded}
          />
        </li>
      </ul>
    </nav>
  );
}
