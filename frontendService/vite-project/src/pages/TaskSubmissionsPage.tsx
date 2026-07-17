import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { isAxiosError } from "axios";
import axiosInstance from "../utils/axiosInstance";
import type { Page } from "../utils/page";

interface Submission {
  id: number;
  taskId: number;
  githubLink: string;
  userId: number;
  status: string;
  submissionTime: string;
}

const statusClasses = (status: string) => {
  switch (status) {
    case "ACCEPT":
      return "bg-green-500/20 text-green-300 border-green-500/30";
    case "DECLINE":
      return "bg-red-500/20 text-red-300 border-red-500/30";
    default:
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
  }
};

const TaskSubmissionsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [githubLink, setGithubLink] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchSubmissions = async () => {
    const res = await axiosInstance.get<Page<Submission>>(`/api/submission/task/${id}`, {
      params: { size: 100 },
    });
    setSubmissions(res.data.content);
  };

  useEffect(() => {
    fetchSubmissions().finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await axiosInstance.post("/api/submission", {
        taskId: Number(id),
        githubLink,
      });
      setGithubLink("");
      await fetchSubmissions();
    } catch (err) {
      setError(isAxiosError(err) ? err.response?.data?.detail || "Failed to submit." : "Failed to submit.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReview = async (submissionId: number, status: "ACCEPT" | "DECLINE") => {
    await axiosInstance.put(`/api/submission/${submissionId}`, null, { params: { status } });
    await fetchSubmissions();
  };

  if (loading) {
    return <p className="text-purple-300 text-center mt-10">Loading submissions...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Task Submissions</h1>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
        <input
          type="url"
          value={githubLink}
          onChange={(e) => setGithubLink(e.target.value)}
          placeholder="https://github.com/you/your-repo"
          required
          className="flex-grow px-4 py-2 rounded-lg border border-purple-500/30 bg-white/5 dark:bg-gray-700/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors disabled:bg-green-400/50 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
      {error && <p className="text-red-400 mb-4">{error}</p>}

      {submissions.length === 0 ? (
        <p className="text-purple-300">No submissions yet.</p>
      ) : (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {submissions.map((sub) => (
            <div key={sub.id} className="bg-white/10 dark:bg-gray-800/50 p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-between gap-4">
                <a
                  href={sub.githubLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple-300 hover:text-white underline break-all"
                >
                  {sub.githubLink}
                </a>
                <span className={`shrink-0 px-3 py-1 text-xs font-semibold rounded-full border ${statusClasses(sub.status)}`}>
                  {sub.status}
                </span>
              </div>
              <p className="text-xs text-purple-400 mt-1">
                Submitted {new Date(sub.submissionTime).toLocaleString()}
              </p>
              {sub.status === "PENDING" && (
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => handleReview(sub.id, "ACCEPT")}
                    className="px-4 py-1.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReview(sub.id, "DECLINE")}
                    className="px-4 py-1.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default TaskSubmissionsPage;
