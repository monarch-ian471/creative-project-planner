import { ref } from 'vue';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  duration?: number;
}

const toasts = ref<Toast[]>([]);

export function useToast() {
  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast = { ...toast, id };
    
    toasts.value.push(newToast);
    
    // Auto remove after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
    
    return id;
  };

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  const success = (message: string, title?: string, duration?: number) => {
    return addToast({ type: 'success', message, title, duration });
  };

  const error = (message: string, title?: string, duration?: number) => {
    return addToast({ type: 'error', message, title, duration });
  };

  const warning = (message: string, title?: string, duration?: number) => {
    return addToast({ type: 'warning', message, title, duration });
  };

  const info = (message: string, title?: string, duration?: number) => {
    return addToast({ type: 'info', message, title, duration });
  };

  return {
    toasts,
    success,
    error,
    warning,
    info,
    addToast,
    removeToast,
  };
}
