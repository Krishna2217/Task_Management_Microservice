import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../utils/axiosInstance";
import TaskCard, { type TaskCardProps } from "../components/TaskCard";

const DEFAULT_TASK_IMAGE = "https://cdn-icons-png.flaticon.com/512/1147/1147805.png";

// backend TaskStatus enum -> TaskCard's display status
const statusMap: Record<string, string> = {
  PENDING: "not-started",
  ASSIGNED: "in-progress",
  DONE: "completed",
};

interface BackendTask {
  id: number;
  title: string;
  description: string;
  image: string | null;
  tags: string[];
  status: string;
}

const TaskListPage: React.FC = () => {
  const [tasks, setTasks] = useState<TaskCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axiosInstance.get<BackendTask[]>("/api/task/user");
        setTasks(
          res.data.map((task) => ({
            id: String(task.id),
            imageUrl: task.image || DEFAULT_TASK_IMAGE,
            title: task.title,
            description: task.description,
            learningItems: task.tags ?? [],
            status: statusMap[task.status] ?? "not-started",
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleMenuToggle = (id: string) => {
    setOpenMenuId((prevId) => (prevId === id ? null : id)); // Toggle menu
  };

  const handleMenuClose = () => {
    setOpenMenuId(null); // Close the menu
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-white dark:text-purple-200 drop-shadow-lg">
          Your Tasks
        </h1>
        <p className="mt-1 text-lg text-purple-200 dark:text-purple-300">
          Here is a list of tasks assigned to you.
        </p>
      </motion.div>

      {loading ? (
        <p className="text-purple-300">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-purple-300">No tasks assigned to you yet.</p>
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
              description={task.description}
              learningItems={task.learningItems}
              status={task.status}
              isMenuOpen={openMenuId === task.id} // Pass the open state for this card
              onMenuToggle={handleMenuToggle} // Pass the toggle function
              onMenuClose={handleMenuClose} // Pass the close function
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default TaskListPage;