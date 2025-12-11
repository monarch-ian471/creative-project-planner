// src/types/index.ts

export interface UserProfile {
  _id?: string; // Optional field for user ID, can be auto-generated on the backend
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string; // Optional field for user profile picture URL
  location?: {
    city?: string; // Optional city
    country?: string; // Optional country
  };
}

export interface Project {
  _id: string; // ID is required for existing projects
  title: string;
  description: string;
  dueDate: Date; // Ensure it's always a Date object
  status?: string; // Optional status field to track project state (e.g., 'active', 'completed')
}

export interface Task {
  _id?: string; // Optional, may not be present when creating a new task
  name: string;
  completed: boolean;
  project?: string; // Optional, references the associated project (if any)
  dueDate?: Date; // Optional, task due date
  description?: string; // Optional, task description
}

export interface ProfileStats {
  totalProjects: number; // Total number of projects
  completedTasks: number; // Number of completed tasks
  pendingTasks: number; // Number of pending tasks
}

// Utility function to ensure date conversion
export function ensureDate(date: string | Date): Date {
  return date instanceof Date ? date : new Date(date);
}
