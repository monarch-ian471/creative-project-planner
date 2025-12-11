<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Settings as SettingsIcon, Save, Bell, DollarSign, Globe, Shield, Mail, Users, Database, AlertCircle } from 'lucide-vue-next'
import axios from 'axios'

interface PlatformSettings {
  siteName: string;
  siteUrl: string;
  contactEmail: string;
  supportEmail: string;
  commissionRate: number;
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  requireEmailVerification: boolean;
  maxUploadSize: number;
  featuredProductsLimit: number;
  enableNotifications: boolean;
  enableCommunityReviews: boolean;
  currency: string;
  timezone: string;
}

const loading = ref(false)
const saving = ref(false)
const settings = ref<PlatformSettings>({
  siteName: 'Creative Project Planner',
  siteUrl: 'https://creativeprojects.com',
  contactEmail: 'contact@creativeprojects.com',
  supportEmail: 'support@creativeprojects.com',
  commissionRate: 10,
  maintenanceMode: false,
  allowNewRegistrations: true,
  requireEmailVerification: true,
  maxUploadSize: 50,
  featuredProductsLimit: 10,
  enableNotifications: true,
  enableCommunityReviews: true,
  currency: 'USD',
  timezone: 'America/New_York'
})

// Fetch current settings
const fetchSettings = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/admin/settings')
    settings.value = response.data
  } catch (error) {
    console.error('Error fetching settings:', error)
  } finally {
    loading.value = false
  }
}

// Save settings
const saveSettings = async () => {
  saving.value = true
  try {
    await axios.put('/api/admin/settings', settings.value)
    alert('Settings saved successfully!')
  } catch (error) {
    console.error('Error saving settings:', error)
    alert('Failed to save settings')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchSettings()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 p-6">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-2">
          <SettingsIcon :size="32" class="text-orange-500" />
          <h1 class="text-4xl font-bold text-white">Platform Settings</h1>
        </div>
        <p class="text-gray-400">Configure platform-wide settings and preferences</p>
      </div>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-400">Loading settings...</p>
      </div>

      <div v-else class="space-y-6">
        <!-- General Settings -->
        <div class="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          <div class="p-6 border-b border-gray-700 bg-gradient-to-r from-blue-900/20 to-blue-800/10">
            <div class="flex items-center gap-2">
              <Globe :size="24" class="text-blue-400" />
              <h2 class="text-xl font-bold text-white">General Settings</h2>
            </div>
          </div>
          <div class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Site Name</label>
                <input 
                  v-model="settings.siteName"
                  type="text"
                  class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                  placeholder="Creative Project Planner"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Site URL</label>
                <input 
                  v-model="settings.siteUrl"
                  type="url"
                  class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                <select 
                  v-model="settings.currency"
                  class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
                <select 
                  v-model="settings.timezone"
                  class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Email Settings -->
        <div class="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          <div class="p-6 border-b border-gray-700 bg-gradient-to-r from-purple-900/20 to-purple-800/10">
            <div class="flex items-center gap-2">
              <Mail :size="24" class="text-purple-400" />
              <h2 class="text-xl font-bold text-white">Email Settings</h2>
            </div>
          </div>
          <div class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Contact Email</label>
                <input 
                  v-model="settings.contactEmail"
                  type="email"
                  class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                  placeholder="contact@example.com"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Support Email</label>
                <input 
                  v-model="settings.supportEmail"
                  type="email"
                  class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                  placeholder="support@example.com"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Commerce Settings -->
        <div class="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          <div class="p-6 border-b border-gray-700 bg-gradient-to-r from-green-900/20 to-green-800/10">
            <div class="flex items-center gap-2">
              <DollarSign :size="24" class="text-green-400" />
              <h2 class="text-xl font-bold text-white">Commerce Settings</h2>
            </div>
          </div>
          <div class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Commission Rate (%)</label>
                <input 
                  v-model.number="settings.commissionRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                />
                <p class="text-xs text-gray-500 mt-1">Platform commission on each sale</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Featured Products Limit</label>
                <input 
                  v-model.number="settings.featuredProductsLimit"
                  type="number"
                  min="1"
                  class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                />
                <p class="text-xs text-gray-500 mt-1">Maximum number of featured products</p>
              </div>
            </div>
          </div>
        </div>

        <!-- User Settings -->
        <div class="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          <div class="p-6 border-b border-gray-700 bg-gradient-to-r from-orange-900/20 to-orange-800/10">
            <div class="flex items-center gap-2">
              <Users :size="24" class="text-orange-400" />
              <h2 class="text-xl font-bold text-white">User Management</h2>
            </div>
          </div>
          <div class="p-6 space-y-6">
            <div class="space-y-4">
              <label class="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                <div>
                  <p class="text-white font-medium">Allow New Registrations</p>
                  <p class="text-sm text-gray-400">Enable new users to register accounts</p>
                </div>
                <input 
                  v-model="settings.allowNewRegistrations"
                  type="checkbox"
                  class="w-5 h-5 rounded bg-gray-700 border-gray-600 text-orange-500 focus:ring-orange-500"
                />
              </label>

              <label class="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                <div>
                  <p class="text-white font-medium">Require Email Verification</p>
                  <p class="text-sm text-gray-400">Users must verify email before accessing platform</p>
                </div>
                <input 
                  v-model="settings.requireEmailVerification"
                  type="checkbox"
                  class="w-5 h-5 rounded bg-gray-700 border-gray-600 text-orange-500 focus:ring-orange-500"
                />
              </label>
            </div>
          </div>
        </div>

        <!-- Platform Settings -->
        <div class="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          <div class="p-6 border-b border-gray-700 bg-gradient-to-r from-teal-900/20 to-teal-800/10">
            <div class="flex items-center gap-2">
              <Database :size="24" class="text-teal-400" />
              <h2 class="text-xl font-bold text-white">Platform Features</h2>
            </div>
          </div>
          <div class="p-6 space-y-6">
            <div class="space-y-4">
              <label class="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                <div>
                  <p class="text-white font-medium">Enable Notifications</p>
                  <p class="text-sm text-gray-400">Allow system to send notifications to users</p>
                </div>
                <input 
                  v-model="settings.enableNotifications"
                  type="checkbox"
                  class="w-5 h-5 rounded bg-gray-700 border-gray-600 text-orange-500 focus:ring-orange-500"
                />
              </label>

              <label class="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                <div>
                  <p class="text-white font-medium">Enable Community Reviews</p>
                  <p class="text-sm text-gray-400">Allow users to review products and projects</p>
                </div>
                <input 
                  v-model="settings.enableCommunityReviews"
                  type="checkbox"
                  class="w-5 h-5 rounded bg-gray-700 border-gray-600 text-orange-500 focus:ring-orange-500"
                />
              </label>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Max Upload Size (MB)</label>
                <input 
                  v-model.number="settings.maxUploadSize"
                  type="number"
                  min="1"
                  max="500"
                  class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                />
                <p class="text-xs text-gray-500 mt-1">Maximum file upload size for media</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Maintenance Mode -->
        <div class="bg-gradient-to-br from-red-900/30 to-red-800/20 rounded-xl border border-red-500/50 overflow-hidden">
          <div class="p-6 border-b border-red-700/50">
            <div class="flex items-center gap-2">
              <AlertCircle :size="24" class="text-red-400" />
              <h2 class="text-xl font-bold text-white">Maintenance Mode</h2>
            </div>
          </div>
          <div class="p-6">
            <label class="flex items-center justify-between p-4 bg-red-500/10 rounded-lg cursor-pointer hover:bg-red-500/20 transition-colors">
              <div>
                <p class="text-white font-medium">Enable Maintenance Mode</p>
                <p class="text-sm text-red-300">Platform will be unavailable to regular users</p>
              </div>
              <input 
                v-model="settings.maintenanceMode"
                type="checkbox"
                class="w-5 h-5 rounded bg-gray-700 border-red-600 text-red-500 focus:ring-red-500"
              />
            </label>
          </div>
        </div>

        <!-- Save Button -->
        <div class="flex justify-end">
          <button 
            @click="saveSettings"
            :disabled="saving"
            class="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all transform hover:scale-105 font-medium text-lg shadow-lg"
          >
            <Save :size="20" />
            {{ saving ? 'Saving...' : 'Save Settings' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>