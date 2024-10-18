const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView,
  },
  {
    path: '/dashboard',
    name: 'MyDashboard',
    component: MyDashboard,
    meta: { requiresAuth: true }  // Mark this route as protected
  },

]