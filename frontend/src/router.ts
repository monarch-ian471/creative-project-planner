import { createRouter, createWebHistory } from 'vue-router'
import { routes as AdminRoutes } from '@/views/admin'
import { routes as AuthRoutes } from '@/views/auth'
import { routes as PortalRoutes } from '@/views/portal'
import { routes as ProjectsRoutes } from '@/views/projects'


const baseUrl = import.meta.env.VITE_BASE_URL || '/';
console.log(`Using base URL: ${baseUrl}`); // Log the base URL for debugging
const router = createRouter({
  history: createWebHistory(baseUrl),
  routes: [
    {
      path: '/',
      redirect: '/auth/login',
    },    
    {
      path: '/auth',
      children: AuthRoutes,
    },
    {
      path: '/admin',
      children: AdminRoutes,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/portal',
      children: PortalRoutes,
      meta: { requiresAuth: true }
    },
    {
      path: '/projects',
      children: ProjectsRoutes,
      meta: { requiresAuth: true }
    },
  ]
});

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  // If route requires auth and user is not authenticated
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/auth/login');
  } 
  // If user is authenticated and tries to access login page
  else if (to.path === '/auth/login' && isAuthenticated) {
    next('/portal/homeview');
  }
  // If route requires admin access
  else if (to.matched.some(record => record.meta.requiresAdmin)) {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      next('/auth/admin-login');
    } else {
      next();
    }
  }
  else {
    next();
  }
});

export default router
