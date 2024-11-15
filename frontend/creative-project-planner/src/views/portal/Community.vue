<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import crochetingImage from '@/assets/crocheting.png';
import paintingImage from '@/assets/painting.png';
import muralPaintingImage from '@/assets/mural-painter.png';
import chairMakingImage from '@/assets/chair-making.png';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  comments: string[];
  likes: number;
}

export default defineComponent({
  name: 'Projects',
  setup() {
    const isOpen = ref(false);
    const newComments = ref<{ [key: number]: string }>({});
    const newMessage = ref('');
    const feedMessages = ref<{ user: string; text: string }[]>([]);

    const projects = ref<Project[]>([
      {
        id: 1,
        title: 'Crocheted Top',
        description: 'This project involves creating a stylish crocheted top for men. It is designed to be both comfortable and fashionable, suitable for various occasions. The project is expected to take approximately 2 weeks to complete, with a budget of around 15,000 Malawi Kwacha.',
        image: crochetingImage,
        comments: [],
        likes: 0
      },
      {
        id: 2,
        title: 'Home Painting',
        description: 'This project involves painting the interior of a home with a fresh and vibrant color scheme. The project will use a combination of soft blues and warm whites to create a calming and inviting atmosphere. It is expected to take approximately 1 week to complete, with a budget of around 25,000 Malawi Kwacha.',
        image: paintingImage,
        comments: [],
        likes: 0
      },
      {
        id: 3,
        title: 'Mural Painting',
        description: 'This project involves creating a large-scale mural on the side of a community building. The mural will depict scenes of local culture and history, incorporating vibrant colors and dynamic compositions to engage viewers. The project is expected to take approximately 3 weeks to complete, with a budget of around 50,000 Malawi Kwacha.',
        image: muralPaintingImage,
        comments: [],
        likes: 0
      },
      {
        id: 4,
        title: 'Making Chairs',
        description: 'This project involves crafting custom-made wooden chairs. The process includes designing, cutting, assembling, and finishing the chairs. The project is expected to take approximately 2 weeks to complete, with a budget of around 30,000 Malawi Kwacha.',
        image: chairMakingImage,
        comments: [],
        likes: 0
      }
    ]);

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

    function shareOnSocial(platform: string, project: { title: string }) {
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

    function addComment(projectId: number, comment: string) {
      const project = projects.value.find(p => p.id === projectId);
      if (project && comment.trim()) {
        project.comments.push(comment);
        newComments.value[projectId] = '';  // Clear input for that specific project after posting
      }
    }

    function likeProject(projectId: number) {
      const project = projects.value.find(p => p.id === projectId);
      if (project) {
        project.likes++;
      }
    }

    function sendMessage() {
      if (newMessage.value.trim()) {
        feedMessages.value.push({ user: 'You', text: newMessage.value });
        newMessage.value = ''; // Clear the message input
      }
    }

    return {
      isOpen,
      projects,
      routes,
      newComments,
      toggleDropdown,
      router,
      logOut,
      shareOnSocial,
      addComment,
      likeProject,
      newMessage,
      feedMessages,
      sendMessage
    };
  }
});
</script>


<template>
  <header class="flex flex-col items-center lg:flex-row lg:items-start lg:pr-4">
    <div class="fixed top-0 right-0 px-4 py-2">
      <router-link to="/login" class="bg-custom-peach text-white px-4 py-2 rounded-lg shadow-md hover:bg-orange-500 hover:underline">Login</router-link>
      <div class="relative inline-block text-left">
        <button @click="toggleDropdown" class="bg-black text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-400 hover:underline focus:outline-none transition-transform duration-200">
          Menu
        </button>
          <div v-if="isOpen" class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
            <ul class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <li>
                <router-link to="/portal/settings" class="text-gray-700 px-4 py-2 hover:bg-gray-100 rounded-lg transition duration-200" role="menuitem">Settings</router-link>
              </li>
              <li>
                <router-link to="/portal/mydashboard" class="text-gray-700 px-4 py-2 hover:bg-gray-100 rounded-lg transition duration-200" role="menuitem">Dashboard</router-link>
              </li>
              <li>
                <button @click="logOut" class="text-gray-700 px-4 py-2 hover:bg-gray-100 rounded-lg transition duration-200" role="menuitem">Logout</button>
              </li>
            </ul>
          </div>
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

  <div class="community-page p-5">
    <h1 class="text-3xl font-bold mb-5 text-center">Community Projects</h1>
    <div class="community-intro mb-5 bg-black bg-opacity-40 border border-gray-300 p-5 rounded-lg text-center">
      <p class="text-lg text-white mb-5">Explore the latest community projects and get inspired to start your own creative endeavor.</p>
      <p class="text-lg text-white mb-5">Share your favorite projects on social media to spread the word and connect with other creatives.</p>
      <p class="text-lg text-white mb-5">Click on a project to view more details and get involved!</p>
    </div>

    <!-- Projects Grid -->
    <div class="container mx-auto mt-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 justify-center">
        <transition-group name="fade" tag="div" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="project in projects" :key="project.id" class="project-card bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105 mt-4">
            <img :src="project.image" alt="Project Image" class="w-full h-48 object-cover">
            <div class="p-4">
              <h2 class="text-xl font-semibold mb-2">{{ project.title }}</h2>
              <p class="text-gray-700 base mb-3">{{ project.description }}</p>
              <div class="flex justify-between">
                <button @click="likeProject(project.id)" class="bg-orange-500 hover:bg-orange-800 text-white px-4 py-2 rounded-lg transform transition-transform duration-200 hover:scale-110">Like</button>
                <span>{{ project.likes }} Likes</span>
              </div>
              <div class="mt-3">
                <input v-model="newComments[project.id]" type="text" placeholder="Add a comment" class="border px-4 py-2 rounded-lg w-full mb-2">
                <button @click="addComment(project.id, newComments[project.id])" class="bg-teal-500 hover:bg-teal-800 text-white px-4 py-2 rounded-lg transform transition-transform hover:scale-105">Post Comment</button>
              </div>
            </div>
            <div v-if="project.comments.length" class="bg-gray-100 p-4">
              <h3 class="font-semibold text-lg">Comments</h3>
              <ul>
                <li v-for="(comment, index) in project.comments" :key="index" class="text-gray-700 mt-2">
                  {{ comment }}
                </li>
              </ul>
            </div>
          </div>
        </transition-group>
      </div>
    </div>

    <!-- Summary and Feed below the projects -->
    <div class="container mx-auto mt-4">
      <div class="bg-white p-4 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Project Summary</h2>
        <p class="text-gray-700 mb-4">
          This section provides an overview of the latest community projects and allows you to interact with others through the live feed. Stay updated with the latest comments and activities!
        </p>

        <h3 class="text-lg font-semibold mb-3">Chat Feed</h3>
        <div class="bg-gray-100 p-2 rounded-lg h-96 overflow-y-auto">
          <div v-for="(message, index) in feedMessages" :key="index" class="mb-3">
            <p class="font-semibold text-gray-800">{{ message.user }}:</p>
            <p class="text-gray-600">{{ message.text }}</p>
          </div>
        </div>

        <div class="mt-4">
          <input v-model="newMessage" type="text" placeholder="Type a message" class="border px-4 py-2 rounded-lg w-full mb-2">
          <button @click="sendMessage" class="bg-black text-white px-4 py-2 rounded-lg w-full hover:bg-orange-600">Send Message</button>
        </div>
      </div>
    </div>
  </div>
</template>
