<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

interface FAQ {
  question: string;
  answer: string;
  open: boolean;
  icon: string;
}

interface Stats {
  creators: number;
  platformFee: number;
  uptime: number;
  paidOut: number;
}

export default defineComponent({
  name: 'HomeView',
  setup() {
    const router = useRouter();
    const showContact = ref(false);
    const stats = ref<Stats>({
      creators: 0,
      platformFee: 3,
      uptime: 99.9,
      paidOut: 0
    });

    const faqs = ref<FAQ[]>([
      {
        question: 'What is Creative Project Planner?',
        answer: 'A cutting-edge platform designed to help creators organize, plan, and execute their creative projects with powerful collaboration tools, timeline tracking, and integrated marketplace features.',
        open: false,
        icon: '🎨'
      },
      {
        question: 'How do I get started?',
        answer: 'Simply create an account, set up your profile, and start planning your first project. You can track progress, collaborate with team members, and showcase your work in our community marketplace.',
        open: false,
        icon: '🚀'
      },
      {
        question: 'Can I sell my creative projects?',
        answer: 'Yes! Our integrated marketplace allows you to showcase and sell your completed projects. Connect with buyers, manage orders, and receive payments securely through our platform.',
        open: false,
        icon: '💰'
      },
      {
        question: 'What payment methods are supported?',
        answer: 'We support multiple payment gateways including Stripe, PayPal, and local payment options. Payments are processed securely with industry-standard encryption.',
        open: false,
        icon: '💳'
      },
      {
        question: 'Is there a mobile app?',
        answer: 'While we currently offer a fully responsive web application, a dedicated mobile app is in development and will be available soon for iOS and Android.',
        open: false,
        icon: '📱'
      }
    ]);

    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/stats/platform');
        stats.value = response.data;
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    const toggleFaq = (index: number) => {
      faqs.value[index].open = !faqs.value[index].open;
    };

    const navigateToLogin = () => {
      router.push('/auth/login');
    };

    const navigateToRegister = () => {
      router.push('/auth/userRegister');
    };

    onMounted(() => {
      fetchStats();
    });

    return {
      faqs,
      stats,
      showContact,
      toggleFaq,
      navigateToLogin,
      navigateToRegister
    };
  },
});
</script>

<template>
  <main class="w-full">
    <!-- Hero Section -->
    <section class="relative bg-hero-bg bg-cover bg-center bg-no-repeat min-h-screen flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>
      
      <div class="relative z-10 text-center text-white px-4 md:px-8 max-w-5xl mx-auto">
        <h1 class="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 animate-fade-in-down bg-gradient-to-r from-custom-teal via-custom-peach to-custom-lime bg-clip-text text-transparent">
          Transform Your Creative Vision Into Reality
        </h1>
        <p class="text-lg md:text-xl lg:text-2xl mb-10 animate-fade-in-up text-gray-200 max-w-3xl mx-auto">
          The ultimate platform for creators to plan, collaborate, and showcase their projects. Join thousands of innovators turning ideas into masterpieces.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center animate-bounce-in">
          <button 
            @click="navigateToLogin"
            class="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl shadow-2xl text-lg font-bold overflow-hidden transform hover:scale-105 transition-all duration-300"
          >
            <span class="relative z-10">Login to Your Account</span>
            <div class="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          <button 
            @click="navigateToRegister"
            class="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl text-lg font-medium hover:bg-white hover:text-black transform hover:scale-105 transition-all duration-300"
          >
            Create Account
          </button>
        </div>
      </div>

      <!-- Floating Elements -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-20 left-10 w-20 h-20 bg-custom-teal/20 rounded-full animate-float"></div>
        <div class="absolute bottom-32 right-20 w-32 h-32 bg-custom-peach/20 rounded-full animate-float-delayed"></div>
        <div class="absolute top-1/2 left-1/4 w-16 h-16 bg-custom-lime/20 rounded-full animate-pulse"></div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
      <div class="container mx-auto max-w-7xl">
        <h2 class="text-4xl md:text-5xl font-bold mb-6 text-center bg-gradient-to-r from-custom-teal via-custom-peach to-custom-lime bg-clip-text text-transparent">
          Futuristic Features for Modern Creators
        </h2>
        <p class="text-lg md:text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto">
          Experience next-generation tools designed to elevate your creative workflow
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-700 hover:border-custom-teal overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-custom-teal/10 rounded-full blur-3xl group-hover:bg-custom-teal/20 transition-all duration-300"></div>
            <div class="relative z-10">
              <div class="w-16 h-16 bg-gradient-to-br from-custom-teal to-cyan-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <i class="fas fa-brain text-3xl text-white"></i>
              </div>
              <h3 class="text-2xl font-bold mb-4 text-white">AI-Powered Planning</h3>
              <p class="text-gray-300 leading-relaxed">
                Leverage artificial intelligence to optimize your project timelines, suggest task breakdowns, and predict potential bottlenecks before they occur.
              </p>
            </div>
          </div>

          <!-- Feature 2 -->
          <div class="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-700 hover:border-custom-peach overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-custom-peach/10 rounded-full blur-3xl group-hover:bg-custom-peach/20 transition-all duration-300"></div>
            <div class="relative z-10">
              <div class="w-16 h-16 bg-gradient-to-br from-custom-peach to-orange-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <i class="fas fa-chart-line text-3xl text-white"></i>
              </div>
              <h3 class="text-2xl font-bold mb-4 text-white">Real-Time Analytics</h3>
              <p class="text-gray-300 leading-relaxed">
                Track your project's progress with advanced analytics, visualize milestones with Gantt charts, and make data-driven decisions to stay ahead of schedule.
              </p>
            </div>
          </div>

          <!-- Feature 3 -->
          <div class="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-700 hover:border-custom-lime overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-custom-lime/10 rounded-full blur-3xl group-hover:bg-custom-lime/20 transition-all duration-300"></div>
            <div class="relative z-10">
              <div class="w-16 h-16 bg-gradient-to-br from-custom-lime to-green-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <i class="fas fa-users-cog text-3xl text-white"></i>
              </div>
              <h3 class="text-2xl font-bold mb-4 text-white">Seamless Collaboration</h3>
              <p class="text-gray-300 leading-relaxed">
                Connect with team members in real-time, share resources, assign tasks, and communicate effortlessly through integrated chat and video conferencing.
              </p>
            </div>
          </div>

          <!-- Feature 4 -->
          <div class="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-700 hover:border-purple-400 overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-300"></div>
            <div class="relative z-10">
              <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <i class="fas fa-store text-3xl text-white"></i>
              </div>
              <h3 class="text-2xl font-bold mb-4 text-white">Integrated Marketplace</h3>
              <p class="text-gray-300 leading-relaxed">
                Showcase your completed projects, connect with potential buyers, and manage sales directly through our secure marketplace with multi-gateway payment support.
              </p>
            </div>
          </div>

          <!-- Feature 5 -->
          <div class="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-700 hover:border-blue-400 overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-300"></div>
            <div class="relative z-10">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <i class="fas fa-shield-alt text-3xl text-white"></i>
              </div>
              <h3 class="text-2xl font-bold mb-4 text-white">Bank-Level Security</h3>
              <p class="text-gray-300 leading-relaxed">
                Your data and transactions are protected with enterprise-grade encryption, secure payment processing, and regular security audits to ensure peace of mind.
              </p>
            </div>
          </div>

          <!-- Feature 6 -->
          <div class="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-700 hover:border-yellow-400 overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-all duration-300"></div>
            <div class="relative z-10">
              <div class="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <i class="fas fa-rocket text-3xl text-white"></i>
              </div>
              <h3 class="text-2xl font-bold mb-4 text-white">Rapid Deployment</h3>
              <p class="text-gray-300 leading-relaxed">
                Get started in minutes with intuitive onboarding, pre-built templates, and smart automation that adapts to your workflow from day one.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trusted by Creators Stats -->
    <section class="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
      <div class="container mx-auto max-w-7xl">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-custom-teal to-custom-peach bg-clip-text text-transparent">
            Trusted by Creators Worldwide
          </h2>
          <p class="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Join a thriving community of innovators who are turning their creative visions into successful projects and profitable ventures
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 text-center shadow-xl border border-gray-700 hover:border-custom-teal transform hover:-translate-y-2 transition-all duration-300">
            <div class="text-5xl font-bold bg-gradient-to-r from-custom-teal to-cyan-400 bg-clip-text text-transparent mb-2">
              {{ stats.creators.toLocaleString() }}+
            </div>
            <div class="text-gray-400 text-lg">Active Creators</div>
          </div>

          <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 text-center shadow-xl border border-gray-700 hover:border-custom-peach transform hover:-translate-y-2 transition-all duration-300">
            <div class="text-5xl font-bold bg-gradient-to-r from-custom-peach to-orange-400 bg-clip-text text-transparent mb-2">
              {{ stats.platformFee }}%
            </div>
            <div class="text-gray-400 text-lg">Platform Fee</div>
          </div>

          <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 text-center shadow-xl border border-gray-700 hover:border-custom-lime transform hover:-translate-y-2 transition-all duration-300">
            <div class="text-5xl font-bold bg-gradient-to-r from-custom-lime to-green-400 bg-clip-text text-transparent mb-2">
              {{ stats.uptime }}%
            </div>
            <div class="text-gray-400 text-lg">Uptime Guarantee</div>
          </div>

          <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 text-center shadow-xl border border-gray-700 hover:border-purple-400 transform hover:-translate-y-2 transition-all duration-300">
            <div class="text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text text-transparent mb-2">
              MWK {{ stats.paidOut.toLocaleString() }}+
            </div>
            <div class="text-gray-400 text-lg">Paid to Creators</div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-20 px-4 bg-black">
      <div class="container mx-auto max-w-4xl">
        <h2 class="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-custom-teal via-custom-peach to-custom-lime bg-clip-text text-transparent">
          Frequently Asked Questions
        </h2>

        <div class="space-y-4">
          <div 
            v-for="(faq, index) in faqs" 
            :key="index"
            class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-orange-500 transition-all duration-300"
          >
            <button 
              @click="toggleFaq(index)"
              class="w-full px-6 py-5 flex items-center justify-between text-left group"
            >
              <div class="flex items-center gap-4 flex-1">
                <span class="text-3xl">{{ faq.icon }}</span>
                <span class="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors">
                  {{ faq.question }}
                </span>
              </div>
              <div class="flex-shrink-0 ml-4">
                <div 
                  class="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center transform transition-transform duration-300"
                  :class="faq.open ? 'rotate-180' : ''"
                >
                  <i class="fas fa-chevron-down text-orange-400"></i>
                </div>
              </div>
            </button>
            
            <transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="max-h-0 opacity-0"
              enter-to-class="max-h-96 opacity-100"
              leave-active-class="transition-all duration-300 ease-in"
              leave-from-class="max-h-96 opacity-100"
              leave-to-class="max-h-0 opacity-0"
            >
              <div v-if="faq.open" class="px-6 pb-6">
                <div class="pl-14 text-gray-300 leading-relaxed border-l-2 border-orange-500/30">
                  {{ faq.answer }}
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </section>

    <!-- Get in Touch / Footer -->
    <footer class="relative bg-gradient-to-b from-gray-900 to-black py-16 px-4 overflow-hidden">
      <div class="container mx-auto max-w-7xl relative z-10">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold mb-4 text-white">Let's Create Together</h2>
          <p class="text-gray-400 text-lg">Join thousands of creators bringing their visions to life</p>
        </div>

        <div class="flex justify-center mb-12">
          <button 
            @click="navigateToRegister"
            class="px-10 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl shadow-2xl text-lg font-bold hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300"
          >
            Start Your Journey
          </button>
        </div>

        <!-- Contact Info (Hidden by default, shows on hover) -->
        <div 
          class="relative group max-w-2xl mx-auto"
          @mouseenter="showContact = true"
          @mouseleave="showContact = false"
        >
          <div class="text-center py-4 cursor-pointer">
            <p class="text-gray-500 hover:text-orange-400 transition-colors">
              <i class="fas fa-envelope mr-2"></i>
              Get in Touch
            </p>
          </div>
          
          <transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <div 
              v-if="showContact"
              class="absolute left-0 right-0 -top-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-2xl border border-gray-700"
            >
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <i class="fas fa-phone text-orange-400 text-2xl mb-2"></i>
                  <p class="text-sm text-gray-400">Phone</p>
                  <a href="tel:+265986610535" class="text-white hover:text-orange-400 transition-colors">
                    +265 986 610 535
                  </a>
                </div>
                <div>
                  <i class="fas fa-envelope text-orange-400 text-2xl mb-2"></i>
                  <p class="text-sm text-gray-400">Email</p>
                  <a href="mailto:iankatengeza@gmail.com" class="text-white hover:text-orange-400 transition-colors">
                    iankatengeza@gmail.com
                  </a>
                </div>
                <div>
                  <i class="fas fa-map-marker-alt text-orange-400 text-2xl mb-2"></i>
                  <p class="text-sm text-gray-400">Location</p>
                  <p class="text-white text-sm">New Area 12, Lilongwe, Malawi</p>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <!-- Social Links -->
        <div class="flex justify-center space-x-6 mb-12">
          <a 
            href="https://www.facebook.com/share/19UmVXdUEd/?mibextid=LQQJ4d" 
            target="_blank"
            class="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-110"
          >
            <i class="fab fa-facebook-f text-xl"></i>
          </a>
          <a 
            href="https://www.instagram.com/ian.monarch_471" 
            target="_blank"
            class="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-110"
          >
            <i class="fab fa-instagram text-xl"></i>
          </a>
          <a 
            href="https://www.linkedin.com/in/ian-katengeza-2529a0206" 
            target="_blank"
            class="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-110"
          >
            <i class="fab fa-linkedin-in text-xl"></i>
          </a>
        </div>

        <!-- Copyright -->
        <div class="text-center text-gray-500 text-sm border-t border-gray-800 pt-8">
          <p>&copy; 2024 Creative Project Planner. All rights reserved.</p>
          <p class="mt-2">Empowering creators to build the future, one project at a time.</p>
        </div>
      </div>

      <!-- Background decoration -->
      <div class="absolute inset-0 pointer-events-none opacity-10">
        <div class="absolute top-10 left-10 w-64 h-64 bg-custom-teal rounded-full blur-3xl"></div>
        <div class="absolute bottom-10 right-10 w-64 h-64 bg-custom-peach rounded-full blur-3xl"></div>
      </div>
    </footer>
  </main>
</template>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes float-delayed {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-30px);
  }
}

@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
}

.animate-fade-in-down {
  animation: fade-in-down 1s ease-out;
}

.animate-fade-in-up {
  animation: fade-in-up 1s ease-out 0.2s both;
}

.animate-bounce-in {
  animation: bounce-in 0.8s ease-out 0.4s both;
}
</style>
