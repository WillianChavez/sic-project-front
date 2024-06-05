import store from "../store";
import Vue from "vue";

const hasRole = (role) => {
    return store.state.userInfo.roles.some(row=>row===role)
}

Vue.prototype.hasRole=hasRole;

export {
    hasRole
}