import axiosInstance from "./axiosInstance";
import type { TaskCardProps } from "../components/TaskCard";

export const DEFAULT_TASK_IMAGE = "https://cdn-icons-png.flaticon.com/512/1147/1147805.png";

export const PREDEFINED_LEARNING_ITEMS = [
  "Java",
  "Spring Boot",
  "MERN",
  "React",
  "Node.js",
  "TypeScript",
  "GraphQL",
  "Tailwind CSS",
];

// backend TaskStatus enum -> TaskCard's display status
const statusMap: Record<string, string> = {
  PENDING: "not-started",
  ASSIGNED: "in-progress",
  DONE: "completed",
};

export interface BackendTask {
  id: number;
  title: string;
  description: string;
  image: string | null;
  assignedUserId: number | null;
  tags: string[];
  status: string;
}

export const mapBackendTask = (
  task: BackendTask,
  userNamesById?: Record<number, string>
): TaskCardProps => ({
  id: String(task.id),
  imageUrl: task.image || DEFAULT_TASK_IMAGE,
  title: task.title,
  description: task.description,
  learningItems: task.tags ?? [],
  status: statusMap[task.status] ?? "not-started",
  assignedUserName:
    task.assignedUserId != null ? userNamesById?.[task.assignedUserId] : undefined,
});

// GET /api/users (USER-SERVICE) is the source of truth for resolving assignedUserId -> a display name
export const fetchUserNamesById = async (): Promise<Record<number, string>> => {
  const res = await axiosInstance.get<{ id: number; fullName: string }[]>("/api/users");
  return Object.fromEntries(res.data.map((u) => [u.id, u.fullName]));
};
