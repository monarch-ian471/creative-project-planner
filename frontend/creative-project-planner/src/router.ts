import { createRouter, createWebHistory } from 'vue-router'
// Routes 
// import PublicRoutes from '@/views/public'
import { routes as AdminRoutes } from '@/views/admin'
import { routes as AuthRoutes } from '@/views/auth'
import { routes as PortalRoutes } from '@/views/portal'


const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL || '/'), // Fallback to '/' if not set
  routes: [
    {
      path: '/',
      redirect: '/portal/homeview',
    },
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
  ]
})

export default router
