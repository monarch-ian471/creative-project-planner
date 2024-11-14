<script>
import { ref, defineComponent } from 'vue';

export default defineComponent({
  name: 'UserSettings',
  setup() {
    const isOpen = ref(false);
    const isLoading = ref(false);
    const hasError = ref(false);
    const successMessage = ref('');
    const userName = ref('John Doe');
    const email = ref('johndoe@example.com');
    const projectCount = ref(5);
    const twitterHandle = ref('@johndoe');
    const linkedInHandle = ref('linkedin.com/in/johndoe');
    const profileBadge = ref('Pro Member'); // Badge indicator
    const profilePicture = ref('https://via.placeholder.com/150');
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
      if (isLoading.value) return;
      isLoading.value = true;
      successMessage.value = '';

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

    function updateEmail() {
      if (isLoading.value) return;
      isLoading.value = true;
      successMessage.value = ''; 

      // Simulate API call for email update
      setTimeout(() => {
        isLoading.value = false;
        successMessage.value = 'Email updated successfully!';
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

    function updateProfilePicture(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          profilePicture.value = reader.result; // Update the profile picture
          successMessage.value = 'Profile picture updated successfully!';
        };
        reader.readAsDataURL(file);

        // Simulated API Call - Replace this with actual backend logic
        fetch('/api/updateProfilePicture', { method: 'POST', body: file })
          .then(() => { successMessage.value = 'Profile picture updated successfully!'; })
          .catch(() => { successMessage.value = 'Error updating profile picture'; });
      }
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
      userName,
      email,
      projectCount,
      twitterHandle,
      linkedInHandle,
      profileBadge,
      toggleDropdown,
      routes,
      updatePassword,
      updateName,
      updateEmail,
      updateHandles,
      updateProfilePicture,
      logOut
    };
  }
});
</script>

<template>
  <header class="flex flex-col items-center lg:flex-row lg:items-start lg:pr-4">
    <div class="fixed top-0 right-0 px-4 py-2">
      <router-link to="/login" class="bg-custom-peach text-white px-4 py-2 hover:underline rounded-lg shadow-md hover:bg-orange-500">
        Login
      </router-link>

      <div class="relative inline-block text-left">
        <button @click="toggleDropdown" class="bg-black text-white px-4 py-1 hover:underline rounded-lg shadow-md hover:bg-gray-400 focus:outline-none">
          Menu
        </button>
      </div>  

      <div v-if="isOpen" class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
        <ul class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <li>
            <router-link to="/portal/homeview" class="text-gray-700 px-4 py-2 hover:underline rounded-lg shadow-md hover:bg-gray-100" role="menuitem">Home</router-link>
          </li>
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

  <!-- Profile Section -->
  <div class="container mx-auto p-4 mt-6 bg-gradient-to-r from-gray-600 to-orange-400 rounded-xl shadow-lg">
    <div class="flex items-center space-x-4 mb-6">
      <!-- Profile Picture Update Icon with File Input -->
      <div class="relative w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
        <img :src="profilePicture" alt="Profile Picture" class="w-full h-full object-cover">
        <input type="file" id="profilePicInput" class="hidden" @change="updateProfilePicture">
        <label for="profilePicInput" class="absolute bottom-0 right-0 bg-gray-800 text-white p-1 rounded-full hover:bg-gray-600 cursor-pointer">
          <i class="fas fa-edit"></i>
        </label>
      </div>

      <!-- Profile Details -->
      <div>
        <h2 class="text-3xl font-semibold text-white">{{ userName }}</h2>
        <p class="text-gray-200">{{ email }}</p>
        <p class="text-gray-200">Projects: {{ projectCount }}</p>
        <p class="text-gray-200">Twitter: {{ twitterHandle }}</p>
        <p class="text-gray-200">LinkedIn: {{ linkedInHandle }}</p>
      </div>
    </div>
  </div>

  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Settings</h1>

    <!-- Success message -->
    <div v-if="successMessage" class="bg-green-100 text-green-800 p-2 rounded mb-4">
      {{ successMessage }}
    </div>

    <!-- Update Name Form -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Update Name</h2>
      <input type="text" v-model="userName" placeholder="New Name" class="border border-orange-500 p-2 mb-2 w-full max-w-sm" />
      <button @click="updateName" :disabled="isLoading" class="bg-custom-peach text-white p-2 rounded hover:bg-orange-400 disabled:opacity-50">
        {{ isLoading ? 'Updating...' : 'Update Name' }}
      </button>
    </div>

    <!-- Update Email Form -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Update Email</h2>
      <input type="email" v-model="email" placeholder="New Email" class="border border-orange-500 p-2 mb-2 w-full max-w-sm" />
      <button @click="updateEmail" :disabled="isLoading" class="bg-custom-peach text-white p-2 rounded hover:bg-orange-400 disabled:opacity-50">
        {{ isLoading ? 'Updating...' : 'Update Email' }}
      </button>
    </div>

    <!-- Change Password Form -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Change Password</h2>
      <input type="password" placeholder="Current Password" class="border border-orange-500 p-2 mb-2 w-full max-w-sm" />
      <input type="password" placeholder="New Password" class="border border-orange-500 p-2 mb-2 w-full max-w-sm" />
      <input type="password" placeholder="Confirm New Password" class="border border-orange-500 p-2 mb-2 w-full max-w-sm" />
      <button @click="updatePassword" :disabled="isLoading" class="bg-custom-peach text-white p-2 rounded hover:bg-orange-400 disabled:opacity-50">
        {{ isLoading ? 'Updating...' : 'Update Password' }}
      </button>
    </div>

    <!-- Update Social Media Handles -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Social Media Handles</h2>
      <input type="text" v-model="twitterHandle" placeholder="Twitter Handle" class="border border-orange-500 p-2 mb-2 w-full max-w-sm" />
      <input type="text" v-model="linkedInHandle" placeholder="LinkedIn Handle" class="border border-orange-500 p-2 mb-2 w-full max-w-sm" />
      <button @click="updateHandles" :disabled="isLoading" class="bg-custom-peach text-white p-2 rounded hover:bg-orange-400 disabled:opacity-50">
        {{ isLoading ? 'Updating...' : 'Update Handles' }}
      </button>
    </div>

    <!-- API Update Section (Commented Out) -->
    <!--
    async function updateBackendData() {
      try {
        const response = await axios.put('/api/user/update', {
          name: userName.value,
          email: email.value,
          twitterHandle: twitterHandle.value,
          linkedInHandle: linkedInHandle.value
        });
        successMessage.value = 'Data updated successfully!';
      } catch (error) {
        hasError.value = true;
        console.error('Error updating data:', error);
      }
    }
    -->

  </div>
</template>

<style scoped>
.bg-custom-peach {
  background-color: #fa6e42;
}
</style>
