const routes = [
  {
    path: '/',
    name: 'portal',
    redirect: '/portal/homeview', // redirect to the correct path
    meta: { requiresAuth: true },
  },
  {
    path: '/portal/homeview',
    name: 'HomeView',
    component: () => import('@/views/portal/HomeView.vue')
  },
  {
    path: '/portal/mydashboard',
    name: 'MyDashboard',
    component: () => import('@/views/portal/MyDashboard.vue')
  }, 
  {
    path: '/portal/settings',
    name: 'Settings',
    component: () => import('@/views/portal/Settings.vue')
  },
  {
    path: '/portal/userprojects',
    name: 'UserProjects',
    component: () => import('@/views/portal/UserProjects.vue')
  },
  {
    path: '/portal/community',
    name: 'Community',
    component: () => import('@/views/portal/Community.vue')
  },
]

export {routes}


