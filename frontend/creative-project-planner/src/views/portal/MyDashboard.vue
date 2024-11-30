<script lang="ts">
import { defineComponent, ref, onMounted, watch, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { 
  getProjects, 
  getTasks, 
  addProject, 
  addTask 
} from '@/services/projectService';
import GanttChart from 'vue-ganttastic';
import { Calendar } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';

// Define interfaces for type safety
interface Project {
  _id: string;
  id?: string;
  name: string;
  title: string;
  description: string;
  status: string;
  end_date: string;
  dueDate: Date;
}

interface Task {
  _id: string;
  id?: string;
  name: string;
  title?: string;
  project: string;
  status?: string;
  due_date?: string;
  completed: boolean;
}

export default defineComponent({
  name: 'MyDashboard',
  components: {
    GanttChart,
    FullCalendar,
  },
  setup() {
    const router = useRouter();

    // Typed state variables
    const projects = ref<Project[]>([]);
    const tasks = ref<Task[]>([]);

    // Modify the type for ganttData to make label non-optional
    const ganttData = ref<Array<{
      id: string;
      label: string;
      startsAt: Date;
      endsAt: Date;
      project: string;
    }>>([]);

    // Modify the type for calendarEvents to make title non-optional
    const calendarEvents = ref<Array<{
      title: string;
      start?: Date;
      end?: Date;
    }>>([]);
    
    const userPreferences = reactive({
      showCalendar: true,
      showGantt: true,
    });

    // Typed form data for new project and task
    const newProject = reactive<Omit<Project, '_id' | 'id' | 'name' | 'status' | 'end_date'>>({
      title: '',
      description: '',
      dueDate: new Date(),
    });

    const newTask = reactive<Partial<Omit<Task, '_id' | 'id'>>>({
      name: '',
      project: '',
      completed: false,
    });


    const calendarOptions = ref<any>({
      plugins: [dayGridPlugin],
      initialView: 'dayGridMonth',
      events: [],
    });

    // Fetch projects and tasks
    // Modify the fetchData method to ensure type compatibility
const fetchData = async () => {
  try {
    const fetchedProjects = await getProjects();
    const fetchedTasks = await getTasks();
    
    projects.value = fetchedProjects as Project[];
    tasks.value = fetchedTasks as Task[];

    // Prepare Gantt data with non-optional label and title
    ganttData.value = tasks.value.map((task) => ({
      id: task._id || task.id || '',
      label: task.name || task.title || 'Unnamed Task', // Provide a default string
      startsAt: new Date(), 
      endsAt: new Date(), 
      project: task.project,
    }));

    // Prepare Calendar events with non-optional title
    calendarEvents.value = tasks.value.map((task) => ({
      title: task.name || task.title || 'Unnamed Event', // Provide a default string
      start: task.due_date ? new Date(task.due_date) : undefined,
      end: task.due_date ? new Date(task.due_date) : undefined,
    }));

    // Update calendar options
    calendarOptions.value = {
      ...calendarOptions.value,
      events: calendarEvents.value,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    ganttData.value = [];
    calendarEvents.value = [];
  }
};

    // Create a new project
    const createProject = async () => {
      try {
        const project = await addProject({
          title: newProject.title,
          description: newProject.description,
          dueDate: newProject.dueDate
        });
        
        // Reset form and refresh data
        newProject.title = '';
        newProject.description = '';
        newProject.dueDate = new Date();
        
        // Refresh projects list
        await fetchData();
      } catch (error) {
        console.error('Error creating project:', error);
      }
    };

    const createTask = async () => {
      try {
        const task = await addTask({
          name: newTask.name || 'New Task',
          // title: newTask.name || 'New Task',
          completed: newTask.completed,
          project: newTask.project,
          // status: newTask.status || 'pending',
          // due_date: new Date().toISOString()
        });
        
        // Reset form and refresh data
        newTask.completed = false;
        newTask.project = '';
        newTask.name = '';
        newTask.title = '';
        newTask.status = 'pending';
        
        // Refresh tasks list
        await fetchData();
      } catch (error) {
        console.error('Error creating task:', error);
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

    // Navigation methods
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
      newProject,
      newTask,
      goToSettings,
      goToProject,
      createProject,
      createTask,
    };
  },
});
</script>

<template>
    <div class="container mx-auto p-4">
    <h1 class="text-4xl font-bold mb-4">Welcome to Your Dashboard</h1>

    <!-- Project Creation Form -->
    <div class="mb-6 bg-white rounded shadow-md p-4">
      <h2 class="text-xl font-bold mb-4">Create New Project</h2>
      <form @submit.prevent="createProject" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Project Title</label>
          <input 
            v-model="newProject.title" 
            type="text" 
            required 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Description</label>
          <input 
            v-model="newProject.description" 
            type="text" 
            required 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Due Date</label>
          <input 
            v-model="newProject.dueDate" 
            type="date" 
            required 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
        </div>
        <div class="md:col-span-3">
          <button 
            type="submit" 
            class="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Create Project
          </button>
        </div>
      </form>
    </div>

    <!-- Task Creation Form -->
    <div class="mb-6 bg-white rounded shadow-md p-4">
      <h2 class="text-xl font-bold mb-4">Create New Task</h2>
      <form @submit.prevent="createTask" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Task Name</label>
          <input 
              v-model="newTask.name"
              type="text" 
              required 
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Project</label>
          <select 
            v-model="newTask.project" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Select a Project</option>
            <option v-for="project in projects" :key="project._id" :value="project._id">
              {{ project.title }}
            </option>
          </select>
        </div>
        <div class="flex items-center">
          <input 
            v-model="newTask.completed" 
            type="checkbox" 
            class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
          <label class="ml-2 text-sm font-medium text-gray-700">Completed</label>
        </div>
        <div class="md:col-span-3">
          <button 
            type="submit" 
            class="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Create Task
          </button>
        </div>
      </form>
    </div>

    
    <div class="mb-6">
      <button @click="goToSettings" class="bg-gray-800 text-white px-4 py-2 rounded">
        Personalize Dashboard
      </button>
    </div>

    
    <div v-if="projects.length > 0" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
      <div
        v-for="project in projects"
        :key="project.id"
        class="bg-white rounded shadow-md p-4 border hover:shadow-lg transition-shadow"
      >
        <h2 class="text-lg font-bold">{{ project.name }}</h2>
        <p>Status: {{ project.status }}</p>
        <p>Due: {{ project.end_date }}</p>
        <button @click="goToProject(project._id)" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
          View Details
        </button>
      </div>
    </div>
    <div v-else class="text-center text-gray-500">No projects available.</div>

    
    <div v-if="userPreferences.showCalendar && calendarOptions" class="mb-6">
      <h2 class="text-xl font-bold mb-4">Calendar</h2>
      <FullCalendar v-bind="calendarOptions" />
    </div>

    
    <div v-if="userPreferences.showGantt && ganttData.length > 0" class="mb-6">
      <h2 class="text-xl font-bold mb-4">Gantt Timeline</h2>
      <GanttChart
        :rows="ganttData"
        :columns="['label', 'startsAt', 'endsAt']"
        :columnHeaderStyle="{ color: '#4a4a4a', fontWeight: 'bold' }"
      />
    </div>

    
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


<!-- <div class="container mx-auto p-4">
    <h1 class="text-4xl font-bold mb-4">Welcome to Your Dashboard</h1>

<!-- <template>
    <div class="text-center">
      <svg class="mx-auto size-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
      <h3 class="mt-2 text-sm font-semibold text-gray-900">No projects</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
      <div class="mt-6">
        <button type="button" class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          <PlusIcon class="-ml-0.5 mr-1.5 size-5" aria-hidden="true" />
          New Project
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { PlusIcon } from '@heroicons/vue/20/solid'
  </script> -->