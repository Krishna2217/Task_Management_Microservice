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

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');

  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get<UserProfile>("/api/users/profile");
        setName(res.data.fullName);
        setEmail(res.data.email);
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

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage('');
    setProfileError('');

    try {
      await axiosInstance.put("/api/users/profile", { fullName: name });
      setProfileMessage('Profile updated successfully!');
      setTimeout(() => {
        navigate('/dashboard/profile');
      }, 1500);
    } catch (err) {
      if (isAxiosError(err)) {
        setProfileError(err.response?.data?.detail || 'Failed to update profile. Please try again.');
      } else {
        setProfileError('Failed to update profile. Please try again.');
      }
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangingPassword(true);
    setPasswordMessage('');
    setPasswordError('');

    try {
      await axiosInstance.put("/api/users/password", { currentPassword, newPassword });
      setPasswordMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      if (isAxiosError(err)) {
        setPasswordError(err.response?.data?.detail || 'Failed to change password. Please try again.');
      } else {
        setPasswordError('Failed to change password. Please try again.');
      }
    } finally {
      setChangingPassword(false);
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
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
          <form onSubmit={handleSubmitProfile}>
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
            </div>

            {/* Feedback Messages */}
            <div className="mt-6 text-center h-5">
              {profileMessage && <p className="text-green-400">{profileMessage}</p>}
              {profileError && <p className="text-red-400">{profileError}</p>}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={savingProfile}
                className="w-full px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors disabled:bg-green-400/50 disabled:cursor-not-allowed"
              >
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard/profile')}
                disabled={savingProfile}
                className="w-full px-6 py-3 bg-gray-500/50 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500/70 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>

        {/* Change Password */}
        <motion.div
          className="bg-white/10 dark:bg-gray-800/50 p-6 sm:p-8 rounded-xl shadow-lg backdrop-blur-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-white mb-4">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-purple-200 mb-1">
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-purple-500/30 bg-white/5 dark:bg-gray-700/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-purple-200 mb-1">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
                className="w-full px-4 py-2 rounded-lg border border-purple-500/30 bg-white/5 dark:bg-gray-700/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
            <div className="text-center h-5">
              {passwordMessage && <p className="text-green-400">{passwordMessage}</p>}
              {passwordError && <p className="text-red-400">{passwordError}</p>}
            </div>
            <button
              type="submit"
              disabled={changingPassword}
              className="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors disabled:bg-purple-400/50 disabled:cursor-not-allowed"
            >
              {changingPassword ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditProfilePage;
