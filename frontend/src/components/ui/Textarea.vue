<template>
  <div class="space-y-2">
    <label v-if="label" :for="textareaId" class="block text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <textarea
      :id="textareaId"
      v-model="textValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      :maxlength="maxLength"
      :class="textareaClasses"
      @input="handleInput"
      @blur="emit('blur')"
    />
    
    <div class="flex justify-between">
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <p v-else-if="helperText" class="text-sm text-gray-500">{{ helperText }}</p>
      <p v-if="maxLength" class="text-sm text-gray-500 ml-auto">
        {{ textValue.length }} / {{ maxLength }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface Props {
  modelValue: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  error?: string;
  helperText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  rows: 4,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'blur'): void;
}>();

const textValue = ref(props.modelValue);
const textareaId = `textarea-${Math.random().toString(36).substr(2, 9)}`;

watch(() => props.modelValue, (newValue) => {
  textValue.value = newValue;
});

const textareaClasses = computed(() => {
  const base = 'block w-full rounded-md shadow-sm transition-colors sm:text-sm resize-y';
  const state = props.error
    ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500';
  const disabled = props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';
  
  return `${base} ${state} ${disabled}`;
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
};
</script>
