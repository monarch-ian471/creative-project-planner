<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useProjectStore } from '@/store/projectStore'; // Importing Pinia store

export default defineComponent({
  name: 'UserProfile',
  setup() {
    const projectStore = useProjectStore();
    const profile = ref({
      firstName: '', lastName: '', email: '', phone: '',
      country: '', streetAddress: '', city: '', 
      region: '', postalCode: '',
      profilePicture: '/uploads/profile-pictures/default-avatar.png',
      notifications: { sms: false, email: false }
    });

    const profilePictureFile = ref<File | null>(null);
    const isEditing = ref(false);

    onMounted(async () => {
      try {
        await projectStore.fetchUserProfile();
        profile.value = { ...profile.value, ...projectStore.userProfile };
      } catch (error) {
        console.error('Profile fetch error:', error);
      }
    });

    const handleProfilePictureUpload = async (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      
      if (file) {
        profilePictureFile.value = file;
        try {
          const uploadedUrl = await projectStore.uploadProfilePicture(file);
          profile.value.profilePicture = uploadedUrl;
        } catch (error) {
          console.error('Picture upload failed:', error);
        }
      }
    };

    const updateProfile = async () => {
      try {
        await projectStore.updateUserProfile(profile.value);
        isEditing.value = false;
      } catch (error) {
        console.error('Profile update failed:', error);
      }
    };

    return {
      profile,
      isEditing,
      handleProfilePictureUpload,
      updateProfile,
      toggleEdit: () => isEditing.value = !isEditing.value
    };
  }
});
</script>

<template>
  <div class="container mx-auto p-6">
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <!-- Profile Picture Section -->
      <div class="relative">
        <img 
          :src="profile.profilePicture" 
          alt="Profile Picture" 
          class="w-32 h-32 rounded-full mx-auto mt-6 object-cover"
        />
        <input 
          type="file" 
          @change="handleProfilePictureUpload" 
          accept="image/*" 
          class="hidden" 
          id="profilePictureInput"
        />
        <label 
          for="profilePictureInput" 
          class="absolute bottom-0 right-1/2 transform translate-x-1/2 bg-blue-500 text-white p-2 rounded-full cursor-pointer"
        >
          ✏️
        </label>
      </div>

      <!-- Profile Details -->
      <div class="p-6">
        <div v-if="!isEditing" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <strong>First Name:</strong> {{ profile.firstName }}
            </div>
            <div>
              <strong>Last Name:</strong> {{ profile.lastName }}
            </div>
          </div>
          <div>
            <strong>Email:</strong> {{ profile.email }}
          </div>
          <div>
            <strong>Phone:</strong> {{ profile.phone || 'Not provided' }}
          </div>
          <div>
            <strong>Address:</strong> 
            {{ profile.streetAddress }}, 
            {{ profile.city }}, 
            {{ profile.region }}, 
            {{ profile.country }} 
            {{ profile.postalCode }}
          </div>
          <div>
            <strong>Notifications:</strong>
            SMS: {{ profile.notifications.sms ? 'Enabled' : 'Disabled' }},
            Email: {{ profile.notifications.email ? 'Enabled' : 'Disabled' }}
          </div>
        </div>

        <!-- Editable Form -->
        <form v-else @submit.prevent="updateProfile" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label>First Name</label>
              <input 
                v-model="profile.firstName" 
                required 
                class="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label>Last Name</label>
              <input 
                v-model="profile.lastName" 
                required 
                class="w-full border p-2 rounded"
              />
            </div>
          </div>
          <div>
            <label>Email</label>
            <input 
              v-model="profile.email" 
              required 
              class="w-full border p-2 rounded"
            />
          </div>
          <!-- Add similar input fields for other profile details -->
        </form>

        <!-- Action Buttons -->
        <div class="mt-6 flex justify-end space-x-4">
          <button 
            v-if="!isEditing" 
            @click="toggleEdit" 
            class="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
          <template v-else>
            <button 
              @click="toggleEdit" 
              class="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button 
              @click="updateProfile" 
              class="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
