<template>
    <div class="min-h-screen flex flex-col">
        <header class="bg-gray-800 text-white p-4">
            <nav class="container mx-auto flex justify-between items-center">
                <div class="text-lg font-bold">Creative Project Planner</div>
                <div>
                    <router-link to="/dashboard" class="mr-4">Dashboard</router-link>
                    <router-link to="/login" class="mr-4">Login</router-link>
                    <router-link to="/register">Register</router-link>
                </div>
            </nav>
        </header>
        <main class="flex-grow container mx-auto p-4">
            <router-view></router-view>
        </main>
        <footer class="bg-gray-800 text-white p-4 text-center">
            &copy; 2024 Creative Project Planner
        </footer>
    </div>
</template>

<script>
export default {
    name: 'MainLayout',
};
</script>