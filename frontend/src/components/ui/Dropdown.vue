<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggle"
      :class="[
        'inline-flex items-center justify-between gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors',
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50',
        buttonClass
      ]"
      :disabled="disabled"
    >
      <span>{{ selectedLabel || placeholder }}</span>
      <svg
        :class="['h-5 w-5 transition-transform', isOpen && 'rotate-180']"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        :class="[
          'absolute z-10 mt-2 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
          positionClass,
          'max-h-60 overflow-auto'
        ]"
        style="min-width: 200px"
      >
        <!-- Search -->
        <div v-if="searchable" class="p-2 border-b border-gray-200">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            @click.stop
          />
        </div>

        <!-- Options -->
        <div class="py-1">
          <button
            v-for="option in filteredOptions"
            :key="option.value"
            @click="selectOption(option)"
            :class="[
              'w-full text-left px-4 py-2 text-sm transition-colors',
              option.value === modelValue
                ? 'bg-indigo-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            ]"
          >
            <div class="flex items-center justify-between">
              <span>{{ option.label }}</span>
              <svg
                v-if="option.value === modelValue"
                class="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </button>
          <div v-if="filteredOptions.length === 0" class="px-4 py-2 text-sm text-gray-500">
            No options found
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface Option {
  label: string;
  value: string | number;
}

interface Props {
  modelValue: string | number | null;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  position?: 'left' | 'right';
  buttonClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select an option',
  disabled: false,
  searchable: false,
  position: 'left',
  buttonClass: 'border border-gray-300 bg-white text-gray-700',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void;
  (e: 'change', value: string | number | null): void;
}>();

const isOpen = ref(false);
const searchQuery = ref('');
const dropdownRef = ref<HTMLElement | null>(null);

const selectedLabel = computed(() => {
  const selected = props.options.find(opt => opt.value === props.modelValue);
  return selected?.label || '';
});

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) {
    return props.options;
  }
  const query = searchQuery.value.toLowerCase();
  return props.options.filter(opt => 
    opt.label.toLowerCase().includes(query)
  );
});

const positionClass = computed(() => {
  return props.position === 'right' ? 'right-0' : 'left-0';
});

const toggle = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value;
    if (!isOpen.value) {
      searchQuery.value = '';
    }
  }
};

const selectOption = (option: Option) => {
  emit('update:modelValue', option.value);
  emit('change', option.value);
  isOpen.value = false;
  searchQuery.value = '';
};

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
    searchQuery.value = '';
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
