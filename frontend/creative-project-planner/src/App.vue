<template>
  <div id="app" class="min-h-screen flex flex-col">
    <header class="bg-green-500 text-white p-6 text-center">
      <h1 class="text-3xl font-bold">Creative Project Planner</h1>
    </header>

    <main class="flex-grow p-6">
      <router-view></router-view>
    </main>

    <footer class="bg-gray-100 text-gray-700 text-center p-4">
      <p>&copy; 2024 Creative Project Planner. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  setup() {
    // Since no complex logic is needed here, setup remains simple
    return {};
  }
});
</script>
