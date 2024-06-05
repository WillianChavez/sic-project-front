<template>
  <v-app>
    <app-loader v-if="loader"></app-loader>

    <app-header></app-header>
    <app-aside-bar :menu="menu"
    ></app-aside-bar>
    <v-main class="bgMinsal">
      <div class="pa-2 pa-sm-4" v-if="userInfo.user">
        <router-view :key="$route.fullPath" />
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import jwtDecode from "jwt-decode";

export default {
  name: "layout",
  methods: {
    ...mapMutations(["setUserInfo"]),
  },
  computed: {
    ...mapState({
      userInfo: "userInfo",
      token: "token",
    }),
    ...mapState("utils", ["loader", "menu"]),
  },
  async created() {
    const userToken = this.token || localStorage.getItem('token');
    if (userToken) {
      const userDecode = jwtDecode(userToken);
      this.setUserInfo(userDecode);
    } else {
      this.$router.push("/login").catch((e) => {});
    }
  },
};
</script>

<style scoped>
</style>