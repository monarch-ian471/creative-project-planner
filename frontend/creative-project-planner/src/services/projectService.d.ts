// src/services/projectService.d.ts
import { Project, Task } from '../types/index'; // Ensure correct types are imported

declare module '@/services/projectService' {
  export interface ProjectService {
    createProject(projectData: Omit<Project, '_id'>): Promise<Project>; // Ensure Project data type is consistent
    getProjects(): Promise<Project[]>; // Return an array of Project objects
    updateProject(projectId: string, projectData: Partial<Project>): Promise<Project>; // Partial type for updating
    deleteProject(projectId: string): Promise<void>; // No return value
    getTasks(): Promise<Task[]>; // Fetch Tasks
    addTask(taskData: Omit<Task, '_id'>): Promise<Task>; // Add new Task
    fetchUserProfile(): Promise<any>; // Assuming profile structure
    fetchUserStats(): Promise<any>; // Assuming stats structure
    uploadProfilePicture(file: File): Promise<string>; // Returns the URL of the uploaded profile picture
  }

  export const projectService: ProjectService;

  export default projectService;
}
