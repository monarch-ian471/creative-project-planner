<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  setup() {
    // Since no complex logic is needed here, setup remains simple
    return {};
  }
});
</script>

<template>
  <div id="app" class="min-h-screen flex flex-col bg-app-bg bg-cover bg-center">
    <header class="bg-opacity-75 p-6 flex items-center">
      <img src="@/assets/cpp-logo.png" alt="Logo" class="h-10 mr-4">
      <h1 class="text-3xl font-bold text-white">Creative Project Planner</h1>
    </header>

    <main class="flex-grow p-6">
      <router-view></router-view>
    </main>

    <footer class="bg-gray-100 text-gray-700 text-center p-4">
      <p>&copy; 2024 Creative Project Planner. All rights reserved.</p>
    </footer>
  </div>
</template>


