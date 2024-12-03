const routes = [
    {
      path: '/component/projectCard',
      name: 'projectCard',
      component: () => import('@/components/projectCard.vue')
    },
    {
      path: '/component/projectForm',
      name: 'projectForm',
      component: () => import('@/components/projectForm.vue')
    },
  ];