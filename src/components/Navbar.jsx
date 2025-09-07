import React, { useState } from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="bg-zinc-100 font-semibold h-fit w-full shadow-md fixed top-0 z-50">
      <div className="mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src="/removed.png" className="h-10 w-16" />
          </div>

          {/* Menu Items (Desktop) */}
          <ul className="hidden md:flex space-x-8 text-gray-700">
            <Link to="/overview">
            <li onClick={() => handleScroll("home")} className="cursor-pointer hover:text-blue-600">
              Home
            </li>
            </Link>
            <Link to="/overview">

            <li onClick={() => handleScroll("about")} className="cursor-pointer hover:text-blue-600">
              About Us
            </li></Link>
            <Link to="/overview">

            <li onClick={() => handleScroll("features")} className="cursor-pointer hover:text-blue-600">
              Features
            </li>
            </Link>
            <Link to="/overview">

            <li onClick={() => handleScroll("pricing")} className="cursor-pointer hover:text-blue-600">
              Pricing
            </li>
            </Link>
            <Link to="/overview">

            <li onClick={() => handleScroll("contact")} className="cursor-pointer hover:text-blue-600">
              Contact
            </li>
            </Link>
          </ul>

          {/* Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="/login" className="text-gray-700 hover:text-blue-600">
              Login
            </a>
            <a
              href="/mentors"
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
            >
              Find your mentor →
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <ul className="space-y-4 text-gray-700">
            <Link to="/overview">

              <li onClick={() => handleScroll("home")} className="block cursor-pointer hover:text-blue-600">
                Home
              </li>
              </Link>
            <Link to="/overview">

              <li onClick={() => handleScroll("about")} className="block cursor-pointer hover:text-blue-600">
                About Us
              </li>
              </Link>
            <Link to="/overview">

              <li onClick={() => handleScroll("features")} className="block cursor-pointer hover:text-blue-600">
                Features
              </li>
</Link>
            <Link to="/overview">

              <li onClick={() => handleScroll("pricing")} className="block cursor-pointer hover:text-blue-600">
                Pricing
              </li>
              </Link>
            <Link to="/overview">

              <li onClick={() => handleScroll("contact")} className="block mb-5 bg-black text-white text-center px-4 py-2 rounded-md hover:bg-gray-800">
                Contact
              </li>
              </Link>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
