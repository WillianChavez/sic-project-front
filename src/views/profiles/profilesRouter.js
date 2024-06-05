export default [
    {
        path: "profiles",
        name: "profiles",
        component: () =>
            import(
                /* webpackChunkName: "perfilesList" */ "./profiles.vue"
                ),
    },
    {
        path: "profiles/create",
        name: "profilesCreate",
        component: () =>
            import(
                /* webpackChunkName: "perfilesCreate" */ "./profileForm.vue"
                ),
    },
    {
        path: "profiles/edit/:id",
        name: "profilesEdit",
        component: () =>
            import(
                /* webpackChunkName: "perfilesEdit" */ "./profileForm.vue"
                ),
    },
]
