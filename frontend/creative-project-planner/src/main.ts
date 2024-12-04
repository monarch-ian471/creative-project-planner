import './assets/tailwind.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import router from '@/router'
import { Toaster } from 'vue-sonner'
import { createAuth0 } from '@auth0/auth0-vue'

const initializeApp = async (): Promise<void> => {
  try {
    // Create Vue app and Pinia instance
    const app = createApp(App)
    const pinia = createPinia()

    // Set up app with Pinia, Toaster, Router, and Auth0
    app.use(pinia)
    app.use(Toaster, {
      position: 'top-right',
      duration: 3000,
      richColors: true
    })
    app.use(router)
    app.use(createAuth0({
      domain: import.meta.env.VITE_AUTH0_DOMAIN,
      clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: 'read:projects write:projects'
      }
    }))

    // Mount the app
    app.mount('#app')
    console.log('App initialized successfully with Auth0.')
  } catch (error) {
    console.error('App initialization error:', error)
    Toaster.error('Failed to initialize the application. Please try again.')
  }
}

// Start initialization
initializeApp()
