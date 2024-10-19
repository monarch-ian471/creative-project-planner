<script setup>
import { ref } from 'vue';

const settings = ref({
     username: '',
     email: '',
     notifications: false
});

const saveSettings = () => {
     // Save settings logic here
     console.log('Settings saved:', settings.value);
};
</script>

<template>
     <div class="settings-page max-w-lg mx-auto p-5 bg-gray-100 rounded-lg shadow-md">
           <h1 class="text-2xl font-bold mb-5">Settings</h1>
           <form @submit.prevent="saveSettings">
                  <div class="form-group mb-4">
                         <label for="username" class="block mb-2">Username:</label>
                         <input type="text" id="username" v-model="settings.username" class="w-full p-2 border border-gray-300 rounded" />
                  </div>
                  <div class="form-group mb-4">
                         <label for="email" class="block mb-2">Email:</label>
                         <input type="email" id="email" v-model="settings.email" class="w-full p-2 border border-gray-300 rounded" />
                  </div>
                  <div class="form-group mb-4">
                         <label for="notifications" class="block mb-2">Enable Notifications:</label>
                         <input type="checkbox" id="notifications" v-model="settings.notifications" class="mr-2" />
                  </div>
                  <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Save</button>
           </form>
     </div>
</template>