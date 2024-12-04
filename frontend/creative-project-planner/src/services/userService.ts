import axios, { AxiosResponse, AxiosError } from 'axios';
import { getAuth0Client } from '@/views/auth/auth0';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  errorCode?: string; // optional property
  // You can add other fields here as necessary
}


// Get the authorization headers
const getAuthHeaders = async (): Promise<{ headers: { Authorization: string } }> => {
  try {
    const auth0Client = await getAuth0Client();
    if (!auth0Client) {
      throw new Error('Auth0 client is not initialized');
    }
    const token = await auth0Client.getTokenSilently();
    return { headers: { Authorization: `Bearer ${token}` } };
  } catch (error: unknown) {
    console.error('Error getting auth headers:', error);
    throw error;
  }
};

// Create a new user (registration)
export const registerUser = async (userData: UserData): Promise<AxiosResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    return response;
  } catch (error: unknown) {
    handleApiError(error);
    throw error;
  }
};

// User services
export const userServices = {
  // Update user profile
  async updateUserProfile(profileData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    streetAddress: string;
    city: string;
    region: string;
    postalCode: string;
    profilePicture: string;
    notifications: {
      sms: boolean;
      email: boolean;
    };
  }) {
    try {
      const auth0Client = await getAuth0Client();
      if (!auth0Client) {
        throw new Error('Auth0 client is not initialized');
      }
      const token = await auth0Client.getTokenSilently();
      const response = await axios.put(`${API_BASE_URL}/profile`, profileData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: unknown) {
      handleApiError(error);
      throw error;
    }
  },

  // Fetch user profile
  async getUserProfile() {
    try {
      const auth0Client = await getAuth0Client();
      if (!auth0Client) {
        throw new Error('Auth0 client is not initialized');
      }
      const token = await auth0Client.getTokenSilently();
      const response = await axios.get(`${API_BASE_URL}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data.profile;
    } catch (error: unknown) {
      handleApiError(error);
      throw error;
    }
  },

  // Fetch user stats
  async getUserStats() {
    try {
      const auth0Client = await getAuth0Client();
      if (!auth0Client) {
        throw new Error('Auth0 client is not initialized');
      }
      const token = await auth0Client.getTokenSilently();
      const response = await axios.get(`${API_BASE_URL}/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data.stats;
    } catch (error: unknown) {
      handleApiError(error);
      throw error;
    }
  },

  // Upload profile picture
  async uploadProfilePicture(file: File) {
    try {
      const auth0Client = await getAuth0Client();
      if (!auth0Client) {
        throw new Error('Auth0 client is not initialized');
      }
      const token = await auth0Client.getTokenSilently();
      const formData = new FormData();
      formData.append('profilePicture', file);
      const response = await axios.post(`${API_BASE_URL}/profile-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data.profilePictureUrl;
    } catch (error: unknown) {
      handleApiError(error);
      throw error;
    }
  }
};

// Helper function to handle API errors
function handleApiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    // Assert that the error response follows the ApiErrorResponse structure
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (axiosError.response) {
      // Now TypeScript knows that axiosError.response.data is of type ApiErrorResponse
      const errorMessage = axiosError.response.data?.message || 'Unknown error';
      const errorCode = axiosError.response.data?.errorCode;

      // Log and alert the error message
      console.error(`API error: ${errorMessage}`);
      alert(`Error: ${errorMessage}`);

      // You can also access other fields, e.g., errorCode
      if (errorCode) {
        console.error(`Error code: ${errorCode}`);
      }
    } else if (axiosError.request) {
      // Handle case where no response was received (network error, etc.)
      console.error('Network error: No response received from the server.');
      alert('Network error: No response received.');
    } else {
      // Handle other errors (such as Axios configuration errors)
      console.error('Axios error:', axiosError.message);
      alert(`Request error: ${axiosError.message}`);
    }
  } else {
    // Handle non-Axios errors
    console.error('Unexpected error:', error);
    alert('An unexpected error occurred.');
  }
}
