<!-- src/views/Projects/ProjectDetail.vue -->
<template>
  <div v-if="project" class="bg-white shadow-md rounded-lg p-6 border border-gray-800">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">{{ project.title }}</h1>
      <div class="flex space-x-2">
        <button 
          @click="editMode = !editMode"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {{ editMode ? 'Cancel' : 'Edit' }}
        </button>
        <button 
          @click="deleteProject"
          class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>

    <div v-if="!editMode">
      <p class="text-gray-600 mb-4">{{ project.description }}</p>
      <div class="flex justify-between">
        <span>Due Date:</span>
        <span>{{ formatDate(project.dueDate) }}</span>
      </div>
    </div>

    <ProjectForm 
      v-else
      :project="project"
      :is-editing="true"
      @submit="updateProject"
    />

    <div class="mt-6">
      <h2 class="text-xl font-semibold mb-4">Tasks</h2>
      <ul class="space-y-2">
        <li 
          v-for="task in projectTasks" 
          :key="task._id"
          class="flex justify-between items-center p-3 bg-gray-100 rounded-lg"
        >
          <span 
            :class="[
              'font-medium',
              task.completed ? 'line-through text-gray-500' : 'text-gray-800'
            ]"
          >
            {{ task.name }}
          </span>
          <span class="text-sm text-gray-500">
            {{ task.completed ? 'Completed' : 'Pending' }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProjectStore } from '@/stores/projectStore';
import { Project, Task } from '@/types';
import ProjectForm from '@/components/projectForm.vue;

const route = useRoute();
const router = useRouter();
const projectStore = useProjectStore();

const project = ref<Project | undefined>(undefined);
const editMode = ref(false);

const projectTasks = computed(() => 
  projectStore.tasks.filter(task => task.project === project.value?._id)
);

onMounted(async () => {
  const projectId = route.params.id as string;
  project.value = projectStore.projects.find(p => p._id === projectId);
});

const formatDate = (date: Date) => {
  return date ? new Date(date).toLocaleDateString() : 'No due date';
};

const updateProject = async (updatedProject: Omit<Project, '_id'>) => {
  if (project.value?._id) {
    try {
      await projectStore.updateProject(project.value._id, updatedProject);
      editMode.value = false;
    } catch (error) {
      console.error('Failed to update project', error);
    }
  }
};

const deleteProject = async () => {
  if (project.value?._id) {
    try {
      await projectStore.deleteProject(project.value._id);
      router.push('/portal/projects');
    } catch (error) {
      console.error('Failed to delete project', error);
    }
  }
};
</script>