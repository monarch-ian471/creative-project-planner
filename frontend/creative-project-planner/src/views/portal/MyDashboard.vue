<script lang="ts">
import { defineComponent, ref, onMounted, watch, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectStore } from '@/stores/projectStore';
import { CalendarOptions } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { 
  initializeAuth0, 
  getTokenSilently 
} from '@/views/auth/auth0';
import axios from 'axios';

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

interface UserProfile {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  location?: {
    city?: string;
    country?: string;
  };
}

export default defineComponent({
  name: 'MyDashboard',
  components: {
    FullCalendar,
  },
  setup() {

    const projectStore = useProjectStore();

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

        // New profile-related reactive state
        const userProfile = ref<UserProfile>({
      firstName: '',
      lastName: '',
      email: '',
      profilePicture: '/default-avatar.png' // Default avatar
    });

    const profileStats = ref({
      totalProjects: 0,
      completedTasks: 0,
      pendingTasks: 0
    });

    const profilePictureFile = ref<File | null>(null);


    // Fetch user profile
    const fetchUserProfile = async () => {
      try {
        await initializeAuth0();
        
        const response = await axios.get('/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${await getTokenSilently()}`
          }
        });

        userProfile.value = response.data.profile;
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    // Fetch user stats
    const fetchUserStats = async () => {
      try {
        const response = await axios.get('/api/users/stats', {
          headers: {
            'Authorization': `Bearer ${await getTokenSilently()}`
          }
        });

        profileStats.value = response.data.stats;
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    // Upload profile picture
    const uploadProfilePicture = async () => {
      if (!profilePictureFile.value) return;

      const formData = new FormData();
      formData.append('profilePicture', profilePictureFile.value);

      try {
        const response = await axios.post('/api/users/profile-picture', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${await getTokenSilently()}`
          }
        });

        userProfile.value.profilePicture = response.data.profilePictureUrl;
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }
    };

    // Handle file selection
    const handleFileUpload = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (file) {
        profilePictureFile.value = file;
        uploadProfilePicture();
      }
    };


    // Initialize data when component is mounted
    onMounted(async () => {
      try {
        await initializeAuth0();
        await fetchUserProfile();
        await fetchUserStats();
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
      userProfile,
      profileStats,
      handleFileUpload,
    };
  },
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6 rounded-lg border border-gray-800">
    <div class="container mx-auto">

      <div class="bg-white shadow-md rounded-lg p-6 mb-8 border border-gray-800 flex items-center">
          <div class="relative mr-6">
            <input 
              type="file" 
              @change="handleFileUpload"
              accept="image/*" 
              class="hidden" 
              id="profilePictureUpload"
            />
            <label 
              for="profilePictureUpload" 
              class="cursor-pointer hover:opacity-75 transition-opacity"
            >
              <img 
                :src="userProfile.profilePicture" 
                alt="Profile" 
                class="w-24 h-24 rounded-full object-cover border-4 border-orange-400"
              />
              <div 
                class="absolute bottom-0 right-0 bg-orange-400 text-white rounded-full w-8 h-8 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </label>
          </div>
          
          <div class="flex-grow">
            <h2 class="text-2xl font-bold text-gray-800">
              {{ userProfile.firstName }} {{ userProfile.lastName }}
            </h2>
            <p class="text-gray-600 mb-2">{{ userProfile.email }}</p>
            <p class="text-gray-500">
              {{ userProfile.location?.city }}, {{ userProfile.location?.country }}
            </p>
          </div>
          
          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <h3 class="text-xl font-bold text-orange-400">
                {{ profileStats.totalProjects }}
              </h3>
              <p class="text-gray-600 text-sm">Projects</p>
            </div>
            <div>
              <h3 class="text-xl font-bold text-green-500">
                {{ profileStats.completedTasks }}
              </h3>
              <p class="text-gray-600 text-sm">Completed</p>
            </div>
            <div>
              <h3 class="text-xl font-bold text-red-500">
                {{ profileStats.pendingTasks }}
              </h3>
              <p class="text-gray-600 text-sm">Pending</p>
            </div>
          </div>
        </div>
      <!-- Header Section -->
      <header class="mb-8 flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-800">Project Dashboard</h1>
      </header>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- New Project Form -->
        <div class="bg-white shadow-md rounded-lg p-6 border border-orange-400">
          <h2 class="text-xl font-semibold mb-4">Create New Project</h2>
          <form @submit.prevent="createProject" class="space-y-4">
            <input 
              v-model="newProject.title" 
              placeholder="Project Title" 
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
            <textarea 
              v-model="newProject.description" 
              placeholder="Project Description" 
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              rows="3"
            ></textarea>
            <input 
              type="date" 
              :value="newProject.dueDate.toISOString().split('T')[0]"
              @input="newProject.dueDate = new Date(($event.target as HTMLInputElement).value)"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <button 
              type="submit" 
              class="w-full bg-orange-400 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Create Project
            </button>
          </form>
        </div>

        <!-- New Task Form -->
        <div class="bg-white shadow-md rounded-lg p-6 border border-orange-400">
          <h2 class="text-xl font-semibold mb-4">Create New Task</h2>
          <form @submit.prevent="createTask" class="space-y-4">
            <input 
              v-model="newTask.name" 
              placeholder="Task Name" 
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
            <select 
              v-model="newTask.project" 
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
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
              class="w-full bg-orange-400 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Create Task
            </button>
          </form>
        </div>
      </div>

      <!-- Projects and Tasks Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Projects List -->
        <div class="bg-white shadow-md rounded-lg p-6 border border-gray-800">
          <h2 class="text-xl font-semibold mb-4">Projects</h2>
          <div v-if="projects.length === 0" class="text-gray-500 text-center rounded-lg border border-gray-300">
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
        <div class="bg-white shadow-md rounded-lg p-6 border border-gray-800">
          <h2 class="text-xl font-semibold mb-4">Tasks</h2>
          <div v-if="tasks.length === 0" class="text-gray-500 text-center rounded-lg border border-gray-300">
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

