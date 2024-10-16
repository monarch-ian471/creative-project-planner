<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="flex flex-col items-center lg:flex-row lg:items-start lg:pr-8">
    <img alt="Vue logo" class="w-32 h-32 mb-8 lg:mb-0 lg:mr-8" src="@/assets/cpp-logo.svg" />

    <div class="flex flex-col items-center lg:flex-row lg:items-start">
      <HelloWorld msg="You did it!" />

      <nav class="mt-8 text-center lg:text-left lg:mt-4 lg:ml-4">
        <RouterLink to="/" class="inline-block px-4 py-2 border-l border-gray-300 first:border-0"></RouterLink>
        <RouterLink to="/about" class="inline-block px-4 py-2 border-l border-gray-300">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>
