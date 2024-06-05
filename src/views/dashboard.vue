<template>
  <v-container class="pa-0 pa-sm-2 justify-center d-flex" fill-height fluid>
    <v-flex xs12 sm11 md10 lg9>

      <!-- saludo al usuario -->
      <h1 class="text-center pt-5 text--white">
        Bienvenido {{ userInfo.user.nombre }}
      </h1>

      <!-- mensage de bienvenida y la foto de banner -->
      <v-layout row wrap justify-center>
        <v-flex xs12 sm12 md12 lg12 xl12>
          <v-card class="pa-2 pa-sm-10 mt-5" rounded="lg" :elevation="5">
            <v-card-text>
              <v-layout row wrap justify-center>
                <v-flex xs12 sm12 md12 lg12 xl12>
                  <v-img class="mx-auto d-flex mb-2" src="@/assets/img/banner.png" max-width="550" />
                </v-flex>
                <v-flex xs12 sm12 md12 lg12 xl12>
                  <p class="text-h5 text-center pt-5 text--white">
                    Bienvenido a Gestión Financiera Funerales y Capillas Ismael Guzmán! <br>
                    Una propuesta de software contable fácil de usar!
                  </p>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>


    </v-flex>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "dashboard",
  data: () => ({
    items: [
      {
        nombre: "Usuarios",
        acciones: [
          {
            nombre: "Agregar Nuevo",
            icono: "mdi-plus-circle",
            path: "/users/create",
          },
          { nombre: "Listar", icono: "mdi-view-list", path: "/users/list" },
        ],
      },
      {
        nombre: "Roles",
        acciones: [
          {
            nombre: "Agregar Nuevo",
            icono: "mdi-plus-circle",
            path: "/roles/create",
          },
          { nombre: "Listar", icono: "mdi-view-list", path: "/roles/list" },
        ],
      },
      {
        nombre: "Perfiles",
        acciones: [
          {
            nombre: "Agregar Nuevo",
            icono: "mdi-plus-circle",
            path: "/profiles/create",
          },
          { nombre: "Listar", icono: "mdi-view-list", path: "/profiles/list" },
        ],
      },
      {
        nombre: "Rutas",
        acciones: [
          {
            nombre: "Agregar Nuevo",
            icono: "mdi-plus-circle",
            path: "/paths/create",
          },
          { nombre: "Listar", icono: "mdi-view-list", path: "/paths/list" },
        ],
      },
    ],
  }),
  created() { },

  computed: {
    ...mapState(["userInfo"]),
  },
};
</script>
