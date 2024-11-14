<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'App',
  setup() {
    // State to handle dropdown visibility
    const isOpen = ref(false);

    // Define routes for navigation
    const routes = [
      { path: '/portal/homeview', label: 'Home' },
      { path: '/portal/community', label: 'Community' },
      { path: '/portal/mydashboard', label: 'MyDashboard' },
      { path: '/portal/projects', label: 'Projects' },
    ];

    // Toggle dropdown visibility
    const toggleDropdown = () => {
      isOpen.value = !isOpen.value;
    };

    // Handle logout functionality
    const router = useRouter();
    const logOut = () => {
      router.push('/login');
    };

    // Define an array of FAQs with questions and answers
    const faqs = ref([
      {
        question: "What is a Creative Project Planner?",
        answer: "Creative Project Planner is a tool designed to help you organize, plan, and collaborate on your creative projects. It provides features to keep track of your ideas, break down projects into tasks, and work seamlessly with your team.",
      },
      {
        question: "How do I get started?",
        answer: "To get started, simply sign up for an account by clicking on the 'Create Account' button on the home page. Once registered, you can start planning your projects and collaborating with your team.",
      },
      {
        question: "Can I collaborate with others?",
        answer: "Yes, Creative Project Planner allows you to collaborate with your team members. You can share ideas, assign tasks, and track progress in real-time to ensure everyone is on the same page.",
      },
      {
        question: "Is there a mobile app available?",
        answer: "Currently, Creative Project Planner is available as a web application. We are working on developing a mobile app to provide you with more flexibility and convenience.",
      },
    ]);

    return {
      isOpen,
      toggleDropdown,
      routes,
      logOut,
      faqs,
    };
  },
});
</script>

<template>
  <header class="flex flex-col items-center lg:flex-row lg:items-start lg:pr-4">
    <div class="fixed top-0 right-0 px-4 py-2">
      <!-- Login Button -->
      <router-link to="/login" class="bg-custom-peach text-white px-4 py-2 rounded-lg shadow-md hover:bg-orange-500">Login</router-link>
      
      <!-- Dropdown Menu Button -->
      <div class="relative inline-block text-left">
        <button @click="toggleDropdown" class="bg-black text-white px-4 py-1 rounded-lg shadow-md hover:bg-gray-400 focus:outline-none">
          Menu
        </button>
      </div>

      <!-- Dropdown Menu -->
      <div v-if="isOpen" class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
        <ul class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
          <li><router-link to="/portal/settings" class="text-gray-700 px-4 py-2 hover:bg-gray-100" role="menuitem">Settings</router-link></li>
          <li><router-link to="/portal/mydashboard" class="text-gray-700 px-4 py-2 hover:bg-gray-100" role="menuitem">Dashboard</router-link></li>
          <li><button @click="logOut" class="text-gray-700 px-4 py-2 hover:bg-gray-100" role="menuitem">Logout</button></li>
        </ul>
      </div>
    </div>

    <!-- Navigation Links -->
    <nav class="mt-8 text-center lg:text-left lg:mt-4 lg:ml-4">
      <router-link
        v-for="route in routes"
        :key="route.path"
        :to="route.path"
        class="inline-block px-4 py-2 border-l border-gray-300 first:border-0 hover:bg-orange-500"
        :aria-label="route.label"
      >
        {{ route.label }}
      </router-link>
    </nav>
  </header>

  <!-- Main Content -->
  <div class="container mx-auto mt-8 text-center">
    <h1 class="text-4xl font-bold mb-6 animate-fade-in">Creative Project Planner</h1>
    <p class="text-lg mb-6">Transform your ideas into actionable projects and collaborate seamlessly with your team.</p>
    
    <!-- Interactive Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="text-white bg-black bg-opacity-75 p-6 rounded-lg shadow-md transform hover:scale-105 transition duration-200 hover:bg-gray-900">
        <h2 class="text-2xl font-semibold mb-4">Organize Your Ideas</h2>
        <p>Store all your creative thoughts in one place. Capture and revisit inspirations anytime.</p>
      </div>
      <div class="text-white bg-black bg-opacity-75 p-6 rounded-lg shadow-md transform hover:scale-105 transition duration-200 hover:bg-gray-900">
        <h2 class="text-2xl font-semibold mb-4">Plan Your Projects</h2>
        <p>Structure projects with clear tasks and deadlines to stay organized and motivated.</p>
      </div>
      <div class="text-white bg-black bg-opacity-75 p-6 rounded-lg shadow-md transform hover:scale-105 transition duration-200 hover:bg-gray-900">
        <h2 class="text-2xl font-semibold mb-4">Collaborate with Team</h2>
        <p>Share and track progress, assign roles, and keep communication transparent.</p>
      </div>
    </div>
  </div>

  <!-- Bottom Banner -->
  <div class="container mx-auto mt-12 mb-8 p-8 bg-teal-600 rounded-lg text-center text-white shadow-lg transform hover:scale-105 transition duration-200">
    <h2 class="text-3xl font-bold mb-4">Turn Ideas into Action!</h2>
    <p class="text-lg mb-4">Plan, create, and thrive with efficient project management.</p>
    <router-link to="/userRegister" class="bg-black px-6 py-3 rounded-lg shadow-md hover:bg-orange-500">Get Started Today</router-link>
  </div>

  <!-- Community Section -->
  <div class="container mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="category text-white bg-black bg-opacity-75 p-5 rounded-lg text-center flex flex-col md:flex-row shadow-md transform hover:scale-105 transition duration-200">
      <img src="@/assets/community-1.png" alt="Community Projects" class="w-full md:w-1/2 rounded-lg mb-4 md:mr-4 object-cover max-w-full">
      <div class="flex flex-col justify-center">
        <h3 class="text-2xl mb-3">Community Projects</h3>
        <p class="text-lg mb-3">Explore trending community projects and start your own.</p>
        <p class="text-lg mb-3">Engage with peers and collaborate on creative endeavors.</p>
      </div>
    </div>
    <div class="category text-white bg-black bg-opacity-75 p-5 rounded-lg text-center flex flex-col md:flex-row shadow-md transform hover:scale-105 transition duration-200">
      <img src="@/assets/featured-1.png" alt="Featured Projects" class="w-full md:w-1/2 rounded-lg mb-4 md:mr-4 object-cover max-w-full">
      <div class="flex flex-col justify-center">
        <h3 class="text-2xl mb-3">Featured Projects</h3>
        <p class="text-lg mb-3">Discover inspiring projects from around the world.</p>
        <p class="text-lg mb-3">Share your ideas and connect with a vibrant community.</p>
      </div>
    </div>
  </div>

  <!-- FAQ Section -->
  <div class="container mx-auto mt-8">
    <h2 class="text-3xl font-bold text-center mb-6">Frequently Asked Questions</h2>
    <div v-for="faq in faqs" :key="faq.question" class="faq-item text-white bg-black bg-opacity-75 p-6 mb-4 rounded-lg shadow-md">
      <h3 class="text-2xl font-semibold mb-3">{{ faq.question }}</h3>
      <p class="text-lg">{{ faq.answer }}</p>
    </div>
  </div>
</template>
