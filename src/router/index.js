import Vue from "vue";
import VueRouter from "vue-router";
import rolesRouter from "../views/roles/rolesRouter";
import profilesRouter from "../views/profiles/profilesRouter";
import usersRouter from "../views/users/userRouter";
import pathsRouter from "../views/paths/pathRouter";
import cuentasRouter from "../views/cuentas/router";
import comprasRouter from "../views/compras/router";
import serviciosRouter from '../views/servicios/router';
import reportesRouter from '../views/reportes/router';

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        component: () => import(/* webpackChunkName: "layout" */ "../views/layout"),
        children: [
            {
                path: "/",
                name: "dashboard",
                component: () =>
                    import(/* webpackChunkName: "profiles" */ "../views/dashboard"),
            },
            {
                path: "profile",
                name: "profile",
                component: () =>
                    import(/* webpackChunkName: "profiles" */ "../views/profile"),
            },
            ...rolesRouter,
            ...profilesRouter,
            ...usersRouter,
            ...pathsRouter,
            ...cuentasRouter,
            ...comprasRouter,
            ...serviciosRouter,
            ...reportesRouter,
            {
                path: "/security",
                name: "security",
                component: () => import(/* webpackChunkName: "qr" */ "../views/auth/security"),
            },
        ],
    },
    {
        path: "/login",
        name: "login",
        component: () => import(/* webpackChunkName: "login" */ "../views/auth/login"),
    },
    {
        path: "/forgot-password",
        name: "forgot-password",
        component: () =>
            import(
                /* webpackChunkName: "recuperarPassword" */ "../views/auth/recoverPassword"
                ),
    },
    {
        path: "/reset-password/:id",
        name: "reset-password",
        component: () =>
            import(/* webpackChunkName: "resetPassword" */ "../views/auth/resetPassword"),
    },
    {
        path: "/verify-mail/:token",
        name: "verifyMail",
        component: () =>
            import(/* webpackChunkName: "login" */ "../views/auth/verifyMail"),
    },
    {
        path: "/forbidden",
        name: "Forbidden",
        component: () =>
            import(/* webpackChunkName: "forbidden" */ "../views/forbidden"),
    },
    {
        path: "/autenticacionqr",
        name: "2fa",
        component: () => import(/* webpackChunkName: "qr" */ "../views/auth/2fa"),
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});
router.beforeEach(async (to, from, next) => {
    if (to.fullPath === "/") {
        const token = localStorage.getItem("token");
        if (!token) {
            next("/login");
            return;
        }
    }
    if (await Vue.prototype.canNext(to)) {
        next();
    } else {
        next("/forbidden");
    }
});

export default router;
