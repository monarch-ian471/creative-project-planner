<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { User, Mail, Lock, Bell, Shield, Trash2, Save, Eye, EyeOff, Camera, Twitter, Linkedin } from 'lucide-vue-next'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  twitter?: string;
  linkedin?: string;
  bio?: string;
  profilePicture?: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  projectUpdates: boolean;
  communityMessages: boolean;
  marketingEmails: boolean;
}

const loading = ref(false)
const saving = ref(false)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const profile = ref<UserProfile>({
  firstName: 'Demo',
  lastName: 'User',
  email: 'user@example.com',
  phone: '',
  twitter: '',
  linkedin: '',
  bio: '',
  profilePicture: ''
})

const passwordForm = ref<PasswordForm>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const notifications = ref<NotificationSettings>({
  emailNotifications: true,
  projectUpdates: true,
  communityMessages: true,
  marketingEmails: false
})

// Fetch user profile
const fetchProfile = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/users/profile')
    profile.value = response.data
  } catch (error) {
    console.error('Error fetching profile:', error)
  } finally {
    loading.value = false
  }
}

// Update profile
const updateProfile = async () => {
  saving.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    await axios.put('/api/users/profile', profile.value)
    successMessage.value = 'Profile updated successfully!'
    setTimeout(() => successMessage.value = '', 3000)
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to update profile'
  } finally {
    saving.value = false
  }
}

// Change password
const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    errorMessage.value = 'Passwords do not match'
    return
  }
  
  if (passwordForm.value.newPassword.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters'
    return
  }
  
  saving.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    await axios.put('/api/users/password', {
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    })
    successMessage.value = 'Password changed successfully!'
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
    setTimeout(() => successMessage.value = '', 3000)
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to change password'
  } finally {
    saving.value = false
  }
}

// Update notifications
const updateNotifications = async () => {
  saving.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    await axios.put('/api/users/notifications', notifications.value)
    successMessage.value = 'Notification settings updated!'
    setTimeout(() => successMessage.value = '', 3000)
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to update notifications'
  } finally {
    saving.value = false
  }
}

// Handle profile picture upload
const handleProfilePictureUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    errorMessage.value = 'Please select an image file'
    return
  }
  
  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = 'Image must be less than 5MB'
    return
  }
  
  const formData = new FormData()
  formData.append('profilePicture', file)
  
  saving.value = true
  errorMessage.value = ''
  
  try {
    const response = await axios.post('/api/users/profile-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    profile.value.profilePicture = response.data.imageUrl
    successMessage.value = 'Profile picture updated!'
    setTimeout(() => successMessage.value = '', 3000)
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to upload picture'
  } finally {
    saving.value = false
  }
}

// Delete account
const deleteAccount = async () => {
  const confirmed = confirm(
    'Are you sure you want to delete your account? This action cannot be undone. All your projects and data will be permanently deleted.'
  )
  
  if (!confirmed) return
  
  const password = prompt('Please enter your password to confirm account deletion:')
  
  if (!password) return
  
  try {
    await axios.delete('/api/users/account', { data: { password } })
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/auth/login')
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to delete account'
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 p-6">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">Account Settings</h1>
        <p class="text-gray-400">Manage your profile, security, and preferences</p>
      </div>

      <!-- Success/Error Messages -->
      <div v-if="successMessage" class="mb-6 bg-green-500/10 border border-green-500/50 rounded-lg p-4">
        <p class="text-green-400">{{ successMessage }}</p>
      </div>
      
      <div v-if="errorMessage" class="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4">
        <p class="text-red-400">{{ errorMessage }}</p>
      </div>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-400">Loading settings...</p>
      </div>

      <div v-else class="space-y-6">
        <!-- Profile Section -->
        <div class="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          <div class="p-6 border-b border-gray-700 bg-gradient-to-r from-orange-900/20 to-orange-800/10">
            <div class="flex items-center gap-2">
              <User :size="24" class="text-orange-400" />
              <h2 class="text-xl font-bold text-white">Profile Information</h2>
            </div>
          </div>
          <div class="p-6 space-y-6">
            <!-- Profile Picture -->
            <div class="flex items-center gap-6">
              <div class="relative">
                <div class="w-24 h-24 rounded-full bg-gray-700 overflow-hidden">
                  <img 
                    v-if="profile.profilePicture"
                    :src="profile.profilePicture" 
                    alt="Profile"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <User :size="40" class="text-gray-500" />
                  </div>
                </div>
                <label class="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full cursor-pointer hover:bg-orange-600 transition-colors">
                  <Camera :size="16" />
                  <input type="file" accept="image/*" @change="handleProfilePictureUpload" class="hidden" />
                </label>
              </div>
              <div>
                <p class="text-white font-medium">{{ profile.firstName }} {{ profile.lastName }}</p>
                <p class="text-gray-400 text-sm">{{ profile.email }}</p>
              </div>
            </div>

            <!-- Name Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                <input 
                  v-model="profile.firstName"
                  type="text"
                  class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                <input 
                  v-model="profile.lastName"
                  type="text"
                  class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <!-- Email & Phone -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input 
                  v-model="profile.email"
                  type="email"
                  class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Phone (Optional)</label>
                <input 
                  v-model="profile.phone"
                  type="tel"
                  class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <!-- Social Links -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  <Twitter :size="16" class="inline mr-2" />
                  Twitter Handle
                </label>
                <input 
                  v-model="profile.twitter"
                  type="text"
                  class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                  placeholder="@username"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  <Linkedin :size="16" class="inline mr-2" />
                  LinkedIn Profile
                </label>
                <input 
                  v-model="profile.linkedin"
                  type="text"
                  class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                  placeholder="linkedin.com/in/username"
                />
              </div>
            </div>

            <!-- Bio -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Bio</label>
              <textarea 
                v-model="profile.bio"
                rows="4"
                class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none resize-none"
                placeholder="Tell us about yourself..."
              ></textarea>
            </div>

            <button 
              @click="updateProfile"
              :disabled="saving"
              class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all"
            >
              <Save :size="20" />
              {{ saving ? 'Saving...' : 'Save Profile' }}
            </button>
          </div>
        </div>

        <!-- Security Section -->
        <div class="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          <div class="p-6 border-b border-gray-700 bg-gradient-to-r from-blue-900/20 to-blue-800/10">
            <div class="flex items-center gap-2">
              <Lock :size="24" class="text-blue-400" />
              <h2 class="text-xl font-bold text-white">Security</h2>
            </div>
          </div>
          <div class="p-6 space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
              <div class="relative">
                <input 
                  v-model="passwordForm.currentPassword"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                />
                <button 
                  type="button"
                  @click="showCurrentPassword = !showCurrentPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <Eye v-if="!showCurrentPassword" :size="20" class="text-gray-500" />
                  <EyeOff v-else :size="20" class="text-gray-500" />
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">New Password</label>
              <div class="relative">
                <input 
                  v-model="passwordForm.newPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                />
                <button 
                  type="button"
                  @click="showNewPassword = !showNewPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <Eye v-if="!showNewPassword" :size="20" class="text-gray-500" />
                  <EyeOff v-else :size="20" class="text-gray-500" />
                </button>
              </div>
              <p class="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
              <input 
                v-model="passwordForm.confirmPassword"
                type="password"
                class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
              />
            </div>

            <button 
              @click="changePassword"
              :disabled="saving"
              class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all"
            >
              <Shield :size="20" />
              {{ saving ? 'Changing...' : 'Change Password' }}
            </button>
          </div>
        </div>

        <!-- Notifications Section -->
        <div class="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          <div class="p-6 border-b border-gray-700 bg-gradient-to-r from-purple-900/20 to-purple-800/10">
            <div class="flex items-center gap-2">
              <Bell :size="24" class="text-purple-400" />
              <h2 class="text-xl font-bold text-white">Notifications</h2>
            </div>
          </div>
          <div class="p-6 space-y-4">
            <label class="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
              <div>
                <p class="text-white font-medium">Email Notifications</p>
                <p class="text-sm text-gray-400">Receive notifications via email</p>
              </div>
              <input 
                v-model="notifications.emailNotifications"
                type="checkbox"
                class="w-5 h-5 rounded bg-gray-700 border-gray-600 text-orange-500 focus:ring-orange-500"
              />
            </label>

            <label class="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
              <div>
                <p class="text-white font-medium">Project Updates</p>
                <p class="text-sm text-gray-400">Get notified about project activity</p>
              </div>
              <input 
                v-model="notifications.projectUpdates"
                type="checkbox"
                class="w-5 h-5 rounded bg-gray-700 border-gray-600 text-orange-500 focus:ring-orange-500"
              />
            </label>

            <label class="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
              <div>
                <p class="text-white font-medium">Community Messages</p>
                <p class="text-sm text-gray-400">Notifications for community interactions</p>
              </div>
              <input 
                v-model="notifications.communityMessages"
                type="checkbox"
                class="w-5 h-5 rounded bg-gray-700 border-gray-600 text-orange-500 focus:ring-orange-500"
              />
            </label>

            <label class="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
              <div>
                <p class="text-white font-medium">Marketing Emails</p>
                <p class="text-sm text-gray-400">Promotional content and offers</p>
              </div>
              <input 
                v-model="notifications.marketingEmails"
                type="checkbox"
                class="w-5 h-5 rounded bg-gray-700 border-gray-600 text-orange-500 focus:ring-orange-500"
              />
            </label>

            <button 
              @click="updateNotifications"
              :disabled="saving"
              class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all"
            >
              <Save :size="20" />
              {{ saving ? 'Saving...' : 'Save Preferences' }}
            </button>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="bg-gradient-to-br from-red-900/30 to-red-800/20 rounded-xl border border-red-500/50 overflow-hidden">
          <div class="p-6 border-b border-red-700/50">
            <div class="flex items-center gap-2">
              <Trash2 :size="24" class="text-red-400" />
              <h2 class="text-xl font-bold text-white">Danger Zone</h2>
            </div>
          </div>
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-white font-medium mb-1">Delete Account</h3>
                <p class="text-red-300 text-sm">Permanently delete your account and all associated data. This action cannot be undone.</p>
              </div>
              <button 
                @click="deleteAccount"
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap ml-4"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
