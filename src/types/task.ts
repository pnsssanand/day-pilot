export type TaskCategory = "work" | "personal" | "learn" | "health" | "company" | "other";

export interface Task {
  id: string;
  title: string;
  notes: string | null;
  date: string; // YYYY-MM-DD format
  time: string | null; // HH:mm format
  userId: string;
  priority: boolean;
  category: TaskCategory;
  completed: boolean;
  createdAt: Date;
  updatedAt?: Date;
  repeat: "daily" | "weekly" | "monthly" | null;
}

export type TaskFormData = Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">;

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  work: "Work",
  personal: "Personal",
  learn: "To Learn",
  health: "Health",
  company: "Company",
  other: "Other",
};

export const CATEGORY_COLORS: Record<TaskCategory, string> = {
  work: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  personal: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  learn: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  health: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  company: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  other: "bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-300",
};
