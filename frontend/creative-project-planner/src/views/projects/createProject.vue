<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useProjectStore } from '@/store/projectStore';
import ProjectForm from '@/views/projects/projectForm.vue';
import { Project } from '@/types/index';
import { toast } from 'vue-sonner'; // Assuming you're using a toast library

const router = useRouter();
const projectStore = useProjectStore();
const newProject = ref<Omit<Project, '_id'>>({
  title: '',
  description: '',
  dueDate: new Date()
});

const handleCreateProject = async () => {
  try {
    // Validate project data
    if (!newProject.value.title.trim()) {
      toast.error('Project title is required');
      return;
    }

    // Use createProject method from the store
    const createdProject = await projectStore.createProject(newProject.value);
    
    // Show success toast
    toast.success('Project created successfully');
    
    // Navigate to the project details page or dashboard
    router.push(`/portal/project/${createdProject._id}`);
  } catch (error) {
    // Log the error
    console.error('Failed to create project', error);
    
    // Show error toast
    toast.error('Failed to create project. Please try again.');
  }
};

// Optional: Reset form
const resetForm = () => {
  newProject.value = {
    title: '',
    description: '',
    dueDate: new Date()
  };
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-xl mx-auto bg-white shadow-md rounded-lg p-8">
      <h1 class="text-2xl font-bold mb-6 text-center">
        Create New Project
      </h1>
      <ProjectForm 
        :isEditing="false"
        @submit="handleCreateProject"
      />
    </div>
  </div>
</template>