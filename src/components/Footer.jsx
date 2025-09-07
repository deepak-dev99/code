import React from 'react';
import { AiFillInstagram } from 'react-icons/ai';
import { FaFacebook } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white py-8">
      <div className=" mx-auto px-4 sm:px-8">
        {/* Top Section */}
        <div className="flex flex-wrap justify-between gap-6">
          {/* Logo and Description */}
          <div className="w-full md:w-1/4">
            <div className="flex items-center gap-2">
              {/* Replace this with your logo */}
              <div className="bg-white rounded-full p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 text-blue-900"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5L15.5 12h-7L12 4.5z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-lg">SKILL KRONOS</h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed">
              Helping ambitious learners upskill themselves & shift to top
              companies.
            </p>
            <h4 className="font-bold my-2">Contact Us</h4>
            <ul className="text-sm">
              <li>
                <strong>E-mail:</strong> info@skillkronos.com
              </li>
              <li> 
                <strong>Contact:</strong>+91-8800710212
              </li>
            </ul>
          </div>

          {/* Free Resources */}
          <div className="w-full md:w-1/4">
            <h4 className="font-bold mb-4">Free Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>Attend Free Event</li>
              <li>Blog</li>
              <li>Informative Docs</li>
            </ul>
          </div>

          {/* Who Are We */}
          <div className="w-full md:w-1/4">
            <h4 className="font-bold mb-4">Who Are We</h4>
            <ul className="space-y-2 text-sm">
              <li>About Us</li>
              <li>Reviews</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
            
            </ul>
          </div>

          {/* Contact Us */}
          {/* <div className="w-full md:w-1/4">
            <h4 className="font-bold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <strong>E-mail:</strong> INFO@skillkronos.COM
              </li>
              <li>
                <strong>Contact:</strong>+91-8800710212
              </li>
            </ul>
          </div> */}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-wrap items-center justify-between text-sm">
          <p className="text-gray-200">
            Copyright © 2024 SkillKronos Pvt. Ltd. All rights
            reserved.
          </p>
          <div className="flex gap-4">
            {/* Social Icons */}
            <a href="#" className="text-gray-200 hover:text-white">
            <FaFacebook size={20}/>
            </a>
            <a href="#" className="text-gray-200 hover:text-white">
            <FaYoutube  size={20}/>
            </a>
            <a href="#" className="text-gray-200 hover:text-white">
            <AiFillInstagram size={20}/>

            </a>
            
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
