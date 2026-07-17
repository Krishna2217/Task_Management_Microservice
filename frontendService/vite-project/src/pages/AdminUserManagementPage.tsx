import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "../utils/axiosInstance";
import { ALL_ROLES, roleLabel } from "../utils/roles";
import type { Page } from "../utils/page";

interface AppUser {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

interface RoleChangeRequest {
  id: number;
  userId: number;
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

const AdminUserManagementPage: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [requests, setRequests] = useState<RoleChangeRequest[]>([]);
  const [pendingRoleById, setPendingRoleById] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  const fetchAll = async () => {
    const [profileRes, usersRes, requestsRes] = await Promise.all([
      axiosInstance.get<{ role: string }>("/api/users/profile"),
      axiosInstance.get<Page<AppUser>>("/api/users", { params: { size: 100 } }),
      axiosInstance.get<RoleChangeRequest[]>("/api/users/role-requests"),
    ]);
    setRole(profileRes.data.role);
    setUsers(usersRes.data.content);
    setRequests(requestsRes.data);
  };

  useEffect(() => {
    fetchAll().finally(() => setLoading(false));
  }, []);

  const userNamesById = Object.fromEntries(users.map((u) => [u.id, u.fullName]));

  const handlePromote = async (userId: number) => {
    const newRole = pendingRoleById[userId];
    if (!newRole) return;
    setSavingId(userId);
    try {
      await axiosInstance.put(`/api/users/${userId}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    } finally {
      setSavingId(null);
    }
  };

  const handleReview = async (requestId: number, action: "approve" | "reject") => {
    await axiosInstance.put(`/api/users/role-requests/${requestId}/${action}`);
    await fetchAll();
  };

  if (loading) {
    return <p className="text-purple-300 text-center mt-10">Loading...</p>;
  }

  if (role !== "ROLE_ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Manage Users</h1>
        <p className="text-purple-300 mb-6">Promote users directly, or review their self-service role requests.</p>

        <motion.div
          className="overflow-x-auto bg-white/10 dark:bg-gray-800/50 rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-purple-500/30 text-purple-200 text-sm">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Current Role</th>
                <th className="px-4 py-3">Change To</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-purple-500/10 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-white">{user.fullName}</p>
                    <p className="text-sm text-purple-300">{user.email}</p>
                  </td>
                  <td className="px-4 py-3 text-purple-200">{roleLabel(user.role)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={pendingRoleById[user.id] ?? ""}
                      onChange={(e) => setPendingRoleById((prev) => ({ ...prev, [user.id]: e.target.value }))}
                      className="px-3 py-1.5 rounded-lg border border-purple-500/30 bg-white/5 dark:bg-gray-700/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      <option value="" className="bg-gray-800">Select role</option>
                      {ALL_ROLES.filter((r) => r.value !== user.role).map((r) => (
                        <option key={r.value} value={r.value} className="bg-gray-800">
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handlePromote(user.id)}
                      disabled={!pendingRoleById[user.id] || savingId === user.id}
                      className="px-4 py-1.5 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-400/50 disabled:cursor-not-allowed"
                    >
                      {savingId === user.id ? "Saving..." : "Update"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Role Change Requests</h2>
        {requests.length === 0 ? (
          <p className="text-purple-300">No role change requests yet.</p>
        ) : (
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {requests.map((req) => (
              <div key={req.id} className="bg-white/10 dark:bg-gray-800/50 p-4 rounded-lg shadow-md flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-white">
                    {userNamesById[req.userId] ?? `User #${req.userId}`}
                  </p>
                  <p className="text-sm text-purple-300">
                    {roleLabel(req.currentRole)} &rarr; {roleLabel(req.requestedRole)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${requestStatusClasses(req.status)}`}>
                    {req.status}
                  </span>
                  {req.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleReview(req.id, "approve")}
                        className="px-3 py-1.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReview(req.id, "reject")}
                        className="px-3 py-1.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminUserManagementPage;
