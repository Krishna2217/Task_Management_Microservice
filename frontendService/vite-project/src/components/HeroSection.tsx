import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext"; // Import the hook

const logoUrl =
    "https://w7.pngwing.com/pngs/398/1016/png-transparent-task-manager-task-management-action-item-tasks-together-orange-logo-sign.png";

const HeroSection: React.FC = () => {
    // Use the global theme state. No local state or useEffect needed here anymore!
    const { darkMode } = useTheme();

    return (
        // Note: The Navbar is now separate, so this component doesn't need a header.
        // The background is applied to a main content area.
        <>
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-400 to-purple-700 dark:from-purple-900 dark:to-gray-900 transition-colors duration-500 pt-16">
                {/* The header with the toggle is now in the Navbar */}

                {/* Hero Content */}
                <main className="flex flex-1 flex-col items-center justify-center text-center px-4">
                    <motion.img
                        src={logoUrl}
                        alt="Task Manager Logo"
                        className="w-24 h-24 mb-6 mx-auto rounded-full bg-white p-2 shadow-lg"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />
                    <motion.h1
                        className="text-4xl md:text-5xl font-extrabold text-white dark:text-purple-200 mb-4 drop-shadow-lg"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        Task Management Made Simple
                    </motion.h1>
                    <motion.p
                        className="text-lg md:text-xl text-purple-100 dark:text-purple-300 mb-8 max-w-xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                        Organize, assign, and track tasks with role-based access for teams, students, and professionals. Stay productive with real-time collaboration, deadline reminders, and a user-friendly dashboard.
                    </motion.p>
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.1 }}
                    >
                        <Link
                            to="/register"
                            className="px-8 py-3 bg-white text-purple-700 font-semibold rounded shadow hover:bg-purple-100 hover:scale-105 transition-transform duration-200"
                        >
                            Sign Up
                        </Link>
                        <Link
                            to="/login"
                            className="px-8 py-3 bg-purple-600 text-white font-semibold rounded shadow hover:bg-purple-800 hover:scale-105 transition-transform duration-200 border border-white"
                        >
                            Login
                        </Link>
                    </motion.div>
                </main>
            </div>
        </>
    );
};

export default HeroSection;