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

<script>
import ProjectCard from '@/components/project-card.vue';

export default {
    name: 'Projects',
    components: {
        ProjectCard
    },
    data() {
        return {
            projects: []
        };
    },
    created() {
        this.fetchProjects();
    },
    methods: {
        fetchProjects() {
            // Replace with actual API call to fetch user's projects
            this.projects = [
                { id: 1, name: 'Project 1', description: 'Description of project 1' },
                { id: 2, name: 'Project 2', description: 'Description of project 2' },
                // Add more projects as needed
            ];
        }
    }
};
</script>
