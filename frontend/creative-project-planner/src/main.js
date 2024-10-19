import './assets/tailwind.css';

import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import { initializeAuth } from '@/views/auth/auth0';  // Ensure this path is correct

Vue.config.productionTip = false;

// Wrapping the Auth0 initialization in an async function
async function initializeApp() {
  try {
    // Initialize Auth0 before mounting the app
    await initializeAuth();

    // After Auth0 is initialized, mount the Vue instance
    new Vue({
      router,
      render: h => h(App)
    }).$mount('#app');

    console.log('Auth0 initialized successfully, app is starting.');
  } catch (error) {
    // Handle initialization error
    console.error('Failed to initialize Auth0:', error);
    alert('There was an error initializing the app. Please try again later.');
  }
}

// Start the initialization process
initializeApp();
