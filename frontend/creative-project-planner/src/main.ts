import './assets/tailwind.css'; // Ensure this path is correct
import store from './store'
import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
// import { initializeAuth } from '@/views/auth/auth0';



// Wrapping the Auth0 initialization in an async function
async function initializeApp(): Promise<void> {
  try {
    // Commenting Auth0 initialization temporarily to test the app rendering
    // await initializeAuth();
    // async function initApp() {
    //   await initializeAuth();

    // Initialize Vue application
    const app = createApp(App);

    // Use router
    app.use(router);

    // Mount the Vue app
    app.mount('#app');

    console.log('App is starting successfully without Auth0 initialization.');
  } catch (error) {
    // Handle initialization error
    console.error('Error during app initialization:', error);
    alert('There was an error initializing the app. Please try again later.');
  }
}

// Start the initialization process
initializeApp();
