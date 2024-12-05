<script lang="ts">
import { defineComponent, ref, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'App',
  setup() {
    const router = useRouter();

    // State management
    const isMobileMenuOpen = ref(false);
    const isUserMenuOpen = ref(false);
    let menuTimeout: ReturnType<typeof setTimeout> | null = null;

    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value;
      if (isMobileMenuOpen.value) {
        isUserMenuOpen.value = false;
      }
    };

    const toggleUserMenu = () => {
      isUserMenuOpen.value = !isUserMenuOpen.value;
      if (isUserMenuOpen.value) {
        isMobileMenuOpen.value = false;
      }
    };

    const openUserMenu = () => {
      isUserMenuOpen.value = true;
      resetMenuTimeout();
    };

    const closeUserMenu = () => {
      isUserMenuOpen.value = false;
      if (menuTimeout) {
        clearTimeout(menuTimeout);
        menuTimeout = null;
      }
    };

    const resetMenuTimeout = () => {
      if (menuTimeout) {
        clearTimeout(menuTimeout);
      }
      menuTimeout = setTimeout(closeUserMenu, 25000); // Menu will close after 5 seconds of inactivity
    };
    
    onUnmounted(() => {
      if (menuTimeout) {
        clearTimeout(menuTimeout);
      }
    });

    const logIn = () => {
      router.push('/login');
    };

    const routes = [
      { path: '/portal/homeview', label: 'Home' },
      { path: '/portal/community', label: 'Community' },
      { path: '/portal/mydashboard', label: 'Dashboard' },
      { path: '/portal/projects', label: 'Projects' },
    ];
    return {
      isMobileMenuOpen,
      closeUserMenu,
      resetMenuTimeout,
      isUserMenuOpen,
      toggleMobileMenu,
      toggleUserMenu,
      logIn,
      routes,
    };
  }
});
</script>

<template>
  <div id="app" class="min-h-screen flex flex-col bg-app-bg bg-cover bg-center">
      <!-- Header Section -->
  <header class="flex flex-col items-center lg:flex-row lg:justify-between p-4 bg-black bg-opacity-75 text-white shadow-lg">
    <div class="flex items-center space-x-4">
      <h1 class="text-3xl font-bold">
        <span class="text-custom-teal ">Creative </span> 
        <span class="text-custom-peach">Project </span> 
        <span class="text-custom-lime">Planner</span>
      </h1>
    </div>

    <!-- Desktop Navigation -->
    <nav class="hidden lg:flex space-x-6">
      <router-link
        v-for="route in routes"
        :key="route.path"
        :to="route.path"
        class="text-lg font-medium hover:text-orange-500"
      >
        {{ route.label }}
      </router-link>
    </nav>

    <!-- Mobile Menu -->
    <div class="lg:hidden relative">
      <button @click="toggleMobileMenu" class="text-lg font-medium focus:outline-none">
        <span v-if="!isMobileMenuOpen">☰</span>
        <span v-else>✕</span>
      </button>

      <div
        v-if="isMobileMenuOpen"
        class="absolute top-12 right-0 w-48 bg-white text-black rounded-md shadow-lg z-50"
      >
        <ul>
          <li v-for="route in routes" :key="route.path">
            <router-link :to="route.path" class="block px-4 py-2 text-lg hover:bg-gray-200">
              {{ route.label }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>

  <!-- User Menu -->
  <div class="relative">
        <button
          @click="toggleUserMenu"
          class="px-4 py-2 rounded-lg bg-orange-500 text-white shadow-md hover:bg-orange-600 focus:outline-none"
        >
          Menu
        </button>

        <div
          v-if="isUserMenuOpen"
          class="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-50"
          @mouseenter="resetMenuTimeout"
          @mouseleave="closeUserMenu"
        >
          <ul>
            <li>
              <router-link to="/portal/settings" class="block px-4 py-2 rounded-md hover:bg-orange-200">
                Settings
              </router-link>
            </li>
            <li>
              <router-link to="/portal/mydashboard" class="block px-4 py-2 rounded-md hover:bg-orange-200">
                Dashboard
              </router-link>
            </li>
            <li>
              <button @click="logIn" class="block w-full text-left px-4 py-2 rounded-md hover:bg-orange-200">
                Login
              </button>
            </li>
          </ul>
        </div>
      </div>
  </header>

    <main class="flex-grow p-6">
      <router-view></router-view>
    </main>

    <footer class="bg-black bg-opacity-75 text-white text-center p-4">
      <p>&copy; 2024 Creative Project Planner. All rights reserved.</p>
    </footer>
  </div>
</template>


