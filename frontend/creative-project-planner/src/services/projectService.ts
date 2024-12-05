import axios from 'axios';
import type { Project, Task, UserProfile } from '../types';
import { getAuth0Client } from '@/views/auth/auth0'; // Make sure getAuth0Client is correctly imported

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

const getAuthHeaders = async () => {
  try {
    const auth0Client = await getAuth0Client();
    if (!auth0Client) {
      throw new Error('Auth0 client is not initialized');
    }
    const token = await auth0Client.getTokenSilently();
    return { Authorization: `Bearer ${token}` };
  } catch (error) {
    console.error('Error getting auth token:', error);
    throw error;
  }
};

export const projectService = {
  async getProjects(): Promise<Project[]> {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/projects`, { headers });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Failed to fetch projects', error.response?.data);
        console.error('Error Status:', error.response?.status);
      } else if (error instanceof Error) {
        console.error('Failed to fetch projects', error.message);
      } else {
        console.error('An unknown error occurred while fetching projects');
      }
      throw error;
    }
  },

  async getTasks(): Promise<Task[]> {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/tasks`, { headers });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tasks', error);
      throw error;
    }
  },

  async addProject(projectData: Omit<Project, '_id'>): Promise<Project> {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(`${API_BASE_URL}/projects`, projectData, { headers });
      return response.data;
    } catch (error) {
      console.error('Failed to create project', error);
      throw error;
    }
  },

  async addTask(taskData: Omit<Task, '_id'>): Promise<Task> {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(`${API_BASE_URL}/tasks`, taskData, { headers });
      return response.data;
    } catch (error) {
      console.error('Failed to create task', error);
      throw error;
    }
  },

  async fetchUserProfile() {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/users/profile`, { headers });
      return response.data.profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  async fetchUserStats() {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/users/stats`, { headers });
      return response.data.stats;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  },

  async updateUserProfile(profileData: UserProfile) {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error('Failed to update user profile');
    }

    return await response.json();
  },

  async uploadProfilePicture(file: File) {
    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(`${API_BASE_URL}/users/profile-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...headers // Include the authorization token here
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
      const headers = await getAuthHeaders();
      const response = await axios.patch(`${API_BASE_URL}/projects/${projectId}`, projectData, { headers });
      return response.data;
    } catch (error) {
      console.error(`Failed to update project ${projectId}`, error);
      throw error;
    }
  },

  async deleteProject(projectId: string): Promise<void> {
    try {
      const headers = await getAuthHeaders();
      await axios.delete(`${API_BASE_URL}/projects/${projectId}`, { headers });
    } catch (error) {
      console.error(`Failed to delete project ${projectId}`, error);
      throw error;
    }
  }
};
export { Project };

