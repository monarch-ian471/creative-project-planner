import axios, { AxiosResponse } from 'axios';
import { getAuth0Client } from '@/views/auth/auth0';

const API_URL = 'http://localhost:3000/api/projects';  // Backend API URL

// Define the types for Project and ProjectData (you can adjust based on your actual project structure)
interface Project {
  id: string;
  name: string;
  description: string;
  // Add other fields here based on your project schema
}

interface ProjectData {
  name: string;
  description: string;
  // Add other fields here based on your project schema
}

// Get the authorization headers
const getAuthHeaders = async (): Promise<{ headers: { Authorization: string } }> => {
    const auth0Client = await getAuth0Client();
    if (!auth0Client) {
        throw new Error('Auth0 client is not initialized');
    }
    const token = await auth0Client.getTokenSilently();
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

// Get all projects
export const getProjects = async (): Promise<Project[]> => {
    try {
        const headers = await getAuthHeaders();
        const response: AxiosResponse<Project[]> = await axios.get(API_URL, headers);
        return response.data;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
};

// Get a single project by ID
export const getProjectById = async (id: string): Promise<Project> => {
    try {
        const headers = await getAuthHeaders();
        const response: AxiosResponse<Project> = await axios.get(`${API_URL}/${id}`, headers);
        return response.data;
    } catch (error) {
        console.error(`Error fetching project by ID (${id}):`, error);
        throw error;
    }
};

// Create a new project
export const createProject = async (projectData: ProjectData): Promise<Project> => {
    try {
        const headers = await getAuthHeaders();
        const response: AxiosResponse<Project> = await axios.post(API_URL, projectData, headers);
        return response.data;
    } catch (error) {
        console.error('Error creating project:', error);
        throw error;
    }
};

// Update a project by ID
export const updateProject = async (id: string, projectData: ProjectData): Promise<Project> => {
    try {
        const headers = await getAuthHeaders();
        const response: AxiosResponse<Project> = await axios.put(`${API_URL}/${id}`, projectData, headers);
        return response.data;
    } catch (error) {
        console.error(`Error updating project by ID (${id}):`, error);
        throw error;
    }
};

// Delete a project by ID
export const deleteProject = async (id: string): Promise<void> => {
    try {
        const headers = await getAuthHeaders();
        const response: AxiosResponse<void> = await axios.delete(`${API_URL}/${id}`, headers);
        return response.data;
    } catch (error) {
        console.error(`Error deleting project by ID (${id}):`, error);
        throw error;
    }
};
