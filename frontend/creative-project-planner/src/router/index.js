import Vue from 'vue';
import VueRouter from 'vue-router';
// import Home from '../views/Home.vue';
// import Dashboard from '../views/Dashboard.vue';  // Example of a protected route
import { isAuthenticated } from '@/auth/auth0';  // Import the Auth0 authentication check

// Ensure isAuthenticated is a function that returns a boolean
if (typeof isAuthenticated !== 'function') {
  throw new Error('isAuthenticated must be a function');
}

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }  // Mark this route as protected
  }
];

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes
});

// Global navigation guard to check for authentication
router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const loggedIn = await isAuthenticated();
    if (!loggedIn) {
      return next('/');
    }
  }
  next();
});

export default router;
