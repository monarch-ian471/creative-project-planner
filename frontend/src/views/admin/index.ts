const routes = [
    {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue')
    },
    {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/Users.vue')
    },
    {
        path: 'products',
        name: 'AdminProducts',
        component: () => import('@/views/admin/Products.vue')
    },
    {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/admin/profile.vue')
    },
    {
        path: 'settings',
        name: 'AdminSettings',
        component: () => import('@/views/admin/settings.vue')
    },
]

export { routes }