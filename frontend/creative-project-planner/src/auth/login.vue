<script setup>
import { Form as VForm, Field as VField, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { ref } from 'vue'

const values = ref({
    email: '',
    password: ''
})

const loginSchema = yup.object({
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup
        .string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()\-_=+{};:,<.>?]{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        )
        .notOneOf(
            ['12345678', 'password', 'qwerty', 'azerty', '12345678'.toUpperCase()],
            'Password must not be too common'
        )
})

const registrationSchema = yup.object({
    username: yup.string().required('Username is required'),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup
        .string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()\-_=+{};:,<.>?]{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        )
        .notOneOf(
            ['12345678', 'password', 'qwerty', 'azerty', '12345678'.toUpperCase()],
            'Password must not be too common'
        ),
    about: yup.string().max(500, 'About field must be less than 500 characters')
})

const onSubmit = (values) => {
    console.log('Form Submitted!', values)
}
</script>

<template>
  <div class="flex min-h-full flex-1">
    <div class="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <img class="h-14 w-auto" src="@/assets/cpp-logo.png"
            alt="Your Company" />
          <h2 class="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          <p class="mt-2 text-sm leading-6 text-gray-500">
            Do not have an account?
            <router-link to="/auth/register" class="font-semibold text-indigo-600 hover:text-indigo-500">
              Create Account
            </router-link>
          </p>
        </div>

        <div class="mt-10">
          <div>
            <VForm v-slot="{ errors }" :validation-schema="loginSchema" @submit="onSubmit">
              <div class="mb-4">
                <label for="email" class="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div class="mt-1">
                  <VField id="email" name="email" type="email"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    :class="{ 'border-red-500': errors.email }" />
                  <ErrorMessage name="email" class="text-red-600 text-sm bg-red-100 px-3 py-2 rounded mt-2" />
                </div>
              </div>

              <div class="mb-4">
                <label for="password" class="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div class="mt-1">
                  <VField id="password" name="password" type="password"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    :class="{ 'border-red-500': errors.password }" />
                  <ErrorMessage name="password" class="text-red-600 text-sm bg-red-100 px-3 py-2 rounded mt-2" />
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div class="text-sm">
                  <router-link to="/auth/forgot-password/email"
                    class="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </router-link>
                </div>
              </div>

              <div class="mt-6">
                <button type="submit"
                  class="w-full px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-semibold shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Sign in
                </button>
              </div>
            </VForm>
          </div>
        </div>
      </div>
    </div>
    <div class="hidden lg:block relative w-0 flex-1">
      <img class="absolute inset-0 h-full w-full object-cover"
        src=""
        alt="" />
    </div>
  </div>
</template>
