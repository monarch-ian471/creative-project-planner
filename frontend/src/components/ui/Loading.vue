<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg p-8 max-w-sm">
      <div class="flex flex-col items-center">
        <!-- Spinner -->
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
        
        <!-- Message -->
        <p v-if="message" class="mt-4 text-gray-700 text-center">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isVisible = ref(false);
const message = ref('');

const show = (msg = 'Loading...') => {
  message.value = msg;
  isVisible.value = true;
};

const hide = () => {
  isVisible.value = false;
  message.value = '';
};

defineExpose({
  show,
  hide,
});
</script>
