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
]

export default routes,
