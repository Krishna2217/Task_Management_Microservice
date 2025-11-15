// src/pages/UserProfilePage.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEdit, FaKey, FaBell, FaFileExport, FaTrash } from "react-icons/fa";

// --- Mock User Data ---
const mockUserProfile = {
  name: "Alex Doe",
  email: "alex.doe@example.com",
  memberSince: "2024-01-15",
  avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d", // A random placeholder avatar
};

const mockUserStats = [
  { label: "Tasks Completed", value: 42 },
  { label: "Tasks In Progress", value: 8 },
  { label: "Teams", value: 3 },
];

const UserProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<typeof mockUserProfile | null>(null);
  const [userStats, setUserStats] = useState<typeof mockUserStats | null>(null);

  // Simulate API call to fetch user data and stats
  useEffect(() => {
    const fetchUserData = async () => {
      // Simulate a delay for API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Set user profile and stats
      setUserProfile(mockUserProfile);
      setUserStats(mockUserStats);
    };

    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-800 dark:from-purple-900 dark:to-gray-900 text-white pt-24 sm:pt-32 pb-16 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-white dark:text-purple-200 drop-shadow-lg mb-8">
            My Profile
          </h1>
        </motion.div>

        {userProfile && userStats ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* --- Left Column: Profile Card --- */}
            <motion.div
              className="lg:col-span-1 bg-white/10 dark:bg-gray-800/50 p-6 rounded-xl shadow-lg backdrop-blur-sm text-center flex flex-col items-center"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img
                src={userProfile.avatarUrl}
                alt="User Avatar"
                className="w-32 h-32 rounded-full border-4 border-purple-400 shadow-lg"
              />
              <h2 className="mt-4 text-2xl font-bold text-white">{userProfile.name}</h2>
              <p className="text-purple-300">{userProfile.email}</p>
              <p className="mt-2 text-sm text-purple-400">
                Member since {new Date(userProfile.memberSince).toLocaleDateString()}
              </p>
              <Link
                to="/dashboard/profile/edit"
                className="mt-6 flex items-center gap-2 px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors"
              >
                <FaEdit />
                Edit Profile
              </Link>
            </motion.div>

            {/* --- Right Column: Stats and Settings --- */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h3 className="text-xl font-bold text-white mb-4">Your Activity</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {userStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-white/10 dark:bg-gray-800/50 p-4 rounded-xl shadow-lg text-center"
                    >
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-purple-300 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Account Settings Section */}
              <motion.div
                className="bg-white/10 dark:bg-gray-800/50 p-6 rounded-xl shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h3 className="text-xl font-bold text-white mb-4">Account Settings</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-white/10 transition-colors">
                    <FaKey className="text-purple-300" />
                    <span>Change Password</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-white/10 transition-colors">
                    <FaBell className="text-purple-300" />
                    <span>Manage Notifications</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-white/10 transition-colors">
                    <FaFileExport className="text-purple-300" />
                    <span>Export My Data</span>
                  </button>
                </div>
              </motion.div>

              {/* Danger Zone */}
              <motion.div
                className="bg-red-900/30 border border-red-500/50 p-6 rounded-xl shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <h3 className="text-xl font-bold text-red-300 mb-2">Danger Zone</h3>
                <p className="text-red-300/80 text-sm mb-4">
                  These actions are permanent and cannot be undone.
                </p>
                <button className="w-full sm:w-auto px-4 py-2 bg-red-600/80 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors">
                  <FaTrash className="inline mr-2" />
                  Delete My Account
                </button>
              </motion.div>
            </div>
          </div>
        ) : (
          <p className="text-purple-300 text-center">Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;