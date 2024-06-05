
<template>
  <v-container class="pa-0 pa-sm-2 justify-center d-flex" fill-height fluid>
    <main>
      <h1>Reportes Financieros</h1>
      <h2>Libro Diario</h2>

      <!-- // filtros de busqueda, por Fecha solo mes -->
      <v-card class="mt-6" style="width: 100%;">
        <v-card-title style="width: 290px;">
          <v-menu offset-y ref="menu" transition="scale-transition" :close-on-content-click="false" max-width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="search" append-icon="mdi-calendar" label="Buscar por fecha" v-bind="attrs" v-on="on"
                max-width="290px"></v-text-field>
            </template>
            <v-date-picker v-model="search" type="date" @input="$refs.menu.save(search)"></v-date-picker>
          </v-menu>

        </v-card-title>
        <!-- // tabla de datos, con totales por columna al final de la tabla -->
        <v-data-table :headers="headers" :items="items" :search="search" :loading="loading" class="elevation-1">
          <template v-slot:item.cuenta="{ item }">
            <v-chip color="primary" dark>{{ item.cuenta }}</v-chip>
          </template>
          <template v-slot:item.debe="{ item }">
            <v-chip color="primary" dark>{{ item.debe }}</v-chip>
          </template>
          <template v-slot:item.haber="{ item }">
            <v-chip color="primary" dark>{{ item.haber }}</v-chip>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">No hay datos nuevos. Click para recargar</v-btn>
          </template>
        </v-data-table>

        Resumen
        <div class="d-flex">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Debe</v-list-item-title>
            </v-list-item-content>
            <v-list-item-content class="align-end">
              <v-list-item-title>{{ totalDebe }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Haber</v-list-item-title>
            </v-list-item-content>
            <v-list-item-content class="align-end">
              <v-list-item-title>{{ totalHaber }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>





      </v-card>
    </main>
  </v-container>
</template>
<script>
import { mapActions } from "vuex";

export default {
  data: () => ({
    options: [{ value: 10, text: '10' }, { value: 25, text: '25' }, { value: 50, text: '50' }],
    loading: false,
    search: '',

    // encabezados: cuenta, debe, haber
    headers: [
      { text: 'Cuenta', value: 'cuenta' },
      { text: 'Debe', value: 'debe' },
      { text: 'Haber', value: 'haber' },
    ],

    items: [
      {
        cuenta: 'Bancos',
        debe: 500,
        haber: 100,
      },
      {
        cuenta: 'Caja',
        debe: 300,
        haber: 150,
      },
      {
        cuenta: 'Iva Credito fiscal',
        debe: 200,
        haber: 200,
      },
      {
        cuenta: 'Iva Debito fiscal',
        debe: 150,
        haber: 250,
      },
      {
        cuenta: 'Servicios de Desarrollo',
        debe: 100,
        haber: 250,
      },
      {
        cuenta: 'Inventario',
        debe: 50,
        haber: 50,
      },
    ]
  }),

  computed: {
    totalDebe() {
      return this.items.reduce((sum, item) => sum + item.debe, 0)
    },
    totalHaber() {
      return this.items.reduce((sum, item) => sum + item.haber, 0)
    },
  },
};
</script>
