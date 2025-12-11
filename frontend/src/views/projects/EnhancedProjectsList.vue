<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12 px-6 shadow-2xl">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="mb-6 md:mb-0">
            <h1 class="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">
              Creative Projects
            </h1>
            <p class="text-lg text-indigo-100">
              Bring your creative visions to life
            </p>
          </div>
          <button 
            @click="openCreateProject" 
            class="group relative px-8 py-4 bg-white text-indigo-600 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>New Project</span>
          </button>
        </div>
        
        <!-- Quick Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div class="text-3xl font-bold">{{ totalProjects }}</div>
            <div class="text-sm text-indigo-100">Total Projects</div>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div class="text-3xl font-bold">{{ activeProjects }}</div>
            <div class="text-sm text-indigo-100">Active</div>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div class="text-3xl font-bold">{{ completedProjects }}</div>
            <div class="text-sm text-indigo-100">Completed</div>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div class="text-3xl font-bold">{{ totalTasks }}</div>
            <div class="text-sm text-indigo-100">Total Tasks</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and View Options -->
    <div class="max-w-7xl mx-auto px-6 py-6">
      <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div class="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <!-- Search -->
          <div class="relative flex-1 max-w-md">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search projects..."
              class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <svg class="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <!-- Filter by Status -->
          <div class="flex items-center space-x-4">
            <label class="text-gray-600 font-medium">Filter:</label>
            <select 
              v-model="statusFilter"
              class="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Projects</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <!-- View Toggle -->
          <div class="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button 
              @click="viewMode = 'grid'"
              :class="viewMode === 'grid' ? 'bg-white shadow' : ''"
              class="p-2 rounded transition-all"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button 
              @click="viewMode = 'list'"
              :class="viewMode === 'list' ? 'bg-white shadow' : ''"
              class="p-2 rounded transition-all"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Projects Content -->
    <div class="max-w-7xl mx-auto px-6 pb-12">
      <!-- Loading State -->
      <div v-if="projectStore.loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="projectStore.error" class="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-xl font-bold text-red-800 mb-2">Error Loading Projects</h3>
        <p class="text-red-600">{{ projectStore.error }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredProjects.length === 0" class="bg-white rounded-xl shadow-lg p-12 text-center">
        <div class="max-w-md mx-auto">
          <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="text-2xl font-bold text-gray-800 mb-2">No Projects Yet</h3>
          <p class="text-gray-600 mb-6">
            Start your creative journey by creating your first project!
          </p>
          <button 
            @click="openCreateProject"
            class="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-bold hover:shadow-xl transform hover:scale-105 transition-all"
          >
            Create Your First Project
          </button>
        </div>
      </div>

      <!-- Projects Grid -->
      <div 
        v-else-if="viewMode === 'grid'"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <CreativeProjectCard
          v-for="project in filteredProjects"
          :key="project._id"
          :project="project"
          @click="openProjectDetail(project._id!)"
        />
      </div>

      <!-- Projects List -->
      <div v-else class="space-y-4">
        <div
          v-for="project in filteredProjects"
          :key="project._id"
          @click="openProjectDetail(project._id!)"
          class="bg-white rounded-lg shadow hover:shadow-xl transition-shadow cursor-pointer p-6 flex items-center justify-between"
        >
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-800 mb-2">{{ project.title }}</h3>
            <p class="text-gray-600 text-sm line-clamp-2">{{ project.description }}</p>
          </div>
          <div class="flex items-center space-x-4 ml-6">
            <span :class="getStatusBadgeClass(project.status)" class="px-3 py-1 rounded-full text-xs font-semibold">
              {{ project.status }}
            </span>
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectStore } from '@/store/projectStore';
import CreativeProjectCard from '@/components/CreativeProjectCard.vue';

const projectStore = useProjectStore();
const router = useRouter();

const searchQuery = ref('');
const statusFilter = ref('all');
const viewMode = ref<'grid' | 'list'>('grid');

onMounted(async () => {
  await projectStore.fetchData();
});

// Computed properties for stats
const totalProjects = computed(() => projectStore.projects.length);
const activeProjects = computed(() => 
  projectStore.projects.filter(p => p.status === 'in-progress').length
);
const completedProjects = computed(() => 
  projectStore.projects.filter(p => p.status === 'completed').length
);
const totalTasks = computed(() => 
  projectStore.projects.reduce((sum, p) => sum + (p.tasks?.length || 0), 0)
);

// Filtered projects
const filteredProjects = computed(() => {
  let projects = projectStore.projects;

  // Filter by search query
  if (searchQuery.value) {
    projects = projects.filter(p => 
      p.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // Filter by status
  if (statusFilter.value !== 'all') {
    projects = projects.filter(p => p.status === statusFilter.value);
  }

  return projects;
});

const openProjectDetail = (projectId: string) => {
  router.push({ name: 'ProjectDetail', params: { id: projectId } });
};

const openCreateProject = () => {
  router.push({ name: 'CreateProject' });
};

const getStatusBadgeClass = (status?: string) => {
  const classes: Record<string, string> = {
    'in-progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'on-hold': 'bg-yellow-100 text-yellow-800',
    'cancelled': 'bg-red-100 text-red-800'
  };
  return classes[status || 'in-progress'] || classes['in-progress'];
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
