import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';


export function useAuth() {
  const user = ref(null);
  const isAuthenticated = ref(false);
  const router = useRouter();

  
  const login = async (email: string, password: string): Promise<void> => {
    try {
      // Call backend login API
      const response = await axios.post('http://localhost:3000/api/users/login', { email, password });
  
      // Extract user and token from response
      const { user: loggedInUser, token } = response.data;
  
      // Save user state and set as authenticated
      user.value = loggedInUser;
      isAuthenticated.value = true;
  
      // Optional: Save token to localStorage or cookies
      localStorage.setItem('authToken', token);
  
      // Redirect to the dashboard
      await router.push('/portal/mydashboard');
    } catch (error: any) {
      console.error('Login failed', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  // Mock logout function
  const logout = async (): Promise<void> => {
    user.value = null;
    isAuthenticated.value = false;
    
    // Redirect to login page after logout
    await router.push('/login');
  };

  // Check if the user is authenticated (e.g., check token in localStorage)
  const checkAuth = () => {
    // Implement actual logic to check if the user is authenticated
    // For example, check a token stored in localStorage or Vuex store
    const token = localStorage.getItem('authToken');
    if (token) {
      isAuthenticated.value = true;
    } else {
      isAuthenticated.value = false;
    }
  };

  return {
    user,
    isAuthenticated,
    login,
    logout,
    checkAuth
  };
}
