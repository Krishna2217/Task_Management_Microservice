// src/pages/EditProfilePage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { isAxiosError } from 'axios';
import { FaCamera } from 'react-icons/fa';
import axiosInstance from '../utils/axiosInstance';

interface UserProfile {
  fullName: string;
  email: string;
  role: string;
}

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  // updateUserProfile re-encodes and overwrites the password on every save, so it must always be supplied
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get<UserProfile>("/api/users/profile");
        setName(res.data.fullName);
        setEmail(res.data.email);
        setRole(res.data.role);
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const avatarUrl = `https://i.pravatar.cc/150?u=${encodeURIComponent(email || "guest")}`;

  const handleAvatarChange = () => {
    // This is a placeholder for file upload logic
    // In a real app, this would open a file dialog
    alert('Avatar change functionality is not yet implemented.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await axiosInstance.put("/api/users/profile", {
        fullName: name,
        email,
        role,
        password,
      });

      setMessage('Profile updated successfully!');
      setTimeout(() => {
        navigate('/dashboard/profile');
      }, 1500);
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
      } else {
        setError('Failed to update profile. Please try again.');
      }
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center text-purple-300">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-800 dark:from-purple-900 dark:to-gray-900 text-white pt-24 sm:pt-32 pb-16 sm:pb-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-white dark:text-purple-200 drop-shadow-lg mb-8">
            Edit Profile
          </h1>
        </motion.div>

        <motion.div
          className="bg-white/10 dark:bg-gray-800/50 p-6 sm:p-8 rounded-xl shadow-lg backdrop-blur-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit}>
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <img
                  src={avatarUrl}
                  alt="User Avatar"
                  className="w-32 h-32 rounded-full border-4 border-purple-400 shadow-lg"
                />
                <button
                  type="button"
                  onClick={handleAvatarChange}
                  className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full hover:bg-purple-700 transition-colors"
                  aria-label="Change avatar"
                >
                  <FaCamera className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-purple-200 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-purple-500/30 bg-white/5 dark:bg-gray-700/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-purple-200 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-2 rounded-lg border border-purple-500/30 bg-white/5 dark:bg-gray-700/50 text-white/60 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-purple-300/70">Email cannot be changed.</p>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-purple-200 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-purple-500/30 bg-white/5 dark:bg-gray-700/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="Re-enter your password to confirm changes"
                  required
                />
                <p className="mt-1 text-xs text-purple-300/70">
                  Required to save changes. Enter a new password here to change it.
                </p>
              </div>
            </div>

            {/* Feedback Messages */}
            <div className="mt-6 text-center h-5">
              {message && <p className="text-green-400">{message}</p>}
              {error && <p className="text-red-400">{error}</p>}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors disabled:bg-green-400/50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard/profile')}
                disabled={loading}
                className="w-full px-6 py-3 bg-gray-500/50 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500/70 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditProfilePage;
