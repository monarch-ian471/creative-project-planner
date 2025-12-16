import { ref } from 'vue';

const isLoading = ref(false);
const loadingMessage = ref('Loading...');

export function useLoading() {
  const show = (message = 'Loading...') => {
    loadingMessage.value = message;
    isLoading.value = true;
  };

  const hide = () => {
    isLoading.value = false;
    loadingMessage.value = 'Loading...';
  };

  return {
    isLoading,
    loadingMessage,
    show,
    hide,
  };
}
