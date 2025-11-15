import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FaHome, FaCheckCircle, FaUserCheck, FaQuestionCircle, FaPlus, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

// Mock user data (in a real app, this would come from a context or API)
const user = {
  name: 'Alex Doe',
  avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
};

// Props interface to control the sidebar's visibility on mobile
interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  // Common classes for NavLink to keep the code DRY
  const navLinkClasses = "flex items-center gap-3 px-4 py-3 rounded-lg text-purple-200 hover:bg-purple-700 hover:text-white transition-colors";
  const activeNavLinkClasses = "bg-purple-800 text-white shadow-inner";

  return (
    // Main container with responsive and state-based classes for visibility
    <aside
      className={`
        w-64 bg-gradient-to-b from-purple-700 to-purple-900 dark:from-gray-800 dark:to-gray-900 p-4 flex flex-col
        fixed top-0 left-0 h-full z-30 transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:flex-shrink-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* Top Section: User Profile (does not scroll) */}
      <div className="flex-shrink-0 flex flex-col items-center text-center mb-10">
        <div className="relative">
          {/* Gradient border effect for the avatar */}
          <div className="w-28 h-28 rounded-full bg-gradient-to-r from-purple-400 to-green-400 p-1 shadow-lg">
            <div className="bg-purple-800 rounded-full p-1">
              <img src={user.avatarUrl} alt="User Avatar" className="w-full h-full rounded-full" />
            </div>
          </div>
        </div>
        <h3 className="mt-4 text-lg font-bold text-white">{user.name}</h3>
      </div>

      {/* Middle Section: Navigation Links (scrollable if content overflows) */}
      <nav 
        className="flex-grow space-y-2 overflow-y-auto" 
        // On mobile, clicking a link will close the sidebar
        onClick={window.innerWidth < 768 ? toggleSidebar : undefined}
      >
        <NavLink to="/dashboard" end className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
          <FaHome className="w-5 h-5" />
          <span>Home</span>
        </NavLink>
        <NavLink to="/dashboard/tasks/done" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
          <FaCheckCircle className="w-5 h-5" />
          <span>Done</span>
        </NavLink>
        <NavLink to="/dashboard/tasks/assigned" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
          <FaUserCheck className="w-5 h-5" />
          <span>Assigned</span>
        </NavLink>
        <NavLink to="/dashboard/tasks/unassigned" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
          <FaQuestionCircle className="w-5 h-5" />
          <span>Not Assigned</span>
        </NavLink>
        <NavLink to="/dashboard/profile" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
          <FaUserCircle className="w-5 h-5" />
          <span>Profile</span>
        </NavLink>
      </nav>

      {/* Bottom Section: Action Buttons (does not scroll) */}
      <div className="flex-shrink-0 space-y-4 mt-4">
        <Link
          to="/dashboard/tasks/new"
          className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors"
        >
          <FaPlus />
          <span>Create New Task</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-red-600/80 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;