const routes = [
    {
      path: '/projects',
      name: 'projectList',
      component: () => import('@/views/projects/projectsList.vue')
      ,meta: { requiresAuth: true },
    },
    {
      path: '/projects/create',
      name: 'createProject',
      component: () => import('@/views/projects/createProject.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/projects/:id',
      name: 'projectDetail',
      component: () => import('@/views/projects/projectDetail.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/projects/projectCard',
      name: 'ProjectCard',
      component: () => import('@/views/projects/projectCard.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/projects/projectForm',
      name: 'ProjectForm',
      component: () => import('@/views/projects/projectForm.vue'),
    },
  ];

  export {routes}