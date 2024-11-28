<script lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { registerUser } from '@/services/userService'; // Import the user service


// Define the structure of your form
interface Form {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  streetAddress: string;
  city: string;
  region: string;
  postalCode: string;
  password: string; // Add password field
  notifications: {
    sms: boolean;
    email: boolean;
  };
}

// Define the structure for form errors
interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  country?: string;
  streetAddress?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  password?: string; // Add password field
}

export default {
  setup() {
const router = useRouter();
const { isAuthenticated } = useAuth();

// Ref for form data with proper typing
const form = ref<Form>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  country: '',
  streetAddress: '',
  city: '',
  region: '',
  postalCode: '',
  password: '', // Add password field
  notifications: {
    sms: false,
    email: false,
  },
});

// Ref for form errors
const errors = ref<FormErrors>({});

// Validate form
const validateForm = (): boolean => {
  errors.value = {}; // Clear previous errors

  if (!form.value.firstName) errors.value.firstName = 'First name is required';
  if (!form.value.lastName) errors.value.lastName = 'Last name is required';
  if (!form.value.email) errors.value.email = 'Email is required';
  if (!form.value.phone) errors.value.phone = 'Phone number is required';
  if (!form.value.country) errors.value.country = 'Country is required';
  if (!form.value.streetAddress) errors.value.streetAddress = 'Street address is required';
  if (!form.value.city) errors.value.city = 'City is required';
  if (!form.value.region) errors.value.region = 'State / Province is required';
  if (!form.value.postalCode) errors.value.postalCode = 'ZIP / Postal code is required';
  if (!form.value.password) errors.value.password = 'Password is required'; // Add password validation

  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async (event: Event): Promise<void> => {
  event.preventDefault();

  if (validateForm()) {
    try {
      
      const response = await registerUser({
        // form fields
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        email: form.value.email,
        phone: form.value.phone,
        country: form.value.country,
        streetAddress: form.value.streetAddress,
        city: form.value.city,
        region: form.value.region,
        postalCode: form.value.postalCode,
        password: form.value.password,
        notifications: {
          sms: form.value.notifications.sms,
          email: form.value.notifications.email,
        },
      });

      if (response.status === 201) { // Check if the response status indicates success
        await router.push('/login');
        console.log(response);
      } else {
        console.error('Unexpected response:', response);
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  }
};

    return {
      form,
      errors,
      handleSubmit,
    };
  },
};
</script>

<template>
  <div class="flex min-h-full flex-1">
    <div class="isolate px-6 py-12 sm:py-32 lg:px-8 w-full">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-3xl font-extrabold tracking-tight text-black sm:text-2xl">
          REGISTER ACCOUNT
        </h2>
        <p class="mt-2 text-lg text-black-700">Fill in the details below to create a new account.</p>
      </div>
      <form
        class="mx-auto mt-10 max-w-4xl bg-white border border-orange-400 shadow-md ring-1 ring-orange-200 sm:rounded-lg p-8"
          @submit.prevent="handleSubmit"
      >
        <div class="space-y-12">

          <div class="pb-12">
            <h2 class="text-xl font-semibold leading-7 text-orange-800 text-center">Personal Information</h2>

            <div class="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div class="sm:col-span-3">
                <label for="first-name" class="block text-sm font-medium leading-6 text-orange-900"
                  >First name</label
                >
                <div class="mt-2">
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    autocomplete="given-name"
                    v-model="form.firstName"
                    class="block w-full rounded-md border-0 py-1.5 text-orange-900 shadow-sm ring-1 ring-inset ring-orange-300 placeholder:text-orange-400 focus:ring-2 focus:ring-inset focus:ring-custom-peach sm:text-sm sm:leading-6"
                  />
                  <span v-if="errors.firstName" class="text-red-500 text-sm">{{ errors.firstName }}</span>
                </div>
              </div>

              <div class="sm:col-span-3">
                <label for="last-name" class="block text-sm font-medium leading-6 text-orange-900"
                  >Last name</label
                >
                <div class="mt-2">
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    autocomplete="family-name"
                    v-model="form.lastName"
                    class="block w-full rounded-md border-0 py-1.5 text-orange-900 shadow-sm ring-1 ring-inset ring-orange-300 placeholder:text-orange-400 focus:ring-2 focus:ring-inset focus:ring-custom-peach sm:text-sm sm:leading-6"
                  />
                  <span v-if="errors.lastName" class="text-red-500 text-sm">{{ errors.lastName }}</span>
                </div>
              </div>

              <!-- Email Field -->
              <div class="sm:col-span-3">
                <label for="email" class="block text-sm font-medium leading-6 text-orange-900"
                  >Email address</label
                >
                <div class="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autocomplete="email"
                    v-model="form.email"
                    class="block w-full rounded-md border-0 py-1.5 text-orange-900 shadow-sm ring-1 ring-inset ring-orange-300 placeholder:text-orange-400 focus:ring-2 focus:ring-inset focus:ring-custom-peach sm:text-sm sm:leading-6"
                  />
                  <span v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</span>
                </div>
              </div>

              <!-- Password Field -->
              <div class="sm:col-span-3">
                <label for="password" class="block text-sm font-medium leading-6 text-orange-900"
                  >Password</label
                >
                <div class="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autocomplete="new-password"
                    v-model="form.password"
                    class="block w-full rounded-md border-0 py-1.5 text-orange-900 shadow-sm ring-1 ring-inset ring-orange-300 placeholder:text-orange-400 focus:ring-2 focus:ring-inset focus:ring-custom-peach sm:text-sm sm:leading-6"
                  />
                  <span v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</span>
                </div>
              </div>

              <!-- Phone Field -->
              <div class="sm:col-span-3">
                <label for="phone" class="block text-sm font-medium leading-6 text-orange-900"
                  >Phone number</label
                >
                <div class="mt-2">
                  <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autocomplete="tel"
                  v-model="form.phone"
                  class="block w-full rounded-md border-0 py-1.5 text-orange-900 shadow-sm ring-1 ring-inset ring-orange-300 placeholder:text-orange-400 focus:ring-2 focus:ring-inset focus:ring-custom-peach sm:text-sm sm:leading-6"
                  />
                  <span v-if="errors.phone" class="text-red-500 text-sm">{{ errors.phone }}</span>
                </div>
              </div>

              <div class="sm:col-span-3">
                <label for="country" class="block text-sm font-medium leading-6 text-orange-900"
                  >Country</label
                >
                <div class="mt-2">
                  <select
                    id="country"
                    name="country"
                    autocomplete="country-name"
                    v-model="form.country"
                    class="block w-full rounded-md border-0 py-1.5 text-orange-900 shadow-sm ring-1 ring-inset ring-orange-300 focus:ring-2 focus:ring-inset focus:ring-custom-peach sm:text-sm sm:leading-6"
                  >
                    <option value="" disabled selected>Select your country</option>
                    <option value="Malawi">Malawi</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Zambia">Zambia</option>
                    <option value="South Africa">South Africa</option>
                    <option value="Tanzania">Tanzania</option>
                  </select>
                  <span v-if="errors.country" class="text-red-500 text-sm">{{ errors.country }}</span>
                </div>
              </div>

              <div class="sm:col-span-3">
                <label for="streetAddress" class="block text-sm font-medium leading-6 text-orange-900"
                  >Street address</label
                >
                <div class="mt-2">
                  <input
                    id="streetAddress"
                    name="streetAddress"
                    type="text"
                    v-model="form.streetAddress"
                    class="block w-full rounded-md border-0 py-1.5 text-orange-900 shadow-sm ring-1 ring-inset ring-orange-300 placeholder:text-orange-400 focus:ring-2 focus:ring-inset focus:ring-custom-peach sm:text-sm sm:leading-6"
                  />
                  <span v-if="errors.streetAddress" class="text-red-500 text-sm">{{ errors.streetAddress }}</span>
                </div>
              </div>

              <div class="sm:col-span-3">
                <label for="city" class="block text-sm font-medium leading-6 text-orange-900"
                  >City</label
                >
                <div class="mt-2">
                  <input
                    id="city"
                    name="city"
                    type="text"
                    v-model="form.city"
                    class="block w-full rounded-md border-0 py-1.5 text-orange-900 shadow-sm ring-1 ring-inset ring-orange-300 placeholder:text-orange-400 focus:ring-2 focus:ring-inset focus:ring-custom-peach sm:text-sm sm:leading-6"
                  />
                  <span v-if="errors.city" class="text-red-500 text-sm">{{ errors.city }}</span>
                </div>
              </div>

              <div class="sm:col-span-3">
                <label for="region" class="block text-sm font-medium leading-6 text-orange-900"
                  >State / Province</label
                >
                <div class="mt-2">
                  <input
                    id="region"
                    name="region"
                    type="text"
                    v-model="form.region"
                    class="block w-full rounded-md border-0 py-1.5 text-orange-900 shadow-sm ring-1 ring-inset ring-orange-300 placeholder:text-orange-400 focus:ring-2 focus:ring-inset focus:ring-custom-peach sm:text-sm sm:leading-6"
                  />
                  <span v-if="errors.region" class="text-red-500 text-sm">{{ errors.region }}</span>
                </div>
              </div>

              <div class="sm:col-span-3">
                <label for="postalCode" class="block text-sm font-medium leading-6 text-orange-900"
                  >ZIP / Postal code</label
                >
                <div class="mt-2">
                  <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    v-model="form.postalCode"
                    class="block w-full rounded-md border-0 py-1.5 text-orange-900 shadow-sm ring-1 ring-inset ring-orange-300 placeholder:text-orange-400 focus:ring-2 focus:ring-inset focus:ring-custom-peach sm:text-sm sm:leading-6"
                  />
                  <span v-if="errors.postalCode" class="text-red-500 text-sm">{{ errors.postalCode }}</span>
                </div>
              </div>

              <div class="sm:col-span-3">
                <div class="flex items-center">
                  <input
                    id="sms"
                    name="sms"
                    type="checkbox"
                    v-model="form.notifications.sms"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label for="sms" class="ml-2 block text-sm font-medium leading-6 text-orange-900"
                    >Receive SMS notifications</label
                  >
                </div>
              </div>

              <div class="sm:col-span-3">
                <div class="flex items-center">
                  <input
                    id="emailNotifications"
                    name="emailNotifications"
                    type="checkbox"
                    v-model="form.notifications.email"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label for="emailNotifications" class="ml-2 block text-sm font-medium leading-6 text-orange-900"
                    >Receive Email notifications</label
                  >
                </div>
              </div>
            </div>
          </div>

          <div class="mt-8 flex justify-center gap-x-4">
            <router-link to="/portal/homeview" class="inline-flex justify-center rounded-md border border-transparent bg-gray-600 px-6 py-3 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 sm:text-sm md-2" role="menuitem">Cancel</router-link>
            <button
              type="submit"
              class="flex justify-center rounded-md border border-transparent bg-orange-600 px-6 py-3 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 sm:text-sm"
              @submit.prevent="handleSubmit"
            >
              Register
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
