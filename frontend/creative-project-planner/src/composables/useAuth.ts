import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Define a User type or interface (you can modify this based on your needs)
interface User {
  id: number;
  name: string;
  email: string;
}

export function useAuth() {
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);
  const router = useRouter();

  // Mock login function (replace this with your actual API call)
  const login = async (email: string, password: string): Promise<void> => {
    try {
      // Example of setting user data (replace with actual API request)
      user.value = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com'
      };
      isAuthenticated.value = true;

      // Redirect to the dashboard or desired page after login
      await router.push('/portal/mydashboard');
    } catch (error) {
      console.error('Login failed', error);
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
