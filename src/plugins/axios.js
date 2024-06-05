"use strict";

import Vue from "vue";
import axios from "axios";
import router from "../router";
import store from "../store";
import jwtDecode from "jwt-decode";

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
    baseURL: process.env.VUE_APP_API_URL || "http://127.0.0.1:8000/",
    // timeout: 60 * 1000, // Timeout
    // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
_axios.interceptors.response.use(
    (response) => response,
    (error) => {
        /**
         * Logica para refresh token
         * */
        const status = error.response.status;

        if (
            status !== 401 ||
            (status === 401 && (window.location.pathname === "/login" || window.location.pathname.includes('/verify-mail/')) )
        ) {
            return Promise.reject(error);
        }
        const token = store.state.token
            ? store.state.token
            : localStorage.getItem("token");
        const base = process.env.VUE_APP_API_URL;
        return axios
            .post(
                base + "/api/v1/refresh",
                {
                    refresh_token: localStorage.getItem("refresh_token"),
                },
                "Bearer " + token
            )
            .then((response) => {
                if (response.status === 200) {
                    const token = response.data.token;
                    localStorage.setItem("token", token);
                    localStorage.setItem("refresh_token", response.data.refresh_token);
                    store.commit("setToken", token);
                    store.commit("setUserInfo", jwtDecode(token));
                    error.response.config.headers["Authorization"] = "Bearer " + token;
                    return axios(error.response.config);
                }
            })
            .catch((error) => {
                store.commit("utils/setLoader", false);
                if (error.response.status === 401) {
                    localStorage.clear();
                    store.commit("setToken", null);
                    store.commit("setUserInfo", {});
                    router.push("/login").catch((err) => {
                    });
                }
                return Promise.reject(error);
            });
        /**
         * finish here
         * */
    }
);

Plugin.install = function (Vue, options) {
    Vue.axios = _axios;
    window.axios = _axios;
    Object.defineProperties(Vue.prototype, {
        axios: {
            get() {
                return _axios;
            },
        },
        $axios: {
            get() {
                return _axios;
            },
        },
    });
};

Vue.use(Plugin);

export default Plugin;
