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

  if (!isAuthenticated.value) {
    router.push('/login');
    return;
  }

  if (validateForm()) {
    try {
      // Send form data to backend for registration
      await registerUser({
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        email: form.value.email,
        phone: form.value.phone,
        country: form.value.country,
        streetAddress: form.value.streetAddress,
        city: form.value.city,
        region: form.value.region,
        postalCode: form.value.postalCode,
        password: form.value.password, // Include password field
        notifications: {
          sms: form.value.notifications.sms,
          email: form.value.notifications.email,
        },
      });

      // Redirect on success
      await router.push('/login');
    } catch (error) {
      console.error('Error registering user:', error);
    }
  }
};

export default {
  setup() {
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
        @submit="handleSubmit"
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
                    class="block w-full rounded-md border-0 py-1.5 text-orange-900 shadow-sm ring-1 ring-inset ring-orange-300 focus:ring-2 focus:ring-inset focus:ring-custom-peach sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option>Malawi</option>
                    <option>Zambia</option>
                    <option>Tanzania</option>
                  </select>
                  <span v-if="errors.country" class="text-red-500 text-sm">{{ errors.country }}</span>
                </div>
              </div>

              <div class="col-span-full">
                <label
                  for="street-address"
                  class="block text-sm font-medium leading-6 text-orange-900"
                  >Street address</label
                >
                <div class="mt-2">
                  <input
                    type="text"
                    name="street-address"
                    id="street-address"
                    autocomplete="street-address"
                    v-model="form.streetAddress"
                    class="block w-full rounded-md border-0 py-1.5 text-orange-900 shadow-sm ring-1 ring-inset ring-orange-300 placeholder:text-orange-400 focus:ring-2 focus:ring-inset focus:ring-custom-peach sm:text-sm sm:leading-6"
                  />
                  <span v-if="errors.streetAddress" class="text-red-500 text-sm">{{ errors.streetAddress }}</span>
                </div>
              </div>

              <div class="sm:col-span-2 sm:col-start-1">
                <label for="city" class="block text-sm font-medium leading-6 text-orange-900"
                  >City</label
                >
                <div class="mt-2">
                  <input
                    type="text"
                    name="city"
                    id="city"
                    autocomplete="address-level2"
                    v-model="form.city"
                    class="block w-full rounded-md border-0 py-1.5 text-orange-900 shadow-sm ring-1 ring-inset ring-orange-300 placeholder:text-orange-400 focus:ring-2 focus:ring-inset focus:ring-custom-peach sm:text-sm sm:leading-6"
                  />
                  <span v-if="errors.city" class="text-red-500 text-sm">{{ errors.city }}</span>
                </div>
              </div>

              <div class="sm:col-span-2">
                <label for="region" class="block text-sm font-medium leading-6 text-orange-900"
                  >State / Province</label
                >
                <div class="mt-2">
                  <input
                    type="text"
                    name="region"
                    id="region"
                    autocomplete="address-level1"
                    v-model="form.region"
                    class="block w-full rounded-md border-0 py-1.5 text-orange-900 shadow-sm ring-1 ring-inset ring-orange-300 placeholder:text-orange-400 focus:ring-2 focus:ring-inset focus:ring-custom-peach sm:text-sm sm:leading-6"
                  />
                  <span v-if="errors.region" class="text-red-500 text-sm">{{ errors.region }}</span>
                </div>
              </div>

              <div class="sm:col-span-2">
                <label for="postal-code" class="block text-sm font-medium leading-6 text-orange-900"
                  >ZIP / Postal code</label
                >
                <div class="mt-2">
                  <input
                    type="text"
                    name="postal-code"
                    id="postal-code"
                    autocomplete="postal-code"
                    v-model="form.postalCode"
                    class="block w-full rounded-md border-0 py-1.5 text-orange-900 shadow-sm ring-1 ring-inset ring-orange-300 placeholder:text-orange-400 focus:ring-2 focus:ring-inset focus:ring-custom-peach sm:text-sm sm:leading-6"
                  />
                  <span v-if="errors.postalCode" class="text-red-500 text-sm">{{ errors.postalCode }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="pb-12">
            <h2 class="text-xl font-semibold leading-7 text-orange-900">Notifications</h2>
            <p class="mt-1 text-sm leading-6 text-orange-600">
              Chose basic communication preferences.
            </p>

            <div class="mt-8 space-y-10">
              <fieldset>
                <div class="space-y-6">
                  <div class="relative flex gap-x-3">
                    <div class="flex h-6 items-center">
                      <input
                        id="sms"
                        name="sms"
                        type="checkbox"
                        v-model="form.notifications.sms"
                        class="h-4 w-4 rounded border-orange-300 text-orange-400 focus:ring-custom-peach"
                      />
                    </div>
                    <div class="text-sm leading-6">
                      <label for="sms" class="font-medium text-orange-900">SMS</label>
                      <p class="text-orange-500">
                        Get notified by SMS
                      </p>
                    </div>
                  </div>
                  <div class="relative flex gap-x-3">
                    <div class="flex h-6 items-center">
                      <input
                        id="email"
                        name="email"
                        type="checkbox"
                        v-model="form.notifications.email"
                        class="h-4 w-4 rounded border-orange-300 text-orange-400 focus:ring-custom-peach"
                      />
                    </div>
                    <div class="text-sm leading-6">
                      <label for="email" class="font-medium text-orange-900">Email</label>
                      <p class="text-orange-500">Get notified by email.</p>
                    </div>
                  </div>
                  
                </div>
              </fieldset>
           
            </div>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-end gap-x-6">
          <button type="reset" class="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-orange"> <a href="/portal/homeview">Cancel</a></button>
          <button
            type="submit"
            class="rounded-md bg-custom-peach px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  </div>
</template>