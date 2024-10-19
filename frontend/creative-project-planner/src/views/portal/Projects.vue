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
    }
};
</script>

<template>
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
