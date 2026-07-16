// src/pages/UserProfilePage.tsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { isAxiosError } from "axios";
import { FaEdit, FaKey, FaBell, FaFileExport, FaTrash } from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";
import type { BackendTask } from "../utils/taskMapper";
import { ALL_ROLES, roleLabel } from "../utils/roles";

interface UserProfile {
  fullName: string;
  email: string;
  role: string;
}

interface UserStat {
  label: string;
  value: number;
}

interface RoleChangeRequest {
  id: number;
  currentRole: string;
  requestedRole: string;
  status: string;
  requestedAt: string;
}

const requestStatusClasses = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-500/20 text-green-300 border-green-500/30";
    case "REJECTED":
      return "bg-red-500/20 text-red-300 border-red-500/30";
    default:
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
  }
};

const UserProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStat[] | null>(null);
  const [roleRequests, setRoleRequests] = useState<RoleChangeRequest[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [requestError, setRequestError] = useState("");
  const navigate = useNavigate();

  const fetchRoleRequests = async () => {
    const res = await axiosInstance.get<RoleChangeRequest[]>("/api/users/role-requests/mine");
    setRoleRequests(res.data);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const [profileRes, tasksRes] = await Promise.all([
        axiosInstance.get<UserProfile>("/api/users/profile"),
        axiosInstance.get<BackendTask[]>("/api/task/user"),
      ]);
      setUserProfile(profileRes.data);
      const completed = tasksRes.data.filter((t) => t.status === "DONE").length;
      setUserStats([
        { label: "Tasks Completed", value: completed },
        { label: "Tasks In Progress", value: tasksRes.data.length - completed },
      ]);
      await fetchRoleRequests();
    };

    fetchUserData();
  }, []);

  const hasPendingRequest = roleRequests.some((r) => r.status === "PENDING");

  const handleRequestRoleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestError("");
    setSubmittingRequest(true);
    try {
      await axiosInstance.post("/api/users/role-requests", { requestedRole: selectedRole });
      setSelectedRole("");
      await fetchRoleRequests();
    } catch (err) {
      setRequestError(isAxiosError(err) ? err.response?.data?.message || "Failed to submit request." : "Failed to submit request.");
    } finally {
      setSubmittingRequest(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("This will permanently delete your account. Continue?")) return;
    await axiosInstance.delete("/api/users/profile");
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const avatarUrl = `https://i.pravatar.cc/150?u=${encodeURIComponent(userProfile?.email ?? "guest")}`;

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
                src={avatarUrl}
                alt="User Avatar"
                className="w-32 h-32 rounded-full border-4 border-purple-400 shadow-lg"
              />
              <h2 className="mt-4 text-2xl font-bold text-white">{userProfile.fullName}</h2>
              <p className="text-purple-300">{userProfile.email}</p>
              <p className="mt-2 text-sm text-purple-400">{userProfile.role}</p>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              {/* Request a Role Change */}
              <motion.div
                className="bg-white/10 dark:bg-gray-800/50 p-6 rounded-xl shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h3 className="text-xl font-bold text-white mb-4">Request a Role Change</h3>
                {hasPendingRequest ? (
                  <p className="text-yellow-300 text-sm mb-4">
                    You already have a pending request. An admin needs to review it before you can submit another.
                  </p>
                ) : (
                  <form onSubmit={handleRequestRoleChange} className="flex flex-col sm:flex-row gap-3 mb-4">
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      required
                      className="flex-grow px-4 py-2 rounded-lg border border-purple-500/30 bg-white/5 dark:bg-gray-700/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      <option value="" disabled>Select a role to request</option>
                      {ALL_ROLES.filter((r) => r.value !== userProfile.role).map((r) => (
                        <option key={r.value} value={r.value} className="bg-gray-800">
                          {r.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      disabled={submittingRequest}
                      className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors disabled:bg-purple-400/50 disabled:cursor-not-allowed"
                    >
                      {submittingRequest ? "Submitting..." : "Request"}
                    </button>
                  </form>
                )}
                {requestError && <p className="text-red-400 text-sm mb-4">{requestError}</p>}

                {roleRequests.length > 0 && (
                  <div className="space-y-2">
                    {roleRequests.map((r) => (
                      <div key={r.id} className="flex items-center justify-between bg-black/20 rounded-lg px-4 py-2">
                        <span className="text-sm text-purple-200">
                          {roleLabel(r.currentRole)} &rarr; {roleLabel(r.requestedRole)}
                        </span>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${requestStatusClasses(r.status)}`}>
                          {r.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
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
                <button
                  onClick={handleDeleteAccount}
                  className="w-full sm:w-auto px-4 py-2 bg-red-600/80 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
                >
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
