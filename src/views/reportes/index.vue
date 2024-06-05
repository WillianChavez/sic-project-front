<template>
  <v-container class="pa-0 pa-sm-2 justify-center d-flex" fill-height fluid>
    <v-flex xs12 sm11 md11 lg10>
      <!-- // menu de opciones para ir a ver los reportes, 
      // se agrega un boton a la par del nombre para ir a la vista de cada reporte -->

      <!-- listado de reportes -->
      <!-- Libro de ventas a contribuyentes
      Libro de ventas a consumidores finales
      Libro de compras
      Libro diario
      Libro mayor -->

    <main>
      <h1>Reportes Financieros</h1>
      <h2>Informes de registros</h2>
      <v-card class="mt-6">
        <v-list>
          <v-list-item-group>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Libro de ventas a contribuyentes</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn color="primary" text to="/reportes/libro-ventas-contribuyentes">Ver</v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Libro de ventas a consumidores finales</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn color="primary" text to="/reportes/libro-ventas-consumidores-finales">Ver</v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Libro de compras</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn color="primary" text to="/reportes/libro-compras">Ver</v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Libro diario</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn color="primary" text to="/reportes/libro-diario">Ver</v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Libro mayor</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn color="primary" text to="/reportes/libro-mayor">Ver</v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>

    </main>
    </v-flex>
  </v-container>
</template>
<script>
import { mapActions } from "vuex";

export default {
  data: () => ({
    options: [{ value: 10, text: '10' }, { value: 25, text: '25' }, { value: 50, text: '50' }],
    loading: false,
  }),
};
</script>
