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
import ProjectForm from '@/views/projects/projectForm.vue';
import { toast } from 'vue-sonner';
import type { Project, Task, UserProfile } from '@/types/index';

export default defineComponent({
  name: 'MyDashboard',
  components: {
    FullCalendar,
    ProjectCard,
    ProjectForm
  },
  setup() {
    const projectStore = useProjectStore();
    const router = useRouter();

    // New state for project creation flyout
    const isProjectCreateFlyoutOpen = ref(false);
    const newProject = ref<Project>({
      _id: '', // Add _id with empty string
      title: '',
      description: '',
      dueDate: new Date(),
      status: 'pending' // Add a default status
    });

    const projects = computed<Project[]>(() => 
      projectStore.projects.map(project => ({
        ...project,
        dueDate: project.dueDate instanceof Date 
          ? project.dueDate 
          : new Date(project.dueDate)
      }))
    );

    // Existing state variables
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

    // Existing methods
    const fetchData = async () => {
      try {
        await projectStore.fetchData();
        
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

    // New method for project creation
    const handleCreateProject = async () => {
      try {
        if (!newProject.value.title.trim()) {
          toast.error('Project title is required');
          return;
        }
        
        // Remove _id before creating project
        const { _id, ...projectData } = newProject.value;
        const createdProject = await projectStore.createProject(newProject.value);
        
        toast.success('Project created successfully');
        
        // Close flyout and reset form
        isProjectCreateFlyoutOpen.value = false;
        newProject.value = {
          _id: '',
          title: '',
          description: '',
          dueDate: new Date(),
          status: 'pending'
        };

        // Refresh data to show new project
        await fetchData();
      } catch (error) {
        console.error('Failed to create project', error);
        toast.error('Failed to create project. Please try again.');
      }
    };

    // Toggle project creation flyout
    const toggleProjectCreateFlyout = () => {
      isProjectCreateFlyoutOpen.value = !isProjectCreateFlyoutOpen.value;
    };

    // Existing navigation methods
    const openProjectDetail = (projectId: string) => {
      router.push(`/projects/${projectId}`);
    };

    // Rest of the existing user profile and initialization logic
    const userProfile = ref<UserProfile>({
      firstName: 'Ian',
      lastName: 'Katengeza',
      email: 'iankatengeza@gmail.com',
      profilePicture: '@/src/assets/me.png'
    });

    const profileStats = ref({
      totalProjects: 6,
      completedTasks: 3,
      pendingTasks: 8
    });

    const profilePictureFile = ref<File | null>(null);

    // Existing profile and initialization methods...
    const fetchUserProfile = async () => { /* existing implementation */ };
    const fetchUserStats = async () => { /* existing implementation */ };
    const handleFileUpload = (event: Event) => { /* existing implementation */ };

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
      openProjectDetail,
      
      // New project creation properties
      isProjectCreateFlyoutOpen,
      newProject,
      toggleProjectCreateFlyout,
      handleCreateProject,
    };
  },
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6 rounded-lg border border-gray-800 relative">
    <div class="container mx-auto">
      <!-- Profile Header (existing implementation) -->
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

      <!-- Projects Overview Section -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">My Projects</h2>
          <button 
            @click="toggleProjectCreateFlyout"
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

      <!-- Existing calendar view -->
      <div v-if="userPreferences.showCalendar" class="mt-8">
        <h2 class="text-2xl font-bold mb-4">Project Calendar</h2>
        <FullCalendar 
          :options="calendarOptions" 
          class="bg-white shadow-md rounded-lg p-4"
        />
      </div>
    </div>

    <!-- Project Creation Flyout -->
    <div 
      v-if="isProjectCreateFlyoutOpen" 
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      @click.self="toggleProjectCreateFlyout"
    >
      <div 
        class="bg-white w-full max-w-xl mx-auto rounded-lg shadow-xl p-8 relative"
        @click.stop
      >
        <button 
          @click="toggleProjectCreateFlyout"
          class="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 class="text-2xl font-bold mb-6 text-center">Create New Project</h2>
        
        <ProjectForm
          :isEditing="false"
          :project="newProject"
          @submit="handleCreateProject"
        />
      </div>
    </div>
  </div>
</template>