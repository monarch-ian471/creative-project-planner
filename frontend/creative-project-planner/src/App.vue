<script setup>
import { RouterLink, RouterView } from 'vue-router';

const routes = [
  { path: '/HomeView', label: 'Home' },
  { path: '/Community', label: 'Community' },
  { path: '/MyDashboard', label: 'MyDashboard' },
  { path: '/Projects', label: 'Projects' },
];
</script>

<template>
  <header class="flex flex-col items-center lg:flex-row lg:items-start lg:pr-8">
    <img alt="cpp logo" class="w-32 h-32 mb-8 lg:mb-0 lg:mr-8" src="@/assets/cpp-logo.svg" />

    <div class="flex flex-col items-center lg:flex-row lg:items-start">
      <nav class="mt-8 text-center lg:text-left lg:mt-4 lg:ml-4">
        <RouterLink
          v-for="route in routes"
          :key="route.path"
          :to="route.path"
          class="inline-block px-4 py-2 border-l border-gray-300 first:border-0"
          :aria-label="route.label"
        >
          {{ route.label }}
        </RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>


<!-- <template>
  <header class="flex flex-col items-center lg:flex-row lg:items-start lg:pr-8">
    <img alt="cpp logo" class="w-32 h-32 mb-8 lg:mb-0 lg:mr-8" src="@/assets/cpp-logo.svg" />

    <div class="flex flex-col items-center lg:flex-row lg:items-start">

      <nav class="mt-8 text-center lg:text-left lg:mt-4 lg:ml-4">
        <RouterLink to="/HomeView" class="inline-block px-4 py-2 border-l border-gray-300 first:border-0">Home</RouterLink>
        <RouterLink to="/Community" class="inline-block px-4 py-2 border-l border-gray-300">Community</RouterLink>
        <RouterLink to="/MyDashboard" class="inline-block px-4 py-2 border-l border-gray-300">My Dashboard</RouterLink>
        <RouterLink to="/Projects" class="inline-block px-4 py-2 border-l border-gray-300">Projects</RouterLink>
        <RouterLink to="/Settings" class="inline-block px-4 py-2 border-l border-gray-300"></RouterLink> 
      </nav>
    </div>
  </header>

  <RouterView />
</template> -->
