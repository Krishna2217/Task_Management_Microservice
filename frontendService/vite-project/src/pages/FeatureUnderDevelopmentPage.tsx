// src/pages/FeatureUnderDevelopmentPage.tsx

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Define the props the component will accept
interface FeatureUnderDevelopmentPageProps {
  featureName: string;
}

const FeatureUnderDevelopmentPage: React.FC<FeatureUnderDevelopmentPageProps> = ({ featureName }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 to-purple-700 dark:from-purple-900 dark:to-gray-900 text-white p-4 pt-16">
      <motion.div
        className="text-center bg-white/10 dark:bg-gray-800/50 p-8 sm:p-12 rounded-xl shadow-2xl backdrop-blur-lg max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="text-6xl mb-4" role="img" aria-label="Rocket emoji">
          🚀
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white dark:text-purple-200 drop-shadow-lg">
          Coming Soon!
        </h1>
        <p className="mt-4 text-lg text-purple-100 dark:text-purple-300">
          The <span className="font-bold text-white">{featureName}</span> page is currently under development.
        </p>
        <p className="mt-2 text-purple-200 dark:text-purple-400">
          We're working hard to bring this feature to you. Please check back later!
        </p>
        <Link
          to="/" // Or "/" if you prefer sending users to the homepage
          className="mt-8 inline-block px-8 py-3 bg-white text-purple-700 font-semibold rounded-lg shadow-md hover:bg-purple-100 hover:scale-105 transition-transform duration-200"
        >
          Go to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default FeatureUnderDevelopmentPage;