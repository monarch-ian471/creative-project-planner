<template>
  <div :class="['bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg', cardClass]">
    <!-- Header -->
    <div v-if="title || $slots.header" class="px-6 py-4 border-b border-gray-200">
      <slot name="header">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      </slot>
    </div>
    
    <!-- Body -->
    <div :class="['px-6 py-4', bodyClass]">
      <slot />
    </div>
    
    <!-- Footer -->
    <div v-if="$slots.footer" class="px-6 py-4 bg-gray-50 border-t border-gray-200">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  cardClass?: string;
  bodyClass?: string;
}

withDefaults(defineProps<Props>(), {
  cardClass: '',
  bodyClass: '',
});
</script>
