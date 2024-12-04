<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
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

    onMounted(async () => {
      try {
        auth0Client.value = await initializeAuth0();
        isAuthenticated.value = await checkIsAuthenticated();
        authenticationChecked.value = true;
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

        await loginWithRedirect();
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

        await loginWithRedirect();
      } catch (error) {
        console.error('Facebook login error:', error);
        errorMessage.value = 'Facebook login failed';
      }
    };

    const handleLogout = async () => {
      try {
        await auth0Logout();
        isAuthenticated.value = false;
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
                  <path fill="#EA4335" d="M24 9.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 3.29 29.93 1 24 1 15.4 1 7.96 5.93 4.34 14.12l7.33 5.7c1.75-5.2 6.6-9.07 12.33-9.07z"/>
                </svg>
                Continue with Google
              </button>

              <button
                @click="loginWithFacebook"
                class="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="mr-2 h-5 w-5">
                  <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </button>
            </div>

            <div class="mt-6 text-center">
              <p class="text-sm text-orange-600">
                Don't have an account? 
                <a href="/userRegister" class="text-gray-600 hover:text-orange-500">Sign up</a>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="hidden lg:block w-1/2 relative">
        <img src="@/assets/bg.png" alt="Login background" class="absolute inset-0 w-full h-full object-cover bg-center"/>
      </div>
    </div>
  </div>
</template>