import axios from 'axios';
import { ref, Ref } from 'vue';
import { useRouter } from 'vue-router';

// Define a User interface
interface User {
  id: string;
  name?: string;
  email: string;
  // Add other user properties as needed
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export function useAuth() {
  const user: Ref<User | null> = ref(null);
  const isAuthenticated: Ref<boolean> = ref(false);
  const router = useRouter();

  // Set up Axios interceptor to automatically add Authorization header
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    }, 
    (error) => Promise.reject(error)
  );

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, { email, password });
      const { user: loggedInUser, token } = response.data;

      user.value = loggedInUser;
      isAuthenticated.value = true;
      localStorage.setItem('authToken', token);

      // Redirect to dashboard after login
      await router.push('/portal/mydashboard');
    } catch (error) {
      // Type guard for Axios error
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Login failed';
        console.error('Login failed', errorMessage);
        throw new Error(errorMessage);
      } else {
        console.error('Unexpected login error', error);
        throw new Error('An unexpected error occurred');
      }
    }
  };
  

  const logout = async (): Promise<void> => {
    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('authToken');
    await router.push('/login');
  };

  const checkAuth = () => {
    const token = localStorage.getItem('authToken');
    isAuthenticated.value = !!token;
  };

  return {
    user,
    isAuthenticated,
    login,
    logout,
    checkAuth
  };
}