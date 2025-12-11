<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { handleAuthCallback } from '@/views/auth/auth0';

export default defineComponent({
  name: 'CallbackView',
  setup() {
    const router = useRouter();

    onMounted(async () => {
      try {
        await handleAuthCallback();
        // Redirect to dashboard or desired page after successful authentication
        router.push('/portal/mydashboard');
      } catch (error) {
        console.error('Authentication callback error:', error);
        // Redirect to login page or show error
        router.push('/login');
      }
    });

    return {};
  }
});
</script>