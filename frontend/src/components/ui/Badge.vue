<template>
  <span
    :class="[
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      variantClasses
    ]"
  >
    <span v-if="dot" :class="['h-2 w-2 rounded-full mr-1.5', dotClass]"></span>
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary' | 'gray';
  dot?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'gray',
  dot: false,
});

const variantClasses = computed(() => {
  const variants = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
    primary: 'bg-indigo-100 text-indigo-800',
    secondary: 'bg-purple-100 text-purple-800',
    gray: 'bg-gray-100 text-gray-800',
  };
  return variants[props.variant];
});

const dotClass = computed(() => {
  const dots = {
    success: 'bg-green-400',
    error: 'bg-red-400',
    warning: 'bg-yellow-400',
    info: 'bg-blue-400',
    primary: 'bg-indigo-400',
    secondary: 'bg-purple-400',
    gray: 'bg-gray-400',
  };
  return dots[props.variant];
});
</script>
