<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import ProjectCard from '@/components/projectCard.vue';


export default {
    name: 'UserProjects',
    components: {
        ProjectCard,
        TaskList,
        CalendarCard,
    },
    setup() {
        const projects = ref([]);

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

        return {
            projects,
        };
    }
};
</script>

<template>   
    <div class="container mx-auto p-4">
        <h1 class="text-4xl font-bold mb-6">User's Projects</h1>



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