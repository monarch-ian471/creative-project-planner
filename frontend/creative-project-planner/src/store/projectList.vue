<script setup lang ="ts">
import { defineProps, defineEmits } from 'vue';
import { Project } from '@/types/index';
import ProjectCard from '@/portal/project/projectCard.vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  projects: Project[];
}>();

const router = useRouter();

const goToProject = (projectId?: string) => {
  if (projectId) {
    router.push(`/portal/project/${projectId}`);
  }
};
</script>

<template>
  <div class="bg-white shadow-md rounded-lg p-6 border border-gray-800">
    <h2 class="text-xl font-semibold mb-4">Projects</h2>
    <div v-if="projects.length === 0" class="text-gray-500 text-center rounded-lg border border-gray-300">
      No projects found
    </div>
    <ul v-else class="space-y-2">
      <ProjectCard 
        v-for="project in projects" 
        :key="project._id" 
        :project="project"
        @click="goToProject"
      />
    </ul>
  </div>
</template>

