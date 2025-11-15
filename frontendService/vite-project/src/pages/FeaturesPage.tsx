// src/pages/FeaturesPage.tsx

import React from "react";
import { motion } from "framer-motion";

// You can use actual icons from a library like 'react-icons' for a better look
const features = [
  {
    icon: "👥",
    title: "Real-time Collaboration",
    description: "Work with your team in real-time. Changes are synced instantly across all devices.",
  },
  {
    icon: "🔐",
    title: "Role-Based Access Control",
    description: "Assign roles like Admin, Manager, and Member to control permissions and access within your team.",
  },
  {
    icon: "📅",
    title: "Deadline Reminders",
    description: "Never miss a deadline again. Get automatic reminders for upcoming and overdue tasks.",
  },
  {
    icon: "📊",
    title: "Productivity Dashboard",
    description: "Visualize your progress with an intuitive dashboard that tracks tasks, deadlines, and team performance.",
  },
  {
    icon: "📂",
    title: "File Attachments",
    description: "Attach files, documents, and images directly to your tasks to keep everything organized in one place.",
  },
  {
    icon: "💬",
    title: "Task Comments & Activity",
    description: "Communicate with your team directly on tasks. Keep a clear history of all actions and discussions.",
  },
];

const FeaturesPage: React.FC = () => {
  return (
     <div className="min-h-screen bg-gradient-to-br from-purple-400 to-purple-700 dark:from-purple-900 dark:to-gray-900 text-white pt-24 sm:pt-32 pb-16 sm:pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-white dark:text-purple-200 drop-shadow-lg">
            Features to Boost Your Productivity
          </h1>
          <p className="mt-4 text-lg md:text-xl text-purple-100 dark:text-purple-300 max-w-2xl mx-auto">
            TaskFlow is packed with powerful features to help you and your team stay organized and efficient.
          </p>
        </motion.div>
        

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-white/10 dark:bg-gray-800/50 p-6 rounded-lg shadow-lg backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white dark:text-purple-200 mb-2">
                {feature.title}
              </h3>
              <p className="text-purple-100 dark:text-purple-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;