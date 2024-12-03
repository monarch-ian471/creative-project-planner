import './assets/tailwind.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia' // Add this import
import App from '@/App.vue'
import router from '@/router'
import { Toaster } from 'vue-sonner'
import { createAuth0 } from '@auth0/auth0-vue'

async function initializeApp(): Promise<void> {
  try {
    // Create Vue app
    const app = createApp(App)

    // Create Pinia instance
    const pinia = createPinia()

    // Use Pinia
    app.use(pinia)

    app.use(Toaster, {
      // Optional configuration
      position: 'top-right',
      duration: 3000,
      richColors: true
    })
    // Use router
    app.use(router)

    // Use Auth0
    app.use(
      createAuth0({
        domain: "https://dev-lsauz5y1t0iz3nv2.us.auth0.com/oauth/token",
        clientId: "Z08tH8UDNQijeCdDklsHE5K9d7z2Q6Ay",
        authorizationParams: {
          redirect_uri: window.location.origin,
          audience: 'https://creative-project-planner-api',
          scope: 'read:projects write:projects'
        }
      })
    )

    // Mount the Vue app
    app.mount('#app')

    console.log('App is starting successfully with Auth0 initialization.')
  } catch (error) {
    console.error('Error during app initialization:', error)
    alert('There was an error initializing the app. Please try again later.')
  }
}

// Start the initialization process
initializeApp()