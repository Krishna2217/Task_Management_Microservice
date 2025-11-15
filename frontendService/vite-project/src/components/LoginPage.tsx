import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios, { isAxiosError } from "axios"; // Import axios

const LoginPage: React.FC = () => {
  // State for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State for handling errors and loading status
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Hook for navigation
  const navigate = useNavigate();

  // Form submission handler
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Using axios for the POST request.
      // Axios automatically stringifies the object and sets the correct headers.
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      // Axios places the response data in the `data` property
      const token = response.data.token;

      if (token) {
        // Store the JWT token in localStorage
        localStorage.setItem("token", token);

        // Navigate to the dashboard or another protected route
        navigate("/dashboard");
      } else {
        throw new Error("Login successful, but no token was provided.");
      }
    } catch (err) {
      // Axios automatically throws an error for non-2xx responses,
      // which simplifies error handling significantly.
      if (isAxiosError(err)) {
        // Access the server's error message from err.response.data
        setError(err.response?.data?.message || "Invalid credentials or server error.");
      } else {
        // Handle non-Axios errors
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 to-purple-700 dark:from-purple-900 dark:to-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700 dark:text-purple-200">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Display error message if login fails */}
          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors duration-300 disabled:bg-purple-400 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Don't have an account?{" "}
          <Link to="/register" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;