<script lang="ts">
export default {
    data() {
        return {
            projects: [
                { id: 1, name: 'Project A', status: 'In Progress' },
                { id: 2, name: 'Project B', status: 'Completed' },
                { id: 3, name: 'Project C', status: 'Pending' },
            ],
        };
    },
};
</script>

<template>
    <div class="container mx-auto p-4">
        <div class="bg-white shadow-md rounded-lg p-6">
            <h1 class="text-2xl font-bold mb-4">My Dashboard</h1>
            
            <!-- User Profile Section -->
            <div class="mb-6">
                <h2 class="text-xl font-semibold mb-2">User Profile</h2>
                <div class="flex items-center space-x-4">
                    <img class="w-16 h-16 rounded-full" src="https://via.placeholder.com/150" alt="User Avatar">
                    <div>
                        <p class="text-lg font-medium">Johnny Miboy</p>
                        <p class="text-gray-600">johnny.Miboy@example.com</p>
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
                                <button class="bg-blue-500 text-white px-4 py-2 rounded">Edit</button>
                                <button class="bg-red-500 text-white px-4 py-2 rounded ml-2">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <!-- Navigation Section -->
            <div class="flex space-x-4">
                <button class="bg-green-500 text-white px-4 py-2 rounded">Add New Project</button>
                <button class="bg-gray-500 text-white px-4 py-2 rounded">Settings</button>
            </div>
        </div>
    </div>
</template>