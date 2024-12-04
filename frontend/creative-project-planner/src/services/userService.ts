import axios, { AxiosResponse } from 'axios';
import { getAuth0Client } from '@/views/auth/auth0';

const API_BASE_URL = 'http://localhost:3000/api/users';

// Define the types for User and UserData
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

// Get the authorization headers
const getAuthHeaders = async (): Promise<{ headers: { Authorization: string } }> => {
  try {
    const auth0Client = await getAuth0Client();
    if (!auth0Client) {
      throw new Error('Auth0 client is not initialized');
    }
    const token = await auth0Client.getTokenSilently();
    return { headers: { Authorization: `Bearer ${token}` } };
  } catch (error) {
    console.error('Error getting auth headers:', error);
    throw error;
  }
};

// Create a new user (registration)
export const registerUser = async (userData: UserData): Promise<AxiosResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    return response;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

// User services
export const userServices = {
  // Add this to your existing userServices object
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
        }
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
        } catch (error) {
          console.error('Error updating user profile:', error);
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
    } catch (error) {
      console.error('Error fetching user profile:', error);
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
    } catch (error) {
      console.error('Error fetching user stats:', error);
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
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  }
};