// Import necessary dependencies
import React from "react";

// Define the Button component
// This component renders a customizable button with various styles and sizes
export default function Button({
  children,
  variant = "primary",
  onClick,
  size = "md",
  className = "",
  disabled = false,
  ...rest
}) {
  // Define base styles applied to all buttons
  const baseStyles = "duration-150 font-semibold rounded focus:outline-none ";

  // Define variant-specific styles
  // These styles change the button's appearance based on its purpose or context
  const variants = {
    primary: "bg-primary text-bright hover:bg-primaryDark",
    secondary: "bg-secondary text-bright hover:bg-secondaryDark",
    outline:
      "border border-primary text-primary hover:bg-primary hover:text-bright",
  };

  // Define size-specific styles
  // These styles adjust the button's dimensions based on the desired size
  const sizes = {
    sm: "text-sm px-3 py-1",
    md: "text-base px-5 py-2",
    lg: "text-lg px-7 py-3",
  };

  // Define disabled styles
  // These styles are applied when the button is in a disabled state
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";

  // Combine all styles based on props
  // This creates the final className string for the button
  const buttonStyles = `${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`;

  // Render the button component
  // This section returns the actual button element with all the applied styles and props
  return (
    <button
      onClick={onClick}
      className={buttonStyles}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
