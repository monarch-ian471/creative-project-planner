<template>
    <div class="min-h-screen bg-gray-100 p-4">
        <Dashboard />
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
    </div>
</template>

<script>
import Dashboard from '@/components/Dashboard.vue';

export default {
    name: 'HomeView',
    components: {
        Dashboard
    }
};
</script>