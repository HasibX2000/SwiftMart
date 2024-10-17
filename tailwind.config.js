/** @type {import('tailwindcss').Config} */
export default {
  // Specify the files Tailwind should scan for classes
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Add custom font family
      fontFamily: {
        ssans: ['"Source Sans Pro"', "sans-serif"],
      },
      // Define custom colors
      colors: {
        primary: "#F74B00",
        primaryDark: "#C63C00", // Darker variant of primary

        secondary: "#00007C",
        secondaryDark: "#000063", // Darker variant of secondary

        bright: "#fefefe",
        brightDark: "#E6E6E6",
      },
      // Add custom screen breakpoint
      screens: {
        xs: "420px",
      },
    },
  },
  plugins: [],
};
