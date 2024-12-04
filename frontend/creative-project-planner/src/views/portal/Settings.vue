<script>
import { ref, defineComponent } from 'vue';

export default defineComponent({
  name: 'UserSettings',
  setup() {
    const isLoading = ref(false);
    const hasError = ref(false);
    const successMessage = ref('');
    const userName = ref('Ian Katengeza');
    const email = ref('iankatengeza@gmail.com');
    const projectCount = ref(5);
    const twitterHandle = ref('@ian.iv.vii.');
    const linkedInHandle = ref('linkedin.com/in/iankatengeza/');
    const profileBadge = ref('Pro Member'); // Badge indicator
    const profilePicture = ref('frontend/creative-project-planner/src/assets/me.png');


    function updatePassword() {
      if (isLoading.value) return;
      isLoading.value = true;
      successMessage.value = '';

      // Placeholder for password update logic
      setTimeout(() => {
        isLoading.value = false;
        successMessage.value = 'Password updated successfully!';
      }, 1500);
    }

    function updateName() {
      if (isLoading.value) return;
      isLoading.value = true;
      successMessage.value = ''; 

      // Simulate API call for name update
      setTimeout(() => {
        isLoading.value = false;
        successMessage.value = 'Name updated successfully!';
      }, 1500);
    }

    function updateEmail() {
      if (isLoading.value) return;
      isLoading.value = true;
      successMessage.value = ''; 

      // Simulate API call for email update
      setTimeout(() => {
        isLoading.value = false;
        successMessage.value = 'Email updated successfully!';
      }, 1500);
    }

    function updateHandles() {
      if (isLoading.value) return;
      isLoading.value = true;
      successMessage.value = '';

      // Simulate API call for social handle update
      setTimeout(() => {
        isLoading.value = false;
        successMessage.value = 'Social media handles updated!';
      }, 1500);
    }

    function updateProfilePicture(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          profilePicture.value = reader.result; // Update the profile picture
          successMessage.value = 'Profile picture updated successfully!';
        };
        reader.readAsDataURL(file);

        // Simulated API Call - Replace this with actual backend logic
        fetch('/api/updateProfilePicture', { method: 'POST', body: file })
          .then(() => { successMessage.value = 'Profile picture updated successfully!'; })
          .catch(() => { successMessage.value = 'Error updating profile picture'; });
      }
    }

    function logOut() {
      // Placeholder for logout logic
      this.$router.push('/login');
    }

    return {
      isLoading,
      hasError,
      successMessage,
      userName,
      email,
      projectCount,
      twitterHandle,
      linkedInHandle,
      profileBadge,
      updatePassword,
      updateName,
      updateEmail,
      updateHandles,
      updateProfilePicture,
      logOut
    };
  }
});
</script>

<template>
  <div class="container mx-auto p-4 mt-6 bg-black bg-opacity-70 rounded-xl shadow-lg">
    <div class="flex items-center space-x-4 mb-6">
      <!-- Profile Picture Update Icon with File Input -->
      <div class="relative w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
        <img :src="profilePicture" alt="Profile Picture" class="w-full h-full object-cover">
        <input type="file" id="profilePicInput" class="hidden" @change="updateProfilePicture">
        <label for="profilePicInput" class="absolute bottom-0 right-0 bg-gray-800 text-white p-1 rounded-full hover:bg-gray-600 cursor-pointer">
          <i class="fas fa-edit"></i>
        </label>
      </div>

      <!-- Profile Details -->
      <div>
        <h2 class="text-3xl font-semibold text-white">{{ userName }}</h2>
        <p class="text-gray-200">{{ email }}</p>
        <p class="text-gray-200">Projects: {{ projectCount }}</p>
        <p class="text-gray-200">Twitter: {{ twitterHandle }}</p>
        <p class="text-gray-200">LinkedIn: {{ linkedInHandle }}</p>
      </div>
    </div>
  </div>

  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Settings</h1>

    <!-- Success message -->
    <div v-if="successMessage" class="bg-green-100 text-green-800 p-2 rounded mb-4">
      {{ successMessage }}
    </div>

    <!-- Update Name Form -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Update Name</h2>
      <input type="text" v-model="userName" placeholder="New Name" class="border border-orange-500 p-2 mb-2 w-full max-w-sm" />
      <button @click="updateName" :disabled="isLoading" class="bg-custom-peach text-white p-2 rounded hover:bg-orange-400 disabled:opacity-50">
        {{ isLoading ? 'Updating...' : 'Update Name' }}
      </button>
    </div>

    <!-- Update Email Form -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Update Email</h2>
      <input type="email" v-model="email" placeholder="New Email" class="border border-orange-500 p-2 mb-2 w-full max-w-sm" />
      <button @click="updateEmail" :disabled="isLoading" class="bg-custom-peach text-white p-2 rounded hover:bg-orange-400 disabled:opacity-50">
        {{ isLoading ? 'Updating...' : 'Update Email' }}
      </button>
    </div>

    <!-- Change Password Form -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Change Password</h2>
      <input type="password" placeholder="Current Password" class="border border-orange-500 p-2 mb-2 w-full max-w-sm" />
      <input type="password" placeholder="New Password" class="border border-orange-500 p-2 mb-2 w-full max-w-sm" />
      <input type="password" placeholder="Confirm New Password" class="border border-orange-500 p-2 mb-2 w-full max-w-sm" />
      <button @click="updatePassword" :disabled="isLoading" class="bg-custom-peach text-white p-2 rounded hover:bg-orange-400 disabled:opacity-50">
        {{ isLoading ? 'Updating...' : 'Update Password' }}
      </button>
    </div>

    <!-- Update Social Media Handles -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Social Media Handles</h2>
      <input type="text" v-model="twitterHandle" placeholder="Twitter Handle" class="border border-orange-500 p-2 mb-2 w-full max-w-sm" />
      <input type="text" v-model="linkedInHandle" placeholder="LinkedIn Handle" class="border border-orange-500 p-2 mb-2 w-full max-w-sm" />
      <button @click="updateHandles" :disabled="isLoading" class="bg-custom-peach text-white p-2 rounded hover:bg-orange-400 disabled:opacity-50">
        {{ isLoading ? 'Updating...' : 'Update Handles' }}
      </button>
    </div>

    <!-- API Update Section (Commented Out) -->
    <!--
    async function updateBackendData() {
      try {
        const response = await axios.put('/api/user/update', {
          name: userName.value,
          email: email.value,
          twitterHandle: twitterHandle.value,
          linkedInHandle: linkedInHandle.value
        });
        successMessage.value = 'Data updated successfully!';
      } catch (error) {
        hasError.value = true;
        console.error('Error updating data:', error);
      }
    }
    -->

  </div>
</template>

<style scoped>
.bg-custom-peach {
  background-color: #fa6e42;
}
</style>


<!--
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
-->
<!-- <template>
  <form>
    <div class="space-y-12">
      <div class="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
        <div>
          <h2 class="text-base/7 font-semibold text-gray-900">Profile</h2>
          <p class="mt-1 text-sm/6 text-gray-600">This information will be displayed publicly so be careful what you share.</p>
        </div>

        <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
          <div class="sm:col-span-4">
            <label for="website" class="block text-sm/6 font-medium text-gray-900">Website</label>
            <div class="mt-2">
              <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm">http://</span>
                <input type="text" name="website" id="website" class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm/6" placeholder="www.example.com" />
              </div>
            </div>
          </div>

          <div class="col-span-full">
            <label for="about" class="block text-sm/6 font-medium text-gray-900">About</label>
            <div class="mt-2">
              <textarea id="about" name="about" rows="3" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" />
            </div>
            <p class="mt-3 text-sm/6 text-gray-600">Write a few sentences about yourself.</p>
          </div>

          <div class="col-span-full">
            <label for="photo" class="block text-sm/6 font-medium text-gray-900">Photo</label>
            <div class="mt-2 flex items-center gap-x-3">
              <UserCircleIcon class="size-12 text-gray-300" aria-hidden="true" />
              <button type="button" class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Change</button>
            </div>
          </div>

          <div class="col-span-full">
            <label for="cover-photo" class="block text-sm/6 font-medium text-gray-900">Cover photo</label>
            <div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              <div class="text-center">
                <PhotoIcon class="mx-auto size-12 text-gray-300" aria-hidden="true" />
                <div class="mt-4 flex text-sm/6 text-gray-600">
                  <label for="file-upload" class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" class="sr-only" />
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
        <div>
          <h2 class="text-base/7 font-semibold text-gray-900">Personal Information</h2>
          <p class="mt-1 text-sm/6 text-gray-600">Use a permanent address where you can receive mail.</p>
        </div>

        <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
          <div class="sm:col-span-3">
            <label for="first-name" class="block text-sm/6 font-medium text-gray-900">First name</label>
            <div class="mt-2">
              <input type="text" name="first-name" id="first-name" autocomplete="given-name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" />
            </div>
          </div>

          <div class="sm:col-span-3">
            <label for="last-name" class="block text-sm/6 font-medium text-gray-900">Last name</label>
            <div class="mt-2">
              <input type="text" name="last-name" id="last-name" autocomplete="family-name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" />
            </div>
          </div>

          <div class="sm:col-span-4">
            <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
            <div class="mt-2">
              <input id="email" name="email" type="email" autocomplete="email" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" />
            </div>
          </div>

          <div class="sm:col-span-3">
            <label for="country" class="block text-sm/6 font-medium text-gray-900">Country</label>
            <div class="mt-2">
              <select id="country" name="country" autocomplete="country-name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6">
                <option>United States</option>
                <option>Canada</option>
                <option>Mexico</option>
              </select>
            </div>
          </div>

          <div class="col-span-full">
            <label for="street-address" class="block text-sm/6 font-medium text-gray-900">Street address</label>
            <div class="mt-2">
              <input type="text" name="street-address" id="street-address" autocomplete="street-address" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" />
            </div>
          </div>

          <div class="sm:col-span-2 sm:col-start-1">
            <label for="city" class="block text-sm/6 font-medium text-gray-900">City</label>
            <div class="mt-2">
              <input type="text" name="city" id="city" autocomplete="address-level2" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" />
            </div>
          </div>

          <div class="sm:col-span-2">
            <label for="region" class="block text-sm/6 font-medium text-gray-900">State / Province</label>
            <div class="mt-2">
              <input type="text" name="region" id="region" autocomplete="address-level1" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" />
            </div>
          </div>

          <div class="sm:col-span-2">
            <label for="postal-code" class="block text-sm/6 font-medium text-gray-900">ZIP / Postal code</label>
            <div class="mt-2">
              <input type="text" name="postal-code" id="postal-code" autocomplete="postal-code" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" />
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
        <div>
          <h2 class="text-base/7 font-semibold text-gray-900">Notifications</h2>
          <p class="mt-1 text-sm/6 text-gray-600">We'll always let you know about important changes, but you pick what else you want to hear about.</p>
        </div>

        <div class="max-w-2xl space-y-10 md:col-span-2">
          <fieldset>
            <legend class="text-sm/6 font-semibold text-gray-900">By Email</legend>
            <div class="mt-6 space-y-6">
              <div class="relative flex gap-x-3">
                <div class="flex h-6 items-center">
                  <input id="comments" name="comments" type="checkbox" class="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                </div>
                <div class="text-sm/6">
                  <label for="comments" class="font-medium text-gray-900">Comments</label>
                  <p class="text-gray-500">Get notified when someones posts a comment on a posting.</p>
                </div>
              </div>
              <div class="relative flex gap-x-3">
                <div class="flex h-6 items-center">
                  <input id="candidates" name="candidates" type="checkbox" class="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                </div>
                <div class="text-sm/6">
                  <label for="candidates" class="font-medium text-gray-900">Candidates</label>
                  <p class="text-gray-500">Get notified when a candidate applies for a job.</p>
                </div>
              </div>
              <div class="relative flex gap-x-3">
                <div class="flex h-6 items-center">
                  <input id="offers" name="offers" type="checkbox" class="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                </div>
                <div class="text-sm/6">
                  <label for="offers" class="font-medium text-gray-900">Offers</label>
                  <p class="text-gray-500">Get notified when a candidate accepts or rejects an offer.</p>
                </div>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend class="text-sm/6 font-semibold text-gray-900">Push Notifications</legend>
            <p class="mt-1 text-sm/6 text-gray-600">These are delivered via SMS to your mobile phone.</p>
            <div class="mt-6 space-y-6">
              <div class="flex items-center gap-x-3">
                <input id="push-everything" name="push-notifications" type="radio" class="size-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                <label for="push-everything" class="block text-sm/6 font-medium text-gray-900">Everything</label>
              </div>
              <div class="flex items-center gap-x-3">
                <input id="push-email" name="push-notifications" type="radio" class="size-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                <label for="push-email" class="block text-sm/6 font-medium text-gray-900">Same as email</label>
              </div>
              <div class="flex items-center gap-x-3">
                <input id="push-nothing" name="push-notifications" type="radio" class="size-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                <label for="push-nothing" class="block text-sm/6 font-medium text-gray-900">No push notifications</label>
              </div>
            </div>
          </fieldset>
        </div>
      </div>
    </div>

    <div class="mt-6 flex items-center justify-end gap-x-6">
      <button type="button" class="text-sm/6 font-semibold text-gray-900">Cancel</button>
      <button type="submit" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save</button>
    </div>
  </form>
</template>

<script setup>
import { PhotoIcon, UserCircleIcon } from '@heroicons/vue/24/solid'
</script> -->