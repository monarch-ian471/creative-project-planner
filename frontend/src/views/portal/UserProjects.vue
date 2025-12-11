<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ProjectCard from '@/views/projects/projectCard.vue'; // Import the ProjectCard component
import { useProjectStore } from '@/store/projectStore'; // Simulate backend API/store

export default {
  name: 'UserProjects',
  components: {
    ProjectCard,
  },
  setup() {
    const router = useRouter();
    const projects = ref([]);
    const projectStore = useProjectStore(); // Assume a store handles API interactions

    const fetchProjects = async () => {
      try {
        // Simulated backend call
        const response = await projectStore.fetchUserProjects();
        projects.value = response; // Update projects from the backend response
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    onMounted(fetchProjects);

    // Handle navigation to project detail
    const navigateToDetail = (id) => {
      if (id) router.push(`/projects/${id}`);
    };

    return {
      projects,
      navigateToDetail,
    };
  },
};
</script>

<template>
  <div class="container mx-auto p-6">
    <header class="mb-6">
      <h1 class="text-4xl font-bold text-gray-800">My Projects</h1>
      <p class="text-lg text-gray-500">Manage your projects effortlessly.</p>
    </header>

    <!-- Projects Grid -->
    <div v-if="projects.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ProjectCard
        v-for="project in projects"
        :key="project._id"
        :project="project"
        @click="navigateToDetail"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center text-gray-500">
      <p>No projects found. Create your first project!</p>
    </div>
  </div>
</template>

<style scoped>
/* Optional styling for responsive layouts */
</style>
