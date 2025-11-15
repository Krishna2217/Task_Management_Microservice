// src/components/TaskCard.tsx

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaEllipsisV, FaUsers, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

export interface TaskCardProps {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  learningItems: string[];
  status: string;
  isMenuOpen?: boolean; // Prop to control menu visibility
  onMenuToggle?: (id: string) => void; // Prop to handle menu toggle
  onMenuClose?: () => void; // Prop to close the menu when clicking outside
}

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  imageUrl,
  title,
  description,
  learningItems,
  isMenuOpen,
  onMenuToggle,
  onMenuClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onMenuClose?.(); // Close the menu if the callback exists
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onMenuClose]);

  return (
    <div 
      className={`
        bg-white/10 dark:bg-gray-800/50 p-4 rounded-xl shadow-lg backdrop-blur-sm relative
        transition-all duration-300 ease-in-out
        shadow-purple-500/10 hover:shadow-purple-400/30
        dark:shadow-purple-400/10 dark:hover:shadow-purple-300/20
        hover:scale-[1.02] hover:shadow-2xl
      `}
    >
      {/* --- 3-Dot Menu Button --- */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => onMenuToggle?.(id)} // Call the toggle function with the card's ID
          className="p-2 rounded-full hover:bg-white/20 focus:outline-none"
          aria-label="Task options"
        >
          <FaEllipsisV className="text-white" />
        </button>

        {/* --- Dropdown Menu --- */}
        {isMenuOpen && (
          <div 
            ref={menuRef} // Attach the ref to the menu
            className="absolute right-0 mt-2 w-48 bg-purple-800 dark:bg-gray-700 rounded-lg shadow-xl z-10"
          >
            <ul className="py-1">
              <li>
                <Link to={`/dashboard/tasks/${id}/assigned`} className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm text-purple-200 hover:bg-purple-700">
                  <FaUsers /> Assigned User
                </Link>
              </li>
              <li>
                <Link to={`/dashboard/tasks/${id}/submissions`} className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm text-purple-200 hover:bg-purple-700">
                  <FaEye /> See Submission
                </Link>
              </li>
              <li>
                <Link to={`/dashboard/tasks/${id}/edit`} className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm text-purple-200 hover:bg-purple-700">
                  <FaEdit /> Edit
                </Link>
              </li>
              <li>
                <button className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm text-red-300 hover:bg-red-500/50">
                  <FaTrash /> Delete
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* --- Left Side: Image --- */}
        <div className="flex-shrink-0">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-40 sm:w-32 sm:h-32 object-cover rounded-lg"
          />
        </div>

        {/* --- Right Side: Content --- */}
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-white pr-8">{title}</h3>
          <p className="mt-1 text-sm text-purple-300">{description}</p>

          <div className="mt-4">
            <h4 className="text-sm font-semibold text-purple-200 mb-2">Things to Learn:</h4>
            <div className="flex flex-col gap-2 items-start">
              {learningItems.map((item, index) => (
                <button
                  key={index}
                  className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    text-purple-300 bg-black/30 border border-purple-500
                    shadow-md shadow-purple-500/30
                    hover:bg-purple-500 hover:text-white
                    hover:shadow-lg hover:shadow-purple-500/50
                    transition-all duration-300 ease-in-out
                    text-left
                  `}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;