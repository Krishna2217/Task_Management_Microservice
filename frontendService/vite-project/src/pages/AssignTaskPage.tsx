import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "../utils/axiosInstance";
import type { BackendTask } from "../utils/taskMapper";

interface AppUser {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

const AssignTaskPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<BackendTask | null>(null);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskRes, usersRes] = await Promise.all([
          axiosInstance.get<BackendTask>(`/api/task/${id}`),
          axiosInstance.get<AppUser[]>("/api/users"),
        ]);
        setTask(taskRes.data);
        setUsers(usersRes.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAssign = async (userId: number) => {
    setAssigningId(userId);
    setError("");
    try {
      await axiosInstance.put(`/api/task/${id}/user/${userId}/assigned`);
      navigate("/dashboard");
    } catch {
      setError("Failed to assign task. Please try again.");
      setAssigningId(null);
    }
  };

  if (loading) {
    return <p className="text-purple-300 text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-2">Assign Task</h1>
      {task && <p className="text-purple-300 mb-6">"{task.title}"</p>}

      {error && <p className="text-red-400 mb-4">{error}</p>}

      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between bg-white/10 dark:bg-gray-800/50 p-4 rounded-lg shadow-md"
          >
            <div>
              <p className="font-semibold text-white">{user.fullName}</p>
              <p className="text-sm text-purple-300">{user.email} · {user.role}</p>
            </div>
            <button
              onClick={() => handleAssign(user.id)}
              disabled={assigningId !== null || task?.assignedUserId === user.id}
              className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-400/50 disabled:cursor-not-allowed"
            >
              {task?.assignedUserId === user.id
                ? "Assigned"
                : assigningId === user.id
                ? "Assigning..."
                : "Assign"}
            </button>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default AssignTaskPage;
