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
        domain: import.meta.env.VITE_AUTH0_DOMAIN,
        clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
        authorizationParams: {
          redirect_uri: window.location.origin,
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: 'read:projects write:projects'
        }
      })
    )

    // Mount the Vue app
    app.mount('#app')

    console.log('App initialized successfully with Auth0.')
  } catch (error) {
    console.error('App initialization error:', error)
    alert('Failed to initialize the application. Please try again.')
  }
}

// Start the initialization process
initializeApp()