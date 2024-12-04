import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export function useAuth() {
  const user = ref(null);
  const isAuthenticated = ref(false);
  const router = useRouter();

  // Set up Axios interceptor to automatically add Authorization header
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await axios.post('http://localhost:3000/api/users/login', { email, password });
      const { user: loggedInUser, token } = response.data;

      user.value = loggedInUser;
      isAuthenticated.value = true;
      localStorage.setItem('authToken', token);

      // Redirect to dashboard after login
      await router.push('/portal/mydashboard');
    } catch (error: any) {
      console.error('Login failed', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Login failed');
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
