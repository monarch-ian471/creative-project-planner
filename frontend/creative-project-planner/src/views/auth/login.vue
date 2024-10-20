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
  <div>
    <p v-if="isAuthenticated">Welcome, {{ user?.name }}!</p>
    <!-- <button @click="login">Logout</button> -->
  </div>

  <div class="flex items-center justify-center min-h-screen">
    <div class="max-w-lg mx-auto p-24 border border-gray-300 rounded-lg shadow-lg">
    <h1 class="text-6xl text-center font-bold mb-6">Login</h1>
    <form @submit.prevent="handleLogin">
      <div class="mb-4">
        <label for="email" class="block text-gray-700 mb-2">Email:</label>
        <input 
          type="email" 
          v-model="email" 
          required 
          class="w-full px-3 py-2 border border-gray-300 rounded-md" 
          id="email"
        />
      </div>
      <div class="mb-6">
        <label for="password" class="block text-gray-700 mb-4">Password:</label>
        <input 
          type="password" 
          v-model="password" 
          required 
          class="w-full px-3 py-2 border border-gray-300 rounded-md" 
          id="password"
        />
      </div>
      <button 
        type="submit" 
        class="justify-center rounded-md bg-custom-peach px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-400"
      >
        Login
      </button>
    </form>
  </div>
  </div>
</template>
