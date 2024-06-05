export default [
    {
        path: "/paths",
        name: "paths",
        component: () => import(/* webpackChunkName: "rutasList" */ "./paths.vue" ),
    },
    {
        path: "/paths/create",
        name: "pathsCreate",
        component: () => import(/* webpackChunkName: "formPath" */ "./pathForm.vue" ),
    },
    {
        path: "/paths/edit/:id",
        name: "pathsEdit",
        component: () => import(/* webpackChunkName: "formPath" */ "./pathForm.vue" ),},
];
