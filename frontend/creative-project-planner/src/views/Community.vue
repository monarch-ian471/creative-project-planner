<template>
    <div class="community-page p-5">
        <h1 class="text-3xl font-bold mb-5">Community Projects</h1>
        <div class="projects-grid grid grid-cols-2 gap-5">
            <div class="project-card border border-gray-300 p-5 rounded-lg text-center" v-for="project in projects" :key="project.id">
                <img :src="project.image" alt="Project Image" class="project-image w-full h-auto rounded-lg" />
                <div class="project-info mt-3">
                    <h2 class="text-xl font-semibold">{{ project.title }}</h2>
                    <p class="mt-2">{{ project.description }}</p>
                    <div class="social-share mt-3">
                        <button @click="shareOnSocial('facebook', project)" class="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600">Share on Facebook</button>
                        <button @click="shareOnSocial('twitter', project)" class="bg-blue-400 text-white px-3 py-1 rounded hover:bg-blue-500">Share on Twitter</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
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
            ]
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

