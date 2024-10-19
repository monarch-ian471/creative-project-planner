<script lang="ts">
import { ref } from 'vue';

export default {
    setup() {
        const user = ref({
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: 'Admin',
            avatar: 'https://via.placeholder.com/150'
        });

        function editProfile() {
            // Logic to edit profile
            console.log('Edit Profile clicked');
        }

        function logout() {
            // Logic to logout
            console.log('Logout clicked');
        }

        return {
            user,
            editProfile,
            logout
        };
    }
};
</script>

<template>
    <div class="user-profile p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-4">
        <h1 class="text-2xl font-bold">Profile Page</h1>
        <div class="profile-details space-y-2">
            <img :src="user.value.avatar" alt="User Avatar" class="avatar w-24 h-24 rounded-full mx-auto"/>
            <h2 class="text-xl font-semibold">{{ user.value.name }}</h2>
            <p class="text-gray-500">Email: {{ user.value.email }}</p>
            <p class="text-gray-500">Role: {{ user.value.role }}</p>
        </div>
        <div class="profile-actions space-x-4">
            <button @click="editProfile" class="bg-blue-500 text-white px-4 py-2 rounded">Edit Profile</button>
            <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
        </div>
    </div>
</template>
