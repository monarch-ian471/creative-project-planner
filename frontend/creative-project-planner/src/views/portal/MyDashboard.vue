<script lang="ts">
import { defineComponent, ref, onMounted, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectStore } from '@/store/projectStore';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import { 
  initializeAuth0, 
  getTokenSilently 
} from '@/views/auth/auth0';
import axios from 'axios';
import ProjectCard from '@/views/projects/projectCard.vue';
import type { Project, Task, UserProfile } from '@/types/index';

export default defineComponent({
  name: 'MyDashboard',
  components: {
    FullCalendar,
    ProjectCard
  },
  setup() {
    const projectStore = useProjectStore();
    
    const projects = computed<Project[]>(() => 
      projectStore.projects.map(project => ({
        ...project,
        // Ensure dueDate is always a Date object
        dueDate: project.dueDate instanceof Date 
          ? project.dueDate 
          : new Date(project.dueDate)
      }))
    );

    const router = useRouter();

    // State variables
    const tasks = ref<Task[]>([]);
    
    const userPreferences = reactive({
      showCalendar: true,
    });

    const calendarOptions = ref({
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
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
      events: [] as EventInput[],
    });

    // Fetch projects and tasks
    const fetchData = async () => {
      try {
        // Use .fetch() method instead of .fetchProjects()
        await projectStore.fetchData();
        

        // Update calendar events with project due dates
        const calendarEventsList: EventInput[] = projects.value.map((project) => ({
          title: project.title,
          start: project.dueDate,
          allDay: true
        }));

        calendarOptions.value = {
          ...calendarOptions.value,
          events: calendarEventsList
        };
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Navigation methods
    const openCreateProject = () => {
      router.push('/projects/create');
    };

    const openProjectDetail = (projectId: string) => {
      router.push(`/projects/${projectId}`);
    };

    // Rest of the existing user profile and initialization logic remains the same
    const userProfile = ref<UserProfile>({
      firstName: '',
      lastName: '',
      email: '',
      profilePicture: '/default-avatar.png'
    });

    const profileStats = ref({
      totalProjects: 0,
      completedTasks: 0,
      pendingTasks: 0
    });

    const profilePictureFile = ref<File | null>(null);

    // Fetch user profile (existing implementation)
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

    // Fetch user stats (existing implementation)
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

    // Profile picture upload (existing implementation)
    const handleFileUpload = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (file) {
        profilePictureFile.value = file;
        // Implement upload logic
      }
    };

    // Initialization
    onMounted(async () => {
      try {
        await initializeAuth0();
        await projectStore.fetchData()
        await fetchUserProfile();
        await fetchUserStats();
        await fetchData();
      } catch (error) {
        console.error('Initialization error:', error);
      }
    });

    return {
      projects,
      tasks,
      userPreferences,
      calendarOptions,
      userProfile,
      profileStats,
      handleFileUpload,
      openCreateProject,
      openProjectDetail,
    };
  },
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6 rounded-lg border border-gray-800">
    <div class="container mx-auto">
      <!-- Profile Header (existing implementation) -->
      <div class="bg-white shadow-md rounded-lg p-6 mb-8 border border-gray-800 flex items-center">
        <!-- Profile picture and details remain the same -->
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

      <!-- Projects Overview Section -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">My Projects</h2>
          <button 
            @click="openCreateProject"
            class="bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Create New Project
          </button>
        </div>

        <div v-if="projects.length === 0" class="text-center text-gray-500 p-6 border border-gray-300 rounded-lg">
          No projects found. Start by creating a new project!
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ProjectCard 
            v-for="project in projects" 
            :key="project._id"
            :project="project"
            @click="openProjectDetail(project._id || '')"
          />
        </div>
      </div>

      <!-- Calendar View -->
      <div v-if="userPreferences.showCalendar" class="mt-8">
        <h2 class="text-2xl font-bold mb-4">Project Calendar</h2>
        <FullCalendar 
          :options="calendarOptions" 
          class="bg-white shadow-md rounded-lg p-4"
        />
      </div>
    </div>
  </div>
</template>
