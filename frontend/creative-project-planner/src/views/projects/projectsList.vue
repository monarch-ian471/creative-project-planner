<!-- src/views/Projects/ProjectList.vue -->
<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectStore } from '@/store/projectStore';
import ProjectCard from '@/views/projects/projectCard.vue';

const projectStore = useProjectStore();
const router = useRouter();

onMounted(async () => {
  await projectStore.fetchData();
});

const openProjectDetail = (projectId: string) => {
  router.push({ name: 'ProjectDetail', params: { id: projectId } });
};

const openCreateProject = () => {
  router.push({ name: 'CreateProject' });
};
</script>

<template>
  <div class="p-5">
    <h1 class="text-2xl font-bold mb-5">My Projects</h1>

    <div v-if="projectStore.loading" class="text-gray-500 text-center">
      Loading projects...
    </div>

    <div v-else-if="projectStore.error" class="text-red-500 text-center">
      {{ projectStore.error }}
    </div>

    <div v-else-if="projectStore.projects.length === 0" class="text-gray-600 text-center">
      No projects found. Create your first project!
    </div>

    <div 
      v-else 
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
    >
      <ProjectCard
        v-for="project in projectStore.projects"
        :key="project._id"
        :project="project"
        @click="openProjectDetail(project._id!)"
      />
    </div>

    <button 
      @click="openCreateProject" 
      class="mt-5 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
    >
      Create New Project
    </button>
  </div>
</template>