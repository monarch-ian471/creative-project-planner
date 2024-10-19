<script>
import { ref } from 'vue';
import { gapi } from 'gapi-script';
import formatDate from '@/utils/formatDate';

export default {
    name: 'ProgressTracker',
    setup() {
        const tasks = ref([
            { id: 1, title: 'Design Mockups', deadline: '2023-10-15', priority: 'High' },
            { id: 2, title: 'Develop Backend', deadline: '2023-11-01', priority: 'Medium' },
            { id: 3, title: 'Testing', deadline: '2023-11-15', priority: 'Low' },
        ]);

        const syncCalendar = () => {
            gapi.load('client:auth2', () => {
                gapi.client.init({
                    apiKey: 'YOUR_API_KEY',
                    clientId: 'YOUR_CLIENT_ID',
                    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
                    scope: 'https://www.googleapis.com/auth/calendar.events',
                }).then(() => {
                    gapi.auth2.getAuthInstance().signIn().then(() => {
                        tasks.value.forEach(task => {
                            const event = {
                                summary: task.title,
                                start: { date: task.deadline },
                                end: { date: task.deadline },
                            };
                            gapi.client.calendar.events.insert({
                                calendarId: 'primary',
                                resource: event,
                            }).then(response => {
                                console.log('Event created: ', response);
                            });
                        });
                    });
                });
            });
        };

        return { tasks, syncCalendar, formatDate };
    },
};
</script>

<template>
    <div class="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
        <h2 class="text-xl font-bold">Project Deadlines</h2>
        <div v-for="task in tasks" :key="task.id" class="p-4 bg-gray-100 rounded-lg">
            <h3 class="text-lg font-semibold">{{ task.title }}</h3>
            <p class="text-gray-600">Deadline: {{ formatDate(task.deadline) }}</p>
            <p class="text-gray-600">Priority: {{ task.priority }}</p>
        </div>
        <button @click="syncCalendar" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
            Sync with Calendar
        </button>
    </div>
</template>


<style scoped>
@import 'tailwindcss/tailwind.css';
</style>