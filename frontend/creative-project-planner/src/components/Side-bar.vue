<template>
    <div class="flex flex-col h-screen bg-gray-800 text-white">
        <dashboard-header />
        <nav class="flex flex-col mt-4">
            <router-link to="/" class="py-2 px-4 hover:bg-gray-700">Home</router-link>
            <router-link to="/projects" class="py-2 px-4 hover:bg-gray-700">Projects</router-link>
            <router-link to="/community" class="py-2 px-4 hover:bg-gray-700">Community</router-link>
            <router-link to="/dashboard" class="py-2 px-4 hover:bg-gray-700">Dashboard</router-link>
        </nav>
    </div>
</template>

<script>
import DashboardHeader from './Dashboard-header.vue';

export default {
    name: 'SideBar',
    components: {
        DashboardHeader
    }
};
</script>
