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
      projects,
      newComments,
      shareOnSocial,
      addComment,
      likeProject,
      newMessage,
      feedMessages,
      sendMessage
    };
  }
});

// import { ref } from 'vue'
// import { CheckCircleIcon } from '@heroicons/vue/24/solid'
// import {
//   FaceFrownIcon,
//   FaceSmileIcon,
//   FireIcon,
//   HandThumbUpIcon,
//   HeartIcon,
//   PaperClipIcon,
//   XMarkIcon,
// } from '@heroicons/vue/20/solid'
// import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'

// const activity = [
//   { id: 1, type: 'created', person: { name: 'Chelsea Hagon' }, date: '7d ago', dateTime: '2023-01-23T10:32' },
//   { id: 2, type: 'edited', person: { name: 'Chelsea Hagon' }, date: '6d ago', dateTime: '2023-01-23T11:03' },
//   { id: 3, type: 'sent', person: { name: 'Chelsea Hagon' }, date: '6d ago', dateTime: '2023-01-23T11:24' },
//   {
//     id: 4,
//     type: 'commented',
//     person: {
//       name: 'Chelsea Hagon',
//       imageUrl:
//         'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
//     },
//     comment: 'Called client, they reassured me the invoice would be paid by the 25th.',
//     date: '3d ago',
//     dateTime: '2023-01-23T15:56',
//   },
//   { id: 5, type: 'viewed', person: { name: 'Alex Curren' }, date: '2d ago', dateTime: '2023-01-24T09:12' },
//   { id: 6, type: 'paid', person: { name: 'Alex Curren' }, date: '1d ago', dateTime: '2023-01-24T09:20' },
// ]
// const moods = [
//   { name: 'Excited', value: 'excited', icon: FireIcon, iconColor: 'text-white', bgColor: 'bg-red-500' },
//   { name: 'Loved', value: 'loved', icon: HeartIcon, iconColor: 'text-white', bgColor: 'bg-pink-400' },
//   { name: 'Happy', value: 'happy', icon: FaceSmileIcon, iconColor: 'text-white', bgColor: 'bg-green-400' },
//   { name: 'Sad', value: 'sad', icon: FaceFrownIcon, iconColor: 'text-white', bgColor: 'bg-yellow-400' },
//   { name: 'Thumbsy', value: 'thumbsy', icon: HandThumbUpIcon, iconColor: 'text-white', bgColor: 'bg-blue-500' },
//   { name: 'I feel nothing', value: null, icon: XMarkIcon, iconColor: 'text-gray-400', bgColor: 'bg-transparent' },
// ]

// const selected = ref(moods[5])
</script>


<template>
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

<!-- <ul role="list" class="space-y-6">
  <li v-for="(activityItem, activityItemIdx) in activity" :key="activityItem.id" class="relative flex gap-x-4">
    <div :class="[activityItemIdx === activity.length - 1 ? 'h-6' : '-bottom-6', 'absolute left-0 top-0 flex w-6 justify-center']">
      <div class="w-px bg-gray-200" />
    </div>
    <template v-if="activityItem.type === 'commented'">
      <img :src="activityItem.person.imageUrl" alt="" class="relative mt-3 size-6 flex-none rounded-full bg-gray-50" />
      <div class="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
        <div class="flex justify-between gap-x-4">
          <div class="py-0.5 text-xs/5 text-gray-500">
            <span class="font-medium text-gray-900">{{ activityItem.person.name }}</span> commented
          </div>
          <time :datetime="activityItem.dateTime" class="flex-none py-0.5 text-xs/5 text-gray-500">{{ activityItem.date }}</time>
        </div>
        <p class="text-sm/6 text-gray-500">{{ activityItem.comment }}</p>
      </div>
    </template>
    <template v-else>
      <div class="relative flex size-6 flex-none items-center justify-center bg-white">
        <CheckCircleIcon v-if="activityItem.type === 'paid'" class="size-6 text-indigo-600" aria-hidden="true" />
        <div v-else class="size-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
      </div>
      <p class="flex-auto py-0.5 text-xs/5 text-gray-500">
        <span class="font-medium text-gray-900">{{ activityItem.person.name }}</span> {{ activityItem.type }} the invoice.
      </p>
      <time :datetime="activityItem.dateTime" class="flex-none py-0.5 text-xs/5 text-gray-500">{{ activityItem.date }}</time>
    </template>
  </li>
</ul>

<!-- New comment form -->
<!-- <div class="mt-6 flex gap-x-3"> -->
  <!-- <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" class="size-6 flex-none rounded-full bg-gray-50" />
  <form action="#" class="relative flex-auto">
    <div class="overflow-hidden rounded-lg pb-12 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
      <label for="comment" class="sr-only">Add your comment</label>
      <textarea rows="2" name="comment" id="comment" class="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm/6" placeholder="Add your comment..." />
    </div>

    <div class="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
      <div class="flex items-center space-x-5">
        <div class="flex items-center">
          <button type="button" class="-m-2.5 flex size-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500">
            <PaperClipIcon class="size-5" aria-hidden="true" />
            <span class="sr-only">Attach a file</span>
          </button>
        </div>
        <div class="flex items-center">
          <Listbox as="div" v-model="selected">
            <ListboxLabel class="sr-only">Your mood</ListboxLabel>
            <div class="relative">
              <ListboxButton class="relative -m-2.5 flex size-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500">
                <span class="flex items-center justify-center">
                  <span v-if="selected.value === null">
                    <FaceSmileIcon class="size-5 shrink-0" aria-hidden="true" />
                    <span class="sr-only">Add your mood</span>
                  </span>
                  <span v-if="!(selected.value === null)">
                    <span :class="[selected.bgColor, 'flex size-8 items-center justify-center rounded-full']">
                      <component :is="selected.icon" class="size-5 shrink-0 text-white" aria-hidden="true" />
                    </span>
                    <span class="sr-only">{{ selected.name }}</span>
                  </span>
                </span>
              </ListboxButton>

              <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
                <ListboxOptions class="absolute bottom-10 z-10 -ml-6 w-60 rounded-lg bg-white py-3 text-base shadow ring-1 ring-black/5 focus:outline-none sm:ml-auto sm:w-64 sm:text-sm">
                  <ListboxOption as="template" v-for="mood in moods" :key="mood.value" :value="mood" v-slot="{ active }">
                    <li :class="[active ? 'bg-gray-100' : 'bg-white', 'relative cursor-default select-none px-3 py-2']">
                      <div class="flex items-center">
                        <div :class="[mood.bgColor, 'flex size-8 items-center justify-center rounded-full']">
                          <component :is="mood.icon" :class="[mood.iconColor, 'size-5 shrink-0']" aria-hidden="true" />
                        </div>
                        <span class="ml-3 block truncate font-medium">{{ mood.name }}</span>
                      </div>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>
        </div>
      </div>
      <button type="submit" class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Comment</button>
    </div>
  </form>
</div> --> 

<!-- 
// tailwind.config.js
module.exports = {
  // ...
  plugins: [
    // ...
    require('@tailwindcss/forms'), -->


    <!-- <template>
      <div class="bg-white">
        <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 class="sr-only">Products</h2>
    
          <div class="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
            <div v-for="product in products" :key="product.id" class="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
              <img :src="product.imageSrc" :alt="product.imageAlt" class="aspect-[3/4] w-full bg-gray-200 object-cover group-hover:opacity-75 sm:aspect-auto sm:h-96" />
              <div class="flex flex-1 flex-col space-y-2 p-4">
                <h3 class="text-sm font-medium text-gray-900">
                  <a :href="product.href">
                    <span aria-hidden="true" class="absolute inset-0" />
                    {{ product.name }}
                  </a>
                </h3>
                <p class="text-sm text-gray-500">{{ product.description }}</p>
                <div class="flex flex-1 flex-col justify-end">
                  <p class="text-sm italic text-gray-500">{{ product.options }}</p>
                  <p class="text-base font-medium text-gray-900">{{ product.price }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <script setup>
    const products = [
      {
        id: 1,
        name: 'Basic Tee 8-Pack',
        href: '#',
        price: '$256',
        description: 'Get the full lineup of our Basic Tees. Have a fresh shirt all week, and an extra for laundry day.',
        options: '8 colors',
        imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/category-page-02-image-card-01.jpg',
        imageAlt: 'Eight shirts arranged on table in black, olive, grey, blue, white, red, mustard, and green.',
      },
      {
        id: 2,
        name: 'Basic Tee',
        href: '#',
        price: '$32',
        description: 'Look like a visionary CEO and wear the same black t-shirt every day.',
        options: 'Black',
        imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/category-page-02-image-card-02.jpg',
        imageAlt: 'Front of plain black t-shirt.',
      },
      // More products...
    ]
    </script> -->

    <!-- <template>
      <div class="bg-white">
        <div class="mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">

          <div class="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">

            <div class="lg:col-span-4 lg:row-end-1">
              <img :src="product.imageSrc" :alt="product.imageAlt" class="aspect-[4/3] w-full rounded-lg bg-gray-100 object-cover" />
            </div>
    

            <div class="mx-auto mt-14 max-w-2xl sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none">
              <div class="flex flex-col-reverse">
                <div class="mt-4">
                  <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{{ product.name }}</h1>
    
                  <h2 id="information-heading" class="sr-only">Product information</h2>
                  <p class="mt-2 text-sm text-gray-500">
                    Version {{ product.version.name }} (Updated <time :datetime="product.version.datetime">{{ product.version.date }}</time
                    >)
                  </p>
                </div>
    
                <div>
                  <h3 class="sr-only">Reviews</h3>
                  <div class="flex items-center">
                    <StarIcon v-for="rating in [0, 1, 2, 3, 4]" :key="rating" :class="[reviews.average > rating ? 'text-yellow-400' : 'text-gray-300', 'size-5 shrink-0']" aria-hidden="true" />
                  </div>
                  <p class="sr-only">{{ reviews.average }} out of 5 stars</p>
                </div>
              </div>
    
              <p class="mt-6 text-gray-500">{{ product.description }}</p>
    
              <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <button type="button" class="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">Pay {{ product.price }}</button>
                <button type="button" class="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-50 px-8 py-3 text-base font-medium text-indigo-700 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">Preview</button>
              </div>
    
              <div class="mt-10 border-t border-gray-200 pt-10">
                <h3 class="text-sm font-medium text-gray-900">Highlights</h3>
                <div class="mt-4">
                  <ul role="list" class="list-disc space-y-1 pl-5 text-sm/6 text-gray-500 marker:text-gray-300">
                    <li v-for="highlight in product.highlights" :key="highlight" class="pl-2">{{ highlight }}</li>
                  </ul>
                </div>
              </div>
    
              <div class="mt-10 border-t border-gray-200 pt-10">
                <h3 class="text-sm font-medium text-gray-900">License</h3>
                <p class="mt-4 text-sm text-gray-500">{{ license.summary }} <a :href="license.href" class="font-medium text-indigo-600 hover:text-indigo-500">Read full license</a></p>
              </div>
    
              <div class="mt-10 border-t border-gray-200 pt-10">
                <h3 class="text-sm font-medium text-gray-900">Share</h3>
                <ul role="list" class="mt-4 flex items-center space-x-6">
                  <li>
                    <a href="#" class="flex size-6 items-center justify-center text-gray-400 hover:text-gray-500">
                      <span class="sr-only">Share on Facebook</span>
                      <svg class="size-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clip-rule="evenodd" />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="#" class="flex size-6 items-center justify-center text-gray-400 hover:text-gray-500">
                      <span class="sr-only">Share on Instagram</span>
                      <svg class="size-6" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="#" class="flex size-6 items-center justify-center text-gray-400 hover:text-gray-500">
                      <span class="sr-only">Share on X</span>
                      <svg class="size-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11.4678 8.77491L17.2961 2H15.915L10.8543 7.88256L6.81232 2H2.15039L8.26263 10.8955L2.15039 18H3.53159L8.87581 11.7878L13.1444 18H17.8063L11.4675 8.77491H11.4678ZM9.57608 10.9738L8.95678 10.0881L4.02925 3.03974H6.15068L10.1273 8.72795L10.7466 9.61374L15.9156 17.0075H13.7942L9.57608 10.9742V10.9738Z" />
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
    
            <div class="mx-auto mt-16 w-full max-w-2xl lg:col-span-4 lg:mt-0 lg:max-w-none">
              <TabGroup as="div">
                <div class="border-b border-gray-200">
                  <TabList class="-mb-px flex space-x-8">
                    <Tab as="template" v-slot="{ selected }">
                      <button :class="[selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800', 'whitespace-nowrap border-b-2 py-6 text-sm font-medium']">Customer Reviews</button>
                    </Tab>
                    <Tab as="template" v-slot="{ selected }">
                      <button :class="[selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800', 'whitespace-nowrap border-b-2 py-6 text-sm font-medium']">FAQ</button>
                    </Tab>
                    <Tab as="template" v-slot="{ selected }">
                      <button :class="[selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800', 'whitespace-nowrap border-b-2 py-6 text-sm font-medium']">License</button>
                    </Tab>
                  </TabList>
                </div>
                <TabPanels as="template">
                  <TabPanel class="-mb-10">
                    <h3 class="sr-only">Customer Reviews</h3>
    
                    <div v-for="(review, reviewIdx) in reviews.featured" :key="review.id" class="flex space-x-4 text-sm text-gray-500">
                      <div class="flex-none py-10">
                        <img :src="review.avatarSrc" alt="" class="size-10 rounded-full bg-gray-100" />
                      </div>
                      <div :class="[reviewIdx === 0 ? '' : 'border-t border-gray-200', 'py-10']">
                        <h3 class="font-medium text-gray-900">{{ review.author }}</h3>
                        <p>
                          <time :datetime="review.datetime">{{ review.date }}</time>
                        </p>
    
                        <div class="mt-4 flex items-center">
                          <StarIcon v-for="rating in [0, 1, 2, 3, 4]" :key="rating" :class="[review.rating > rating ? 'text-yellow-400' : 'text-gray-300', 'size-5 shrink-0']" aria-hidden="true" />
                        </div>
                        <p class="sr-only">{{ review.rating }} out of 5 stars</p>
    
                        <div class="mt-4 text-sm/6 text-gray-500" v-html="review.content" />
                      </div>
                    </div>
                  </TabPanel>
    
                  <TabPanel class="text-sm text-gray-500">
                    <h3 class="sr-only">Frequently Asked Questions</h3>
    
                    <dl>
                      <template v-for="faq in faqs" :key="faq.question">
                        <dt class="mt-10 font-medium text-gray-900">{{ faq.question }}</dt>
                        <dd class="mt-2 text-sm/6 text-gray-500">
                          <p>{{ faq.answer }}</p>
                        </dd>
                      </template>
                    </dl>
                  </TabPanel>
    
                  <TabPanel class="pt-10">
                    <h3 class="sr-only">License</h3>
    
                    <div class="text-sm text-gray-500 [&>:first-child]:mt-0 [&_h4]:mt-5 [&_h4]:font-medium [&_h4]:text-gray-900 [&_li::marker]:text-gray-300 [&_li]:pl-2 [&_p]:my-2 [&_p]:text-sm/6 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ul]:text-sm/6" v-html="license.content" />
                  </TabPanel>
                </TabPanels>
              </TabGroup>
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <script setup>
    import { StarIcon } from '@heroicons/vue/20/solid'
    import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'
    
    const product = {
      name: 'Application UI Icon Pack',
      version: { name: '1.0', date: 'June 5, 2021', datetime: '2021-06-05' },
      price: '$220',
      description:
        'The Application UI Icon Pack comes with over 200 icons in 3 styles: outline, filled, and branded. This playful icon pack is tailored for complex application user interfaces with a friendly and legible look.',
      highlights: [
        '200+ SVG icons in 3 unique styles',
        'Compatible with Figma, Sketch, and Adobe XD',
        'Drawn on 24 x 24 pixel grid',
      ],
      imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/product-page-05-product-01.jpg',
      imageAlt: 'Sample of 30 icons with friendly and fun details in outline, filled, and brand color styles.',
    }
    const reviews = {
      average: 4,
      featured: [
        {
          id: 1,
          rating: 5,
          content: `
            <p>This icon pack is just what I need for my latest project. There's an icon for just about anything I could ever need. Love the playful look!</p>
          `,
          date: 'July 16, 2021',
          datetime: '2021-07-16',
          author: 'Emily Selman',
          avatarSrc:
            'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
        },
        {
          id: 2,
          rating: 5,
          content: `
            <p>Blown away by how polished this icon pack is. Everything looks so consistent and each SVG is optimized out of the box so I can use it directly with confidence. It would take me several hours to create a single icon this good, so it's a steal at this price.</p>
          `,
          date: 'July 12, 2021',
          datetime: '2021-07-12',
          author: 'Hector Gibbons',
          avatarSrc:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
        },
        // More reviews...
      ],
    }
    const faqs = [
      {
        question: 'What format are these icons?',
        answer:
          'The icons are in SVG (Scalable Vector Graphic) format. They can be imported into your design tool of choice and used directly in code.',
      },
      {
        question: 'Can I use the icons at different sizes?',
        answer:
          "Yes. The icons are drawn on a 24 x 24 pixel grid, but the icons can be scaled to different sizes as needed. We don't recommend going smaller than 20 x 20 or larger than 64 x 64 to retain legibility and visual balance.",
      },
      // More FAQs...
    ]
    const license = {
      href: '#',
      summary:
        'For personal and professional use. You cannot resell or redistribute these icons in their original or modified state.',
      content: `
        <h4>Overview</h4>
        
        <p>For personal and professional use. You cannot resell or redistribute these icons in their original or modified state.</p>
        
        <ul role="list">
        <li>You\'re allowed to use the icons in unlimited projects.</li>
        <li>Attribution is not required to use the icons.</li>
        </ul>
        
        <h4>What you can do with it</h4>
        
        <ul role="list">
        <li>Use them freely in your personal and professional work.</li>
        <li>Make them your own. Change the colors to suit your project or brand.</li>
        </ul>
        
        <h4>What you can\'t do with it</h4>
        
        <ul role="list">
        <li>Don\'t be greedy. Selling or distributing these icons in their original or modified state is prohibited.</li>
        <li>Don\'t be evil. These icons cannot be used on websites or applications that promote illegal or immoral beliefs or activities.</li>
        </ul>
      `,
    }
    </script> -->