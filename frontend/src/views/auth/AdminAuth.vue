<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { Eye, EyeOff, Mail, Lock, Shield, ArrowLeft } from 'lucide-vue-next';

const router = useRouter();
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');

const loginForm = ref({
  email: '',
  password: ''
});

const handleLogin = async () => {
  if (!loginForm.value.email || !loginForm.value.password) {
    errorMessage.value = 'Please fill in all fields';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await axios.post('/api/admin/login', {
      email: loginForm.value.email,
      password: loginForm.value.password
    });

    // Store admin token
    localStorage.setItem('adminToken', response.data.token);
    localStorage.setItem('admin', JSON.stringify(response.data.admin));

    // Redirect to admin dashboard
    router.push('/admin/dashboard');
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Invalid credentials. Admin access only.';
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  // Check if user is authenticated before going back
  const token = localStorage.getItem('token');
  if (token) {
    router.push('/portal/homeview');
  } else {
    router.push('/auth/login');
  }
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Back Button -->
      <button 
        @click="goBack"
        class="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft :size="20" />
        <span>Back</span>
      </button>

      <!-- Admin Login Card -->
      <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-orange-500/30 overflow-hidden">
        <!-- Header -->
        <div class="p-8 pb-6 border-b border-gray-700 bg-gradient-to-r from-orange-900/20 to-red-900/20">
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
              <Shield :size="32" class="text-white" />
            </div>
          </div>
          <h1 class="text-3xl font-bold text-center mb-2 text-white">
            Admin Portal
          </h1>
          <p class="text-gray-400 text-center">
            Authorized personnel only
          </p>
        </div>

        <!-- Warning Banner -->
        <div class="mx-8 mt-6 bg-orange-500/10 border border-orange-500/50 rounded-lg p-3">
          <p class="text-orange-400 text-sm text-center">
            <Shield :size="16" class="inline mr-2" />
            This area is restricted to administrators
          </p>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mx-8 mt-4">
          <div class="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
            <p class="text-red-400 text-sm">{{ errorMessage }}</p>
          </div>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="p-8 space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Admin Email</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail :size="20" class="text-gray-500" />
              </div>
              <input 
                v-model="loginForm.email"
                type="email" 
                required
                class="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none transition-colors"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Admin Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock :size="20" class="text-gray-500" />
              </div>
              <input 
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full pl-10 pr-12 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none transition-colors"
                placeholder="Enter admin password"
              />
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <Eye v-if="!showPassword" :size="20" class="text-gray-500 hover:text-gray-300" />
                <EyeOff v-else :size="20" class="text-gray-500 hover:text-gray-300" />
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input type="checkbox" class="w-4 h-4 rounded bg-gray-700 border-gray-600 text-orange-500 focus:ring-orange-500">
              <span class="ml-2 text-sm text-gray-400">Keep me signed in</span>
            </label>
          </div>

          <button 
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all transform hover:scale-105 font-medium shadow-lg"
          >
            {{ loading ? 'Authenticating...' : 'Access Admin Panel' }}
          </button>
        </form>

        <!-- Security Footer -->
        <div class="px-8 pb-8 text-center">
          <p class="text-gray-500 text-xs">
            <Lock :size="12" class="inline mr-1" />
            All admin sessions are monitored and encrypted
          </p>
        </div>
      </div>

      <!-- Additional Security Info -->
      <div class="mt-6 bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <p class="text-gray-400 text-sm text-center">
          <strong class="text-orange-400">Security Notice:</strong> Unauthorized access attempts are logged and reported.
        </p>
      </div>
    </div>
  </div>
</template>
