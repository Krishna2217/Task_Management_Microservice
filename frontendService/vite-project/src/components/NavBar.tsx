import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";

const logoUrl =
  "https://w7.pngwing.com/pngs/398/1016/png-transparent-task-manager-task-management-action-item-tasks-together-orange-logo-sign.png"

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // For mobile menu

  // State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation(); // Hook to detect URL changes

  // This effect runs on component mount AND whenever the location (URL) changes.
  // This ensures the navbar is always in sync after a login or navigation.
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Set isLoggedIn to true if token exists, false otherwise
  }, [location]); // The dependency array makes this effect re-run on navigation

  // Function to handle user logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token
    setIsLoggedIn(false); // Update the state immediately
    navigate("/login"); // Redirect to the login page
  };

  const navLinkClasses = "px-3 py-2 rounded-md text-sm font-medium text-purple-100 hover:bg-purple-700 hover:text-white";
  const activeNavLinkClasses = "bg-purple-800 text-white";

  return (
    <nav className="bg-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and App Name */}
          <div className="shrink-0">
            <Link to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-2">
              <img className="h-8 w-8" src={logoUrl} alt="Task Manager" />
              <span className="text-white font-bold text-xl hidden sm:block">TaskFlow</span>
            </Link>
          </div>

          {/* Desktop Menu Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {/* CONDITIONAL RENDERING: Show different links based on login status */}
              {isLoggedIn && (
                <>
                  <NavLink to="/dashboard" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Dashboard</NavLink>
                  <NavLink to="/tasks" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>My Tasks</NavLink>
                  <NavLink to="/profile" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Profile</NavLink>
                </>
              )}
            </div>
          </div>

          {/* Right side: Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* CONDITIONAL RENDERING: Show Logout button or Login/Sign Up links */}
            {isLoggedIn ? (
              <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white font-semibold rounded shadow hover:bg-red-600 transition">
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 bg-purple-500 text-white font-semibold rounded shadow hover:bg-purple-700 transition">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-white text-purple-700 font-semibold rounded shadow hover:bg-purple-100 transition">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-purple-200 hover:text-white hover:bg-purple-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="block h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {isLoggedIn && (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => `block ${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Dashboard</NavLink>
              <NavLink to="/tasks" className={({ isActive }) => `block ${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>My Tasks</NavLink>
              <NavLink to="/profile" className={({ isActive }) => `block ${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Profile</NavLink>
            </>
          )}
        </div>
        <div className="pt-4 pb-3 border-t border-purple-700">
          <div className="flex items-center justify-between px-4">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-purple-100 hover:bg-purple-700 hover:text-white">
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <Link to="/login" className="flex-1 text-center px-4 py-2 bg-purple-500 text-white font-semibold rounded shadow hover:bg-purple-700 transition">Login</Link>
                <Link to="/register" className="flex-1 text-center px-4 py-2 bg-white text-purple-700 font-semibold rounded shadow hover:bg-purple-100 transition">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;