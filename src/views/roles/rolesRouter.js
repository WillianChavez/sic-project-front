export default [
    {
        path: "/roles",
        name: "roles",
        component: () =>
            import(
                /* webpackChunkName: "rolesList" */ "./roles.vue"
                ),
    },
]
