// src/pages/DashboardPage.tsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// --- Mock Data ---
const summaryStats = [
  { label: "Tasks Due Today", value: 3 },
  { label: "Overdue Tasks", value: 1 },
  { label: "Tasks In Progress", value: 5 },
  { label: "Completed This Week", value: 12 },
];

const mockTasks = [
  { id: 1, title: "Finalize Q4 marketing report", dueDate: "2025-11-14", priority: "High" },
  { id: 2, title: "Design new landing page mockups", dueDate: "2025-11-15", priority: "Medium" },
  { id: 3, title: "Fix authentication bug on staging", dueDate: "2025-11-13", priority: "High" },
  { id: 4, title: "Onboard new junior developer", dueDate: "2025-11-16", priority: "Low" },
  { id: 5, title: "Prepare slides for Friday's all-hands meeting", dueDate: "2025-11-14", priority: "Medium" },
];

const getPriorityClasses = (priority: string) => {
  switch (priority) {
    case "High": return "bg-red-500/20 text-red-300 border-red-500/30";
    case "Medium": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    case "Low": return "bg-green-500/20 text-green-300 border-green-500/30";
    default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
  }
};

const DashboardPage: React.FC = () => {
  const [tasks, setTasks] = useState<typeof mockTasks>([]);
  const [stats, setStats] = useState<typeof summaryStats>([]);

  // Simulate API call to fetch tasks and stats
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Simulate a delay for API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Set tasks and stats
      setTasks(mockTasks);
      setStats(summaryStats);
    };

    fetchDashboardData();
  }, []);

  const overdueTasks = tasks.filter((task) => new Date(task.dueDate) < new Date()).length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* --- Header --- */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white dark:text-purple-200 drop-shadow-lg">
            Welcome Back!
          </h1>
          <p className="mt-1 text-lg text-purple-200 dark:text-purple-300">
            Here's your snapshot for today.
          </p>
        </div>
      </motion.div>

      {/* --- Summary Stats --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-white/10 dark:bg-gray-800/50 p-4 sm:p-6 rounded-xl shadow-lg backdrop-blur-sm text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
          >
            <p className="text-3xl sm:text-4xl font-bold text-white">
              {stat.label === "Overdue Tasks" ? overdueTasks : stat.value}
            </p>
            <p className="text-sm sm:text-base text-purple-200 dark:text-purple-300 mt-1">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* --- Recent Tasks List --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-white mb-4">Your Priority Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-purple-300">Loading tasks...</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white/5 dark:bg-gray-800/40 p-4 rounded-lg shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex-grow">
                  <p className="font-bold text-lg text-white">{task.title}</p>
                  <p className="text-sm text-purple-300">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityClasses(task.priority)}`}>
                    {task.priority}
                  </span>
                  <Link to={`/tasks/${task.id}`} className="text-purple-300 hover:text-white font-semibold">
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardPage;