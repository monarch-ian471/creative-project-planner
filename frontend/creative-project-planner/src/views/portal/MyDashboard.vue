<script lang="ts">
import { defineComponent, ref, onMounted, watch, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { 
  getProjects, 
  getTasks, 
  addProject, 
  addTask 
} from '@/services/projectService';
import { CalendarOptions } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { initializeAuth0 } from '@/views/auth/auth0';

// Define interfaces for type safety
interface Project {
  _id?: string;
  title: string;
  description: string;
  dueDate: Date;
}

interface Task {
  _id?: string;
  name: string;
  completed: boolean;
  project?: string;
}

export default defineComponent({
  name: 'MyDashboard',
  components: {
    FullCalendar,
  },
  setup() {
    const router = useRouter();

    // Typed state variables
    const projects = ref<Project[]>([]);
    const tasks = ref<Task[]>([]);
    
    const userPreferences = reactive({
      showCalendar: true,
    });

    // Typed form data for new project and task
    const newProject = reactive<{
      title: string;
      description: string;
      dueDate: Date;
    }>({
      title: '',
      description: '',
      dueDate: new Date(),
    });

    const newTask = reactive<{
      name: string;
      completed: boolean;
      project?: string;
    }>({
      name: '',
      completed: false,
      project: '',
    });

    // Calendar options
    const calendarOptions = ref<CalendarOptions>({
      plugins: [
        dayGridPlugin, 
        timeGridPlugin, 
        interactionPlugin,
      ],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      events: [],
    });

    // Fetch projects and tasks
    const fetchData = async () => {
      try {
        const fetchedProjects = await getProjects();
        const fetchedTasks = await getTasks();
        
        projects.value = fetchedProjects;
        tasks.value = fetchedTasks;

        // Update calendar events
        const calendarEventsList = tasks.value.map((task) => ({
          title: task.name || 'Unnamed Task',
          start: new Date(), // Placeholder - adjust based on your actual data model
          end: new Date(),
          allDay: true
        }));

        calendarOptions.value = {
          ...calendarOptions.value,
          events: calendarEventsList
        };
      } catch (error) {
        console.error('Error fetching data:', error);
        projects.value = [];
        tasks.value = [];
      }
    };

    // Create a new project
    const createProject = async () => {
      try {
        await initializeAuth0();

        await addProject({
          title: newProject.title,
          description: newProject.description,
          dueDate: newProject.dueDate
        });
        
        // Reset form
        newProject.title = '';
        newProject.description = '';
        newProject.dueDate = new Date();
        
        // Refresh projects list
        await fetchData();
      } catch (error) {
        console.error('Error creating project:', error);
      }
    };

    // Create a new task
    const createTask = async () => {
      try {
        await initializeAuth0();

        await addTask({
          name: newTask.name,
          completed: newTask.completed,
          project: newTask.project
        });
        
        // Reset form
        newTask.name = '';
        newTask.completed = false;
        newTask.project = '';
        
        // Refresh tasks list
        await fetchData();
      } catch (error) {
        console.error('Error creating task:', error);
      }
    };

    // Initialize data when component is mounted
    onMounted(async () => {
      try {
        await initializeAuth0();
        await fetchData();
      } catch (error) {
        console.error('Initialization or data fetch error:', error);
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
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="container mx-auto">
      <!-- Header Section -->
      <header class="mb-8 flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-800">Project Dashboard</h1>
        <div class="flex space-x-4">
          <button 
            @click="goToSettings" 
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Settings
          </button>
        </div>
      </header>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- New Project Form -->
        <div class="bg-white shadow-md rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">Create New Project</h2>
          <form @submit.prevent="createProject" class="space-y-4">
            <input 
              v-model="newProject.title" 
              placeholder="Project Title" 
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea 
              v-model="newProject.description" 
              placeholder="Project Description" 
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            ></textarea>
            <input 
              type="date" 
              :value="newProject.dueDate.toISOString().split('T')[0]"
              @input="newProject.dueDate = new Date(($event.target as HTMLInputElement).value)"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="submit" 
              class="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Create Project
            </button>
          </form>
        </div>

        <!-- New Task Form -->
        <div class="bg-white shadow-md rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">Create New Task</h2>
          <form @submit.prevent="createTask" class="space-y-4">
            <input 
              v-model="newTask.name" 
              placeholder="Task Name" 
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <select 
              v-model="newTask.project" 
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Project</option>
              <option 
                v-for="project in projects" 
                :key="project._id" 
                :value="project._id"
              >
                {{ project.title }}
              </option>
            </select>
            <div class="flex items-center">
              <input 
                type="checkbox" 
                v-model="newTask.completed" 
                class="mr-2"
              />
              <label>Completed</label>
            </div>
            <button 
              type="submit" 
              class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create Task
            </button>
          </form>
        </div>
      </div>

      <!-- Projects and Tasks Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Projects List -->
        <div class="bg-white shadow-md rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">Projects</h2>
          <div v-if="projects.length === 0" class="text-gray-500 text-center">
            No projects found
          </div>
          <ul v-else class="space-y-2">
            <li 
              v-for="project in projects" 
              :key="project._id" 
              class="flex justify-between items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
              @click="goToProject(project._id || '')"
            >
              <span class="font-medium">{{ project.title }}</span>
              <span class="text-sm text-gray-500">
                Due: {{ project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'No due date' }}
              </span>
            </li>
          </ul>
        </div>

        <!-- Tasks List -->
        <div class="bg-white shadow-md rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">Tasks</h2>
          <div v-if="tasks.length === 0" class="text-gray-500 text-center">
            No tasks found
          </div>
          <ul v-else class="space-y-2">
            <li 
              v-for="task in tasks" 
              :key="task._id" 
              class="flex justify-between items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <span 
                :class="[
                  'font-medium',
                  task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                ]"
              >
                {{ task.name }}
              </span>
              <span class="text-sm text-gray-500">
                {{ task.completed ? 'Completed' : 'Pending' }}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Calendar View -->
      <div v-if="userPreferences.showCalendar" class="mt-8">
        <h2 class="text-2xl font-bold mb-4">Calendar View</h2>
        <FullCalendar 
          :options="calendarOptions" 
          class="bg-white shadow-md rounded-lg p-4"
        />
      </div>
    </div>
  </div>
</template>

