<template>
    <div class="container mx-auto p-4">
        <h1 class="text-3xl font-bold mb-4">Project Details</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white p-4 rounded shadow">
                <h2 class="text-2xl font-semibold mb-2">Tasks</h2>
                <TaskList />
            </div>
            <div class="bg-white p-4 rounded shadow">
                <h2 class="text-2xl font-semibold mb-2">Calendar</h2>
                <Calendar />
            </div>
        </div>
    </div>
</template>

<script>
import TaskList from '@/components/TaskList.vue';
import Calendar from '@/components/Calendar.vue';

export default {
    name: 'ProjectDetail',
    components: {
        TaskList,
        Calendar
    }
};
</script>