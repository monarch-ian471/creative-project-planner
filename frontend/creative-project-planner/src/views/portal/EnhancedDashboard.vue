<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {{ userProfile.firstName }}! 👋
            </h1>
            <p class="text-gray-600">Here's what's happening with your creative projects today.</p>
          </div>
          <div class="flex items-center space-x-4">
            <button 
              @click="openCreateProject"
              class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>New Project</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Projects -->
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-blue-100 text-sm font-medium">Total Projects</p>
            <p class="text-4xl font-bold">{{ profileStats.totalProjects || 0 }}</p>
          </div>
        </div>

        <!-- Active Projects -->
        <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-purple-100 text-sm font-medium">Active Projects</p>
            <p class="text-4xl font-bold">{{ activeProjectsCount }}</p>
          </div>
        </div>

        <!-- Completed -->
        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-green-100 text-sm font-medium">Completed</p>
            <p class="text-4xl font-bold">{{ profileStats.completedProjects || 0 }}</p>
          </div>
        </div>

        <!-- Pending Tasks -->
        <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-orange-100 text-sm font-medium">Pending Tasks</p>
            <p class="text-4xl font-bold">{{ pendingTasksCount }}</p>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Recent Projects -->
        <div class="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Recent Projects</h2>
            <button 
              @click="router.push('/projects')"
              class="text-indigo-600 hover:text-indigo-700 font-semibold text-sm flex items-center space-x-1"
            >
              <span>View All</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div v-if="projectStore.loading" class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
          </div>

          <div v-else-if="recentProjects.length === 0" class="text-center py-12 text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p class="text-lg font-medium">No projects yet</p>
            <p class="text-sm">Create your first project to get started</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="project in recentProjects"
              :key="project._id"
              @click="openProjectDetail(project._id!)"
              class="group cursor-pointer bg-gradient-to-r from-gray-50 to-white hover:from-indigo-50 hover:to-purple-50 rounded-xl p-5 border border-gray-200 hover:border-indigo-300 transition-all hover:shadow-md"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">
                    {{ project.title }}
                  </h3>
                  <p class="text-sm text-gray-600 line-clamp-2 mb-3">
                    {{ project.description }}
                  </p>
                  <div class="flex items-center space-x-4 text-sm">
                    <span :class="getStatusColor(project.status)" class="px-3 py-1 rounded-full font-medium">
                      {{ project.status }}
                    </span>
                    <span class="text-gray-500 flex items-center space-x-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{{ formatDate(project.dueDate) }}</span>
                    </span>
                  </div>
                </div>
                <svg class="w-6 h-6 text-gray-400 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Calendar Widget -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Project Calendar</h2>
            <div v-if="userPreferences.showCalendar">
              <FullCalendar :options="calendarOptions" class="creative-calendar" />
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <h3 class="text-xl font-bold mb-4">Quick Actions</h3>
            <div class="space-y-3">
              <button 
                @click="openCreateProject"
                class="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-3 text-left transition-all flex items-center space-x-3"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span class="font-medium">New Project</span>
              </button>
              <button 
                @click="router.push('/projects')"
                class="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-3 text-left transition-all flex items-center space-x-3"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span class="font-medium">View All Projects</span>
              </button>
              <button 
                @click="router.push('/admin/settings')"
                class="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-3 text-left transition-all flex items-center space-x-3"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="font-medium">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectStore } from '@/store/projectStore';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventInput } from '@fullcalendar/core';
import type { UserProfile } from '@/types/index';
import moment from 'moment';

const projectStore = useProjectStore();
const router = useRouter();

const userProfile = ref<UserProfile>({
  firstName: 'User',
  lastName: '',
  email: '',
  profilePicture: ''
});

const profileStats = ref({
  totalProjects: 0,
  completedProjects: 0,
  pendingProjects: 0
});

const userPreferences = reactive({
  showCalendar: true,
});

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next',
    center: 'title',
    right: 'today'
  },
  height: 'auto',
  events: [] as EventInput[],
});

onMounted(async () => {
  await projectStore.fetchData();
  updateCalendarEvents();
  // TODO: Fetch user profile and stats from API
});

const updateCalendarEvents = () => {
  const events: EventInput[] = projectStore.projects.map((project) => ({
    title: project.title,
    start: project.dueDate,
    allDay: true,
    color: getEventColor(project.status)
  }));
  calendarOptions.value.events = events;
};

const getEventColor = (status?: string) => {
  const colors: Record<string, string> = {
    'in-progress': '#3b82f6',
    'completed': '#10b981',
    'on-hold': '#f59e0b',
    'cancelled': '#ef4444'
  };
  return colors[status || 'in-progress'] || colors['in-progress'];
};

const recentProjects = computed(() => 
  projectStore.projects.slice(0, 5)
);

const activeProjectsCount = computed(() => 
  projectStore.projects.filter(p => p.status === 'in-progress').length
);

const pendingTasksCount = computed(() => 
  projectStore.projects.reduce((sum, p) => 
    sum + (p.tasks?.filter(t => !t.completed).length || 0), 0
  )
);

const openProjectDetail = (projectId: string) => {
  router.push({ name: 'ProjectDetail', params: { id: projectId } });
};

const openCreateProject = () => {
  router.push({ name: 'CreateProject' });
};

const formatDate = (date: Date) => {
  return moment(date).format('MMM D, YYYY');
};

const getStatusColor = (status?: string) => {
  const colors: Record<string, string> = {
    'in-progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'on-hold': 'bg-yellow-100 text-yellow-800',
    'cancelled': 'bg-red-100 text-red-800'
  };
  return colors[status || 'in-progress'] || colors['in-progress'];
};
</script>

<style>
.creative-calendar {
  font-size: 0.875rem;
}

.creative-calendar .fc-daygrid-day-number {
  padding: 4px;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
