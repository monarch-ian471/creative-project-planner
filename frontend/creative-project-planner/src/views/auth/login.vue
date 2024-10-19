<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'LoginView',
  setup() {
    const email = ref('');
    const password = ref('');

    const handleLogin = () => {
      console.log('Email:', email.value);
      console.log('Password:', password.value);
      // Handle login logic here, e.g., calling an API service
    };

    return {
      email,
      password,
      handleLogin
    };
  }
});
</script>

<template>
  <div class="max-w-md mx-auto p-6 border border-gray-300 rounded-lg shadow-lg">
    <h1 class="text-2xl font-bold mb-6">Login</h1>
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
        <label for="password" class="block text-gray-700 mb-2">Password:</label>
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
        class="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
      >
        Login
      </button>
    </form>
  </div>
</template>

