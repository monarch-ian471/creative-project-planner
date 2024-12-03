// src/stores/projectStore.ts
import { defineStore } from 'pinia';
import { Project, Task, UserProfile, ProfileStats } from '@/types/index';
import { projectService } from '@/services/projectService';

interface ProjectState {
  projects: Project[];
  tasks: Task[];
  userProfile: UserProfile;
  profileStats: ProfileStats;
  loading: boolean;
  error: string | null;
}

export const useProjectStore = defineStore('projects', {
  state: (): ProjectState => ({
    projects: [],
    tasks: [],
    userProfile: {
      firstName: '',
      lastName: '',
      email: '',
      profilePicture: '/default-avatar.png'
    },
    profileStats: {
      totalProjects: 0,
      completedTasks: 0,
      pendingTasks: 0
    },
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchData() {
      this.loading = true;
      this.error = null;
      try {
        const [fetchedProjects, fetchedTasks] = await Promise.all([
          projectService.getProjects(),
          projectService.getTasks()
        ]);
        
        // Ensure date conversion
        this.projects = fetchedProjects.map(project => ({
          ...project,
          dueDate: project.dueDate instanceof Date 
            ? project.dueDate 
            : new Date(project.dueDate)
        }));
        
        this.projects = fetchedProjects;
        this.tasks = fetchedTasks;
      } catch (error) {
        this.handleError(error, 'Failed to fetch data');
        this.projects = [];
        this.tasks = [];
      } finally {
        this.loading = false;
      }
    },
    
    async createProject(projectData: Omit<Project, '_id'>) {
      try {
        const newProject = await projectService.addProject(projectData);
        this.projects.push(newProject);
        await this.fetchData(); // Refresh to get updated stats
        return newProject;
      } catch (error) {
        this.handleError(error, 'Failed to create project');
        throw error;
      }
    },
    
    async createTask(taskData: Omit<Task, '_id'>) {
      try {
        const newTask = await projectService.addTask(taskData);
        this.tasks.push(newTask);
        await this.fetchData(); // Refresh to get updated stats
        return newTask;
      } catch (error) {
        this.handleError(error, 'Failed to create task');
        throw error;
      }
    },
    
    async fetchUserProfile() {
      try {
        this.userProfile = await projectService.fetchUserProfile();
        return this.userProfile;
      } catch (error) {
        this.handleError(error, 'Failed to fetch user profile');
        throw error;
      }
    },
    
    async fetchUserStats() {
      try {
        this.profileStats = await projectService.fetchUserStats();
        return this.profileStats;
      } catch (error) {
        this.handleError(error, 'Failed to fetch user stats');
        throw error;
      }
    },
    
    async uploadProfilePicture(file: File) {
      try {
        const profilePictureUrl = await projectService.uploadProfilePicture(file);
        this.userProfile.profilePicture = profilePictureUrl;
        return profilePictureUrl;
      } catch (error) {
        this.handleError(error, 'Failed to upload profile picture');
        throw error;
      }
    },
    
    async updateProject(projectId: string, projectData: Partial<Project>) {
      try {
        const updatedProject = await projectService.updateProject(projectId, projectData);
        const index = this.projects.findIndex(p => p._id === projectId);
        if (index !== -1) {
          this.projects[index] = updatedProject;
        }
        return updatedProject;
      } catch (error) {
        this.handleError(error, 'Failed to update project');
        throw error;
      }
    },
    
    async deleteProject(projectId: string) {
      try {
        await projectService.deleteProject(projectId);
        this.projects = this.projects.filter(p => p._id !== projectId);
        this.tasks = this.tasks.filter(t => t.project !== projectId);
        return projectId;
      } catch (error) {
        this.handleError(error, 'Failed to delete project');
        throw error;
      }
    },
    
    // New centralized error handling method
    handleError(error: unknown, defaultMessage: string) {
      this.error = error instanceof Error ? error.message : defaultMessage;
      console.error(defaultMessage, error);
    }
  }
});