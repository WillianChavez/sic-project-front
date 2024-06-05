<template>
  <v-app-bar app :elevation="0" color="bgWhite" dense>
    <v-app-bar-nav-icon @click.stop="setSideBar(!sideBar)"></v-app-bar-nav-icon>
    <v-spacer></v-spacer>

    <v-menu offset-y transition="scroll-y-transition" rounded="lg">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" elevation="" small>
          {{ userInfo.user.email }}
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <v-list dense nav>
        <v-list-item :to="{name:'profile'}" class="my-0">
          <v-list-item-icon>
            <v-icon size="20">mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Perfil</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{name:'security'}" class="my-0">
          <v-list-item-icon>
            <v-icon size="20">mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Seguridad</v-list-item-title>
        </v-list-item>
        <v-list-item @click="cerrarSession()" class="my-0">
          <v-list-item-icon>
            <v-icon size="20">mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Cerrar Sesión</v-list-item-title>
        </v-list-item>
        <v-list-item class="my-0">
          <v-list-item-icon>
            <v-switch
                v-model="$vuetify.theme.dark"
                class="my-0"
                hint="This toggles the global state of the Vuetify theme"
                dense
            ></v-switch>
          </v-list-item-icon>
          <v-list-item-title>Tema Oscuro</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import {mapMutations, mapState} from "vuex";

export default {
  name: "AppHeader",
  methods: {
    ...mapMutations("utils", ["setSideBar", "setMenu"]),
    ...mapMutations(["setToken"]),
    async cerrarSession() {
      this.setMenu([]);
      this.setToken(null);
      await this.services.auth.logout()
      localStorage.clear();
      this.$router.push({name: 'login'}).catch((e) => {
      });
    },
  },
  computed: {
    ...mapState(["userInfo"]),
    ...mapState("utils", {
      sideBar: "sideBar",
    }),
  },
};
</script>

<style scoped>
</style>