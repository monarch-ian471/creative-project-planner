<!-- src/views/Projects/ProjectList.vue -->
<template>
    <div class="project-list">
      <h1>My Projects</h1>
      
      <div v-if="projectStore.loading" class="loading">
        Loading projects...
      </div>
      
      <div v-else-if="projectStore.error" class="error">
        {{ projectStore.error }}
      </div>
      
      <div v-else-if="projectStore.projects.length === 0" class="no-projects">
        No projects found. Create your first project!
      </div>
      
      <div v-else class="projects-grid">
        <ProjectCard 
          v-for="project in projectStore.projects" 
          :key="project.id"
          :project="project"
          @click="openProjectDetail(project.id)"
        />
      </div>
      
      <button @click="openCreateProject" class="create-project-btn">
        Create New Project
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useProjectStore } from '@/stores/projectStore';
  import ProjectCard from '@/components/Project/ProjectCard.vue';
  
  const projectStore = useProjectStore();
  const router = useRouter();
  
  onMounted(async () => {
    await projectStore.fetchProjects();
  });
  
  const openProjectDetail = (projectId: string) => {
    router.push({ name: 'ProjectDetail', params: { id: projectId } });
  };
  
  const openCreateProject = () => {
    router.push({ name: 'CreateProject' });
  };
  </script>
  
  <style scoped>
  .project-list {
    padding: 20px;
  }
  
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .create-project-btn {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
  }
  </style>