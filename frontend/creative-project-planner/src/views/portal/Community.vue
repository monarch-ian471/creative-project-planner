<script lang="ts">
export default {
    data() {
        return {
            projects: [
                {
                    id: 1,
                    title: 'Project One',
                    description: 'A brief description of project one.',
                    image: 'path/to/image1.jpg'
                },
                {
                    id: 2,
                    title: 'Project Two',
                    description: 'A brief description of project two.',
                    image: 'path/to/image2.jpg'
                },
                {
                    id: 3,
                    title: 'Project Three',
                    description: 'A brief description of project three.',
                    image: 'path/to/image3.jpg'
                },
                {
                    id: 4,
                    title: 'Project Four',
                    description: 'A brief description of project four.',
                    image: 'path/to/image4.jpg'
                }
            ],
            routes: [
                { path: '/portal/homeview', label: 'Home' },
                { path: '/portal/community', label: 'Community' },
                { path: '/portal/mydashboard', label: 'MyDashboard' },
                { path: '/portal/projects', label: 'Projects' },
                { path: '/portal/settings', label: 'Settings' },
            ],
        };
    },
    methods: {
        shareOnSocial(platform, project) {
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
};
</script>

<template>
    <header class="flex flex-col items-center lg:flex-row lg:items-start lg:pr-4">
        <div class="fixed top-0 right-0 px-4 py-2">
            <router-link to="/login" class="bg-custom-peach text-white px-4 py-1 text-white hover:underline rounded-lg shadow-md hover:bg-orange-500">Login</router-link>
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
        <h1 class="text-3xl font-bold mb-5">Community Projects</h1>
        <div class="projects-grid grid grid-cols-2 gap-5">
            <div class="project-card border border-gray-300 p-5 rounded-lg text-center" v-for="project in projects" :key="project.id">
                <img :src="project.image" alt="Project Image" class="project-image w-full h-auto rounded-lg" />
                <div class="project-info mt-3">
                    <h2 class="text-xl font-semibold">{{ project.title }}</h2>
                    <p class="mt-2">{{ project.description }}</p>
                    <div class="social-share mt-3">
                        <button @click="shareOnSocial('facebook', project)" class="bg-custom-peach text-white px-3 py-1 rounded mr-2 hover:bg-orange-400">Share on Facebook</button>
                        <button @click="shareOnSocial('twitter', project)" class="bg-custom-peach text-white px-3 py-1 rounded hover:bg-orange-400">Share on Twitter</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

