<script>
import { ref, defineComponent } from 'vue';

export default defineComponent({
  name: 'UserSettings',
  setup() {
    const isOpen = ref(false);
    const isLoading = ref(false); // New loading state
    const hasError = ref(false); // Error handling flag
    const successMessage = ref(''); // Success message to notify the user
    const routes = [
      { path: '/portal/homeview', label: 'Home' },
      { path: '/portal/community', label: 'Community' },
      { path: '/portal/mydashboard', label: 'MyDashboard' },
      { path: '/portal/projects', label: 'Projects' },
      { path: '/portal/settings', label: 'Settings' },
    ];

    function toggleDropdown() {
      isOpen.value = !isOpen.value;
    }

    function updatePassword() {
      if (isLoading.value) return; // Prevent multiple submissions
      isLoading.value = true;
      successMessage.value = ''; // Clear previous success message

      // Placeholder for password update logic
      setTimeout(() => {
        isLoading.value = false;
        successMessage.value = 'Password updated successfully!';
      }, 1500);
    }

    function updateName() {
      if (isLoading.value) return;
      isLoading.value = true;
      successMessage.value = ''; 

      // Simulate API call for name update
      setTimeout(() => {
        isLoading.value = false;
        successMessage.value = 'Name updated successfully!';
      }, 1500);
    }

    function updateHandles() {
      if (isLoading.value) return;
      isLoading.value = true;
      successMessage.value = '';

      // Simulate API call for social handle update
      setTimeout(() => {
        isLoading.value = false;
        successMessage.value = 'Social media handles updated!';
      }, 1500);
    }

    function logOut() {
      // Placeholder for logout logic
      this.$router.push('/login');
    }

    return {
      isOpen,
      isLoading,
      hasError,
      successMessage,
      toggleDropdown,
      routes,
      updatePassword,
      updateName,
      updateHandles,
      logOut
    };
  }
});
</script>

<template>
    <header class="flex flex-col items-center lg:flex-row lg:items-start lg:pr-4">
      <div class="fixed top-0 right-0 px-4 py-2">
        <router-link to="/login" class="bg-custom-peach text-white px-4 py-2 text-white hover:underline rounded-lg shadow-md hover:bg-orange-500">
          Login
        </router-link>
  
        <div class="relative inline-block text-left">
          <button @click="toggleDropdown" class="bg-black text-white px-4 py-1 text-white hover:underline rounded-lg shadow-md hover:bg-gray-400 focus:outline-none">
            Menu
          </button>
        </div>  
  
        <div v-if="isOpen" class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <ul class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <li>
              <router-link to="/portal/settings" class="text-gray-700 px-4 py-2 hover:underline rounded-lg shadow-md hover:bg-gray-100" role="menuitem">Settings</router-link>
            </li>
            <li>
              <router-link to="/portal/mydashboard" class="text-gray-700 px-4 py-2 hover:underline rounded-lg shadow-md hover:bg-gray-100" role="menuitem">Dashboard</router-link>
            </li>
            <li>
              <button @click="logOut" class="text-gray-700 px-4 py-2 hover:underline rounded-lg shadow-md hover:bg-gray-100" role="menuitem">Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Settings</h1>
  
      <!-- Success message -->
      <div v-if="successMessage" class="bg-green-100 text-green-800 p-2 rounded mb-4">
        {{ successMessage }}
      </div>
  
      <!-- Change Password Form -->
      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-2">Change Password</h2>
        <input type="password" placeholder="Current Password" class="border p-2 mb-2 w-full max-w-sm" />
        <input type="password" placeholder="New Password" class="border p-2 mb-2 w-full max-w-sm" />
        <input type="password" placeholder="Confirm New Password" class="border p-2 mb-2 w-full max-w-sm" />
        <button @click="updatePassword" :disabled="isLoading" class="bg-custom-peach text-white p-2 rounded hover:bg-orange-400 disabled:opacity-50">
          {{ isLoading ? 'Updating...' : 'Update Password' }}
        </button>
      </div>
  
      <!-- Update Name Form -->
      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-2">Update Name</h2>
        <input type="text" placeholder="New Name" class="border p-2 mb-2 w-full max-w-sm" />
        <button @click="updateName" :disabled="isLoading" class="bg-custom-peach text-white p-2 rounded hover:bg-orange-400 disabled:opacity-50">
          {{ isLoading ? 'Updating...' : 'Update Name' }}
        </button>
      </div>
  
      <!-- Update Social Media Handles -->
      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-2">Social Media Handles</h2>
        <input type="text" placeholder="Twitter Handle" class="border-gray-900 p-2 mb-2 w-full max-w-sm" />
        <input type="text" placeholder="LinkedIn Handle" class="border-gray-900 p-2 mb-2 w-full max-w-sm" />
        <button @click="updateHandles" :disabled="isLoading" class="bg-custom-peach text-white p-2 rounded hover:bg-orange-400 disabled:opacity-50">
          {{ isLoading ? 'Updating...' : 'Update Handles' }}
        </button>
      </div>
  
      <!-- Log Out Button -->
      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-2">Account</h2>
        <button @click="logOut" class="bg-black text-white p-2 rounded mb-2 hover:bg-gray-400">Log Out</button>
      </div>
    </div>
  </template>

<!-- To enhance this code, Analyze this, Add some ingenuity to this and add more interactivity, usability, and features, we can introduce several improvements. These will aim to increase the user experience by adding things like loading states, error handling, and subtle animations. -->