// src/components/Footer.tsx

import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const logoUrl =
  "https://w7.pngwing.com/pngs/398/1016/png-transparent-task-manager-task-management-action-item-tasks-together-orange-logo-sign.png";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-purple-700 to-purple-900 dark:from-gray-800 dark:to-gray-900 text-purple-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Branding Section */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <img className="h-8 w-8" src={logoUrl} alt="TaskFlow Logo" />
              <span className="text-white font-bold text-xl">TaskFlow</span>
            </Link>
            <p className="mt-4 text-sm text-purple-300">
              Task Management Made Simple.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Product</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/features" className="text-base text-purple-300 hover:text-white">Features</Link></li>
              <li><Link to="/pricing" className="text-base text-purple-300 hover:text-white">Pricing</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/about" className="text-base text-purple-300 hover:text-white">About Us</Link></li>
              {/* <li><Link to="/careers" className="text-base text-purple-300 hover:text-white">Careers</Link></li> */}
              <li><Link to="/contact" className="text-base text-purple-300 hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/privacy" className="text-base text-purple-300 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-base text-purple-300 hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright and Socials */}
        <div className="mt-8 pt-8 border-t border-purple-700 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-purple-300">
            &copy; {currentYear} TaskFlow. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="text-purple-300 hover:text-white">
              <span className="sr-only">Twitter</span>
              <FaTwitter className="h-6 w-6" />
            </a>
            <a href="#" className="text-purple-300 hover:text-white">
              <span className="sr-only">GitHub</span>
              <FaGithub className="h-6 w-6" />
            </a>
            <a href="#" className="text-purple-300 hover:text-white">
              <span className="sr-only">LinkedIn</span>
              <FaLinkedin className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;