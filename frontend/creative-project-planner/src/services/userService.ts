import axios, { AxiosResponse, AxiosError } from 'axios';
import { getAuth0Client } from '@/views/auth/auth0';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

interface User {
  status: number;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  streetAddress: string;
  city: string;
  region: string;
  postalCode: string;
  password: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  streetAddress: string;
  city: string;
  region: string;
  postalCode: string;
  password: string;
  notifications: {
    sms: boolean;
    email: boolean;
  };
}

interface ApiErrorResponse {
  message: string;
  errorCode?: string;
}

// Reusable authorization header generator
const getAuthHeaders = async () => {
  try {
    const auth0Client = await getAuth0Client();
    const token = await auth0Client?.getTokenSilently();
    return { headers: { Authorization: `Bearer ${token}` } };
  } catch {
    throw new Error('Authentication failed');
  }
};

// Helper function to handle API errors
function handleApiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (axiosError.response) {
      const errorMessage = axiosError.response.data?.message || 'Unknown error';
      const errorCode = axiosError.response.data?.errorCode;

      console.error(`API error: ${errorMessage}`);
      alert(`Error: ${errorMessage}`);

      if (errorCode) {
        console.error(`Error code: ${errorCode}`);
      }
    } else if (axiosError.request) {
      console.error('Network error: No response received from the server.');
      alert('Network error: No response received.');
    } else {
      console.error('Axios error:', axiosError.message);
      alert(`Request error: ${axiosError.message}`);
    }
  } else {
    console.error('Unexpected error:', error);
    alert('An unexpected error occurred.');
  }
}

// Create a new user (registration)
export const registerUser = async (userData: UserData): Promise<AxiosResponse> => {
  try {
    return await axios.post(`${API_BASE_URL}/register`, userData);
  } catch (error) {
    handleApiError(error);
    throw error; // Re-throw to allow catch in calling component
  }
};

// User services object
export const userServices = {
  async updateUserProfile(profileData: UserData) {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.put(`${API_BASE_URL}/profile`, profileData, headers);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Fetch user profile
  async getUserProfile() {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/profile`, headers);
      return response.data.profile;
    } catch (error) {
      handleApiError(error);
    }
  },

  async uploadProfilePicture(file: File) {
    try {
      const headers = await getAuthHeaders();
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await axios.post(`${API_BASE_URL}/profile-picture`, formData, {
        ...headers,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      return response.data.profilePictureUrl;
    } catch (error) {
      handleApiError(error);
    }
  }
};