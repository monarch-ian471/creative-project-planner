<template>
    <div class="create-project-container">
      <ProjectForm 
        :isEditing="false"
        @submit="handleCreateProject"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { useProjectStore } from '@/stores/projectStore';
  import ProjectForm from '@/components/Project/ProjectForm.vue';
  import { Project } from '@/types';
  
  const router = useRouter();
  const projectStore = useProjectStore();
  
  const handleCreateProject = async (projectData: Partial<Project>) => {
    try {
      const newProject = await projectStore.addProject({
        ...projectData,
        status: 'active',
        createdAt: new Date(),
        dueDate: new Date(projectData.dueDate || Date.now())
      });
      
      // Navigate to the new project's detail page
      router.push(`/projects/${newProject._id}`);
    } catch (error) {
      console.error('Project creation failed', error);
      // Optionally show an error notification
    }
  };
  </script>
  
  <style scoped>
  .create-project-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  </style>