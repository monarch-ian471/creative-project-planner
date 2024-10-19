<script>
import { ref, onMounted } from 'vue';
import ProjectCard from '@/components/ProjectCard.vue';

export default {
    name: 'UserProjects',
    components: {
        ProjectCard
    },
    setup() {
        const projects = ref([]);

        const fetchProjects = () => {
            // Replace with actual API call to fetch user's projects
            projects.value = [
                { id: 1, name: 'Project 1', description: 'Description of project 1' },
                { id: 2, name: 'Project 2', description: 'Description of project 2' },
                // Add more projects as needed
            ];
        };

        onMounted(() => {
            fetchProjects();
        });

        return {
            projects
        };
    },
    data() {
    return {
      routes: [
        { path: '/portal/homeview', label: 'Home' },
        { path: '/portal/community', label: 'Community' },
        { path: '/portal/mydashboard', label: 'MyDashboard' },
        { path: '/portal/projects', label: 'Projects' },
        { path: '/portal/settings', label: 'Settings' },
      ],
    };
  },
};
</script>

<template>
    <header class="flex flex-col items-center lg:flex-row lg:items-start lg:pr-4">
        <div class="fixed top-0 right-0 px-4 py-2">
            <router-link to="/login" class="bg-custom-peach text-white px-4 py-1 text-white hover:underline rounded-lg shadow-md hover:bg-orange-500">Login</router-link>
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
        <div v-if="projects.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
        </div>
        <div v-else class="text-center text-gray-500">
            <p>No projects found.</p>
        </div>
    </div>
</template>
