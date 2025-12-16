<template>
  <div>
    <!-- Tab Headers -->
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="selectTab(tab.key)"
          :class="[
            'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors',
            activeTab === tab.key
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
          ]"
        >
          <div class="flex items-center gap-2">
            <component v-if="tab.icon" :is="tab.icon" class="h-5 w-5" />
            <span>{{ tab.label }}</span>
            <Badge v-if="tab.badge" :variant="tab.badgeVariant || 'gray'">
              {{ tab.badge }}
            </Badge>
          </div>
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="py-4">
      <slot :name="`tab-${activeTab}`" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Badge from './Badge.vue';

export interface Tab {
  key: string;
  label: string;
  icon?: any;
  badge?: string | number;
  badgeVariant?: 'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary' | 'gray';
}

interface Props {
  tabs: Tab[];
  modelValue?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', key: string): void;
  (e: 'change', key: string): void;
}>();

const activeTab = ref(props.modelValue || props.tabs[0]?.key);

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    activeTab.value = newValue;
  }
});

const selectTab = (key: string) => {
  activeTab.value = key;
  emit('update:modelValue', key);
  emit('change', key);
};
</script>
