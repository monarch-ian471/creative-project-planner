<template>
  <div 
    class="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white border-2 border-transparent hover:border-indigo-500"
    @click="$emit('click')"
  >
    <!-- Project Status Badge -->
    <div class="absolute top-4 right-4 z-10">
      <span 
        :class="statusClasses"
        class="px-3 py-1 rounded-full text-xs font-semibold shadow-md"
      >
        {{ project.status }}
      </span>
    </div>

    <!-- Project Header with Gradient -->
    <div 
      class="h-40 relative overflow-hidden"
      :style="{ background: gradientBackground }"
    >
      <div class="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
      <div class="absolute bottom-4 left-4 right-4">
        <h3 class="text-2xl font-bold text-white drop-shadow-lg line-clamp-2">
          {{ project.title }}
        </h3>
      </div>
      
      <!-- Creative Icon Overlay -->
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20">
        <component :is="projectIcon" class="w-24 h-24 text-white" />
      </div>
    </div>

    <!-- Project Details -->
    <div class="p-6 space-y-4">
      <!-- Description -->
      <p class="text-gray-600 text-sm line-clamp-3 min-h-[60px]">
        {{ project.description || 'No description provided' }}
      </p>

      <!-- Progress Bar -->
      <div v-if="project.tasks && project.tasks.length > 0" class="space-y-2">
        <div class="flex justify-between items-center text-sm">
          <span class="text-gray-600 font-medium">Progress</span>
          <span class="font-bold text-indigo-600">{{ progressPercentage }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div 
            class="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-indigo-500 to-purple-600"
            :style="{ width: `${progressPercentage}%` }"
          ></div>
        </div>
        <div class="text-xs text-gray-500">
          {{ completedTasks }} of {{ totalTasks }} tasks completed
        </div>
      </div>

      <!-- Due Date & Task Count -->
      <div class="flex items-center justify-between pt-4 border-t border-gray-100">
        <div class="flex items-center space-x-2 text-sm">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span :class="dueDateClasses" class="font-medium">
            {{ formattedDueDate }}
          </span>
        </div>
        
        <div v-if="project.tasks && project.tasks.length > 0" class="flex items-center space-x-2 text-sm">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <span class="text-gray-600 font-medium">{{ totalTasks }} tasks</span>
        </div>
      </div>
    </div>

    <!-- Hover Effect Overlay -->
    <div class="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Project } from '@/types/index';
import moment from 'moment';

interface Props {
  project: Project;
}

const props = defineProps<Props>();
const emit = defineEmits(['click']);

// Calculate progress
const totalTasks = computed(() => props.project.tasks?.length || 0);
const completedTasks = computed(() => 
  props.project.tasks?.filter(task => task.completed).length || 0
);
const progressPercentage = computed(() => 
  totalTasks.value > 0 ? Math.round((completedTasks.value / totalTasks.value) * 100) : 0
);

// Format due date
const formattedDueDate = computed(() => {
  if (!props.project.dueDate) return 'No due date';
  return moment(props.project.dueDate).format('MMM D, YYYY');
});

// Due date styling
const dueDateClasses = computed(() => {
  if (!props.project.dueDate) return 'text-gray-500';
  const daysUntilDue = moment(props.project.dueDate).diff(moment(), 'days');
  if (daysUntilDue < 0) return 'text-red-600 font-bold';
  if (daysUntilDue < 7) return 'text-orange-600 font-bold';
  return 'text-gray-600';
});

// Status badge styling
const statusClasses = computed(() => {
  const status = props.project.status?.toLowerCase() || 'in-progress';
  const classes: Record<string, string> = {
    'in-progress': 'bg-blue-500 text-white',
    'completed': 'bg-green-500 text-white',
    'on-hold': 'bg-yellow-500 text-white',
    'cancelled': 'bg-red-500 text-white'
  };
  return classes[status] || classes['in-progress'];
});

// Creative gradient backgrounds
const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
];

const gradientBackground = computed(() => {
  const index = (props.project.title?.charCodeAt(0) || 0) % gradients.length;
  return gradients[index];
});

// Project icon based on title or type
const projectIcon = computed(() => {
  return 'svg'; // Placeholder
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
