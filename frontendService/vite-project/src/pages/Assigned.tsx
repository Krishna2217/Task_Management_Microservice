import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../utils/axiosInstance";
import TaskCard, { type TaskCardProps } from "../components/TaskCard";
import { mapBackendTask, type BackendTask } from "../utils/taskMapper";

const AssignedPage: React.FC = () => {
  const [tasks, setTasks] = useState<TaskCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // tasks currently assigned to me
        const res = await axiosInstance.get<BackendTask[]>("/api/task/user");
        setTasks(res.data.map(mapBackendTask));
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleMenuToggle = (id: string) => {
    setOpenMenuId((prevId) => (prevId === id ? null : id));
  };

  const handleMenuClose = () => {
    setOpenMenuId(null);
  };

  const handleDelete = async (id: string) => {
    await axiosInstance.delete(`/api/task/${id}`);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Assigned Tasks</h1>
      {loading ? (
        <p className="text-purple-300">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-purple-300">No assigned tasks found.</p>
      ) : (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              imageUrl={task.imageUrl}
              title={task.title}
              status={task.status}
              description={task.description}
              learningItems={task.learningItems}
              isMenuOpen={openMenuId === task.id}
              onMenuToggle={handleMenuToggle}
              onMenuClose={handleMenuClose}
              onDelete={handleDelete}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default AssignedPage;
