import axios, { AxiosResponse } from 'axios';
import { getAuth0Client } from '@/views/auth/auth0';

const API_URL_PROJECTS = 'http://localhost:3000/api/projects'; // Projects API endpoint
const API_URL_TASKS = 'http://localhost:3000/api/tasks'; // Tasks API endpoint

// Updated interfaces to match backend schema
interface Project {
  _id?: string; // Backend uses _id for MongoDB documents
  title: string;
  description: string;
  dueDate: Date;
  createdAt?: Date;
}

interface Task {
  _id?: string; // Backend uses _id for MongoDB documents
  name: string;
  completed: boolean;
  project?: string; // Reference to project ID
}

// Get authorization headers
const getAuthHeaders = async (): Promise<{ headers: { Authorization: string } }> => {
  const auth0Client = await getAuth0Client();
  if (!auth0Client) {
    throw new Error('Auth0 client is not initialized');
  }
  const token = await auth0Client.getTokenSilently();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all projects
export const getProjects = async (): Promise<Project[]> => {
  try {
    const headers = await getAuthHeaders();
    const response: AxiosResponse<Project[]> = await axios.get(API_URL_PROJECTS, headers);
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

// Get all tasks
export const getTasks = async (): Promise<Task[]> => {
  try {
    const headers = await getAuthHeaders();
    const response: AxiosResponse<Task[]> = await axios.get(API_URL_TASKS, headers);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// Create a new project
export const addProject = async (projectData: {
  title: string;
  description: string;
  dueDate: Date;
}): Promise<Project> => {
  try {
    const headers = await getAuthHeaders();
    const response: AxiosResponse<Project> = await axios.post(API_URL_PROJECTS, {
      title: projectData.title,
      description: projectData.description,
      dueDate: projectData.dueDate
    }, headers);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

// Create a new task
export const addTask = async (taskData: {
  name: string;
  completed?: boolean;
  project?: string;
}): Promise<Task> => {
  try {
    const headers = await getAuthHeaders();
    const response: AxiosResponse<Task> = await axios.post(API_URL_TASKS, {
      name: taskData.name,
      completed: taskData.completed || false,
      project: taskData.project
    }, headers);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Additional CRUD methods (you can expand these as needed)
export const getProjectById = async (id: string): Promise<Project> => {
  try {
    const headers = await getAuthHeaders();
    const response: AxiosResponse<Project> = await axios.get(`${API_URL_PROJECTS}/${id}`, headers);
    return response.data;
  } catch (error) {
    console.error(`Error fetching project by ID (${id}):`, error);
    throw error;
  }
};

export const updateProject = async (id: string, projectData: Partial<Project>): Promise<Project> => {
  try {
    const headers = await getAuthHeaders();
    const response: AxiosResponse<Project> = await axios.put(`${API_URL_PROJECTS}/${id}`, projectData, headers);
    return response.data;
  } catch (error) {
    console.error(`Error updating project by ID (${id}):`, error);
    throw error;
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    const headers = await getAuthHeaders();
    await axios.delete(`${API_URL_PROJECTS}/${id}`, headers);
  } catch (error) {
    console.error(`Error deleting project by ID (${id}):`, error);
    throw error;
  }
};