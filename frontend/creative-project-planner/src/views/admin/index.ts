const routers = [
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/admin/profile.vue')
    },
    {
        path: '/settings',
        name: 'Settings',
        component: () => import('@/views/admin/settings.vue')
    },
]

export {routers }