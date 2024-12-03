const routes = [
    {
      path: '/portal/projects',
      name: 'projectList',
      component: () => import('@/views/projects/projectList.vue')
    },
    {
      path: '/portal/project/create',
      name: 'createProject',
      component: () => import('@/components/project/projectForm.vue')
    },
    {
      path: '/portal/project/:id',
      name: 'projectDetail',
      component: () => import('@/views/projects/projectDetail.vue')
    }
  ];