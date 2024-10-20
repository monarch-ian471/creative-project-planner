<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAuth } from '@/composables/useAuth';
import axios from 'axios';
import { useRouter } from 'vue-router'; // Import the useRouter

export default defineComponent({
  name: 'LoginView',
  setup() {
    const email = ref('');
    const password = ref('');
    const { user, isAuthenticated, login, logout } = useAuth();
    const router = useRouter(); // Get the router instance

    const handleLogin = async () => {
      try {
        console.log('Email:', email.value);
        console.log('Password:', password.value);

        // Call your backend API for login
        const response = await axios.post('http://localhost:3000/api/users/login', {
          email: email.value,
          password: password.value
        });

        // Assuming the response contains user data and a token
        const { user: loggedInUser, token } = response.data;

        // Call the login method from useAuth to handle the authentication state
        login(loggedInUser, token);

        console.log('Login successful:', loggedInUser);

        // Redirect the user to their account page (adjust the path as necessary)
        router.push('/portal/mydashboard'); // Use the path where you want to redirect
      } catch (error) {
        console.error('Login failed:', error);
        // Handle the error response (e.g., show an error message)
      }
    };

    return {
      email,
      password,
      handleLogin,
      user,
      isAuthenticated,
      login,
      logout
    };
  }
});
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 bg-opacity-40">
  <div class="w-full max-w-md p-8 bg-white border border-orange-400 rounded-xl shadow-xl">
    <!-- Authenticated state -->
    <div v-if="isAuthenticated" class="text-center mb-6">
      <p class="text-lg font-semibold text-gray-700">Welcome, {{ user?.name }}!</p>
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

        <button
          type="submit"
          @click="handleLogin"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-custom-peach hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-peach"
        >
          Login
        </button>
      </form>

      <div class="mt-6 text-center">
        <a href="#" class="text-sm text-custom-peach hover:text-orange-500">Forgot your password?</a>
      </div>

      <div class="mt-6 text-center">
        <p class="text-sm text-orange-600">Don't have an account? <a href="/userRegister" class="text-custom-peach hover:text-orange-500">Sign up</a></p>
    </div>
    </div>
  </div>
</div>
</template>
