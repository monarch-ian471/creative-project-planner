import { createRouter, createWebHistory } from 'vue-router'
// import store from '@/store'

import { routes as AdminRoutes } from '@/views/admin'
import { routes as AuthRoutes } from '@/views/auth'
import { routes as PortalRoutes } from '@/views/portal'
import { routes as ProjectsRoutes } from '@/views/projects'


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
    {
      path: '/projects',
      children: ProjectsRoutes,  // Ensure PortalRoutes are properly prefixed
    },
  ]
})

// // Navigation Guard
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = store.getters['auth/isAuthenticated']
  
//   if (to.meta.requiresAuth && !isAuthenticated) {
//     // Redirect to login if trying to access authenticated route
//     next({ name: 'Login', query: { redirect: to.fullPath } })
//   } else if (to.meta.requiresGuest && isAuthenticated) {
//     // Redirect to dashboard if authenticated user tries to access login
//     next({ name: 'Dashboard' })
//   } else {
//     next()
//   }
// })

export default router
