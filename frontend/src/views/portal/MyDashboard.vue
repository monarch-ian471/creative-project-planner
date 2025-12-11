<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectStore } from '@/store/projectStore';
import axios from 'axios';
import type { Project, UserProfile } from '@/types/index';

interface ProjectWithStatus extends Project {
  status: 'pending' | 'in-progress' | 'completed';
  progress: number;
  startDate: Date;
  completionDate?: Date;
  projectedCompletionDate: Date;
}

export default defineComponent({
  name: 'ProfileDashboard',
  setup() {
    const projectStore = useProjectStore();
    const router = useRouter();

    // State
    const projects = ref<ProjectWithStatus[]>([]);
    const showProjectModal = ref(false);
    const editingProject = ref<ProjectWithStatus | null>(null);
    const viewMode = ref<'grid' | 'gantt'>('grid');

    const userProfile = ref<UserProfile>({
      firstName: '',
      lastName: '',
      email: '',
      profilePicture: '/default-avatar.png'
    });

    const profileStats = computed(() => ({
      totalProjects: projects.value.length,
      completedProjects: projects.value.filter(p => p.status === 'completed').length,
      pendingProjects: projects.value.filter(p => p.status === 'pending').length,
      inProgressProjects: projects.value.filter(p => p.status === 'in-progress').length,
    }));

    // New project form data
    const newProject = ref({
      title: '',
      description: '',
      startDate: '',
      projectedCompletionDate: '',
      category: '',
      budget: 0
    });

    // Gantt chart data
    const ganttChartMonths = ref<string[]>([]);
    const ganttChartDays = ref<number>(90);

    // Methods
    const fetchProjects = async () => {
      try {
        await projectStore.fetchData();
        projects.value = projectStore.projects.map((project: any) => ({
          ...project,
          status: project.status || 'pending',
          progress: project.progress || 0,
          startDate: new Date(project.startDate || project.createdAt),
          completionDate: project.completionDate ? new Date(project.completionDate) : undefined,
          projectedCompletionDate: new Date(project.dueDate),
        }));
        generateGanttMonths();
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/users/profile');
        userProfile.value = response.data.profile;
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const generateGanttMonths = () => {
      const months = [];
      const now = new Date();
      for (let i = -1; i <= 3; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
        months.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
      }
      ganttChartMonths.value = months;
    };

    const calculateProjectPosition = (project: ProjectWithStatus) => {
      const now = new Date();
      const startOfPeriod = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfPeriod = new Date(now.getFullYear(), now.getMonth() + 4, 0);
      
      const totalDays = Math.ceil((endOfPeriod.getTime() - startOfPeriod.getTime()) / (1000 * 60 * 60 * 24));
      const projectStart = Math.max(0, Math.ceil((project.startDate.getTime() - startOfPeriod.getTime()) / (1000 * 60 * 60 * 24)));
      const projectEnd = Math.min(totalDays, Math.ceil((project.projectedCompletionDate.getTime() - startOfPeriod.getTime()) / (1000 * 60 * 60 * 24)));
      
      const left = (projectStart / totalDays) * 100;
      const width = ((projectEnd - projectStart) / totalDays) * 100;
      
      return {
        left: `${left}%`,
        width: `${Math.max(width, 2)}%`
      };
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'completed': return 'bg-green-500';
        case 'in-progress': return 'bg-orange-500';
        case 'pending': return 'bg-gray-500';
        default: return 'bg-gray-500';
      }
    };

    const openCreateProjectModal = () => {
      editingProject.value = null;
      newProject.value = {
        title: '',
        description: '',
        startDate: '',
        projectedCompletionDate: '',
        category: '',
        budget: 0
      };
      showProjectModal.value = true;
    };

    const openEditProjectModal = (project: ProjectWithStatus) => {
      editingProject.value = project;
      newProject.value = {
        title: project.title,
        description: project.description,
        startDate: project.startDate.toISOString().split('T')[0],
        projectedCompletionDate: project.projectedCompletionDate.toISOString().split('T')[0],
        category: project.category || '',
        budget: project.budget || 0
      };
      showProjectModal.value = true;
    };

    const closeProjectModal = () => {
      showProjectModal.value = false;
      editingProject.value = null;
    };

    const saveProject = async () => {
      try {
        if (editingProject.value) {
          // Update existing project
          await axios.put(`/api/projects/${editingProject.value._id}`, {
            ...newProject.value,
            dueDate: newProject.value.projectedCompletionDate
          });
        } else {
          // Create new project
          await projectStore.addProject({
            title: newProject.value.title,
            description: newProject.value.description,
            startDate: new Date(newProject.value.startDate),
            dueDate: new Date(newProject.value.projectedCompletionDate),
            category: newProject.value.category,
            budget: newProject.value.budget,
            status: 'pending',
            tasks: []
          });
        }
        await fetchProjects();
        closeProjectModal();
      } catch (error) {
        console.error('Error saving project:', error);
      }
    };

    const updateProjectStatus = async (projectId: string, newStatus: 'pending' | 'in-progress' | 'completed') => {
      try {
        await axios.put(`/api/projects/${projectId}/status`, { status: newStatus });
        await fetchProjects();
      } catch (error) {
        console.error('Error updating project status:', error);
      }
    };

    const deleteProject = async (projectId: string) => {
      if (confirm('Are you sure you want to delete this project?')) {
        try {
          await projectStore.deleteProject(projectId);
          await fetchProjects();
        } catch (error) {
          console.error('Error deleting project:', error);
        }
      }
    };

    const openProjectDetail = (projectId: string) => {
      router.push(`/projects/${projectId}`);
    };

    const handleFileUpload = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (file) {
        // Implement profile picture upload logic
        console.log('Uploading profile picture:', file);
      }
    };

    onMounted(async () => {
      await fetchUserProfile();
      await fetchProjects();
    });

    return {
      projects,
      userProfile,
      profileStats,
      showProjectModal,
      newProject,
      viewMode,
      ganttChartMonths,
      editingProject,
      openCreateProjectModal,
      openEditProjectModal,
      closeProjectModal,
      saveProject,
      updateProjectStatus,
      deleteProject,
      openProjectDetail,
      calculateProjectPosition,
      getStatusColor,
      handleFileUpload
    };
  },
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 py-8 px-4">
    <div class="container mx-auto max-w-7xl">
      <!-- Profile Header -->
      <div class="bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl rounded-2xl p-8 mb-8 border border-gray-700">
        <div class="flex flex-col md:flex-row items-center gap-8">
          <!-- Profile Picture -->
          <div class="relative group">
            <input 
              type="file" 
              @change="handleFileUpload"
              accept="image/*" 
              class="hidden" 
              id="profilePictureUpload"
            />
            <label 
              for="profilePictureUpload" 
              class="cursor-pointer block"
            >
              <div class="relative">
                <img 
                  :src="userProfile.profilePicture" 
                  alt="Profile" 
                  class="w-32 h-32 rounded-full object-cover border-4 border-orange-500 shadow-xl"
                />
                <div class="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <i class="fas fa-camera text-white text-2xl"></i>
                </div>
              </div>
            </label>
          </div>
          
          <!-- Profile Info -->
          <div class="flex-1 text-center md:text-left">
            <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
              {{ userProfile.firstName }} {{ userProfile.lastName }}
            </h1>
            <p class="text-gray-400 text-lg mb-4">{{ userProfile.email }}</p>
            <div class="flex flex-wrap gap-3 justify-center md:justify-start">
              <span class="px-4 py-2 bg-gray-700 text-gray-300 rounded-full text-sm">
                <i class="fas fa-map-marker-alt mr-2"></i>
                {{ userProfile.location?.city }}, {{ userProfile.location?.country }}
              </span>
              <span class="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium">
                Creative Professional
              </span>
            </div>
          </div>
          
          <!-- Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
            <div class="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700">
              <div class="text-3xl font-bold text-white mb-1">{{ profileStats.totalProjects }}</div>
              <div class="text-xs text-gray-400">Total Projects</div>
            </div>
            <div class="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700">
              <div class="text-3xl font-bold text-green-500 mb-1">{{ profileStats.completedProjects }}</div>
              <div class="text-xs text-gray-400">Completed</div>
            </div>
            <div class="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700">
              <div class="text-3xl font-bold text-orange-500 mb-1">{{ profileStats.inProgressProjects }}</div>
              <div class="text-xs text-gray-400">In Progress</div>
            </div>
            <div class="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700">
              <div class="text-3xl font-bold text-gray-500 mb-1">{{ profileStats.pendingProjects }}</div>
              <div class="text-xs text-gray-400">Pending</div>
            </div>
          </div>
        </div>
      </div>

      <!-- View Controls -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-bold bg-gradient-to-r from-custom-teal to-custom-peach bg-clip-text text-transparent">
          My Creative Projects
        </h2>
        
        <div class="flex gap-3">
          <button 
            @click="viewMode = 'grid'"
            :class="`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'grid' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`"
          >
            <i class="fas fa-th mr-2"></i>Grid View
          </button>
          <button 
            @click="viewMode = 'gantt'"
            :class="`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'gantt' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`"
          >
            <i class="fas fa-chart-bar mr-2"></i>Timeline View
          </button>
          <button 
            @click="openCreateProjectModal"
            class="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 font-medium"
          >
            <i class="fas fa-plus mr-2"></i>New Project
          </button>
        </div>
      </div>

      <!-- Grid View -->
      <div v-if="viewMode === 'grid'">
        <div v-if="projects.length === 0" class="text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-700">
          <i class="fas fa-folder-open text-6xl text-gray-600 mb-4"></i>
          <p class="text-gray-400 text-lg mb-6">No projects yet. Start by creating your first creative project!</p>
          <button 
            @click="openCreateProjectModal"
            class="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 font-medium"
          >
            Create Your First Project
          </button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="project in projects" 
            :key="project._id"
            class="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700 hover:border-orange-500 transition-all duration-300 transform hover:-translate-y-2"
          >
            <!-- Project Header -->
            <div class="p-6 border-b border-gray-700">
              <div class="flex justify-between items-start mb-3">
                <h3 class="text-xl font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2 flex-1">
                  {{ project.title }}
                </h3>
                <span 
                  :class="`px-3 py-1 rounded-full text-xs font-bold ${
                    project.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    project.status === 'in-progress' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`"
                >
                  {{ project.status }}
                </span>
              </div>
              <p class="text-gray-400 text-sm line-clamp-3 mb-4">{{ project.description }}</p>
              
              <!-- Progress Bar -->
              <div class="mb-4">
                <div class="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{{ project.progress }}%</span>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    :class="`h-full rounded-full transition-all ${getStatusColor(project.status)}`"
                    :style="{ width: `${project.progress}%` }"
                  ></div>
                </div>
              </div>

              <!-- Dates -->
              <div class="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p class="text-gray-500 mb-1">Start Date</p>
                  <p class="text-gray-300">{{ project.startDate.toLocaleDateString() }}</p>
                </div>
                <div>
                  <p class="text-gray-500 mb-1">Target Date</p>
                  <p class="text-gray-300">{{ project.projectedCompletionDate.toLocaleDateString() }}</p>
                </div>
              </div>
            </div>

            <!-- Project Actions -->
            <div class="p-4 bg-gray-800/50 flex justify-between items-center">
              <div class="flex gap-2">
                <button 
                  @click="updateProjectStatus(project._id || '', 'pending')"
                  :class="`p-2 rounded-lg transition-colors ${
                    project.status === 'pending' ? 'bg-gray-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`"
                  title="Pending"
                >
                  <i class="fas fa-clock"></i>
                </button>
                <button 
                  @click="updateProjectStatus(project._id || '', 'in-progress')"
                  :class="`p-2 rounded-lg transition-colors ${
                    project.status === 'in-progress' ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`"
                  title="In Progress"
                >
                  <i class="fas fa-spinner"></i>
                </button>
                <button 
                  @click="updateProjectStatus(project._id || '', 'completed')"
                  :class="`p-2 rounded-lg transition-colors ${
                    project.status === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`"
                  title="Completed"
                >
                  <i class="fas fa-check"></i>
                </button>
              </div>
              
              <div class="flex gap-2">
                <button 
                  @click="openEditProjectModal(project)"
                  class="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                  title="Edit"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button 
                  @click="openProjectDetail(project._id || '')"
                  class="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-orange-600 hover:text-white transition-colors"
                  title="View Details"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button 
                  @click="deleteProject(project._id || '')"
                  class="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                  title="Delete"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gantt Chart View -->
      <div v-if="viewMode === 'gantt'" class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 overflow-x-auto">
        <div class="min-w-max">
          <!-- Timeline Header -->
          <div class="flex mb-4">
            <div class="w-64 flex-shrink-0 pr-4">
              <h3 class="text-lg font-bold text-white">Project Name</h3>
            </div>
            <div class="flex-1 grid grid-cols-5 gap-2">
              <div 
                v-for="month in ganttChartMonths" 
                :key="month"
                class="text-center text-sm font-medium text-gray-400"
              >
                {{ month }}
              </div>
            </div>
          </div>

          <!-- Project Rows -->
          <div v-if="projects.length === 0" class="text-center py-10">
            <p class="text-gray-400">No projects to display in timeline view</p>
          </div>

          <div v-else class="space-y-3">
            <div 
              v-for="project in projects" 
              :key="project._id"
              class="flex items-center group"
            >
              <!-- Project Name -->
              <div class="w-64 flex-shrink-0 pr-4">
                <div class="bg-gray-800 rounded-lg p-3 border border-gray-700 group-hover:border-orange-500 transition-colors">
                  <h4 class="font-semibold text-white text-sm truncate">{{ project.title }}</h4>
                  <p class="text-xs text-gray-400 mt-1">
                    {{ project.startDate.toLocaleDateString() }} - {{ project.projectedCompletionDate.toLocaleDateString() }}
                  </p>
                </div>
              </div>

              <!-- Timeline Bar -->
              <div class="flex-1 relative h-12 bg-gray-700/30 rounded-lg">
                <div 
                  :class="`absolute top-1/2 transform -translate-y-1/2 h-8 rounded-lg ${getStatusColor(project.status)} cursor-pointer hover:opacity-80 transition-opacity`"
                  :style="calculateProjectPosition(project)"
                  :title="`${project.title}: ${project.progress}%`"
                >
                  <div class="h-full flex items-center justify-center text-white text-xs font-medium px-2">
                    <span v-if="project.progress > 20">{{ project.progress }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Legend -->
          <div class="mt-6 pt-6 border-t border-gray-700 flex justify-center gap-6">
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 rounded bg-gray-500"></div>
              <span class="text-sm text-gray-400">Pending</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 rounded bg-orange-500"></div>
              <span class="text-sm text-gray-400">In Progress</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 rounded bg-green-500"></div>
              <span class="text-sm text-gray-400">Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Project Modal -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="showProjectModal"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="closeProjectModal"
      >
        <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-2xl w-full border border-gray-700 shadow-2xl transform transition-all">
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
            <h2 class="text-2xl font-bold text-white">
              {{ editingProject ? 'Edit Project' : 'Create New Project' }}
            </h2>
            <button 
              @click="closeProjectModal"
              class="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <i class="fas fa-times text-gray-400 text-xl"></i>
            </button>
          </div>

          <!-- Modal Content -->
          <div class="p-6">
            <form @submit.prevent="saveProject" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Project Title *</label>
                <input 
                  v-model="newProject.title"
                  type="text" 
                  required
                  class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="Enter project title"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                <textarea 
                  v-model="newProject.description"
                  required
                  rows="4"
                  class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none transition-colors resize-none"
                  placeholder="Describe your creative project"
                ></textarea>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Start Date *</label>
                  <input 
                    v-model="newProject.startDate"
                    type="date" 
                    required
                    class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Projected Completion *</label>
                  <input 
                    v-model="newProject.projectedCompletionDate"
                    type="date" 
                    required
                    class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <input 
                    v-model="newProject.category"
                    type="text" 
                    class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none transition-colors"
                    placeholder="e.g., Art, Music, Design"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Budget (MWK)</label>
                  <input 
                    v-model.number="newProject.budget"
                    type="number" 
                    min="0"
                    class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none transition-colors"
                    placeholder="0"
                  />
                </div>
              </div>

              <!-- Form Actions -->
              <div class="flex gap-3 pt-4">
                <button 
                  type="button"
                  @click="closeProjectModal"
                  class="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  class="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 font-medium"
                >
                  {{ editingProject ? 'Update Project' : 'Create Project' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
