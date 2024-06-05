export default [
    {
        path: "/reportes",
        name: "reportes",
        component: () =>
            import(
                /* webpackChunkName: "reportes" */ "./index.vue"
                ),
    },
    {
        path: "/reportes/libro-ventas-contribuyentes",
        name: "reportes-libro-ventas-contribuyentes",
        component: () =>
            import(
                /* webpackChunkName: "compras" */ "./RepContribuyentes.vue"
                ),
    },
    {
        path: "/reportes/libro-ventas-consumidores-finales",
        name: "reportes-libro-ventas-consumidores-finales",
        component: () =>
            import(
                /* webpackChunkName: "compras" */ "./RepConsumidores.vue"
                ),
    },
    {
        path: "/reportes/libro-compras",
        name: "reportes-libro-compras",
        component: () =>
            import(
                /* webpackChunkName: "compras" */ "./RepCompras.vue"
                ),
    },
    {
        path: "/reportes/libro-diario",
        name: "reportes-libro-diario",
        component: () =>
            import(
                /* webpackChunkName: "compras" */ "./RepDiario.vue"
                ),
    },
    {
        path: "/reportes/libro-mayor",
        name: "reportes-libro-mayor",
        component: () =>
            import(
                /* webpackChunkName: "compras" */ "./RepMayor.vue"
                ),
    }
]