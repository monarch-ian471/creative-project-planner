const routes = [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/login.vue')
    },
    {
      path: '/userRegister',
      name: 'UserRegister',
      component: () => import('@/views/auth/userRegister.vue')
    }, 
  ]
  
  export {routes}