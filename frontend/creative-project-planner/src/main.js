import './assets/tailwind.css'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { initializeAuth } from './auth/auth0';  // Import Auth0 initialization function

// const app = createApp(App)  // This line is for Vue 3, not needed for Vue 2

Vue.config.productionTip = false;

initializeAuth().then(() => {  // Ensure Auth0 is initialized before starting the app
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app');
});
