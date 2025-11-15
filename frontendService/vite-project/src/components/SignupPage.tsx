import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const roles = [
  { value: "ROLE_ADMIN", label: "Admin" },
  { value: "ROLE_USER", label: "User" },
  { value: "ROLE_TEACHER", label: "Teacher" },
  { value: "ROLE_STUDENT", label: "Student" },
  { value: "ROLE_PROJECT_HEAD", label: "Project Head" },
  { value: "ROLE_DEVELOPER", label: "Developer" },
];

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(roles[0].value);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    // setError("");
    // try {
    //   const res = await axiosInstance.post("/auth/signup", {
    //     email,
    //     password,
    //     role,
    //     fullName,
    //   });
    //   const { token, role: userRole } = res.data;
    //   localStorage.setItem("token", token);
    //   localStorage.setItem("role", userRole);
    //   // Redirect based on role
    //   if (userRole === "ROLE_ADMIN") {
    //     navigate("/admin");
    //   } else {
    //     navigate("/dashboard");
    //   }
    // } catch (err: any) {
    //   setError(err.response?.data?.message || "Signup failed");
    // }
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 to-purple-700 dark:from-purple-900 dark:to-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-purple-700 dark:text-purple-200">Sign Up</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full mb-4 px-4 py-2 rounded border border-gray-300 dark:bg-gray-700 dark:text-white"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 px-4 py-2 rounded border border-gray-300 dark:bg-gray-700 dark:text-white"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 px-4 py-2 rounded border border-gray-300 dark:bg-gray-700 dark:text-white"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <select
            className="w-full mb-6 px-4 py-2 rounded border border-gray-300 dark:bg-gray-700 dark:text-white"
            value={role}
            onChange={e => setRole(e.target.value)}
            required
          >
            {roles.map(r => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;