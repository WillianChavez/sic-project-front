import pathServices from "../../services/path.services"

export default {
    namespaced: true,
    state: {
        alert: {
            show: false,
            type: "info",
            message: "",
            timeout: 2500,
        },
        loader: false,
        sideBar: false,
        menu: [],
        rutas: [],
    },
    getters: {
        getAlert: (state) => {
            return state.alert;
        },
    },
    mutations: {
        setAlert: (state, payload) => {
            state.alert = payload;
        },
        setLoader: (state, payload) => {
            state.loader = payload;
        },
        setSideBar: (state, payload) => {
            state.sideBar = payload;
        },
        setMenu: (state, menu) => {
            state.menu = menu;
        },
        setRutas: (state, rutas) => {
            state.rutas = rutas;
        },
    },
    actions: {
        getMenu: async ({commit}) => {
            const response = await pathServices.getAuthorizedPaths()
            const menu = getNavItem(response?.data)
            commit("setMenu", menu);
            commit("setRutas", response.data);

        },
        clearMenu: ({commit}) => {
            commit("setMenu", []);
            commit("setRutas", []);
        }
    },
};

const getNavItem = (items) => {
    return items.filter((item) => {
        if (!item.mostrar) return false
        if (item.childrens?.length > 0) item.childrens = getNavItem(item.childrens)
        return true
    })
}
