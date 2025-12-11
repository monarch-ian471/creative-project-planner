const routes = [
  {
    path: '/',
    name: 'portal',
    redirect: '/portal/homeview',
    meta: { requiresAuth: true },
  },
  {
    path: '/portal/homeview',
    name: 'HomeView',
    component: () => import('@/views/portal/HomeView.vue')
  },
  {
    path: '/portal/mydashboard',
    name: 'Profile',
    component: () => import('@/views/portal/MyDashboard.vue')
  }, 
  {
    path: '/portal/settings',
    name: 'UserSettings',
    component: () => import('@/views/portal/UserSettings.vue')
  },
  {
    path: '/portal/community',
    name: 'Community',
    component: () => import('@/views/portal/Community.vue')
  },
]

export {routes}




