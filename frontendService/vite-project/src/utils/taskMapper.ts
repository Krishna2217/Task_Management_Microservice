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

export const mapBackendTask = (task: BackendTask): TaskCardProps => ({
  id: String(task.id),
  imageUrl: task.image || DEFAULT_TASK_IMAGE,
  title: task.title,
  description: task.description,
  learningItems: task.tags ?? [],
  status: statusMap[task.status] ?? "not-started",
});
