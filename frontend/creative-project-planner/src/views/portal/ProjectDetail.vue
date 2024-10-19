<script>
import TaskList from '@/components/TaskList.vue';
import CalendarCard from '@/components/CalendarCard.vue';

export default {
    name: 'ProjectDetail',
    components: {
        TaskList,
        CalendarCard,
    },
    data() {
    return {
      routes: [
        { path: '/portal/homeview', label: 'Home' },
        { path: '/portal/community', label: 'Community' },
        { path: '/portal/mydashboard', label: 'MyDashboard' },
        { path: '/portal/projects', label: 'Projects' },
        { path: '/portal/settings', label: 'Settings' },
      ],
    };
  },
};
</script>

<template>
    <header class="flex flex-col items-center lg:flex-row lg:items-start lg:pr-4">

    <div class="flex flex-col items-center lg:flex-row lg:items-start">
        <nav class="mt-8 text-center lg:text-left lg:mt-4 lg:ml-4 rounded-lg shadow-md">
            <router-link
            v-for="route in routes"
            :key="route.path"
            :to="route.path"
            class="inline-block px-4 py-2 border-l border-gray-300 first:border-0 hover:bg-orange-400"
            :aria-label="route.label"
            >
            {{ route.label }}
            </router-link>
        </nav>
    </div>
    </header>

    <div class="container mx-auto p-4">
        <h1 class="text-3xl font-bold mb-4">Project Details</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white p-4 rounded shadow">
                <h2 class="text-2xl font-semibold mb-2">Tasks</h2>
                <TaskList />
            </div>
            <div class="bg-white p-4 rounded shadow">
                <h2 class="text-2xl font-semibold mb-2">Calendar</h2>
                <CalendarCard />
            </div>
        </div>
    </div>
</template>