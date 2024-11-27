<script lang="ts">
import { defineComponent, ref } from 'vue';
// import paintingImage from '@/assets/painting.png';
// import muralPaintingImage from '@/assets/mural-painter.png';
// import chairMakingImage from '@/assets/chair-making.png';

export default defineComponent({
  name: 'App',
  setup() {
    const faqs = ref([
      {
        question: 'What is a Creative Project Planner?',
        answer:
          'Creative Project Planner is a tool designed to help you organize, plan, and collaborate on your creative projects. It provides features to keep track of your ideas, break down projects into tasks, and work seamlessly with your team.',
        open: false,
      },
      {
        question: 'How do I get started?',
        answer:
          "To get started, simply sign up for an account by clicking on the 'Get Started Now' button on the home page. Once registered, you can start planning your projects and collaborating with your team.",
        open: false,
      },
      {
        question: 'Can I collaborate with others?',
        answer:
          'Yes, Creative Project Planner allows you to collaborate with your team members. You can share ideas, assign tasks, and track progress in real-time to ensure everyone is on the same page.',
        open: false,
      },
      {
        question: 'Is there a mobile app available?',
        answer:
          'Currently, Creative Project Planner is available as a web application. We are working on developing a mobile app to provide you with more flexibility and convenience.',
        open: false,
      },
    ]);

    // const collections = [
    //   {
    //     name: "Painting",
    //     href: '#',
    //     imageSrc: paintingImage,
    //     imageAlt: 'Painter painting an image.',
    //   },
    //   {
    //     name: "Mural",
    //     href: '#',
    //     imageSrc: muralPaintingImage,
    //     imageAlt: 'Mural Painting.',
    //   },
    //   {
    //     name: 'Furniture',
    //     href: '#',
    //     imageSrc: chairMakingImage,
    //     imageAlt: 'Making a chair.',
    //   },
    // ]

    const stats = [
      { id: 1, name: 'Creators on the platform', value: '0.1+' },
      { id: 2, name: 'Flat platform fee', value: '0%' },
      { id: 3, name: 'Uptime guarantee', value: '99.9%' },
      { id: 4, name: 'Paid out to creators', value: '8,000+' },
    ];

    const toggleFaq = (index: number) => {
      faqs.value[index].open = !faqs.value[index].open;
    };

    return {
      faqs,
      stats,
      toggleFaq,
      // collections,
    };
  },
});
</script>



<template>
  <main class="container mx-auto mt-8">
      <section class="relative bg-hero-bg bg-cover bg-center bg-no-repeat h-screen flex items-center justify-center">
        <div class="text-center text-white bg-black bg-opacity-60 p-8 rounded-lg shadow-lg">
          <h1 class="text-5xl font-extrabold mb-4 animate-fade-in-down">Welcome to Creative Project Planner</h1>
          <p class="text-lg mb-6 animate-fade-in-up">
            Transform your ideas into actionable projects and collaborate seamlessly with your team.
          </p>
          <button class="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg shadow-md text-lg font-medium transition duration-200 animate-bounce">
            <router-link to="/userRegister">
                Get Started Now
              </router-link>
          </button>
        </div>
      </section>

      <section class="mt-12">
          <h2 class="text-4xl font-bold mb-6 animate-fade-in text-center">Features</h2>
          <p class="text-lg mb-6 text-center">
            Explore the features that make planning your projects simple, efficient, and collaborative.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="text-white bg-black bg-opacity-75 p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 min-h-[350px] text-center flex flex-col justify-between">
              <div>
                <i class="fas fa-lightbulb text-4xl mb-4"></i> 
                <h3 class="text-2xl font-semibold mb-4">Organize Your Ideas</h3>
                <p>
                  Capture and store all your creative thoughts in one centralized place. Whether it's an idea for a new project, a vision for your next big move, or random sparks of inspiration, keep everything organized and easily accessible. This feature allows you to revisit your thoughts, refine them, and take action when you're ready. Stay creative without losing track of your brilliance.
                </p>
              </div>
            </div>

            <div class="text-white bg-black bg-opacity-75 p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 min-h-[350px] text-center flex flex-col justify-between">
              <div>
                <i class="fas fa-calendar-check text-4xl mb-4"></i>
                <h3 class="text-2xl font-semibold mb-4">Plan Your Projects</h3>
                <p>
                  Turn your ideas into actionable plans by structuring your projects with clear tasks, deadlines, and milestones. Stay organized and stay on track by breaking down big projects into manageable steps. Whether you are planning a product launch, a marketing campaign, or a team event, this feature will help you map out every detail, ensuring you meet your goals with precision and clarity.
                </p>
              </div>
            </div>

            <div class="text-white bg-black bg-opacity-75 p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 min-h-[350px] text-center flex flex-col justify-between">
              <div>
                <i class="fas fa-users text-4xl mb-4"></i> 
                <h3 class="text-2xl font-semibold mb-4">Collaborate with Teams</h3>
                <p>
                  Seamless collaboration is key to any successful project. With this feature, you can assign tasks, set deadlines, and track progress in real-time with your team members. Communication, task delegation, and progress tracking have never been easier. Whether you're working remotely or in the same office, this feature helps keep everyone aligned and accountable, fostering a productive and positive work environment.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- <div class="relative mt-8">
            <div aria-hidden="true" class="absolute inset-0 hidden sm:flex sm:flex-col">
              <div class="relative w-full flex-1 bg-gray-800">
                <div class="absolute inset-0 overflow-hidden rounded-lg">
                  <img src="https://tailwindui.com/plus/img/ecommerce-images/home-page-04-hero-full-width.jpg" alt="" class="size-full object-cover" />
                </div>
                <div class="absolute inset-0 bg-gray-900 opacity-50" />
              </div>
              <div class="h-32 w-full bg-white md:h-40 lg:h-48" />
            </div>

            <div class="relative mx-auto max-w-3xl px-4 pb-96 text-center sm:px-6 sm:pb-0 lg:px-8">

              <div aria-hidden="true" class="absolute inset-0 flex flex-col sm:hidden">
                <div class="relative w-full flex-1 bg-gray-800">
                  <div class="absolute inset-0 overflow-hidden">
                    <img src="https://tailwindui.com/plus/img/ecommerce-images/home-page-04-hero-full-width.jpg" alt="" class="size-full object-cover" />
                  </div>
                  <div class="absolute inset-0 bg-gray-900 opacity-50" />
                </div>
                <div class="h-48 w-full bg-white" />
              </div>
              <div class="relative py-16">
                <h1 class="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">Recents On Projects</h1>
                <div class="mt-2 sm:mt-6">
                  <a href="/portal/community" class="inline-block border border-transparent bg-orange-500 px-8 py-3 font-medium text-white hover:bg-orange-700">Community</a>
                </div>
              </div>
            </div>

            <section aria-labelledby="collection-heading" class="relative -mt-96 sm:mt-0">
              <h2 id="collection-heading" class="sr-only">Community</h2>
              <div class="mx-auto grid max-w-md grid-cols-1 gap-y-6 px-4 sm:max-w-7xl sm:grid-cols-3 sm:gap-x-6 sm:gap-y-0 sm:px-6 lg:gap-x-8 lg:px-8">
                <div v-for="collection in collections" :key="collection.name" class="group relative h-96 rounded-lg bg-white shadow-xl sm:aspect-[4/5] sm:h-auto">
                  <div aria-hidden="true" class="absolute inset-0 overflow-hidden rounded-lg">
                    <div class="absolute inset-0 overflow-hidden group-hover:opacity-75">
                      <img :src="collection.imageSrc" :alt="collection.imageAlt" class="size-full object-cover" />
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50" />
                  </div>
                  <div class="absolute inset-0 flex items-end rounded-lg p-6">
                    <div>
                      <h3 class="mt-1 font-semibold text-white">
                        <a :href="collection.href">
                          <span class="absolute inset-0" />
                          {{ collection.name }}
                        </a>
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            </div> -->

    <section class="mt-8 bg-hero-banner-bg bg-cover bg-center animate__animated animate__fadeIn animate__delay-1s min-h-[350px] text-center flex flex-col justify-between">
      <div class="text-white bg-black bg-opacity-75 p-6 rounded-lg text-center relative">
        <h2 class="text-3xl font-bold">Exciting New Updates Coming Soon!</h2>
        <p class="text-lg">Stay tuned for our latest features and improvements. We’re constantly working to make your project planning experience even better!</p>
      </div>
    </section>

  <section  class="mt-8">
      <div class="bg-grey bg-opacity-75 py-12 sm:py-16">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl lg:max-w-none">
          <div class="text-center">
            <h2 class="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Trusted by Creators</h2>
            <p class="mt-4 text-lg/8 text-white bg-black bg-opacity-75 p-6 rounded-lg">Empowering visionaries and innovators worldwide, our platform is trusted by creators to turn ideas into reality. Join a community that thrives on creativity, collaboration, and results.</p>
          </div>
          <dl class="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
            <div v-for="stat in stats" :key="stat.id" class="flex flex-col bg-gray-400/5 p-8">
              <dt class="text-sm/6 font-semibold text-gray-600">{{ stat.name }}</dt>
              <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900">{{ stat.value }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </section>

  <div class="relative mt-2">
    <div class="absolute inset-0 flex items-center" aria-hidden="true">
      <div class="w-full border-t border-gray-300" />
    </div>
    <div class="relative flex justify-center">
      <span class="bg-white px-2 text-orange-500">
         +
      </span>
    </div>
  </div>

  <section class="mt-8">
      <div class="bg-grey bg-opacity-75 mb-8 rounded-lg border border-black">
        <div class="mx-auto max-w-7xl px-3 py-6 sm:py-8 lg:px-4 lg:py-20">
          <div class="mx-auto max-w-4xl divide-y divide-gray-900/10">
            <h2 class="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Frequently asked questions</h2>
            <dl class="mt-5 space-y-6 divide-y divide-gray-900/10">
              <div 
                v-for="(faq, index) in faqs" 
                :key="index" 
                class="pt-6"
              >
                <dt>
                  <button 
                    @click="toggleFaq(index)" 
                    class="flex w-full items-start justify-between text-left text-gray-900"
                  >
                    <span class="text-base/7 font-semibold">{{ faq.question }}</span>
                    <span class="ml-6 flex h-7 items-center">
                      <svg v-if="!faq.open" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-black-300 hover:text-orange-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-black-300 hover:text-orange-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
                      </svg>
                    </span>
                  </button>
                </dt>
                <dd v-if="faq.open" class="mt-2 pr-12">
                  <p class="text-base/7 text-gray-600">{{ faq.answer }}</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="bg-black bg-opacity-75 text-white py-16 rounded-lg shadow-md">
    <div class="container mx-auto px-6 md:px-12 flex justify-between items-center">

      <!-- Contact Details Section -->
      <div class="text-center md:text-left mt-6 md:mt-0">
        <p class="text-4xl font-semibold mb-6">GET IN TOUCH</p>
        <p>Phone: <a href="" class="text-orange-500 hover:text-orange-400">+265(0)986-610-1535</a></p>
        <p>Email: <a href="mailto:iankatengeza@gmail.com" class="text-orange-500 hover:text-orange-400">iankatengeza@gmail.com</a></p>
        <p>Address: <a href="" class="text-orange-500 hover:text-orange-400"> New Area 12 | 526 Songwe St, Lilongwe, Malawi</a></p>
      </div>

      <!-- Social Media Links Section -->
      <div class="flex space-x-6">
        <a href="https://www.facebook.com/share/19UmVXdUEd/?mibextid=LQQJ4d" class="text-gray-300 hover:text-orange-500 transition-colors duration-200">
          <i class="fab fa-facebook-f text-2xl"></i>
        </a>
        <a href="https://www.instagram.com/ian.monarch_471?igsh=MXV6NHlodHdvY2NyaA%3D%3D&utm_source=qr" class="text-gray-300 hover:text-orange-500 transition-colors duration-200">
          <i class="fab fa-instagram text-2xl"></i>
        </a>
        <a href="https://www.linkedin.com/in/ian-katengeza-2529a0206?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" class="text-gray-300 hover:text-orange-500 transition-colors duration-200">
          <i class="fab fa-linkedin-in text-2xl"></i>
        </a>
      </div>
    </div>
  </footer>
</template>