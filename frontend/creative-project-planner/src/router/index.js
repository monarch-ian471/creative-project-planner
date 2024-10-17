import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import MyDashboard from '@/views/MyDashboard.vue';
import Community from '@/views/Community.vue';  // Example of another route
import Settings from '@/views/Settings.vue';  // Example of another route
import Projects from '@/views/Projects.vue';
import CalendarCard from '@/components/Calendar-card.vue';
import DashboardHeader from '@/components/Dashboard-Header.vue';
import { isAuthenticated } from '@/auth/auth0';  // Import the Auth0 authentication check


// Ensure isAuthenticated is a function that returns a boolean
if (typeof isAuthenticated !== 'function') {
  throw new Error('isAuthenticated must be a function');
}

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView,
  },
  {
    path: '/dashboard',
    name: 'MyDashboard',
    component: MyDashboard,
    meta: { requiresAuth: true }  // Mark this route as protected
  },
  {
    path: '/community',
    name: 'Community',
    component: Community,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
  },
  {
    path: '/projects',
    name: 'Projects',
    component: Projects,
  },
  {
    path: '/Calendard-card',
    name: 'CalendarCard',
    component: CalendarCard,
  },
  {
    path: '/dashboard-header',
    name: 'DashboardHeader',
    component: DashboardHeader,
  },
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
