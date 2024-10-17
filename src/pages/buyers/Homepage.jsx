// Import necessary dependencies
import React from "react";
import Carousel from "../../components/ui/Carousel";
import Container from "../../components/ui/Container";
import FlashSale from "../../components/buyers/FlashSale";
import JustForYou from "../../components/buyers/JustForYou";
import ProductsCategory from "../../components/buyers/ProductsCategory";

// Define the Homepage component
// This component serves as the main landing page for buyers, presenting a curated selection of product showcases and promotional elements
export default function Homepage() {
  return (
    <Container>
      {/* Render the Carousel component
          This component displays featured items or promotions to capture user attention */}
      <Carousel />

      {/* Render the FlashSale component
          This component showcases time-limited deals to create urgency and encourage immediate purchases */}
      <FlashSale />

      {/* Render the ProductsCategory component
          This component organizes and displays various product categories for easy browsing */}
      <ProductsCategory />

      {/* Render the JustForYou component
          This component provides personalized product recommendations based on user preferences and browsing history */}
      <JustForYou />
    </Container>
  );
}
