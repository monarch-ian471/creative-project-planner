import axios, { AxiosResponse } from 'axios';
import { getAuth0Client } from '@/views/auth/auth0';

const API_URL_PROJECTS = 'http://localhost:3000/api/projects'; // Projects API endpoint
const API_URL_TASKS = 'http://localhost:3000/api/tasks'; // Tasks API endpoint

// Define the types for Project and Task
interface Project {
  id: string;
  name: string;
  description: string;
  status: string; // E.g., 'active', 'completed'
  start_date: string;
  end_date: string;
  tasks: Task[]; // Associated tasks
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string; // E.g., 'pending', 'in-progress', 'completed'
  start_date: string;
  due_date: string;
  project_id: string;
}

interface ProjectData {
  name: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
}

interface TaskData {
  title: string;
  description: string;
  status: string;
  start_date: string;
  due_date: string;
  project_id: string;
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
      Authorization: `Bearer ${token}`,
    },
  };
};

// Project Services

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

// Get a single project by ID (with tasks)
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

// Create a new project
export const addProject = async (projectData: ProjectData): Promise<Project> => {
  try {
    const headers = await getAuthHeaders();
    const response: AxiosResponse<Project> = await axios.post(API_URL_PROJECTS, projectData, headers);
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
    const response: AxiosResponse<Project> = await axios.put(`${API_URL_PROJECTS}/${id}`, projectData, headers);
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
    const response: AxiosResponse<void> = await axios.delete(`${API_URL_PROJECTS}/${id}`, headers);
    return response.data;
  } catch (error) {
    console.error(`Error deleting project by ID (${id}):`, error);
    throw error;
  }
};

// Task Services

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

// Get a single task by ID
export const getTaskById = async (id: string): Promise<Task> => {
  try {
    const headers = await getAuthHeaders();
    const response: AxiosResponse<Task> = await axios.get(`${API_URL_TASKS}/${id}`, headers);
    return response.data;
  } catch (error) {
    console.error(`Error fetching task by ID (${id}):`, error);
    throw error;
  }
};

// Create a new task
export const addTask = async (taskData: TaskData): Promise<Task> => {
  try {
    const headers = await getAuthHeaders();
    const response: AxiosResponse<Task> = await axios.post(API_URL_TASKS, taskData, headers);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Update a task by ID
export const updateTask = async (id: string, taskData: TaskData): Promise<Task> => {
  try {
    const headers = await getAuthHeaders();
    const response: AxiosResponse<Task> = await axios.put(`${API_URL_TASKS}/${id}`, taskData, headers);
    return response.data;
  } catch (error) {
    console.error(`Error updating task by ID (${id}):`, error);
    throw error;
  }
};

// Delete a task by ID
export const deleteTask = async (id: string): Promise<void> => {
  try {
    const headers = await getAuthHeaders();
    const response: AxiosResponse<void> = await axios.delete(`${API_URL_TASKS}/${id}`, headers);
    return response.data;
  } catch (error) {
    console.error(`Error deleting task by ID (${id}):`, error);
    throw error;
  }
};
