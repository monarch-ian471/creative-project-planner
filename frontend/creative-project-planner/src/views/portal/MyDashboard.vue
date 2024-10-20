<script lang="ts">
import { defineComponent } from 'vue';
import { useAuth } from '@/composables/useAuth';

export default defineComponent({
    name: 'MyDashboard',
    setup() {
        const { user } = useAuth(); // Fetch user data from useAuth
        return {
            user,
            projects: [
                { id: 1, name: 'Project A', status: 'In Progress' },
                { id: 2, name: 'Project B', status: 'Completed' },
                { id: 3, name: 'Project C', status: 'Pending' },
            ],
            routes: [
                { path: '/portal/homeview', label: 'Home' },
                { path: '/portal/community', label: 'Community' },
                { path: '/portal/mydashboard', label: 'My Dashboard' },
                { path: '/portal/projects', label: 'Projects' },
            ],
        };
    },
});
</script>

<template>
    <header class="flex flex-col items-center lg:flex-row lg:items-start lg:pr-4">
        <div class="flex flex-col items-center lg:flex-row lg:items-start">
            <nav class="mt-8 text-center lg:text-left lg:mt-4 lg:ml-4 rounded-lg shadow-md">
                <router-link
                    v-for="route in routes"
                    :key="route.path"
                    :to="route.path"
                    class="inline-block px-4 py-2 border-l border-gray-300 first:border-0 hover:bg-orange-400"
                    :aria-label="route.label"
                >
                    {{ route.label }}
                </router-link>
            </nav>
        </div>
    </header>

    <div class="container mx-auto p-4">
        <div class="bg-white shadow-md rounded-lg p-6">
            <h1 class="text-2xl font-bold mb-4">Welcome, {{ user?.name }}!</h1>
            
            <!-- User Profile Section -->
            <div class="mb-6">
                <h2 class="text-xl font-semibold mb-2">User Profile</h2>
                <div class="flex items-center space-x-4">
                    <img class="w-16 h-16 rounded-full" src="https://via.placeholder.com/150" alt="User Avatar">
                    <div>
                        <p class="text-lg font-medium">{{ user?.name }}</p>
                        <p class="text-gray-600">{{ user?.email }}</p>
                    </div>
                </div>
            </div>
            
            <!-- Projects Table Section -->
            <div class="mb-6">
                <h2 class="text-xl font-semibold mb-2">Projects</h2>
                <table class="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th class="py-2 px-4 border-b">Project Name</th>
                            <th class="py-2 px-4 border-b">Status</th>
                            <th class="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="project in projects" :key="project.id">
                            <td class="py-2 px-4 border-b">{{ project.name }}</td>
                            <td class="py-2 px-4 border-b">{{ project.status }}</td>
                            <td class="py-2 px-4 border-b">
                                <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-300">Edit</button>
                                <button class="bg-red-500 text-white px-4 py-2 rounded ml-2 hover:bg-red-300">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <!-- Navigation Section -->
            <div class="flex space-x-4">
                <button class="bg-custom-peach text-white px-4 py-2 rounded hover:bg-orange-400">Add New Project</button>
                <button class="bg-black text-white px-4 py-2 rounded hover:bg-gray-400">Settings</button>
            </div>
        </div>
    </div>
</template>
