import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUsers, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";
import { fetchUserNamesById, type BackendTask } from "../utils/taskMapper";
import type { Page } from "../utils/page";

const statusClasses = (status: string) => {
  switch (status) {
    case "DONE":
      return "bg-green-500/20 text-green-300 border-green-500/30";
    case "PENDING":
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    default:
      return "bg-purple-500/20 text-purple-300 border-purple-500/30";
  }
};

const AdminTaskOverviewPage: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const [tasks, setTasks] = useState<BackendTask[]>([]);
  const [userNamesById, setUserNamesById] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, tasksRes, names] = await Promise.all([
          axiosInstance.get<{ role: string }>("/api/users/profile"),
          axiosInstance.get<Page<BackendTask>>("/api/task", { params: { size: 100 } }),
          fetchUserNamesById(),
        ]);
        setRole(profileRes.data.role);
        setTasks(tasksRes.data.content);
        setUserNamesById(names);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    await axiosInstance.delete(`/api/task/${id}`);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  if (loading) {
    return <p className="text-purple-300 text-center mt-10">Loading...</p>;
  }

  if (role !== "ROLE_ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-2">Admin Task Overview</h1>
      <p className="text-purple-300 mb-6">Every task in the system and who it's assigned to.</p>

      {tasks.length === 0 ? (
        <p className="text-purple-300">No tasks found.</p>
      ) : (
        <motion.div
          className="overflow-x-auto bg-white/10 dark:bg-gray-800/50 rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-purple-500/30 text-purple-200 text-sm">
                <th className="px-4 py-3">Task</th>
                <th className="px-4 py-3">Assigned To</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-b border-purple-500/10 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-white">{task.title}</p>
                    <p className="text-sm text-purple-300">{task.description}</p>
                  </td>
                  <td className="px-4 py-3 text-purple-200">
                    {task.assignedUserId != null ? userNamesById[task.assignedUserId] ?? "Unknown" : "Unassigned"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusClasses(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 text-purple-300">
                      <Link to={`/dashboard/tasks/${task.id}/assigned`} title="Assign user" className="hover:text-white">
                        <FaUsers />
                      </Link>
                      <Link to={`/dashboard/tasks/${task.id}/submissions`} title="View submissions" className="hover:text-white">
                        <FaEye />
                      </Link>
                      <Link to={`/dashboard/tasks/${task.id}/edit`} title="Edit task" className="hover:text-white">
                        <FaEdit />
                      </Link>
                      <button onClick={() => handleDelete(task.id)} title="Delete task" className="hover:text-red-400">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
};

export default AdminTaskOverviewPage;
