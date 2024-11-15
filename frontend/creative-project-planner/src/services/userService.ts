import axios, { AxiosResponse } from 'axios';
import { getAuth0Client } from '@/views/auth/auth0';  // Assuming you're using Auth0 for authentication

const API_URL = 'http://localhost:3000/api/users'; // Your backend API for user registration

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
  // Add other fields like notifications, etc., based on your schema
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
    password: string; // Add password field here
    notifications: {
      sms: boolean;
      email: boolean;
    };
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

// Create a new user (registration)
export const registerUser = async (userData: { firstName: string; lastName: string; email: string; phone: string; country: string; streetAddress: string; city: string; region: string; postalCode: string; password: string; notifications: { sms: boolean; email: boolean; }; }) => {
    try {
      const response = await axios.post('/api/users/register', userData);
      return response;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  };
