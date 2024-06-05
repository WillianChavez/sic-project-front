import Vue from "vue";
import store from "../store";

const http_client = async (
    url,
    data = {},
    method = "get",
    headers = {},
    sendToken = true
) => {
    const token = store.state.token
        ? store.state.token
        : localStorage.getItem("token");

    if (token && sendToken) headers.Authorization = "Bearer " + token;

    let config = {
        method,
        url,
        headers,
    };
    if (method === "get") {
        config.params = data;
    } else {
        config.data = data;
    }
    try {
        return await Vue.prototype.axios(config);
    } catch (e) {
        if (e.response.status === 500) {
            Vue.prototype.temporalAlert({
                show: true,
                message: e.response.data.message
                    || e.response.data.description
                    || "Ha ocurrido un error interno",
                type: "error",
            });
        } else if (e.response.status === 422) {
            Vue.prototype.temporalAlert({
                show: true,
                message: e.response.data.message
                    || e.response.data.description
                    || "No se pudo procesar la entidad",
                type: "error",
            });
        } else if (e.response.status === 404) {
            Vue.prototype.temporalAlert({
                show: true,
                message: e.response.data.message
                    || e.response.data.description
                    || "No se encontró el recurso",
                type: "error",
            });
        } else if (e.response.status === 403) {
            Vue.prototype.temporalAlert({
                show: true,
                message: e.response.data.message
                    || e.response.data.description
                    || "Petición rechazada",
                type: "error",
            });
        } else if (e.response.status === 400) {
            Vue.prototype.temporalAlert({
                show: true,
                message: e.response.data.message
                    || e.response.data.description
                    || "Petición erronea",
                type: "error",
            });
        } else if (e.response.status === 401) {
            Vue.prototype.temporalAlert({
                show: true,
                message: e.response.data.message
                    || e.response.data.description
                    || "Acceso no autorizado",
                type: "error",
            });
        } else {
            Vue.prototype.temporalAlert({
                show: true,
                message: e.response.data.message
                    || e.response.data.description
                    || "Error al realizar petición",
                type: "error",
            });
        }
        throw e;
    }
};

Vue.prototype.http_client = http_client;

export {http_client};
