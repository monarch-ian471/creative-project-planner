<script>
import DashboardHeader from '@components/Dashboard-Header.vue';

export default {
    name: 'SideBar',
    components: {
        DashboardHeader
    }
};
</script>

<template>
    <div class="flex flex-col h-screen bg-gray-800 text-white">
        <dashboard-header />
        <nav class="flex flex-col mt-4">
            <router-link to="/" class="py-2 px-4 hover:bg-gray-700">Home</router-link>
            <router-link to="/projects" class="py-2 px-4 hover:bg-gray-700">Projects</router-link>
            <router-link to="/community" class="py-2 px-4 hover:bg-gray-700">Community</router-link>
            <router-link to="/dashboard" class="py-2 px-4 hover:bg-gray-700">Dashboard</router-link>
            <RouterLink to="/Settings" class="inline-block px-4 py-2 border-l border-gray-300">Settings</RouterLink> 
        </nav>
    </div>
</template>
