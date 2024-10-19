import { createRouter, createWebHistory } from 'vue-router'
// Routes 
// import PublicRoutes from '@/views/public'
import { routes as AdminRoutes } from '@/views/admin'
import { routes as AuthRoutes } from '@/views/auth'
import { routes as PortalRoutes } from '@/views/portal'


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/auth/login',
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
