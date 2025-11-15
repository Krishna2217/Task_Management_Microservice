// src/components/DashboardNavbar.tsx

import React from 'react';
import { FaBars } from 'react-icons/fa';

interface DashboardNavbarProps {
  toggleSidebar: () => void;
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-purple-700 dark:bg-gray-800 text-white shadow-md">
      <div className="flex items-center justify-between p-4">
        {/* Hamburger Menu Button - Only visible on mobile */}
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-md hover:bg-purple-600 focus:outline-none"
          aria-label="Open sidebar"
        >
          <FaBars className="w-6 h-6" />
        </button>

        {/* You can add a title or other elements here if you want */}
        <div className="text-lg font-semibold md:hidden">
          Dashboard
        </div>
        <div className="w-6 md:hidden"></div> {/* Spacer to center the title */}
      </div>
    </header>
  );
};

export default DashboardNavbar;