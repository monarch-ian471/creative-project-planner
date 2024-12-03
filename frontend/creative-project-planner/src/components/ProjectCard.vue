<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { Project } from '@/types';
import { useRouter } from 'vue-router';

const props = defineProps<{
  project: Project;
}>();

defineEmits<{
  (e: 'click', id?: string): void;
}>();

const formatDate = (date: Date) => {
  return date ? new Date(date).toLocaleDateString() : 'No due date';
};
</script>

<template>
    <div 
      class="flex justify-between items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
      @click="$emit('click', project._id)"
    >
      <div class="flex flex-col">
        <span class="font-medium text-gray-800">{{ project.title }}</span>
        <span class="text-xs text-gray-500">
          {{ project.description }}
        </span>
      </div>
      <span class="text-sm text-gray-500">
        Due: {{ formatDate(project.dueDate) }}
      </span>
    </div>
  </template>
