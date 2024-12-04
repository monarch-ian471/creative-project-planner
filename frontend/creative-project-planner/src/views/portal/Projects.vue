<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import ProjectCard from '@/views/projects/projectCard.vue';


export default {
    name: 'UserProjects',
    components: {
        ProjectCard,
        TaskList,
        CalendarCard,
    },
    setup() {
        const projects = ref([]);

        const fetchProjects = () => {
            // Simulated API call to fetch user's projects
            projects.value = [
                { id: 1, name: 'Project 1', description: 'Project Underway' },
                { id: 2, name: 'Project 2', description: 'Project Underway' },
                { id: 3, name: 'Project 3', description: 'Project Underway' },
                { id: 4, name: 'Project 4', description: 'Project Underway' },
                { id: 5, name: 'Project 5', description: 'Project Underway' },
                { id: 6, name: 'Project 6', description: 'Project Underway' },
            ];
        };

        return {
            projects,
        };
    }
};
</script>

<template>   
    <div class="container mx-auto p-4">
        <h1 class="text-4xl font-bold mb-6">User's Projects</h1>



        <!-- Project Cards Section -->
        <div v-if="projects.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProjectCard
                v-for="project in projects"
                :key="project.id"
                :project="project"
                class="transform hover:scale-105 hover:rotate-2 transition-transform duration-300 ease-in-out"
            />
        </div>

        <!-- No Projects Found Message -->
        <div v-else class="text-center text-gray-500">
            <p>No projects found.</p>
        </div>
    </div>
</template>
<!-- 
<template>
    <Popover class="relative">
      <PopoverButton class="inline-flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
        <span>Solutions</span>
        <ChevronDownIcon class="size-5" aria-hidden="true" />
      </PopoverButton>
  
      <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
        <PopoverPanel class="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
          <div class="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm/6 shadow-lg ring-1 ring-gray-900/5 lg:max-w-3xl">
            <div class="grid grid-cols-1 gap-x-6 gap-y-1 p-4 lg:grid-cols-2">
              <div v-for="item in solutions" :key="item.name" class="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                <div class="mt-1 flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                  <component :is="item.icon" class="size-6 text-gray-600 group-hover:text-indigo-600" aria-hidden="true" />
                </div>
                <div>
                  <a :href="item.href" class="font-semibold text-gray-900">
                    {{ item.name }}
                    <span class="absolute inset-0" />
                  </a>
                  <p class="mt-1 text-gray-600">{{ item.description }}</p>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-8 py-6">
              <div class="flex items-center gap-x-3">
                <h3 class="text-sm/6 font-semibold text-gray-900">Enterprise</h3>
                <p class="rounded-full bg-indigo-600/10 px-2.5 py-1.5 text-xs font-semibold text-indigo-600">New</p>
              </div>
              <p class="mt-2 text-sm/6 text-gray-600">Empower your entire team with even more advanced tools.</p>
            </div>
          </div>
        </PopoverPanel>
      </transition>
    </Popover>
  </template>
  
  <script setup>
  import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
  import { ChevronDownIcon } from '@heroicons/vue/20/solid'
  import {
    ArrowPathIcon,
    ChartPieIcon,
    CursorArrowRaysIcon,
    DocumentChartBarIcon,
    FingerPrintIcon,
    SquaresPlusIcon,
  } from '@heroicons/vue/24/outline'
  
  const solutions = [
    { name: 'Analytics', description: 'Get a better understanding of your traffic', href: '#', icon: ChartPieIcon },
    {
      name: 'Integrations',
      description: 'Connect with third-party tools and find out expectations',
      href: '#',
      icon: SquaresPlusIcon,
    },
    {
      name: 'Engagement',
      description: 'Speak directly to your customers with our engagement tool',
      href: '#',
      icon: CursorArrowRaysIcon,
    },
    { name: 'Automations', description: 'Build strategic funnels that will convert', href: '#', icon: ArrowPathIcon },
    { name: 'Security', description: "Your customers' data will be safe and secure", href: '#', icon: FingerPrintIcon },
    {
      name: 'Reports',
      description: 'Edit, manage and create newly informed decisions',
      href: '#',
      icon: DocumentChartBarIcon,
    },
  ]
  </script> -->