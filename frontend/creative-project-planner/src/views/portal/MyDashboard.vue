<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { deleteProject as deleteProjectService, addProject as addProjectService, updateProject as updateProjectService } from '@/services/projectService';

export default defineComponent({
    name: 'MyDashboard',
    setup() {
        const { user } = useAuth(); // Fetch user data from useAuth
        const isOpen = ref(false);
        const projects = ref([
            { id: 1, name: 'Painting the house', status: 'In Progress' },
            { id: 2, name: 'Make an arm chair', status: 'Completed' },
            { id: 3, name: 'Mini project for school', status: 'Pending' },
        ]);
        const routes = [
            { path: '/portal/homeview', label: 'Home' },
            { path: '/portal/community', label: 'Community' },
            { path: '/portal/mydashboard', label: 'My Dashboard' },
            { path: '/portal/projects', label: 'Projects' },
        ];
        const router = useRouter();

        function toggleDropdown() {
            isOpen.value = !isOpen.value;
        }

        function closeDropdown(event: MouseEvent) {
            const target = event.target as HTMLElement;
            if (!target.closest('.dropdown')) {
                isOpen.value = false;
            }
        }

        function logOut() {
            router.push('/login');
        }

        function addProject() {
            const newProject = { id: Date.now(), name: 'New Project', status: 'Pending', description: 'New project description' };
            projects.value.push(newProject);
            addProjectService(newProject);
        }

        function editProject(project: any) {
            const updatedProjectName = prompt('Enter the new project name:', project.name);
            if (updatedProjectName !== null) {
                const updatedProject = { ...project, name: updatedProjectName, description: 'Updated project description' };
                const index = projects.value.findIndex(p => p.id === project.id);
                if (index !== -1) {
                    projects.value[index] = updatedProject;
                    updateProjectService(updatedProject, project.id);
                }
            }
        }

        function deleteProject(project: any) {
            projects.value = projects.value.filter(p => p.id !== project.id);
            deleteProjectService(project.id);
        }

        function changeStatus(project: any) {
            const statuses = ['In Progress', 'Completed', 'Pending'];
            const currentIndex = statuses.indexOf(project.status);
            const nextIndex = (currentIndex + 1) % statuses.length;
            const updatedProject = { ...project, status: statuses[nextIndex] };
            const index = projects.value.findIndex(p => p.id === project.id);
            if (index !== -1) {
                projects.value[index] = updatedProject;
                updateProjectService(updatedProject, project.id);
            }
        }

        function settings() {
            router.push('/portal/settings');
        }

        onMounted(() => {
            document.addEventListener('click', closeDropdown);
        });

        onBeforeUnmount(() => {
            document.removeEventListener('click', closeDropdown);
        });

        return {
            user,
            isOpen,
            projects,
            routes,
            toggleDropdown,
            logOut,
            addProject,
            editProject,
            deleteProject,
            changeStatus,
            settings,
        };
    },
});
</script>

<template>
    <header class="flex flex-col items-center lg:flex-row lg:items-start lg:pr-4">
        <div class="fixed top-0 right-0 px-4 py-2">
            <router-link to="/login" class="bg-custom-peach text-white px-4 py-2 text-white hover:underline rounded-lg shadow-md hover:bg-orange-500">Login</router-link>
            <div class="relative inline-block text-left dropdown">
                <button @click="toggleDropdown" class="bg-black text-white px-4 py-2 text-white hover:underline rounded-lg shadow-md hover:bg-gray-400 focus:outline-none">
                    Menu
                </button>
                <div
                    v-show="isOpen"
                    class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                >
                    <ul class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <li>
                            <router-link to="/portal/settings" class="text-gray-700 px-4 py-2 hover:underline rounded-lg shadow-md hover:bg-gray-100" role="menuitem">Settings</router-link>
                        </li>
                        <li>
                            <router-link to="/portal/homeview" class="text-gray-700 px-4 py-2 hover:underline rounded-lg shadow-md hover:bg-gray-100" role="menuitem">Home</router-link>
                        </li>
                        <li>
                            <button @click="logOut" class="text-gray-700 px-4 py-2 hover:underline rounded-lg shadow-md hover:bg-gray-100" role="menuitem">Logout</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>  
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
            <h1 class="text-4xl font-bold mb-4">Welcome, Ian Katengeza!</h1>
            
            <!-- User Profile Section -->
            <div class="mb-6">
                <h2 class="text-xl font-semibold mb-2">User Profile</h2>
                <div class="flex items-center space-x-4">
                    <img class="w-12 h-15 rounded-full" src="@/assets/me.png" alt="User Avatar">
                    <div>
                        <p class="text-lg font-medium">Ian Katengeza</p>
                        <p class="text-gray-600">iankatengeza@gmail.com</p>
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
                            <td class="py-2 px-4 border-b text-center">{{ project.name }}</td>
                            <td class="py-2 px-4 border-b text-center">{{ project.status }}</td>
                            <td class="py-2 px-4 border-b text-center">
                                <button @click="editProject(project)" class="bg-custom-lime text-white px-4 py-2 rounded hover:bg-yellow-300">Edit</button>
                                <button @click="deleteProject(project)" class="bg-custom-peach text-white px-4 py-2 rounded ml-2 hover:bg-red-300">Delete</button>
                                <button @click="changeStatus(project)" class="bg-teal-500 text-white px-4 py-2 rounded ml-2 hover:bg-green-300">Change Status</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <!-- Navigation Section -->
            <div class="flex space-x-4">
                <button @click="addProject" class="bg-custom-peach text-white px-4 py-2 rounded hover:bg-orange-400">Add New Project</button>
                <button @click="settings" class="bg-black text-white px-4 py-2 rounded hover:bg-gray-400">Settings</button>
            </div>
        </div>
    </div>
</template>

