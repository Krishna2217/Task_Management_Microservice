import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TaskCard, { type TaskCardProps } from "../components/TaskCard";

// Mock data for our tasks
const mockTaskData: TaskCardProps[] = [
  {
    id: "react-101",
    imageUrl: "https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png",
    title: "Study a React Program",
    description: "Deep dive into the fundamentals of React to build modern, interactive user interfaces.",
    learningItems: ["State & Lifecycle", "Hooks (useState, useEffect)", "Conditional Rendering"],
    status: "in-progress",
  },
  {
    id: "tailwind-css-mastery",
    imageUrl: "https://cdn.icon-icons.com/icons2/2699/PNG/512/tailwindcss_logo_icon_167923.png",
    title: "Master Tailwind CSS",
    description: "Learn how to rapidly build modern websites without ever leaving your HTML.",
    learningItems: ["Utility-First Fundamentals", "Responsive Design", "Dark Mode", "Customizing the Theme"],
    status: "not-started",
  },
  {
    id: "nodejs-backend",
    imageUrl: "https://cdn.icon-icons.com/icons2/2415/PNG/512/nodejs_plain_logo_icon_146409.png",
    title: "Build a Node.js Backend",
    description: "Create a robust and scalable backend server using Node.js and Express.",
    learningItems: ["Express Server Setup", "REST API Principles", "Middleware", "Connecting to a Database"],
    status: "completed",
  },
];

const TaskListPage: React.FC = () => {
  const [tasks, setTasks] = useState<TaskCardProps[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Simulate API call to fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      // Simulate a delay for API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTasks(mockTaskData); // Set the mock data as the fetched tasks
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
          All Tasks
        </h1>
        <p className="mt-1 text-lg text-purple-200 dark:text-purple-300">
          Here is a list of all available tasks.
        </p>
      </motion.div>

      {tasks.length === 0 ? (
        <p className="text-purple-300">Loading tasks...</p>
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