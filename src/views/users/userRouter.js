export default [
    {
        path: "users",
        name: "users",
        component: () =>
            import(
                /* webpackChunkName: "usuariosList" */ "./users.vue"
                ),
    },
    {
        path: "users/create",
        name: "usersCreate",
        component: () =>
            import(
                /* webpackChunkName: "usuariosCreate" */ "./usersCreate.vue"
                ),
    },
    {
        path: "users/edit/:id",
        name: "usersEdit",
        component: () =>
            import(
                /* webpackChunkName: "usuariosEdit" */ "./usersEdit.vue"
                ),
    },
]