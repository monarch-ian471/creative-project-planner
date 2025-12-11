<script lang="ts">
import { defineComponent, ref, onUnmounted, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'App',
  setup() {
    const router = useRouter();

    // State management
    const isMobileMenuOpen = ref(false);
    const isUserMenuOpen = ref(false);
    const isAuthenticated = ref(false);
    let menuTimeout: ReturnType<typeof setTimeout> | null = null;

    // Check authentication status
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      isAuthenticated.value = !!token;
    };

    onMounted(() => {
      checkAuth();
    });

    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value;
      if (isMobileMenuOpen.value) {
        isUserMenuOpen.value = false;
      }
    };

    const openUserMenu = () => {
      if (menuTimeout) {
        clearTimeout(menuTimeout);
        menuTimeout = null;
      }
      isUserMenuOpen.value = true;
    };

    const closeUserMenu = () => {
      menuTimeout = setTimeout(() => {
        isUserMenuOpen.value = false;
      }, 300); // Small delay for smooth transition
    };
    
    onUnmounted(() => {
      if (menuTimeout) {
        clearTimeout(menuTimeout);
      }
    });

    const logIn = () => {
      router.push('/auth/login');
    };

    const logOut = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      isAuthenticated.value = false;
      router.push('/auth/login');
      isMobileMenuOpen.value = false;
      isUserMenuOpen.value = false;
    };

    const routes = [
      { path: '/portal/homeview', label: 'Home' },
      { path: '/portal/community', label: 'Community' },
    ];
    
    return {
      isMobileMenuOpen,
      closeUserMenu,
      openUserMenu,
      isUserMenuOpen,
      toggleMobileMenu,
      logIn,
      logOut,
      routes,
      isAuthenticated,
    };
  }
});
</script>

<template>
  <div id="app" class="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <!-- Header Section -->
  <header v-if="isAuthenticated" class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-7xl">
    <div class="bg-black/90 backdrop-blur-md text-white shadow-2xl rounded-2xl border border-orange-500/30 p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <h1 class="text-2xl md:text-3xl font-bold">
            <span class="text-custom-teal">Creative </span> 
            <span class="text-custom-peach">Project </span> 
            <span class="text-custom-lime">Planner</span>
          </h1>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center space-x-6">
          <router-link
            v-for="route in routes"
            :key="route.path"
            :to="route.path"
            class="text-lg font-medium hover:text-orange-500 transition-colors duration-200"
          >
            {{ route.label }}
          </router-link>
          
          <!-- User Menu Button -->
          <div class="relative" @mouseenter="openUserMenu" @mouseleave="closeUserMenu">
            <button
              class="flex flex-col space-y-1 p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <span class="w-6 h-0.5 bg-white"></span>
              <span class="w-6 h-0.5 bg-white"></span>
              <span class="w-6 h-0.5 bg-white"></span>
            </button>

            <div
              v-if="isUserMenuOpen"
              class="absolute right-0 mt-2 w-48 bg-black/95 backdrop-blur-md text-white rounded-xl shadow-2xl border border-orange-500/30 overflow-hidden"
            >
              <ul>
                <li>
                  <router-link to="/portal/mydashboard" class="block px-4 py-3 hover:bg-orange-500/20 transition-colors">
                    Profile
                  </router-link>
                </li>
                <li>
                  <router-link to="/portal/settings" class="block px-4 py-3 hover:bg-orange-500/20 transition-colors">
                    Settings
                  </router-link>
                </li>
                <li>
                  <button @click="logOut" class="block w-full text-left px-4 py-3 hover:bg-orange-500/20 transition-colors border-t border-gray-700">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <!-- Mobile Menu Toggle -->
        <div class="lg:hidden relative">
          <button @click="toggleMobileMenu" class="flex flex-col space-y-1 p-2 hover:bg-white/10 rounded-lg transition-all duration-200 focus:outline-none">
            <span class="w-6 h-0.5 bg-white transition-all" :class="isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''"></span>
            <span class="w-6 h-0.5 bg-white transition-all" :class="isMobileMenuOpen ? 'opacity-0' : ''"></span>
            <span class="w-6 h-0.5 bg-white transition-all" :class="isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''"></span>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="isMobileMenuOpen" class="lg:hidden mt-4 pt-4 border-t border-white/20">
          <nav class="flex flex-col space-y-2">
            <router-link
              v-for="route in routes"
              :key="route.path"
              :to="route.path"
              @click="isMobileMenuOpen = false"
              class="px-4 py-3 text-lg hover:bg-orange-500/20 rounded-lg transition-colors"
            >
              {{ route.label }}
            </router-link>
            <div class="border-t border-white/20 mt-2 pt-2">
              <router-link to="/portal/mydashboard" @click="isMobileMenuOpen = false" class="block px-4 py-3 hover:bg-orange-500/20 rounded-lg transition-colors">
                Profile
              </router-link>
              <router-link to="/portal/settings" @click="isMobileMenuOpen = false" class="block px-4 py-3 hover:bg-orange-500/20 rounded-lg transition-colors">
                Settings
              </router-link>
              <button @click="logOut" class="block w-full text-left px-4 py-3 hover:bg-orange-500/20 rounded-lg transition-colors">
                Logout
              </button>
            </div>
          </nav>
        </div>
      </transition>
    </div>
  </header>

    <main class="flex-grow" :class="isAuthenticated ? 'pt-20' : ''">
      <router-view></router-view>
    </main>
  </div>
</template>


