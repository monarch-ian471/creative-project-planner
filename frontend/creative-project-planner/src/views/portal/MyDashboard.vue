<script lang="ts">
import { defineComponent, ref, onMounted, watch, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { getProjects, getTasks } from '@/services/projectService';
import GanttChart from 'vue-ganttastic';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';

export default defineComponent({
  name: 'MyDashboard',
  components: {
    GanttChart,
    FullCalendar,
  },
  setup() {
    const router = useRouter();

    // State variables
    const projects = ref([]);
    const tasks = ref([]);
    const ganttData = ref([]);
    const calendarEvents = ref([]);
    const userPreferences = reactive({
      showCalendar: true,
      showGantt: true,
    });

    const calendarOptions = ref({});

    // Fetch projects and tasks
    const fetchData = async () => {
      try {
        projects.value = (await getProjects()) || [];
        tasks.value = (await getTasks()) || [];

        // Prepare Gantt data
        ganttData.value = tasks.value.map((task) => ({
          id: task.id,
          label: task.title,
          startsAt: new Date(task.start_date || Date.now()),
          endsAt: new Date(task.due_date || Date.now()),
          project: task.project_id,
        }));

        // Prepare Calendar events
        calendarEvents.value = tasks.value.map((task) => ({
          title: task.title,
          start: task.start_date,
          end: task.due_date,
        }));

        // Initialize calendar options
        calendarOptions.value = {
          plugins: [dayGridPlugin],
          initialView: 'dayGridMonth',
          events: calendarEvents.value,
        };
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Initial data fetch
    onMounted(fetchData);

    // Watch for calendar event updates
    watch(calendarEvents, (newEvents) => {
      if (calendarOptions.value) {
        calendarOptions.value.events = newEvents;
      }
    });

    // Navigate to settings page
    const goToSettings = () => {
      router.push('/portal/settings');
    };

    const goToProject = (id: string) => {
      router.push(`/portal/project/${id}`);
    };

    return {
      projects,
      tasks,
      ganttData,
      calendarEvents,
      userPreferences,
      calendarOptions,
      goToSettings,
      goToProject,
    };
  },
});
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-4xl font-bold mb-4">Welcome to Your Dashboard</h1>

    <!-- Settings Navigation -->
    <div class="mb-6">
      <button @click="goToSettings" class="bg-gray-800 text-white px-4 py-2 rounded">
        Personalize Dashboard
      </button>
    </div>

    <!-- Compact Cards for Projects -->
    <div v-if="projects.length > 0" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
      <div
        v-for="project in projects"
        :key="project.id"
        class="bg-white rounded shadow-md p-4 border hover:shadow-lg transition-shadow"
      >
        <h2 class="text-lg font-bold">{{ project.name }}</h2>
        <p>Status: {{ project.status }}</p>
        <p>Due: {{ project.end_date }}</p>
        <button @click="goToProject(project.id)" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
          View Details
        </button>
      </div>
    </div>
    <div v-else class="text-center text-gray-500">No projects available.</div>

    <!-- Optional Calendar -->
    <div v-if="userPreferences.showCalendar && calendarOptions" class="mb-6">
      <h2 class="text-xl font-bold mb-4">Calendar</h2>
      <FullCalendar v-bind="calendarOptions" />
    </div>

    <!-- Gantt Timeline -->
    <div v-if="userPreferences.showGantt && ganttData.length > 0" class="mb-6">
      <h2 class="text-xl font-bold mb-4">Gantt Timeline</h2>
      <GanttChart
        :rows="ganttData"
        :columns="['label', 'startsAt', 'endsAt']"
        :columnHeaderStyle="{ color: '#4a4a4a', fontWeight: 'bold' }"
      />
    </div>

    <!-- Task Management -->
    <div v-if="tasks.length > 0" class="mb-6">
      <h2 class="text-xl font-bold mb-4">Tasks</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="task in tasks"
          :key="task.id"
          class="bg-white rounded shadow-md p-4 border"
        >
          <h3 class="text-lg font-bold">{{ task.title }}</h3>
          <p>Status: {{ task.status }}</p>
          <p>Due: {{ task.due_date }}</p>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-500">No tasks available.</div>
    </div>
</template>