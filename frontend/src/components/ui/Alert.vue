<template>
  <Modal v-model="isVisible" :title="title" size="sm" :show-close="false">
    <div class="text-center">
      <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full" :class="iconBg">
        <component :is="icon" :class="['h-6 w-6', iconColor]" />
      </div>
      
      <div class="mt-3">
        <p class="text-sm text-gray-500">{{ message }}</p>
      </div>
    </div>

    <template #footer>
      <Button
        variant="secondary"
        @click="handleCancel"
      >
        {{ cancelText }}
      </Button>
      <Button
        :variant="confirmVariant"
        @click="handleConfirm"
        :loading="loading"
      >
        {{ confirmText }}
      </Button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue';
import Modal from './Modal.vue';
import Button from './Button.vue';

interface Props {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'danger' | 'success';
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirm Action',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  type: 'warning',
});

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

const isVisible = ref(false);
const loading = ref(false);

const iconBg = computed(() => {
  const backgrounds = {
    info: 'bg-blue-100',
    warning: 'bg-yellow-100',
    danger: 'bg-red-100',
    success: 'bg-green-100',
  };
  return backgrounds[props.type];
});

const iconColor = computed(() => {
  const colors = {
    info: 'text-blue-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    success: 'text-green-600',
  };
  return colors[props.type];
});

const confirmVariant = computed(() => {
  const variants = {
    info: 'primary',
    warning: 'warning',
    danger: 'danger',
    success: 'success',
  };
  return variants[props.type] as any;
});

const icon = computed(() => {
  const paths = {
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    danger: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  };

  return {
    render: () => h(
      'svg',
      {
        class: 'h-6 w-6',
        fill: 'none',
        stroke: 'currentColor',
        viewBox: '0 0 24 24',
      },
      [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: paths[props.type],
        })
      ]
    )
  };
});

const show = () => {
  isVisible.value = true;
};

const hide = () => {
  isVisible.value = false;
  loading.value = false;
};

const handleConfirm = () => {
  emit('confirm');
};

const handleCancel = () => {
  hide();
  emit('cancel');
};

defineExpose({
  show,
  hide,
  loading,
});
</script>
