const routes = [
  {
    path: '/homeview',
    name: 'HomeView',
    component: HomeView,
  },
  {
    path: '/dashboard',
    name: 'MyDashboard',
    component: MyDashboard,
    meta: { requiresAuth: true }  
  }, 
  {
    path: '/settings',
    name: 'Settings',
    component: Settngs,
  },
  {
    path: '/projects',
    name: 'Projects',
    component: Projects,
  },
  {
    path: '/community',
    name: 'Community',
    component: Community,
  },
  {
    path: '/projectsdetails',
    name: 'ProjectsDetails',
    component: ProjectsDetails,
  },
  
]

export default routes,
