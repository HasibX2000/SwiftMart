// Import necessary dependencies
import React, { useState, useEffect } from "react";
import CarouselBanner1 from "../../assets/_Carousel_Banner_1.webp";
import CarouselBanner2 from "../../assets/_Carousel_Banner_2.webp";
import CarouselBanner3 from "../../assets/_Carousel_Banner_3.webp";
import CarouselBanner4 from "../../assets/_Carousel_Banner_4.webp";

// Define the Carousel component
// This component displays a rotating set of banner images with navigation controls
const Carousel = () => {
  // State to keep track of the currently active slide
  const [activeIndex, setActiveIndex] = useState(0);

  // Array of banner images to be displayed in the carousel
  const images = [
    CarouselBanner1,
    CarouselBanner2,
    CarouselBanner3,
    CarouselBanner4,
  ];

  // Function to move to the next slide
  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Function to move to the previous slide
  const handlePrev = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    );
  };

  // Effect to automatically advance the carousel every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full" data-carousel="slide">
      {/* Carousel wrapper */}
      {/* This section contains the sliding images */}
      <div className="relative h-32 overflow-hidden sm:h-56 md:h-[300px] lg:h-[400px] xl:h-[500px]">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              activeIndex === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image}
              className="absolute left-1/2 top-1/2 block w-full -translate-x-1/2 -translate-y-1/2 object-cover"
              alt={`Slide ${index + 1}`}
            />
          </div>
        ))}
      </div>

      {/* Slider indicators */}
      {/* This section displays clickable dots to indicate and select slides */}
      <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 space-x-3">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`h-3 w-3 rounded-full ${
              activeIndex === index ? "bg-primary" : "bg-bright"
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slider controls */}
      {/* This section contains the previous and next buttons for manual navigation */}
      <button
        type="button"
        className="group absolute left-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4"
        onClick={handlePrev}
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60">
          <svg
            className="h-4 w-4 text-white dark:text-gray-800"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>
      <button
        type="button"
        className="group absolute right-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4"
        onClick={handleNext}
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60">
          <svg
            className="h-4 w-4 text-white dark:text-gray-800"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
};

export default Carousel;
