export interface UserProfile {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
    location?: {
      city?: string;
      country?: string;
    };
  }
  
  export interface Project {
    _id: string;
    title: string;
    description: string;
    dueDate: Date; // Always ensure it's a Date object
    status?: string; // Optional status field
  }
  
  export interface Task {
    _id?: string;
    name: string;
    completed: boolean;
    project?: string;
    dueDate?: Date;
    description?: string;
  }
  
  export interface ProfileStats {
    totalProjects: number;
    completedTasks: number;
    pendingTasks: number;
  }
  
  // Utility function to ensure date conversion
  export function ensureDate(date: string | Date): Date {
    return date instanceof Date ? date : new Date(date);
  }