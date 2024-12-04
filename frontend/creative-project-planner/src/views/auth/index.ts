const routes = [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/login.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/userRegister',
      name: 'UserRegister',
      component: () => import('@/views/auth/userRegister.vue'),
      meta: { requiresAuth: true },
    }, 
  ]
  
  export {routes}