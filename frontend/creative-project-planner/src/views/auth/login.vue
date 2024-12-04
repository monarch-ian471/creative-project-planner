<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  initializeAuth0, 
  loginWithRedirect, 
  getAuth0Client, 
  logout as auth0Logout,
  isAuthenticated as checkIsAuthenticated
} from '@/views/auth/auth0';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { useAuth } from '@/composables/useAuth';
import { useProjectStore } from '@/store/projectStore'; // Import the project store

export default defineComponent({
  name: 'LoginView',
  setup() {
    const email = ref('');
    const password = ref('');
    const router = useRouter();
    const loading = ref(false);
    const errorMessage = ref('');
    const auth0Client = ref<Auth0Client | null>(null);
    const authenticationChecked = ref(false);
    const isAuthenticated = ref(false);
    
    // Use the project store to manage user profile and authentication state
    const projectStore = useProjectStore();

    onMounted(async () => {
      try {
        auth0Client.value = await initializeAuth0();
        isAuthenticated.value = await checkIsAuthenticated();
        authenticationChecked.value = true;

        // If the user is authenticated, try to fetch their profile
        if (isAuthenticated.value) {
          await projectStore.fetchUserProfile(); // Fetch user profile from the backend
        }
      } catch (error) {
        console.error('Failed to initialize Auth0 client:', error);
        errorMessage.value = 'Authentication setup failed';
        authenticationChecked.value = true;
      }
    });

    const handleLogin = async () => {
      const { login } = useAuth();
        
      // Reset error message and set loading state
      errorMessage.value = '';
      loading.value = true;

      try {
        // Validate input fields before attempting login
        if (!email.value || !password.value) {
          throw new Error('Please enter both email and password');
        }

        // Use the existing login method from useAuth composable
        await login(email.value, password.value);

        // After successful login, fetch the user profile data from the backend
        await projectStore.fetchUserProfile();

        // Redirect the user after successful login
        router.push('/dashboard'); // Change '/dashboard' to the desired redirect path
      } catch (error: any) {
        // Set error message from the login method or a default message
        errorMessage.value = error.message || 'Login failed. Please check your credentials and try again.';
        console.error('Login error:', error);
      } finally {
        // Always set loading to false
        loading.value = false;
      }
    };

    const loginWithGoogle = async () => {
      try {
        if (!auth0Client.value) {
          throw new Error('Auth0 client not initialized');
        }

        await loginWithRedirect(); // Redirect for Google login
      } catch (error) {
        console.error('Google login error:', error);
        errorMessage.value = 'Google login failed';
      }
    };

    const loginWithFacebook = async () => {
      try {
        if (!auth0Client.value) {
          throw new Error('Auth0 client not initialized');
        }

        await loginWithRedirect(); // Redirect for Facebook login
      } catch (error) {
        console.error('Facebook login error:', error);
        errorMessage.value = 'Facebook login failed';
      }
    };

    const handleLogout = async () => {
      try {
        await auth0Logout();
        isAuthenticated.value = false;
        router.push('/login'); // Redirect to the login page after logout
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    return {
      email,
      password,
      handleLogin,
      loginWithGoogle,
      loginWithFacebook,
      handleLogout,
      loading,
      errorMessage,
      isAuthenticated,
      authenticationChecked
    };
  }
});
</script>

<template>
  <div class="flex min-h-screen">
    <div class="flex flex-1">
      <div class="flex items-center justify-center w-full lg:w-1/2 p-8 bg-white">
        <div class="w-full max-w-md">
          <div v-if="authenticationChecked && isAuthenticated" class="text-center mb-6">
            <p class="text-lg font-semibold text-gray-700">Welcome back!</p>
          </div>

          <div v-else>
            <h1 class="text-3xl font-bold text-center mb-8 text-orange-800">Login</h1>
            
            <form @submit.prevent="handleLogin" class="space-y-6">
              <div>
                <label for="email" class="block text-sm font-medium text-orange-700">Email</label>
                <input
                  type="email"
                  id="email"
                  v-model="email"
                  required
                  class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-custom-peach focus:border-custom-peach sm:text-sm"
                />
              </div>

              <div>
                <label for="password" class="block text-sm font-medium text-orange-700">Password</label>
                <input
                  type="password"
                  id="password"
                  v-model="password"
                  required
                  class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-custom-peach focus:border-custom-peach sm:text-sm"
                />
              </div>

              <div v-if="errorMessage" class="text-red-500 text-sm text-center">
                <p>{{ errorMessage }}</p>
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-custom-peach hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-peach"
              >
                <span v-if="loading">Loading...</span>
                <span v-else>Login</span>
              </button>
            </form>

            <div class="mt-6 space-y-4">
              <div class="flex items-center justify-center">
                <span class="text-gray-500 text-sm">OR</span>
              </div>
              
              <button
                @click="loginWithGoogle"
                class="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="mr-2 h-5 w-5">
                  <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
                  <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.33-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
                  <path fill="#FBBC05" d="M11.67 28.18c-.44-1.32-.69-2.73-.69-4.18s.25-2.86.69-4.18v-5.7H4.34A21.991 21.991 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.33-5.7z"/>
                  <path fill="#EA4335" d="M24 9.75c3.23 0 6.02 1.08 8.06 2.88l6.03-6.03C35.02 2.74 29.83.5 24 .5 15.4.5 7.96 5.13 4.34 12.91L11.67 18c1.74-5.2 6.59-9.07 12.33-9.07z"/>
                </svg>
                Login with Google
              </button>

              <button
                @click="loginWithFacebook"
                class="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="mr-2 h-5 w-5">
                  <path fill="#3b5998" d="M24 12.8c3.72 0 6.6 2.88 6.6 6.4 0 3.04-2.16 5.68-5.28 6.32v4.88h4.08c0-.04.08-.12.08-.16 0-.04-.08-.12-.08-.16l-4.08-4.88V21.2h-5.44c-.48 0-.96-.4-.96-.88V14.8c0-.48.48-.88.96-.88h5.44v-4.88h-4.08v4.88H16c-.48 0-.88-.4-.88-.88V14.8h4.08v4.88h5.44z"/>
                </svg>
                Login with Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

