<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Users as UsersIcon, Search, UserPlus, Edit2, Trash2, Mail, Phone, Calendar, Shield, Ban, CheckCircle, X } from 'lucide-vue-next'
import axios from 'axios'

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
  lastLogin?: string;
  projectCount?: number;
  purchaseCount?: number;
}

const users = ref<User[]>([])
const loading = ref(false)
const searchQuery = ref('')
const showUserModal = ref(false)
const editingUser = ref<User | null>(null)
const selectedFilter = ref<'all' | 'active' | 'suspended' | 'admin'>('all')

const newUser = ref<Partial<User>>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: 'user',
  status: 'active'
})

// Computed filtered users
const filteredUsers = computed(() => {
  let filtered = users.value

  // Apply status filter
  if (selectedFilter.value !== 'all') {
    if (selectedFilter.value === 'admin') {
      filtered = filtered.filter(u => u.role === 'admin')
    } else {
      filtered = filtered.filter(u => u.status === selectedFilter.value)
    }
  }

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(u => 
      u.firstName.toLowerCase().includes(query) ||
      u.lastName.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query)
    )
  }

  return filtered
})

// Stats
const userStats = computed(() => ({
  total: users.value.length,
  active: users.value.filter(u => u.status === 'active').length,
  suspended: users.value.filter(u => u.status === 'suspended').length,
  admins: users.value.filter(u => u.role === 'admin').length
}))

// Fetch all users
const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/admin/users')
    users.value = response.data
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    loading.value = false
  }
}

// Open modal for editing
const openEditModal = (user: User) => {
  editingUser.value = user
  newUser.value = { ...user }
  showUserModal.value = true
}

// Open modal for new user
const openNewUserModal = () => {
  editingUser.value = null
  newUser.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'user',
    status: 'active'
  }
  showUserModal.value = true
}

// Close modal
const closeModal = () => {
  showUserModal.value = false
  editingUser.value = null
}

// Save user
const saveUser = async () => {
  try {
    if (editingUser.value && editingUser.value._id) {
      await axios.put(`/api/admin/users/${editingUser.value._id}`, newUser.value)
    } else {
      await axios.post('/api/admin/users', newUser.value)
    }
    await fetchUsers()
    closeModal()
  } catch (error: any) {
    alert(error.response?.data?.message || 'Error saving user')
  }
}

// Delete user
const deleteUser = async (id: string) => {
  if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
    try {
      await axios.delete(`/api/admin/users/${id}`)
      await fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }
}

// Suspend/Activate user
const toggleUserStatus = async (user: User) => {
  const newStatus = user.status === 'active' ? 'suspended' : 'active'
  try {
    await axios.put(`/api/admin/users/${user._id}`, {
      ...user,
      status: newStatus
    })
    await fetchUsers()
  } catch (error) {
    console.error('Error updating user status:', error)
  }
}

// Make admin
const toggleAdminRole = async (user: User) => {
  const newRole = user.role === 'admin' ? 'user' : 'admin'
  if (confirm(`Are you sure you want to ${newRole === 'admin' ? 'grant admin access to' : 'remove admin access from'} this user?`)) {
    try {
      await axios.put(`/api/admin/users/${user._id}`, {
        ...user,
        role: newRole
      })
      await fetchUsers()
    } catch (error) {
      console.error('Error updating user role:', error)
    }
  }
}

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-2">
          <UsersIcon :size="32" class="text-orange-500" />
          <h1 class="text-4xl font-bold text-white">User Management</h1>
        </div>
        <p class="text-gray-400">Manage platform users, roles, and permissions</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl p-6 border border-blue-500/30">
          <div class="flex items-center justify-between mb-2">
            <span class="text-blue-400 text-sm font-medium">Total Users</span>
            <UsersIcon :size="20" class="text-blue-400" />
          </div>
          <p class="text-3xl font-bold text-white">{{ userStats.total }}</p>
        </div>

        <div class="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-xl p-6 border border-green-500/30">
          <div class="flex items-center justify-between mb-2">
            <span class="text-green-400 text-sm font-medium">Active Users</span>
            <CheckCircle :size="20" class="text-green-400" />
          </div>
          <p class="text-3xl font-bold text-white">{{ userStats.active }}</p>
        </div>

        <div class="bg-gradient-to-br from-red-900/30 to-red-800/20 rounded-xl p-6 border border-red-500/30">
          <div class="flex items-center justify-between mb-2">
            <span class="text-red-400 text-sm font-medium">Suspended</span>
            <Ban :size="20" class="text-red-400" />
          </div>
          <p class="text-3xl font-bold text-white">{{ userStats.suspended }}</p>
        </div>

        <div class="bg-gradient-to-br from-orange-900/30 to-orange-800/20 rounded-xl p-6 border border-orange-500/30">
          <div class="flex items-center justify-between mb-2">
            <span class="text-orange-400 text-sm font-medium">Admins</span>
            <Shield :size="20" class="text-orange-400" />
          </div>
          <p class="text-3xl font-bold text-white">{{ userStats.admins }}</p>
        </div>
      </div>

      <!-- Controls -->
      <div class="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-6">
        <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
          <!-- Search -->
          <div class="relative flex-1 w-full md:w-auto">
            <Search :size="20" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="Search users by name or email..."
              class="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <!-- Filters -->
          <div class="flex gap-2">
            <button 
              @click="selectedFilter = 'all'"
              :class="selectedFilter === 'all' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
              class="px-4 py-2 rounded-lg transition-colors"
            >
              All
            </button>
            <button 
              @click="selectedFilter = 'active'"
              :class="selectedFilter === 'active' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
              class="px-4 py-2 rounded-lg transition-colors"
            >
              Active
            </button>
            <button 
              @click="selectedFilter = 'suspended'"
              :class="selectedFilter === 'suspended' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
              class="px-4 py-2 rounded-lg transition-colors"
            >
              Suspended
            </button>
            <button 
              @click="selectedFilter = 'admin'"
              :class="selectedFilter === 'admin' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
              class="px-4 py-2 rounded-lg transition-colors"
            >
              Admins
            </button>
          </div>

          <!-- Add User Button -->
          <button 
            @click="openNewUserModal"
            class="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
          >
            <UserPlus :size="20" />
            Add User
          </button>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
        <div v-if="loading" class="p-12 text-center">
          <p class="text-gray-400">Loading users...</p>
        </div>

        <div v-else-if="filteredUsers.length === 0" class="p-12 text-center">
          <UsersIcon :size="48" class="mx-auto mb-4 text-gray-600" />
          <p class="text-gray-400">No users found</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-900/50 border-b border-gray-700">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-300">User</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-300">Contact</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-300">Role</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-300">Joined</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-300">Activity</th>
                <th class="px-6 py-4 text-right text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr v-for="user in filteredUsers" :key="user._id" class="hover:bg-gray-700/30 transition-colors">
                <td class="px-6 py-4">
                  <div>
                    <p class="font-medium text-white">{{ user.firstName }} {{ user.lastName }}</p>
                    <p class="text-sm text-gray-400">ID: {{ user._id.slice(-8) }}</p>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2 text-sm text-gray-300">
                      <Mail :size="14" class="text-gray-500" />
                      {{ user.email }}
                    </div>
                    <div v-if="user.phone" class="flex items-center gap-2 text-sm text-gray-400">
                      <Phone :size="14" class="text-gray-500" />
                      {{ user.phone }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span 
                    :class="user.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' : 'bg-blue-500/20 text-blue-400 border-blue-500/50'"
                    class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border"
                  >
                    <Shield v-if="user.role === 'admin'" :size="12" />
                    {{ user.role === 'admin' ? 'Admin' : 'User' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span 
                    :class="{
                      'bg-green-500/20 text-green-400 border-green-500/50': user.status === 'active',
                      'bg-red-500/20 text-red-400 border-red-500/50': user.status === 'suspended',
                      'bg-yellow-500/20 text-yellow-400 border-yellow-500/50': user.status === 'pending'
                    }"
                    class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border"
                  >
                    {{ user.status }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2 text-sm text-gray-300">
                    <Calendar :size="14" class="text-gray-500" />
                    {{ formatDate(user.createdAt) }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-400">
                    <p>{{ user.projectCount || 0 }} projects</p>
                    <p>{{ user.purchaseCount || 0 }} purchases</p>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center justify-end gap-2">
                    <button 
                      @click="toggleAdminRole(user)"
                      :title="user.role === 'admin' ? 'Remove Admin' : 'Make Admin'"
                      class="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                    >
                      <Shield :size="16" />
                    </button>
                    <button 
                      @click="toggleUserStatus(user)"
                      :title="user.status === 'active' ? 'Suspend User' : 'Activate User'"
                      :class="user.status === 'active' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'"
                      class="p-2 rounded-lg transition-colors"
                    >
                      <Ban v-if="user.status === 'active'" :size="16" />
                      <CheckCircle v-else :size="16" />
                    </button>
                    <button 
                      @click="openEditModal(user)"
                      class="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                    >
                      <Edit2 :size="16" />
                    </button>
                    <button 
                      @click="deleteUser(user._id)"
                      class="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 :size="16" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- User Modal -->
    <div v-if="showUserModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white">
            {{ editingUser ? 'Edit User' : 'Add New User' }}
          </h2>
          <button @click="closeModal" class="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <X :size="20" class="text-gray-400" />
          </button>
        </div>

        <form @submit.prevent="saveUser" class="p-6 space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">First Name</label>
              <input 
                v-model="newUser.firstName"
                type="text"
                required
                class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                placeholder="John"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
              <input 
                v-model="newUser.lastName"
                type="text"
                required
                class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input 
              v-model="newUser.email"
              type="email"
              required
              class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Phone (Optional)</label>
            <input 
              v-model="newUser.phone"
              type="tel"
              class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Role</label>
              <select 
                v-model="newUser.role"
                class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select 
                v-model="newUser.status"
                class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button 
              type="submit"
              class="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium"
            >
              {{ editingUser ? 'Update User' : 'Create User' }}
            </button>
            <button 
              type="button"
              @click="closeModal"
              class="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
