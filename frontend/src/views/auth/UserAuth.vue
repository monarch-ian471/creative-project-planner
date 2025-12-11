<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-vue-next';

const router = useRouter();
const isLogin = ref(true);
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');
const isAuthenticated = computed(() => !!localStorage.getItem('token'));
const hasToken = computed(() => !!localStorage.getItem('token'));

// Login form
const loginForm = ref({
  email: '',
  password: ''
});

// Register form
const registerForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  errorMessage.value = '';
};

const handleLogin = async () => {
  if (!loginForm.value.email || !loginForm.value.password) {
    errorMessage.value = 'Please fill in all fields';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await axios.post('/api/users/login', {
      email: loginForm.value.email,
      password: loginForm.value.password
    });

    // Store token
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    // Redirect to home page
    router.push('/portal/homeview');
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Login failed. Please try again.';
  } finally {
    loading.value = false;
  }
};

const handleRegister = async () => {
  if (!registerForm.value.firstName || !registerForm.value.lastName || 
      !registerForm.value.email || !registerForm.value.password) {
    errorMessage.value = 'Please fill in all fields';
    return;
  }

  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    errorMessage.value = 'Passwords do not match';
    return;
  }

  if (registerForm.value.password.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await axios.post('/api/users/register', {
      firstName: registerForm.value.firstName,
      lastName: registerForm.value.lastName,
      email: registerForm.value.email,
      password: registerForm.value.password
    });

    // Store token
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    // Redirect to home page
    router.push('/portal/homeview');
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Registration failed. Please try again.';
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  // Check if user is authenticated before going back
  const token = localStorage.getItem('token');
  if (token) {
    router.push('/portal/homeview');
  }
  // If not authenticated, stay on login page
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Back Button (only show if authenticated) -->
      <button 
        v-if="hasToken"
        @click="goBack"
        class="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft :size="20" />
        <span>Back to Home</span>
      </button>

      <!-- Login/Register Card -->
      <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
        <!-- Header -->
        <div class="p-8 pb-6">
          <h1 class="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-custom-teal via-custom-peach to-custom-lime bg-clip-text text-transparent">
            {{ isLogin ? 'Welcome Back' : 'Create Account' }}
          </h1>
          <p class="text-gray-400 text-center">
            {{ isLogin ? 'Sign in to continue to your account' : 'Join thousands of creators today' }}
          </p>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mx-8 mb-4">
          <div class="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
            <p class="text-red-400 text-sm">{{ errorMessage }}</p>
          </div>
        </div>

        <!-- Login Form -->
        <form v-if="isLogin" @submit.prevent="handleLogin" class="px-8 pb-8 space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail :size="20" class="text-gray-500" />
              </div>
              <input 
                v-model="loginForm.email"
                type="email" 
                required
                class="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock :size="20" class="text-gray-500" />
              </div>
              <input 
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full pl-10 pr-12 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none transition-colors"
                placeholder="Enter your password"
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
              <span class="ml-2 text-sm text-gray-400">Remember me</span>
            </label>
            <button type="button" class="text-sm text-orange-400 hover:text-orange-300 transition-colors">
              Forgot password?
            </button>
          </div>

          <button 
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all transform hover:scale-105 font-medium"
          >
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <!-- Register Form -->
        <form v-else @submit.prevent="handleRegister" class="px-8 pb-8 space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">First Name</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User :size="20" class="text-gray-500" />
                </div>
                <input 
                  v-model="registerForm.firstName"
                  type="text" 
                  required
                  class="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="John"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
              <input 
                v-model="registerForm.lastName"
                type="text" 
                required
                class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none transition-colors"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail :size="20" class="text-gray-500" />
              </div>
              <input 
                v-model="registerForm.email"
                type="email" 
                required
                class="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock :size="20" class="text-gray-500" />
              </div>
              <input 
                v-model="registerForm.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full pl-10 pr-12 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none transition-colors"
                placeholder="At least 6 characters"
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

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock :size="20" class="text-gray-500" />
              </div>
              <input 
                v-model="registerForm.confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none transition-colors"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <div class="flex items-start">
            <input type="checkbox" required class="w-4 h-4 mt-1 rounded bg-gray-700 border-gray-600 text-orange-500 focus:ring-orange-500">
            <label class="ml-2 text-sm text-gray-400">
              I agree to the <a href="#" class="text-orange-400 hover:text-orange-300">Terms of Service</a> and <a href="#" class="text-orange-400 hover:text-orange-300">Privacy Policy</a>
            </label>
          </div>

          <button 
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all transform hover:scale-105 font-medium"
          >
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <!-- Toggle Form -->
        <div class="px-8 pb-8 pt-4 border-t border-gray-700 text-center">
          <p class="text-gray-400">
            {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
            <button 
              @click="toggleMode"
              class="ml-2 text-orange-400 hover:text-orange-300 font-medium transition-colors"
            >
              {{ isLogin ? 'Sign up' : 'Sign in' }}
            </button>
          </p>
        </div>
      </div>

      <!-- Additional Info -->
      <p class="text-center text-gray-500 text-sm mt-6">
        Protected by industry-standard encryption
      </p>
    </div>
  </div>
</template>
