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
      redirect: '/portal/homeview',
    },
    // {
    //   path: '/:pathMatch(.*)*',
    //   name: 'NotFound',
    //   component: () => import('@/views/NotFound.vue'),
    // },    
    {
      path: '/auth',
      children: AuthRoutes,  // Ensure AuthRoutes are properly prefixed
    },
    {
      path: '/admin',
      children: AdminRoutes,  // Ensure AdminRoutes are properly prefixed
    },
    {
      path: '/portal',
      children: PortalRoutes,  // Ensure PortalRoutes are properly prefixed
    },
    {
      path: '/projects',
      children: ProjectsRoutes,  // Ensure PortalRoutes are properly prefixed
    },
  ]
});

// router.push('/').catch(err => {
//   console.error('Navigation error:', err);
//   // Handle the error, e.g., by showing a user-friendly message or redirecting
// });

export default router
