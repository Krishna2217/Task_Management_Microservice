import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../utils/axiosInstance";
import TaskCard, { type TaskCardProps } from "../components/TaskCard";
import { mapBackendTask, fetchUserNamesById, type BackendTask } from "../utils/taskMapper";
import type { Page } from "../utils/page";

const TaskListPage: React.FC = () => {
  const [tasks, setTasks] = useState<TaskCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const [profileRes, userNamesById] = await Promise.all([
          axiosInstance.get<{ role: string }>("/api/users/profile"),
          fetchUserNamesById(),
        ]);
        const admin = profileRes.data.role === "ROLE_ADMIN";
        setIsAdmin(admin);

        // admins see every task in the system (paginated); everyone else sees just what's assigned to them
        const tasksData = admin
          ? (await axiosInstance.get<Page<BackendTask>>("/api/task", { params: { size: 100 } })).data.content
          : (await axiosInstance.get<BackendTask[]>("/api/task/user")).data;
        setTasks(tasksData.map((task) => mapBackendTask(task, userNamesById)));
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleDelete = async (id: string) => {
    await axiosInstance.delete(`/api/task/${id}`);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

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
          {isAdmin ? "All Tasks" : "Your Tasks"}
        </h1>
        <p className="mt-1 text-lg text-purple-200 dark:text-purple-300">
          {isAdmin ? "Here is every task in the system." : "Here is a list of tasks assigned to you."}
        </p>
      </motion.div>

      {loading ? (
        <p className="text-purple-300">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-purple-300">{isAdmin ? "No tasks found." : "No tasks assigned to you yet."}</p>
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
              assignedUserName={task.assignedUserName}
              isMenuOpen={openMenuId === task.id} // Pass the open state for this card
              onMenuToggle={handleMenuToggle} // Pass the toggle function
              onMenuClose={handleMenuClose} // Pass the close function
              onDelete={handleDelete}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default TaskListPage;