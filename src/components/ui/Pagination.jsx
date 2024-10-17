// Import necessary dependencies
import React from "react";
import Button from "./Button";

// Define the Pagination component
// This component displays navigation controls for paginated content
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Generate an array of page numbers
  // This array is used to render individual page number buttons
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    // Navigation container
    // This wrapper ensures proper spacing and centering of pagination controls
    <nav className="mt-4 flex justify-center">
      {/* Pagination controls list */}
      {/* This unordered list contains all pagination buttons */}
      <ul className="inline-flex items-center -space-x-px">
        {/* Previous page button */}
        {/* This button allows users to navigate to the previous page */}
        <li>
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="ml-0 block rounded-l-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            Prev
          </button>
        </li>

        {/* Page number buttons */}
        {/* This section renders individual buttons for each page number */}
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => onPageChange(number)}
              className={`border border-gray-300 px-3 py-2 leading-tight ${
                currentPage === number
                  ? "bg-blue-50 text-blue-600"
                  : "bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              {number}
            </button>
          </li>
        ))}

        {/* Next page button */}
        {/* This button allows users to navigate to the next page */}
        <li>
          <Button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="block rounded-r-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            Next
          </Button>
        </li>
      </ul>
    </nav>
  );
};

// Export the Pagination component for use in other parts of the application
export default Pagination;
