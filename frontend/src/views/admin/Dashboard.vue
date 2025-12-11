<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { LayoutDashboard, Users, Package, MessageSquare, TrendingUp, Settings, Upload, Edit2, Trash2, Eye } from 'lucide-vue-next'
import axios from 'axios'

interface Update {
  _id?: string;
  title: string;
  description: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  published: boolean;
  createdAt?: string;
}

interface Stats {
  totalUsers: number;
  totalProjects: number;
  totalSales: number;
  revenue: number;
  activeCreators: number;
  pendingOrders: number;
}

const activeTab = ref<'dashboard' | 'updates' | 'users' | 'products' | 'settings'>('dashboard')
const stats = ref<Stats>({
  totalUsers: 0,
  totalProjects: 0,
  totalSales: 0,
  revenue: 0,
  activeCreators: 0,
  pendingOrders: 0
})

const updates = ref<Update[]>([])
const showUpdateModal = ref(false)
const editingUpdate = ref<Update | null>(null)
const uploadingMedia = ref(false)

const newUpdate = ref<Update>({
  title: '',
  description: '',
  mediaUrl: '',
  mediaType: 'image',
  published: false
})

// Fetch platform stats
const fetchStats = async () => {
  try {
    const response = await axios.get('/api/admin/stats')
    stats.value = response.data
  } catch (error) {
    console.error('Error fetching stats:', error)
  }
}

// Fetch updates
const fetchUpdates = async () => {
  try {
    const response = await axios.get('/api/admin/updates')
    updates.value = response.data
  } catch (error) {
    console.error('Error fetching updates:', error)
  }
}

// Create or update an announcement
const saveUpdate = async () => {
  try {
    if (editingUpdate.value && editingUpdate.value._id) {
      await axios.put(`/api/admin/updates/${editingUpdate.value._id}`, newUpdate.value)
    } else {
      await axios.post('/api/admin/updates', newUpdate.value)
    }
    await fetchUpdates()
    closeUpdateModal()
  } catch (error) {
    console.error('Error saving update:', error)
  }
}

// Delete update
const deleteUpdate = async (id: string) => {
  if (confirm('Are you sure you want to delete this update?')) {
    try {
      await axios.delete(`/api/admin/updates/${id}`)
      await fetchUpdates()
    } catch (error) {
      console.error('Error deleting update:', error)
    }
  }
}

// Toggle published status
const togglePublished = async (update: Update) => {
  try {
    await axios.put(`/api/admin/updates/${update._id}`, {
      ...update,
      published: !update.published
    })
    await fetchUpdates()
  } catch (error) {
    console.error('Error toggling published status:', error)
  }
}

// Handle media upload
const handleMediaUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    uploadingMedia.value = true
    const formData = new FormData()
    formData.append('media', file)
    
    try {
      const response = await axios.post('/api/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      newUpdate.value.mediaUrl = response.data.url
      newUpdate.value.mediaType = file.type.startsWith('video') ? 'video' : 'image'
    } catch (error) {
      console.error('Error uploading media:', error)
    } finally {
      uploadingMedia.value = false
    }
  }
}

const openUpdateModal = (update?: Update) => {
  if (update) {
    editingUpdate.value = update
    newUpdate.value = { ...update }
  } else {
    editingUpdate.value = null
    newUpdate.value = {
      title: '',
      description: '',
      mediaUrl: '',
      mediaType: 'image',
      published: false
    }
  }
  showUpdateModal.value = true
}

const closeUpdateModal = () => {
  showUpdateModal.value = false
  editingUpdate.value = null
}

onMounted(() => {
  fetchStats()
  fetchUpdates()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-gray-800/50 backdrop-blur-md border-r border-gray-700 min-h-screen p-6 sticky top-0">
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-white mb-2">Admin Panel</h1>
          <p class="text-sm text-gray-400">Manage your platform</p>
        </div>

        <nav class="space-y-2">
          <button 
            @click="activeTab = 'dashboard'"
            :class="`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-orange-500 text-white' 
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`"
          >
            <LayoutDashboard :size="20" />
            <span>Dashboard</span>
          </button>

          <button 
            @click="activeTab = 'updates'"
            :class="`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'updates' 
                ? 'bg-orange-500 text-white' 
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`"
          >
            <MessageSquare :size="20" />
            <span>Updates</span>
          </button>

          <button 
            @click="activeTab = 'users'"
            :class="`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'users' 
                ? 'bg-orange-500 text-white' 
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`"
          >
            <Users :size="20" />
            <span>Users</span>
          </button>

          <button 
            @click="activeTab = 'products'"
            :class="`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'products' 
                ? 'bg-orange-500 text-white' 
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`"
          >
            <Package :size="20" />
            <span>Products</span>
          </button>

          <button 
            @click="activeTab = 'settings'"
            :class="`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'settings' 
                ? 'bg-orange-500 text-white' 
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`"
          >
            <Settings :size="20" />
            <span>Settings</span>
          </button>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-8">
        <!-- Dashboard Tab -->
        <div v-if="activeTab === 'dashboard'">
          <h2 class="text-3xl font-bold text-white mb-8">Platform Overview</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
              <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-blue-500/20 rounded-xl">
                  <Users :size="24" class="text-blue-400" />
                </div>
                <TrendingUp :size="20" class="text-green-400" />
              </div>
              <h3 class="text-3xl font-bold text-white mb-2">{{ stats.totalUsers }}</h3>
              <p class="text-gray-400">Total Users</p>
            </div>

            <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
              <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-purple-500/20 rounded-xl">
                  <Package :size="24" class="text-purple-400" />
                </div>
                <TrendingUp :size="20" class="text-green-400" />
              </div>
              <h3 class="text-3xl font-bold text-white mb-2">{{ stats.totalProjects }}</h3>
              <p class="text-gray-400">Total Projects</p>
            </div>

            <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
              <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-green-500/20 rounded-xl">
                  <TrendingUp :size="24" class="text-green-400" />
                </div>
                <TrendingUp :size="20" class="text-green-400" />
              </div>
              <h3 class="text-3xl font-bold text-white mb-2">{{ stats.totalSales }}</h3>
              <p class="text-gray-400">Total Sales</p>
            </div>

            <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
              <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-orange-500/20 rounded-xl">
                  <i class="fas fa-dollar-sign text-2xl text-orange-400"></i>
                </div>
                <TrendingUp :size="20" class="text-green-400" />
              </div>
              <h3 class="text-3xl font-bold text-white mb-2">MWK {{ stats.revenue.toLocaleString() }}</h3>
              <p class="text-gray-400">Platform Revenue</p>
            </div>

            <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
              <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-teal-500/20 rounded-xl">
                  <i class="fas fa-user-check text-2xl text-teal-400"></i>
                </div>
                <TrendingUp :size="20" class="text-green-400" />
              </div>
              <h3 class="text-3xl font-bold text-white mb-2">{{ stats.activeCreators }}</h3>
              <p class="text-gray-400">Active Creators</p>
            </div>

            <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
              <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-red-500/20 rounded-xl">
                  <i class="fas fa-clock text-2xl text-red-400"></i>
                </div>
                <span class="text-red-400 text-sm">Pending</span>
              </div>
              <h3 class="text-3xl font-bold text-white mb-2">{{ stats.pendingOrders }}</h3>
              <p class="text-gray-400">Pending Orders</p>
            </div>
          </div>
        </div>

        <!-- Updates Tab -->
        <div v-if="activeTab === 'updates'">
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-3xl font-bold text-white">Platform Updates</h2>
            <button 
              @click="openUpdateModal()"
              class="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 font-medium"
            >
              <Upload :size="18" class="inline mr-2" />
              Create Update
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="update in updates" 
              :key="update._id"
              class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700"
            >
              <div v-if="update.mediaUrl" class="aspect-video bg-gray-800">
                <img 
                  v-if="update.mediaType === 'image'" 
                  :src="update.mediaUrl" 
                  :alt="update.title"
                  class="w-full h-full object-cover"
                />
                <video 
                  v-else-if="update.mediaType === 'video'" 
                  :src="update.mediaUrl" 
                  controls
                  class="w-full h-full object-cover"
                ></video>
              </div>
              
              <div class="p-6">
                <div class="flex items-start justify-between mb-3">
                  <h3 class="text-lg font-bold text-white flex-1">{{ update.title }}</h3>
                  <span 
                    :class="`px-2 py-1 rounded-full text-xs font-bold ${
                      update.published ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                    }`"
                  >
                    {{ update.published ? 'Published' : 'Draft' }}
                  </span>
                </div>
                
                <p class="text-gray-400 text-sm mb-4 line-clamp-3">{{ update.description }}</p>
                
                <div class="flex gap-2">
                  <button 
                    @click="togglePublished(update)"
                    class="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                  >
                    <Eye :size="14" class="inline mr-1" />
                    {{ update.published ? 'Unpublish' : 'Publish' }}
                  </button>
                  <button 
                    @click="openUpdateModal(update)"
                    class="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                  >
                    <Edit2 :size="14" />
                  </button>
                  <button 
                    @click="deleteUpdate(update._id!)"
                    class="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 :size="14" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="updates.length === 0" class="text-center py-20">
            <MessageSquare :size="64" class="text-gray-600 mx-auto mb-4" />
            <p class="text-gray-400 text-lg mb-6">No updates yet. Create your first platform update!</p>
          </div>
        </div>

        <!-- Users Tab -->
        <div v-if="activeTab === 'users'">
          <h2 class="text-3xl font-bold text-white mb-8">User Management</h2>
          <div class="text-center py-20 text-gray-400">
            <p>User management interface coming soon...</p>
          </div>
        </div>

        <!-- Products Tab -->
        <div v-if="activeTab === 'products'">
          <h2 class="text-3xl font-bold text-white mb-8">Product Management</h2>
          <div class="text-center py-20 text-gray-400">
            <p>Product management interface coming soon...</p>
          </div>
        </div>

        <!-- Settings Tab -->
        <div v-if="activeTab === 'settings'">
          <h2 class="text-3xl font-bold text-white mb-8">Platform Settings</h2>
          <div class="text-center py-20 text-gray-400">
            <p>Platform settings interface coming soon...</p>
          </div>
        </div>
      </main>
    </div>

    <!-- Update Modal -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="showUpdateModal"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="closeUpdateModal"
      >
        <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-2xl w-full border border-gray-700 shadow-2xl">
          <div class="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
            <h2 class="text-2xl font-bold text-white">
              {{ editingUpdate ? 'Edit Update' : 'Create New Update' }}
            </h2>
            <button 
              @click="closeUpdateModal"
              class="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <i class="fas fa-times text-gray-400 text-xl"></i>
            </button>
          </div>

          <div class="p-6">
            <form @submit.prevent="saveUpdate" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                <input 
                  v-model="newUpdate.title"
                  type="text" 
                  required
                  class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                  placeholder="Update title"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                <textarea 
                  v-model="newUpdate.description"
                  required
                  rows="4"
                  class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none resize-none"
                  placeholder="Describe the update..."
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Media (Image or Video)</label>
                <input 
                  type="file" 
                  accept="image/*,video/*"
                  @change="handleMediaUpload"
                  class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                />
                <p v-if="uploadingMedia" class="text-sm text-gray-400 mt-2">Uploading...</p>
                <p v-if="newUpdate.mediaUrl" class="text-sm text-green-400 mt-2">Media uploaded successfully!</p>
              </div>

              <div class="flex items-center gap-3">
                <input 
                  v-model="newUpdate.published"
                  type="checkbox" 
                  id="published"
                  class="w-5 h-5 rounded bg-gray-700 border-gray-600 text-orange-500 focus:ring-orange-500"
                />
                <label for="published" class="text-gray-300">Publish immediately</label>
              </div>

              <div class="flex gap-3 pt-4">
                <button 
                  type="button"
                  @click="closeUpdateModal"
                  class="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  class="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 font-medium"
                >
                  {{ editingUpdate ? 'Update' : 'Create' }}
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
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
