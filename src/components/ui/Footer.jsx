// Import necessary dependencies
import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Github, Linkedin } from "react-bootstrap-icons";

// Define the Footer component
// This component displays the website footer with various sections including About Us, Quick Links, Contact Us, and social media links
const Footer = () => {
  return (
    <footer className="bg-primary py-8 text-bright">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* About Us section */}
          {/* This section provides a brief description of the company or website */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">About Us</h3>
            <p className="text-sm">
              We are dedicated to providing high-quality products and excellent
              customer service.
            </p>
          </div>

          {/* Quick Links section */}
          {/* This section contains navigation links to important pages on the website */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="text-sm">
              <li>
                <Link to="/" className="hover:text-accent">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-accent">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-accent">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-accent">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us section */}
          {/* This section displays contact information for the company or website */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
            <p className="text-sm">
              123 Main Street
              <br />
              City, State 12345
              <br />
              Phone: (123) 456-7890
              <br />
              Email: info@example.com
            </p>
          </div>

          {/* Follow Us section */}
          {/* This section contains social media links represented by icons */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Follow Us</h3>
            <div className="flex space-x-4">
              <Link to="#" className="text-bright">
                <Facebook size={24} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link to="#" className="text-bright">
                <Twitter size={24} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link to="#" className="text-bright">
                <Github size={24} />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link to="#" className="text-bright">
                <Linkedin size={24} />
                <span className="sr-only">Linkedin</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Export the Footer component for use in other parts of the application
export default Footer;
