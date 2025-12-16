<template>
  <div class="flex items-center">
    <input
      :id="checkboxId"
      v-model="checked"
      type="checkbox"
      :disabled="disabled"
      :class="checkboxClasses"
      @change="handleChange"
    />
    <label
      v-if="label"
      :for="checkboxId"
      :class="['ml-2 block text-sm', disabled ? 'text-gray-400' : 'text-gray-700 cursor-pointer']"
    >
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface Props {
  modelValue: boolean;
  label?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'change', value: boolean): void;
}>();

const checked = ref(props.modelValue);
const checkboxId = `checkbox-${Math.random().toString(36).substr(2, 9)}`;

watch(() => props.modelValue, (newValue) => {
  checked.value = newValue;
});

const checkboxClasses = computed(() => {
  const base = 'h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-colors';
  const disabled = props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer';
  return `${base} ${disabled}`;
});

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.checked);
  emit('change', target.checked);
};
</script>
