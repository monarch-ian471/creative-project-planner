<template>
    <div class="p-4 bg-white shadow-md rounded-lg">
        <h2 class="text-xl font-bold mb-4">Progress Tracker</h2>
        <calendar-card v-for="(task, index) in tasks" :key="index" :task="task" @update-progress="updateProgress(index, $event)" />
        <div class="mt-4">
            <h3 class="text-lg font-semibold">Overall Progress</h3>
            <div class="w-full bg-gray-200 rounded-full h-4">
                <div class="bg-blue-600 h-4 rounded-full" :style="{ width: overallProgress + '%' }"></div>
            </div>
            <p class="text-sm mt-2">{{ overallProgress }}% completed</p>
        </div>
    </div>
</template>

<script>
import CalendarCard from '@components/Calendar-card.vue';

export default {
    components: {
        CalendarCard
    },
    data() {
        return {
            tasks: [
                { name: 'Task 1', progress: 20 },
                { name: 'Task 2', progress: 50 },
                { name: 'Task 3', progress: 80 }
            ]
        };
    },
    computed: {
        overallProgress() {
            const totalProgress = this.tasks.reduce((sum, task) => sum + task.progress, 0);
            return (totalProgress / (this.tasks.length * 100)) * 100;
        }
    },
    methods: {
        updateProgress(index, progress) {
            this.tasks[index].progress = progress;
        }
    }
};
</script>
