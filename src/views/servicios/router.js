export default [
    {
        path: "/servicios",
        name: "servicios",
        component: () =>
            import(
                /* webpackChunkName: "servicios" */ "./index.vue"
                ),
    },
    {
        path: "/servicios/crear",
        name: "servicios-crear",
        component: () =>
            import(
                /* webpackChunkName: "servicios" */ "./ServicioForm.vue"
                ),
    },
]