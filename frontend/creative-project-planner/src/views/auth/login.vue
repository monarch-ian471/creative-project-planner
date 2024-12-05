<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAuth } from '@/composables/useAuth';
import axios from 'axios';
import { useRouter } from 'vue-router';

// Define an interface for the user object
interface User {
  name: string;
  // Add other user properties as needed
}

export default defineComponent({
  name: 'LoginView',
  setup() {
    const email = ref('');
    const password = ref('');
    const { user, isAuthenticated, login, logout } = useAuth();
    const router = useRouter();

    const loading = ref(false);
    const errorMessage = ref('');

    const handleLogin = async () => {
      errorMessage.value = '';
      loading.value = true;

      try {
        const { data } = await axios.post('http://localhost:3000/api/users/login', {
          email: email.value,
          password: password.value
        });

        login(data.user, data.token);
        router.push('/portal/mydashboard');
      } catch (error) {
        if (axios.isAxiosError(error)) {
          errorMessage.value = error.response?.data?.message || 'Login failed';
        } else {
          errorMessage.value = 'An unexpected error occurred';
        }
      } finally {
        loading.value = false;
      }
    };

    return {
      email,
      password,
      handleLogin,
      user,
      isAuthenticated,
      login,
      logout,
      loading,
      errorMessage,
    };
  }
});
</script>

<template>
  <div class="flex min-h-screen">
    <div class="flex flex-1">
      <!-- Login Form Container -->
      <div class="flex items-center justify-center w-full lg:w-1/2 p-8 bg-white">
        <div class="w-full max-w-md">
       <!-- Authenticated state -->
        <div v-if="isAuthenticated" class="text-center mb-6">
          <p class="text-lg font-semibold text-gray-700">
            Welcome back, {{ user?.name || 'User' }}!
          </p>
        </div>


      <!-- Login Form -->
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

          <!-- Show error message if login fails -->
          <div v-if="errorMessage" class="text-red-500 text-sm text-center">
            <p>{{ errorMessage }}</p>
          </div>

          <button
            type="submit"
            @click="handleLogin"
            :disabled="loading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-custom-peach hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-peach"
          >
            <span v-if="loading">Loading...</span>
            <span v-else>Login</span>
          </button>
        </form>

        <!-- <div class="mt-6 text-center">
          <a href="#" class="text-sm text-custom-peach hover:text-orange-500">Forgot your password?</a>
        </div> -->

            <div class="mt-6 text-center">
              <p class="text-sm text-orange-600">Don't have an account? <a href="/userRegister" class="text-gray-600 hover:text-orange-500">Sign up</a></p>
            </div>
          </div>
        </div>
      </div>
     <!-- Background Image Container -->
      <div class="hidden lg:block w-1/2 relative">
          <img src="@/assets/bg.png"alt="Login background" class="absolute insert-0 w-full h-full object-cover bg-center"/>
        </div>
    </div>
  </div>
</template>
