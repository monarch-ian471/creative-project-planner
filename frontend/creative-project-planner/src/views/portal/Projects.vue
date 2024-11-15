<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
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
            // Simulated API call to fetch user's projects
            projects.value = [
                { id: 1, name: 'Project 1', description: 'Project Underway' },
                { id: 2, name: 'Project 2', description: 'Project Underway' },
                { id: 3, name: 'Project 3', description: 'Project Underway' },
                { id: 4, name: 'Project 4', description: 'Project Underway' },
                { id: 5, name: 'Project 5', description: 'Project Underway' },
                { id: 6, name: 'Project 6', description: 'Project Underway' },
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
                { path: '/portal/mydashboard', label: 'My Dashboard' },
                { path: '/portal/projects', label: 'Projects' },
            ]
        };
    }
};
</script>

<template>
    <header class="flex flex-col items-center lg:flex-row lg:items-start lg:pr-4 transition-opacity duration-500 ease-in-out">
        <div class="fixed top-0 right-0 px-4 py-2 z-50">
            <router-link to="/login" class="bg-custom-peach text-white px-4 py-2 rounded-lg shadow-md hover:bg-orange-500 hover:scale-105 transition-transform duration-300 ease-in-out">Login</router-link>
            <div class="relative inline-block text-left dropdown ml-4">
                <button @click="toggleDropdown" class="bg-black text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-400 hover:scale-105 transition-transform duration-300 ease-in-out">
                    Menu
                </button>
                <div
                    v-show="isOpen"
                    class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-transform duration-300 ease-in-out transform scale-95"
                >
                    <ul class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <li>
                            <router-link to="/portal/settings" class="text-gray-700 px-4 py-2 block hover:bg-gray-100 hover:scale-105 transition-transform duration-300 ease-in-out">Settings</router-link>
                        </li>
                        <li>
                            <router-link to="/portal/mydashboard" class="text-gray-700 px-4 py-2 block hover:bg-gray-100 hover:scale-105 transition-transform duration-300 ease-in-out">My Dashboard</router-link>
                        </li>
                        <li>
                            <button @click="logOut" class="text-gray-700 px-4 py-2 block hover:bg-gray-100 hover:scale-105 transition-transform duration-300 ease-in-out">Logout</button>
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
                    class="inline-block px-4 py-2 border-l border-gray-300 first:border-0 hover:bg-orange-400 hover:scale-105 transition-transform duration-300 ease-in-out"
                >
                    {{ route.label }}
                </router-link>
            </nav>
        </div>
    </header>    

    <div class="container mx-auto p-4">
        <h1 class="text-4xl font-bold mb-6">User's Projects</h1>

        <!-- Optional Task and Calendar Section -->
        <!-- <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="bg-white p-4 rounded-lg shadow-md hover:scale-105 transition-transform duration-300 ease-in-out">
                <h2 class="text-2xl font-semibold mb-4">Tasks</h2>
                <TaskList />
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md hover:scale-105 transition-transform duration-300 ease-in-out">
                <h2 class="text-2xl font-semibold mb-4">Calendar</h2>
                <CalendarCard />
            </div>
        </div> -->


        <!-- Project Cards Section -->
        <div v-if="projects.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProjectCard
                v-for="project in projects"
                :key="project.id"
                :project="project"
                class="transform hover:scale-105 hover:rotate-2 transition-transform duration-300 ease-in-out"
            />
        </div>

        <!-- No Projects Found Message -->
        <div v-else class="text-center text-gray-500">
            <p>No projects found.</p>
        </div>
    </div>
</template>
