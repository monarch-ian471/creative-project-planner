import { createRouter, createWebHistory } from 'vue-router'
// Routes 
// import PublicRoutes from '@/views/public'
import { routers as AdminRoutes } from '@/views/admin'
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
      children: AuthRoutes,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      children: AdminRoutes,
      meta: { requiresAuth: true }
    },
    {
      path: '/portal',
      children: PortalRoutes,
      meta: { requiresAuth: false }
    },
    // {
    //   path: '/public',
    //   children: PublicRoutes,
    //   meta: { requiresAuth: false }
    // },
  ]
})

export default router
