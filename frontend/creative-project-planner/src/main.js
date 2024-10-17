import './assets/tailwind.css';

import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import { initializeAuth } from '@/auth/auth0';  // Importing Auth0 initialization function

Vue.config.productionTip = false;

initializeAuth().then(() => {  // This is to ensure Auth0 is initialized before starting the app
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app');
}).catch(error => {
  console.error('Failed to initialize Auth0:', error);
  // This to handle the error appropriately
});
