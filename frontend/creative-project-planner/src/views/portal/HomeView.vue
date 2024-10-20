<script lang="ts">
import { defineComponent } from 'vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'App',
  setup() {
    const isOpen = ref(false);
    const routes = [
      { path: '/portal/homeview', label: 'Home' },
      { path: '/portal/community', label: 'Community' },
      { path: '/portal/mydashboard', label: 'MyDashboard' },
      { path: '/portal/projects', label: 'Projects' },
      // { path: '/portal/settings', label: 'Settings' },
    ];

    function toggleDropdown() {
      isOpen.value = !isOpen.value;
    }
    const router = useRouter();

    function logOut() {
      router.push('/login');
    }

    return {
      isOpen,
      toggleDropdown,
      routes,
      logOut,
    }

  }
});
</script>

<template>
    <header class="flex flex-col items-center lg:flex-row lg:items-start lg:pr-4">
      <div class="fixed top-0 right-0 px-4 py-2">
                        <router-link to="/login" class="bg-custom-peach text-white px-4 py-2 text-white hover:underline rounded-lg shadow-md hover:bg-orange-500">Login</router-link>
                            <div class="relative inline-block text-left">
                                <button @click="toggleDropdown" class="bg-black text-white px-4 py-1 text-white hover:underline rounded-lg shadow-md hover:bg-gray-400 focus:outline-none">
                                    Menu
                                </button>
                                </div>  

                                <div
                                    v-if="isOpen"
                                    class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                                >
                                        <ul class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                        <li>
                                            <router-link to="/portal/settings" class="text-gray-700 px-4 py-2 hover:underline rounded-lg shadow-md hover:bg-gray-100" role="menuitem">Settings</router-link>
                                        </li>
                                        <li>
                                            <router-link to="/portal/mydashboard" class="text-gray-700 px-4 py-2 hover:underline rounded-lg shadow-md hover:bg-gray-100" role="menuitem">Dashboard</router-link>
                                        </li>
                                        <li>
                                            <button @click="logOut" class="text-gray-700 px-4 py-2 hover:underline rounded-lg shadow-md hover:bg-gray-100" role="menuitem">Logout</button>
                                        </li>
                                        </ul>
                        </div>
                </div>
        <div class="flex flex-col items-center lg:flex-row lg:items-start">
        <nav class="mt-8 text-center lg:text-left lg:mt-4 lg:ml-4 rounded-lg shadow-md">
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
        </div>
    </header>

    <div class="container mx-auto mt-8">
        <h1 class="text-4xl font-bold text-center mb-6">Creative Project Planner</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="text-white bg-black bg-opacity-75 p-6 rounded-lg shadow-md">
                <h2 class="text-2xl font-semibold mb-4">Organize Your Ideas</h2>
                <p>Keep all your creative ideas in one place and easily accessible. Never lose track of your thoughts and inspirations.</p>
            </div>
            <div class="text-white bg-black bg-opacity-75 p-6 rounded-lg shadow-md">
                <h2 class="text-2xl font-semibold mb-4">Plan Your Projects</h2>
                <p>Break down your projects into manageable tasks and set deadlines to stay on track. Achieve your goals efficiently.</p>
            </div>
            <div class="text-white bg-black bg-opacity-75 p-6 rounded-lg shadow-md">
                <h2 class="text-2xl font-semibold mb-4">Collaborate with Team</h2>
                <p>Work together with your team seamlessly. Share ideas, assign tasks, and track progress in real-time.</p>
            </div>
        </div>
    </div>

    <div class="container mx-auto mt-2"> 
      <div class="text-black bg-custome-teal bg-opacity-75 rounded-lg shadow-md">
        <h2 class="text-3xl font-bold text-center mt-8">TURN IDEAS INTO ACTION</h2>
        <p class="text-center mt-2">plan, create, & thrive with effortless project management</p>
      </div>
  </div>
    <div>
        <h2 class="text-3xl font-bold text-center mt-8">Get Started Today!</h2>
        <p class="text-center mt-2">Sign up now to start planning your creative projects.</p>
        <div class="flex justify-center mt-4">
            <router-link to="/userRegister" class="bg-custom-peach text-white px-6 py-3 rounded-lg shadow-md hover:bg-orange-500">Create Account</router-link>
        </div>
    </div>
    
    <RouterView />
</template>