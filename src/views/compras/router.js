export default [
    {
        path: "/compras",
        name: "compras",
        component: () =>
            import(
                /* webpackChunkName: "compras" */ "./index.vue"
                ),
    },
    {
        path: "/compras/crear",
        name: "compras-crear",
        component: () =>
            import(
                /* webpackChunkName: "compras" */ "./ComprasForm.vue"
                ),
    },
]