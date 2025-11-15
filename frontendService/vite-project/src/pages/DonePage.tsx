import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TaskCard, { type TaskCardProps } from "../components/TaskCard";

// Dummy data to simulate API response
const dummyTasks: TaskCardProps[] = [
  {
    id: "1",
    title: "Learn React",
    description: "Understand the basics of React and build a simple app.",
    imageUrl: "https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png",
    learningItems: ["React", "JSX", "Components"],
    status: "done",
  },
  {
    id: "2",
    title: "Master Tailwind CSS",
    description: "Learn how to use Tailwind CSS for responsive design.",
    imageUrl: "https://cdn.icon-icons.com/icons2/2699/PNG/512/tailwindcss_logo_icon_167923.png",
    learningItems: ["Utility Classes", "Responsive Design", "Dark Mode"],
    status: "in-progress",
  },
  {
    id: "3",
    title: "Build a Node.js API",
    description: "Create a RESTful API using Node.js and Express.",
    imageUrl: "https://cdn.icon-icons.com/icons2/2415/PNG/512/nodejs_plain_logo_icon_146409.png",
    learningItems: ["Node.js", "Express", "REST API"],
    status: "done",
  },
];

const DonePage: React.FC = () => {
  const [tasks, setTasks] = useState<TaskCardProps[]>([]);

  // Fetch tasks from API (using dummy data for now)
  useEffect(() => {
    // Simulate an API call
    const fetchTasks = async () => {
      // Simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTasks(dummyTasks); // Set the dummy data as the fetched tasks
    };

    fetchTasks();
  }, []);

  // Filter tasks with status "done"
  const doneTasks = tasks.filter((task) => task.status === "done");

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Completed Tasks</h1>
      {tasks.length === 0 ? (
        <p className="text-purple-300">Loading tasks...</p>
      ) : doneTasks.length === 0 ? (
        <p className="text-purple-300">No completed tasks found.</p>
      ) : (
        // change this container to be full-width on small screens and switch to a grid on md+ screens
        <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
          {doneTasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              imageUrl={task.imageUrl}
              title={task.title}
              status={task.status}
              description={task.description}
              learningItems={task.learningItems}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default DonePage;