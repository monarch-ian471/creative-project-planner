<script>
export default {
  data() {
    return {
      routes: [
        { path: '/HomeView', label: 'Home' },
        { path: '/Community', label: 'Community' },
        { path: '/MyDashboard', label: 'MyDashboard' },
        { path: '/Projects', label: 'Projects' },
      ],
    };
  },
};
</script>

<template>
    <header class="flex flex-col items-center lg:flex-row lg:items-start lg:pr-8">
        <img alt="cpp logo" class="w-32 h-32 mb-8 lg:mb-0 lg:mr-8" src="@/assets/cpp-logo.svg" />

        <div class="flex flex-col items-center lg:flex-row lg:items-start">
        <nav class="mt-8 text-center lg:text-left lg:mt-4 lg:ml-4">
            <router-link
              v-for="route in routes"
              :key="route.path"
              :to="route.path"
              class="inline-block px-4 py-2 border-l border-gray-300 first:border-0"
              :aria-label="route.label"
            >
              {{ route.label }}
            </router-link>
        </nav>
        </div>
    </header>

    <div class="container mx-auto mt-8">
        <h1 class="text-4xl font-bold text-center mb-6">Creative Project Planner</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-2xl font-semibold mb-4">Organize Your Ideas</h2>
                <p>Keep all your creative ideas in one place and easily accessible. Never lose track of your thoughts and inspirations.</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-2xl font-semibold mb-4">Plan Your Projects</h2>
                <p>Break down your projects into manageable tasks and set deadlines to stay on track. Achieve your goals efficiently.</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-2xl font-semibold mb-4">Collaborate with Team</h2>
                <p>Work together with your team seamlessly. Share ideas, assign tasks, and track progress in real-time.</p>
            </div>
        </div>
    </div>
    
    <RouterView />
</template>