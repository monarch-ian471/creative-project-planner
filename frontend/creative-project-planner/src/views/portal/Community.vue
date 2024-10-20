<script lang="ts">
import { defineComponent } from 'vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import crochetingImage from '@/assets/crocheting.png';
import paintingImage from '@/assets/painting.png';
import muralPaintingImage from '@/assets/mural-painter.png';
import chairMakingImage from '@/assets/chair-making.png';

export default defineComponent({
  name: 'Projects',
  setup() {
    const isOpen = ref(false);

    const projects = [
      {
        id: 1,
        title: 'Crochetted Top',
        description: 'This project involves creating a stylish crochetted top for men. It is designed to be both comfortable and fashionable, suitable for various occasions. The project is expected to take approximately 2 weeks to complete, with a budget of around 15,000 Malawi Kwacha..',
        image: crochetingImage
      },
      {
        id: 2,
        title: 'Home Painting',
        description: 'This project involves painting the interior of a home with a fresh and vibrant color scheme. The project will use a combination of soft blues and warm whites to create a calming and inviting atmosphere. It is expected to take approximately 1 week to complete, with a budget of around 25,000 Malawi Kwacha..',
        image: paintingImage
      },
      {
        id: 3,
        title: 'Mural Painting',
        description: 'This project involves creating a large-scale mural on the side of a community building. The mural will depict scenes of local culture and history, incorporating vibrant colors and dynamic compositions to engage viewers. The project is expected to take approximately 3 weeks to complete, with a budget of around 50,000 Malawi Kwacha. Themes for the mural include unity, progress, and the beauty of the local landscape..',
        image: muralPaintingImage
      },
      {
        id: 4,
        title: 'Making Chairs',
        description: '. This project involves crafting custom-made wooden chairs. The process includes designing, cutting, assembling, and finishing the chairs. The project is expected to take approximately 2 weeks to complete, with a budget of around 30,000 Malawi Kwacha. Resources required include high-quality wood (15,000 MWK), nails and screws (5,000 MWK), wood glue (2,000 MWK), and paint and coating materials (8,000 MWK). The types of paint and coating used will be a combination of wood primer, acrylic paint, and a clear varnish to ensure durability and a polished finish..',
        image: chairMakingImage
      }
    ];
    const routes = [
      { path: '/portal/homeview', label: 'Home' },
      { path: '/portal/community', label: 'Community' },
      { path: '/portal/mydashboard', label: 'MyDashboard' },
      { path: '/portal/projects', label: 'Projects' },
    ];
    const router = useRouter();

    function toggleDropdown() {
      isOpen.value = !isOpen.value;
    }

    function logOut() {
      router.push('/login');
    }

    return {
      isOpen,
      projects,
      routes,
      toggleDropdown,
      router,
      logOut,
    };
  },
  methods: {
    shareOnSocial(platform: string, project: { title: string }) {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(`Check out this project: ${project.title}`);
      let shareUrl = '';

      if (platform === 'facebook') {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
      } else if (platform === 'twitter') {
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
      }

      window.open(shareUrl, '_blank');
    }
  }
});
</script>

<template>
    <header class="flex flex-col items-center lg:flex-row lg:items-start lg:pr-4">
        <div class="fixed top-0 right-0 px-4 py-2">
            <router-link to="/login" class="bg-custom-peach text-white px-4 py-2 text-white hover:underline rounded-lg shadow-md hover:bg-orange-500">Login</router-link>
            <div class="relative inline-block text-left">
                                <button @click="toggleDropdown" class="bg-black text-white px-4 py-2 text-white hover:underline rounded-lg shadow-md hover:bg-gray-400 focus:outline-none">
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

    <div class="community-page p-5">
        <h1 class="text-3xl font-bold mb-5 text-center">Community Projects</h1>
        <div class="community-intro mb-5 bg-black bg-opacity-40 border border-gray-300 p-5 rounded-lg text-center">
            <p class="text-lg text-white mb-5">Explore the latest community projects and get inspired to start your own creative endeavor.</p>
            <p class="text-lg text-white mb-5">Share your favorite projects on social media to spread the word and connect with other creatives.</p>
            <p class="text-lg text-white mb-5">Click on a project to view more details and get involved!</p>
        </div>
        <div class="projects-grid grid grid-cols-2 gap-5">
            <div class="project-card bg-black bg-opacity-40 border border-gray-300 p-5 rounded-lg text-center hover:bg-gray-900" v-for="project in projects" :key="project.id">
                <img :src="project.image" alt="Project Image" class="project-image w-full h-auto rounded-lg" />
                <div class="project-info mt-3">
                    <h2 class="text-xl text-white font-semibold">{{ project.title }}</h2>
                    <p class="mt-2 text-white">{{ project.description }}</p>
                    <div class="social-share mt-3">
                        <button @click="shareOnSocial('facebook', project)" class="bg-custom-peach text-white px-3 py-1 rounded mr-2 hover:bg-orange-400">Share on Facebook</button>
                        <button @click="shareOnSocial('twitter', project)" class="bg-custom-peach text-white px-3 py-1 rounded hover:bg-orange-400">Share on Twitter</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

