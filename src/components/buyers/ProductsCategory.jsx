// Import necessary dependencies
import React from "react";
import { Link } from "react-router-dom";
import {
  Grid3x3Gap,
  Laptop,
  Phone,
  Camera,
  Headphones,
  Tv,
  Watch,
  Joystick,
  Speaker,
  Basket3,
  Bag,
  Lightbulb,
  Tools,
  Cart,
  Truck,
  HouseDoor,
} from "react-bootstrap-icons";

// Define an array of category objects
// Each object contains an icon component and a title for a product category
const categories = [
  { icon: Grid3x3Gap, title: "All" },
  { icon: Headphones, title: "Audio" },
  { icon: Truck, title: "Automotive" },
  { icon: Camera, title: "Cameras" },
  { icon: Laptop, title: "Computers" },
  { icon: Bag, title: "Fashion" },
  { icon: Joystick, title: "Gaming" },
  { icon: Basket3, title: "Groceries" },
  { icon: HouseDoor, title: "Home & Furniture" },
  { icon: Lightbulb, title: "Home & Lighting" },
  { icon: Phone, title: "Phones" },
  { icon: Speaker, title: "Speakers" },
  { icon: Tools, title: "Tools & Hardware" },
  { icon: Cart, title: "Toys" },
  { icon: Tv, title: "TVs" },
  { icon: Watch, title: "Wearables" },
];

// Define the ProductsCategory component
// This component renders a grid of product categories for easy navigation
export default function ProductsCategory() {
  return (
    <div className="space-y-5 py-5">
      {/* Section title */}
      <div className="border-b py-2">
        <h2 className="text-2xl font-semibold text-primary">
          Browse By Category
        </h2>
      </div>

      {/* Grid container for category links */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
        {/* Map through the categories array to create category links */}
        {categories.map((category, index) => (
          <Link
            key={index}
            to={`/category/${category.title.toLowerCase()}`}
            className="flex h-32 flex-col items-center justify-center rounded-lg bg-white p-4 text-center shadow-md transition duration-300 hover:bg-primary hover:text-white"
          >
            {/* Render the category icon */}
            <category.icon className="mb-2 text-3xl" />
            {/* Render the category title */}
            <span className="text-sm font-medium">{category.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
