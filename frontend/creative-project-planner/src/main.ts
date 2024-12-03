import './assets/tailwind.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia' // Add this import
import App from '@/App.vue'
import router from '@/router'
import { createAuth0 } from '@auth0/auth0-vue'

async function initializeApp(): Promise<void> {
  try {
    // Create Vue app
    const app = createApp(App)

    // Create Pinia instance
    const pinia = createPinia()

    // Use Pinia
    app.use(pinia)

    // Use router
    app.use(router)

    // Use Auth0
    app.use(
      createAuth0({
        domain: "dev-lsauz5y1t0iz3nv2.us.auth0.com",
        clientId: "48Jec1jqMeGthEIbTkDaEwFwoPOhRQwi",
        authorizationParams: {
          redirect_uri: window.location.origin,
          audience: 'https://creative-project-planner-api.com',
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