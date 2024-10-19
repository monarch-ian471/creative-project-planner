const routes = [
  {
    path: '/homeview',
    name: 'HomeView',
    component: () => import('@/views/portal/HomeView.vue')
  },
  {
    path: '/mydashboard',
    name: 'MyDashboard',
    component: () => import('@/views/portal/MyDashboard.vue')
  }, 
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/portal/Settings.vue')
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('@/views/portal/Projects.vue')
  },
  {
    path: '/community',
    name: 'Community',
    component: () => import('@/views/portal/Community.vue')
  },
  {
    path: '/projectdetails',
    name: 'ProjectDetails',
    component: () => import('@/views/portal/ProjectDetail.vue')
  },
  
]

export {routes}
