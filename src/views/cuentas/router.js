export default [
    {
        path: "/cuentas",
        name: "cuentas",
        component: () =>
            import(
                /* webpackChunkName: "cuentas" */ "./index.vue"
                ),
    },
]