<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  ThumbsUp, 
  ArrowUp, 
  Filter, 
  Grid, 
  List 
} from 'lucide-vue-next';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// Import project images
const projectImages = {
  1: () => import('@/assets/crocheting.png'),
  2: () => import('@/assets/painting.png'),
  3: () => import('@/assets/mural-painter.png'),
  4: () => import('@/assets/chair-making.png')
}

// Project Interface
interface Project {
  id: number;
  title: string;
  description: string;
  image: () => Promise<{ default: string }>;
  comments: { text: string; author: string; timestamp: string }[];
  likes: number;
  category: string;
  author: string;
  timeEstimate: string;
  budget: string;
}

// State
const projects = ref<Project[]>([])
const newComments = ref<{ [key: number]: string }>({})
const filter = ref('All')
const viewMode = ref('grid')
const feedMessages = ref<{ user: string; text: string; timestamp: string }[]>([])
const newMessage = ref('')

// Fetch all projects from backend
const fetchProjects = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects`); // Replace with your backend URL
    const fetchedProjects: Project[] = response.data;
    projects.value = [...projects.value, ...fetchedProjects]; // Append new projects
    loadImages();
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
}

// Add a new project to the backend
const addNewProject = async (newProject: Project) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/projects`, newProject); // Replace with your backend URL
    const createdProject: Project = response.data;
    projects.value = [createdProject, ...projects.value]; // Add to the beginning of the list
    loadImages();
  } catch (error) {
    console.error('Error adding new project:', error);
  }
}

// Load project images dynamically
const resolvedImages = ref<{ [key: number]: string }>({})

const loadImages = async () => {
  for (const project of projects.value) {
    const imageModule = await project.image();
    resolvedImages.value[project.id] = imageModule.default;
  }
}

// Computed
const categories = computed(() => ['All', ...new Set(projects.value.map(p => p.category))])

const filteredProjects = computed(() => 
  filter.value === 'All' 
    ? projects.value 
    : projects.value.filter(project => project.category === filter.value)
)

// Methods
const likeProject = (projectId: number) => {
  const project = projects.value.find(p => p.id === projectId)
  if (project) {
    project.likes++
  }
}

const addComment = (projectId: number) => {
  const comment = newComments.value[projectId]
  if (comment && comment.trim()) {
    const project = projects.value.find(p => p.id === projectId)
    if (project) {
      project.comments.push({ 
        text: comment, 
        author: 'Anonymous', 
        timestamp: new Date().toLocaleString() 
      })
      newComments.value[projectId] = ''
    }
  }
}

const sendMessage = () => {
  if (newMessage.value.trim()) {
    feedMessages.value.push({ 
      user: 'You', 
      text: newMessage.value, 
      timestamp: new Date().toLocaleString() 
    })
    newMessage.value = ''
  }
}

const shareOnSocial = (platform: string, project: Project) => {
  const url = encodeURIComponent(window.location.href)
  const text = encodeURIComponent(`Check out this project: ${project.title}`)
  let shareUrl = ''

  if (platform === 'facebook') {
    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`
  } else if (platform === 'twitter') {
    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`
  }

  window.open(shareUrl, '_blank')
}

// Fetch projects on mounted
onMounted(() => {
  loadImages();
  fetchProjects();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="container mx-auto  border border-orange-400 rounded-lg p-4">
      <!-- Header -->
      <header class="text-center mb-10">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">Community Projects</h1>
        <p class="text-gray-600 max-w-2xl mx-auto">
          Explore, inspire, and connect with creative projects from our vibrant community. 
          Share your work, get feedback, and find inspiration.
        </p>
      </header>

      <!-- Filters and View Controls -->
      <div class="flex justify-between items-center mb-6 rounded-lg shadow-md p-6">
        <div class="flex space-x-2">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="filter = cat"
            :class="`px-4 py-2 rounded-full text-sm ${
              filter === cat 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`"
          >
            {{ cat }}
          </button>
        </div>
        <div class="flex space-x-2">
          <button 
            @click="viewMode = 'grid'"
            :class="`p-2 rounded ${
              viewMode === 'grid' ? 'bg-orange-600 text-white' : 'bg-gray-200'
            }`"
          >
            <Grid :size="20" />
          </button>
          <button 
            @click="viewMode = 'list'"
            :class="`p-2 rounded ${
              viewMode === 'list' ? 'bg-orange-600 text-white' : 'bg-gray-200'
            }`"
          >
            <List :size="20" />
          </button>
        </div>
      </div>

      <!-- Projects Grid/List -->
      <div :class="`grid ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'grid-cols-1 gap-4'
      }`">
        <div 
          v-for="project in filteredProjects" 
          :key="project.id" 
          class="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105"
        >
        <img 
          :src="resolvedImages[project.id]" 
          :alt="project.title" 
          :class="`object-cover ${
            viewMode === 'grid' 
              ? 'w-full h-48' 
              : 'w-48 h-48 mr-4'
          }`" 
        />
          <div class="p-4 flex-grow">
            <h2 class="text-xl font-semibold mb-2">{{ project.title }}</h2>
            <p class="text-gray-600 mb-4">{{ project.description }}</p>
            
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center space-x-4">
                <button 
                  @click="likeProject(project.id)"
                  class="flex items-center space-x-1 text-gray-600 hover:text-red-500"
                >
                  <ThumbsUp :size="16" />
                  <span>{{ project.likes }} Likes</span>
                </button>
                <div class="relative">
                  <button 
                    class="text-gray-600 hover:text-blue-500"
                    @click="shareOnSocial('facebook', project)"
                  >
                    <Share2 :size="16" />
                  </button>
                </div>
              </div>
              <div class="text-right">
                <span class="text-sm text-gray-500">{{ project.author }}</span>
                <p class="text-xs text-gray-400">{{ project.timeEstimate }} | {{ project.budget }}</p>
              </div>
            </div>

            <!-- Comments Section -->
            <div class="mt-4">
              <div class="space-y-2 mb-4 max-h-40 overflow-y-auto">
                <div 
                  v-for="(comment, index) in project.comments" 
                  :key="index" 
                  class="bg-gray-100 p-2 rounded"
                >
                  <p class="text-sm">{{ comment.text }}</p>
                  <div class="flex justify-between">
                    <span class="text-xs text-gray-500">{{ comment.author }}</span>
                    <span class="text-xs text-gray-400">{{ comment.timestamp }}</span>
                  </div>
                </div>
              </div>
              <div class="flex space-x-2">
                <input
                  type="text"
                  v-model="newComments[project.id]"
                  placeholder="Add a comment"
                  class="flex-grow border rounded-lg p-2 text-sm"
                />
                <button
                  @click="addComment(project.id)"
                  class="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Community Feed -->
      <div class="mt-10 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold mb-4">Community Feed</h2>
        <div class="h-96 overflow-y-auto mb-4 border border-orange-300 bg-gray-50 p-4 rounded-lg">
          <div 
            v-for="(message, index) in feedMessages" 
            :key="index" 
            class="mb-3 pb-3 border-b last:border-b-0"
          >
            <div class="flex justify-between items-center">
              <span class="font-medium text-gray-800">{{ message.user }}</span>
              <span class="text-xs text-gray-500">{{ message.timestamp }}</span>
            </div>
            <p class="text-gray-600">{{ message.text }}</p>
          </div>
        </div>
        <div class="flex space-x-2">
          <input
            type="text"
            v-model="newMessage"
            placeholder="Send a message to the community"
            class="flex-grow border border-gray-400 rounded-lg p-2"
          />
          <button
            @click="sendMessage"
            class="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>