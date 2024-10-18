import { createRouter, createWebHistory } from 'vue-router'
// Routes 
import { Routes as PublicRoutes } from '@/views/public'
import { Routes as AdminRoutes } from '@/views/admin'
import { Routes as AuthRoutes } from '@/views/auth'
import { Routes as PortalRoutes } from '@/views/portal'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/auth/login',
    },
    {
      path: '/auth',
      component: () => import('@/components/layouts/plain/layout.vue'),
      children: AuthRoutes,
      meta: { requiresAuth: false }
    },
    {
      path: '/admin',
      component: () => import('@/components/layouts/admin/layout.vue'),
      children: AdminRoutes,
      meta: { requiresAuth: true }
    },
    {
      path: '/portal',
      component: () => import('@/components/layouts/portal/layout.vue'),
      children: PortalRoutes,
      meta: { requiresAuth: false }
    },
  ]
})

export default router
