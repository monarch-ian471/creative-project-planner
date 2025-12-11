const routes = [
    {
      path: '/login',
      name: 'UserAuth',
      component: () => import('@/views/auth/UserAuth.vue'),
    },
    {
      path: '/admin-login',
      name: 'AdminAuth',
      component: () => import('@/views/auth/AdminAuth.vue'),
    },
  ]
  
  export {routes}