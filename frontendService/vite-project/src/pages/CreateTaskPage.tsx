import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const predefinedLearningItems = [
  "Java",
  "Spring Boot",
  "MERN",
  "React",
  "Node.js",
  "TypeScript",
  "GraphQL",
  "Tailwind CSS",
];

const CreateTaskPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedLearningItems, setSelectedLearningItems] = useState<string[]>([]);
  const navigate = useNavigate();

  // Function to handle adding/removing learning items
  const handleLearningItemChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (!selectedLearningItems.includes(value)) {
      setSelectedLearningItems((prev) => [...prev, value]);
    }
  };

  // Function to remove a learning item
  const handleRemoveLearningItem = (item: string) => {
    setSelectedLearningItems((prev) => prev.filter((i) => i !== item));
  };

  // Function to handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Create a new task object
    const newTask = {
      id: Date.now().toString(), // Generate a unique ID
      title,
      description,
      imageUrl,
      learningItems: selectedLearningItems,
    };

    console.log("New Task Created:", newTask);

    // Redirect to the dashboard or tasks page after submission
    navigate("/tasks");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-black/20 dark:bg-gray-900/40 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-white mb-6">Create New Task</h1>
      <form onSubmit={handleSubmit}>
        {/* Title Input */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-purple-200">
            Task Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-purple-500 rounded-md shadow-sm bg-black/30 text-white focus:ring-purple-500 focus:border-purple-500"
            placeholder="Enter task title"
            required
          />
        </div>

        {/* Description Input */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-purple-200">
            Task Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-purple-500 rounded-md shadow-sm bg-black/30 text-white focus:ring-purple-500 focus:border-purple-500"
            placeholder="Enter task description"
            rows={4}
            required
          ></textarea>
        </div>

        {/* Image URL Input */}
        <div className="mb-4">
          <label htmlFor="imageUrl" className="block text-sm font-medium text-purple-200">
            Image URL
          </label>
          <input
            type="text"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-purple-500 rounded-md shadow-sm bg-black/30 text-white focus:ring-purple-500 focus:border-purple-500"
            placeholder="Enter image URL"
            required
          />
        </div>

        {/* Learning Items Dropdown */}
        <div className="mb-4" >
          <label htmlFor="learningItems" className="block text-sm font-medium text-purple-200">
            Learning Items
          </label>
          <select
            id="learningItems"
            onChange={handleLearningItemChange}
            className="mt-1 block w-full px-3 py-2 bg-purple-700 border border-purple-500 rounded-md shadow-sm text-white focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="" disabled selected>
              Select learning items
            </option>
            {predefinedLearningItems.map((item) => (
              <option key={item} value={item} className="bg-black/20 dark:bg-gray-900/40 text-white">
                {item}
              </option>
            ))}
          </select>

          {/* Display Selected Learning Items */}
          <div className="mt-2">
            {selectedLearningItems.map((item) => (
              <span
                key={item}
                className="inline-flex items-center px-3 py-1 mr-2 mb-2 text-sm font-medium text-purple-300 bg-black/30 border border-purple-500 rounded-full shadow-md shadow-purple-500/30"
              >
                {item}
                <button
                  type="button"
                  onClick={() => handleRemoveLearningItem(item)}
                  className="ml-2 text-purple-300 hover:text-red-500"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-purple-500 text-white font-semibold rounded-md shadow hover:bg-purple-600 focus:ring-2 focus:ring-purple-500"
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTaskPage;