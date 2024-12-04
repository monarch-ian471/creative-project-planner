// src/services/projectService.ts
import axios from 'axios';
import { Project, Task } from '@/types/index';
import { initializeAuth0 } from '@/views/auth/auth0';

const API_BASE_URL  = import.meta.env.VITE_API_BASE_URL;

export const projectService = {
  async getProjects(): Promise<Project[]> {
    try {
      await initializeAuth0();
      const response = await axios.get(`${API_BASE_URL}/projects`, {
        headers: {
          'Authorization': `Bearer`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch projects', error);
      throw error;
    }
  },

  async getTasks(): Promise<Task[]> {
    try {
      await initializeAuth0();
      const response = await axios.get(`${API_BASE_URL}/tasks`, {
        headers: {
          'Authorization': `Bearer`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tasks', error);
      throw error;
    }
  },

  async addProject(projectData: Omit<Project, '_id'>): Promise<Project> {
    try {
      await initializeAuth0();
      const response = await axios.post(`${API_BASE_URL}/projects`, projectData, {
        headers: {
          'Authorization': `Bearer`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create project', error);
      throw error;
    }
  },

  async addTask(taskData: Omit<Task, '_id'>): Promise<Task> {
    try {
      await initializeAuth0();
      const response = await axios.post(`${API_BASE_URL}/tasks`, taskData, {
        headers: {
          'Authorization': `Bearer`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create task', error);
      throw error;
    }
  },

  async fetchUserProfile() {
    try {
      await initializeAuth0();
      const response = await axios.get('/api/users/profile', {
        headers: {
          'Authorization': `Bearer`
        }
      });
      return response.data.profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  async fetchUserStats() {
    try {
      const response = await axios.get('/api/users/stats', {
        headers: {
          'Authorization': `Bearer`
        }
      });
      return response.data.stats;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  },

  async uploadProfilePicture(file: File) {
    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const response = await axios.post('/api/users/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer`
        }
      });
      return response.data.profilePictureUrl;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  },
  
  async updateProject(projectId: string, projectData: Partial<Project>): Promise<Project> {
    try {
      await initializeAuth0();
      const response = await axios.patch(`${API_BASE_URL}/projects/${projectId}`, projectData, {
        headers: {
          'Authorization': `Bearer`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to update project ${projectId}`, error);
      throw error;
    }
  },

  async deleteProject(projectId: string): Promise<void> {
    try {
      await initializeAuth0();
      await axios.delete(`${API_BASE_URL}/projects/${projectId}`, {
        headers: {
          'Authorization': `Bearer`
        }
      });
    } catch (error) {
      console.error(`Failed to delete project ${projectId}`, error);
      throw error;
    }
  }
};
