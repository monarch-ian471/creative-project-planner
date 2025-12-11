<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted } from 'vue';
import { toast } from 'vue-sonner';
import { Project } from '@/types/index';

const props = defineProps<{
  project?: Partial<Project>; // Use Partial to make all properties optional
  isEditing?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', project: Omit<Project, '_id'>): void;
}>();

const localProject = ref<Omit<Project, '_id'>>({
  title: props.project?.title || '',
  description: props.project?.description || '',
  dueDate: props.project?.dueDate instanceof Date 
    ? props.project.dueDate 
    : props.project?.dueDate 
      ? new Date(props.project.dueDate) 
      : new Date(),
  status: props.project?.status || 'pending'
});

const formatDate = (date: Date) => {
  return date ? date.toISOString().split('T')[0] : '';
};

const updateDueDate = (event: Event) => {
  const target = event.target as HTMLInputElement;
  localProject.value.dueDate = new Date(target.value);
};

const submitProject = () => {
  // Validate the project before submitting
  if (!localProject.value.title.trim()) {
    // You might want to add some error handling or toast notification
    toast.success('Project created successfully');

    return;
  }
  
  emit('submit', localProject.value);
};
</script>

<template>
    <form @submit.prevent="submitProject" class="space-y-4">
      <input 
        v-model="localProject.title" 
        placeholder="Project Title" 
        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
        required
      />
      <textarea 
        v-model="localProject.description" 
        placeholder="Project Description" 
        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
        rows="3"
      ></textarea>
      <input 
        type="date" 
        :value="formatDate(localProject.dueDate)"
        @input="updateDueDate($event)"
        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
      />
      <button 
        type="submit" 
        class="w-full bg-orange-400 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
      >
        {{ isEditing ? 'Update Project' : 'Create Project' }}
      </button>
    </form>
</template>