// src/layouts/DashboardLayout.tsx

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DashboardNavbar from '../components/DashboardNavbar'; // Import the new navbar
import Navbar from '../components/NavBar';

const DashboardLayout: React.FC = () => {
  // State to manage the sidebar's visibility on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
    <Navbar />
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* The DashboardNavbar is only for the hamburger menu on mobile */}
      <div className="md:hidden">
        <DashboardNavbar toggleSidebar={toggleSidebar} />
      </div>

      <div className="flex flex-grow overflow-hidden relative">
        {/* Pass state and toggle function to the Sidebar */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Overlay for mobile - darkens the content and closes sidebar on click */}
        {isSidebarOpen && (
          <div
            onClick={toggleSidebar}
            className="md:hidden fixed inset-0 bg-black/50 z-20"
            aria-hidden="true"
          ></div>
        )}

        {/* Main Content Area */}
        <main className="flex-grow overflow-y-auto bg-gradient-to-br from-purple-500 to-purple-800 dark:from-purple-900 dark:to-gray-900 text-white">
          <div className="p-6 sm:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
    </>
  );
};

export default DashboardLayout;