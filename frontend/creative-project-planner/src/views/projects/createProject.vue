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
    const newProject = ref<Omit<Project, '_id'>>({
      title: '',
      description: '',
      dueDate: new Date()
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
        
        const createdProject = await projectStore.createProject(newProject.value);
        
        toast.success('Project created successfully');
        
        // Close flyout and reset form
        isProjectCreateFlyoutOpen.value = false;
        newProject.value = {
          title: '',
          description: '',
          dueDate: new Date()
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
      <!-- Existing profile header and sections remain unchanged -->
      
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
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out"
      @click.self="toggleProjectCreateFlyout"
    >
      <div 
        class="bg-white w-full max-w-xl mx-auto rounded-lg shadow-xl p-8 relative transform transition-all duration-300 ease-in-out scale-100 opacity-100"
        @click.stop
      >
        <button 
          @click="toggleProjectCreateFlyout"
          class="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors"
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