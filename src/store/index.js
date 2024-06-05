import Vue from 'vue'
import Vuex from 'vuex'
import utils from '../modules/utils'
import jwtDecode from "jwt-decode";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: null,
        userInfo: {},
    },
    mutations: {
        setToken(state, payload) {
            state.token = payload
        },
        setUserInfo(state, payload) {
            state.userInfo = payload
        },
    },
    actions:{
      setAuth({commit}, payload){
          const {token, refreshToken} =payload
          commit('setUserInfo', jwtDecode(token))
          commit('setToken', token)
          localStorage.setItem('token', token)
          localStorage.setItem('refresh_token', refreshToken)
          localStorage.setItem('user_info', JSON.stringify(jwtDecode(token)))
      }
    },
    modules: {
        utils,
    }
})
