<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { ref } from 'vue';
  import { useProjectStore } from '@/store/projectStore';
  import ProjectForm from '@/views/projects/projectForm.vue';
  import { Project } from '@/types/index';
  
  const router = useRouter();
  const projectStore = useProjectStore();
  const newProject = ref<Omit<Project, '_id'>>({
    title: '',
    description: '',
    dueDate: new Date()
  })
  
  const handleCreateProject = async () => {
    try {
      // Use createProject method from the store
      await projectStore.createProject(newProject.value)
      // Additional logic like resetting form or navigating
    } catch (error) {
      // Handle error
      console.error('Failed to create project', error)
    }
  }
</script>

<template>
  <div class="max-w-xl mx-auto px-4 py-5">
    <ProjectForm 
      :isEditing="false"
      @submit="handleCreateProject"
    />
  </div>
</template>