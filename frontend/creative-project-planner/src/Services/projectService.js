import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import { getAuth0Client } from '@/views/auth/auth0';  // 

const API_URL = 'http://localhost:3000/api/projects';  // Backend API URL

// Get the authorization headers
const getAuthHeaders = async () => {
    const auth0Client = await getAuth0Client();
    const token = await auth0Client.getTokenSilently();
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

// Get all projects
export const getProjects = async () => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(API_URL, headers);
        return response.data;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
};

// Get a single project by ID
export const getProjectById = async (id) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API_URL}/${id}`, headers);
        return response.data;
    } catch (error) {
        console.error('Error fetching project by ID:', error);
        throw error;
    }
};

// Create a new project
export const createProject = async (projectData) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.post(API_URL, projectData, headers);
        return response.data;
    } catch (error) {
        console.error('Error creating project:', error);
        throw error;
    }
};

// Update a project by ID
export const updateProject = async (id, projectData) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.put(`${API_URL}/${id}`, projectData, headers);
        return response.data;
    } catch (error) {
        console.error('Error updating project:', error);
        throw error;
    }
};

// Delete a project by ID
export const deleteProject = async (id) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios.delete(`${API_URL}/${id}`, headers);
        return response.data;
    } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
};
