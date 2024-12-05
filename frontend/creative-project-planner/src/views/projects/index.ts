const routes = [
    {
      path: '/projects',
      name: 'projectList',
      component: () => import('@/views/projects/projectsList.vue')
    },
    {
      path: '/projects/create',
      name: 'createProject',
      component: () => import('@/views/projects/createProject.vue'),
    },
    {
      path: '/projects/:id',
      name: 'projectDetail',
      component: () => import('@/views/projects/projectDetail.vue'),
    },
    {
      path: '/projects/projectCard',
      name: 'ProjectCard',
      component: () => import('@/views/projects/projectCard.vue'),
    },
    {
      path: '/projects/projectForm',
      name: 'ProjectForm',
      component: () => import('@/views/projects/projectForm.vue'),
    },
  ];

  export {routes}