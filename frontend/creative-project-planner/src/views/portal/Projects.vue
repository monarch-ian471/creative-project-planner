<script>
import { ref, onMounted, onBeforeUnmount  } from 'vue';
import { useRouter } from 'vue-router';
import ProjectCard from '@/components/ProjectCard.vue';
import TaskList from '@/components/TaskList.vue';
import CalendarCard from '@/components/CalendarCard.vue';

export default {
    name: 'UserProjects',
    components: {
        ProjectCard,
        TaskList,
        CalendarCard,
    },
    setup() {
        const projects = ref([]);
        const isOpen = ref(false);
        const router = useRouter();

        const fetchProjects = () => {
            // Replace with actual API call to fetch user's projects
            projects.value = [
                { id: 1, name: 'Project 1', description: 'Project Underway' },
                { id: 2, name: 'Project 2', description: 'Project Underway' },
                { id: 3, name: 'Project 3', description: 'Project Underway' },
                { id: 4, name: 'Project 4', description: 'Project Underway' },
                { id: 5, name: 'Project 5', description: 'Project Underway' },
                { id: 6, name: 'Project 6', description: 'Project Underway' },
                // Add more projects as needed
            ];
        };

        function toggleDropdown() {
            isOpen.value = !isOpen.value;
        }

        function closeDropdown(event) {
            const target = event.target;
            if (!target.closest('.dropdown')) {
                isOpen.value = false;
            }
        }

        function logOut() {
            router.push('/login');
        }

        onMounted(() => {
            fetchProjects();
            document.addEventListener('click', closeDropdown);
        });

        onBeforeUnmount(() => {
            document.removeEventListener('click', closeDropdown);
        });

        return {
            projects,
            isOpen,
            toggleDropdown,
            logOut,
            routes: [
                { path: '/portal/homeview', label: 'Home' },
                { path: '/portal/community', label: 'Community' },
                { path: '/portal/mydashboard', label: 'MyDashboard' },
                { path: '/portal/projects', label: 'Projects' },
            ]
        };
    }
};
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
                            <router-link to="/portal/mydashboard" class="text-gray-700 px-4 py-2 hover:underline rounded-lg shadow-md hover:bg-gray-100" role="menuitem">My Dashboard</router-link>
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
              class="inline-block px-4 py-2 border-l border-gray-300 first:border-0 hover:bg-orange-500"
              :aria-label="route.label"
            >
              {{ route.label }}
            </router-link>
        </nav>
        </div>
    </header>    

    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">User's Projects</h1>
        <!-- <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white p-4 rounded shadow">
                <h2 class="text-2xl font-semibold mb-2">Tasks</h2>
                <TaskList />
            </div>
            <div class="bg-white p-4 rounded shadow">
                <h2 class="text-2xl font-semibold mb-2">Calendar</h2>
                <CalendarCard />
            </div>
        </div> -->
        <div v-if="projects.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
        </div>
        <div v-else class="text-center text-gray-500">
            <p>No projects found.</p>
        </div>
    </div>
</template>
