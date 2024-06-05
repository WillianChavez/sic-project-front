
<template>
  <v-container class="pa-0 pa-sm-2 justify-center d-flex" fill-height fluid>
    <main>
      <h1>Reportes Financieros</h1>
      <h2>Libro de ventas a contribuyentes</h2>

      <!-- // filtros de busqueda, por Fecha -->
      <v-card class="mt-6">
        <v-card-title style="width: 290px;">
          <v-menu offset-y ref="menu" transition="scale-transition" :close-on-content-click="false" max-width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="search" append-icon="mdi-calendar" label="Buscar por fecha" v-bind="attrs" v-on="on"
                max-width="290px"></v-text-field>
            </template>
            <v-date-picker v-model="search" type="month" @input="$refs.menu.save(search)"></v-date-picker>
          </v-menu>

        </v-card-title>
        <v-data-table :headers="headers" :items="items" :search="search" :loading="loading" class="elevation-1">
          <template v-slot:item.numero="{ item }">
            <v-chip color="primary" dark>{{ item.numero }}</v-chip>
          </template>
          <template v-slot:item.fecha="{ item }">
            <v-chip color="primary" dark>{{ item.fecha }}</v-chip>
          </template>
          <template v-slot:item.correlativo="{ item }">
            <v-chip color="primary" dark>{{ item.correlativo }}</v-chip>
          </template>
          <template v-slot:item.nrc="{ item }">
            <v-chip color="primary" dark>{{ item.nrc }}</v-chip>
          </template>
          <template v-slot:item.nombre="{ item }">
            <v-chip color="primary" dark>{{ item.nombre }}</v-chip>
          </template>
          <template v-slot:item.exentas="{ item }">
            <v-chip color="primary" dark>{{ item.exentas }}</v-chip>
          </template>
          <template v-slot:item.noSujetas="{ item }">
            <v-chip color="primary" dark>{{ item.noSujetas }}</v-chip>
          </template>
          <template v-slot:item.gravadasLocales="{ item }">
            <v-chip color="primary" dark>{{ item.gravadasLocales }}</v-chip>
          </template>
          <template v-slot:item.debitoFiscal="{ item }">
            <v-chip color="primary" dark>{{ item.debitoFiscal }}</v-chip>
          </template>
          <template v-slot:item.ivaRetenido="{ item }">
            <v-chip color="primary" dark>{{ item.ivaRetenido }}</v-chip>
          </template>
          <template v-slot:item.totalVentas="{ item }">
            <v-chip color="primary" dark>{{ item.totalVentas }}</v-chip>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">No hay Información. Presione para recargar</v-btn>
          </template>
        </v-data-table>
        Resumen

        <div class="d-flex">

          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title>Total Exentas</v-list-item-title>
              <v-list-item-subtitle>{{ totalExentas }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title>Total No Sujetas</v-list-item-title>
              <v-list-item-subtitle>{{ totalNoSujetas }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title>Total Gravadas Locales</v-list-item-title>
              <v-list-item-subtitle>{{ totalGravadasLocales }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title>Total Débito Fiscal</v-list-item-title>
              <v-list-item-subtitle>{{ totalDebitoFiscal }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title>Total Iva Retenido</v-list-item-title>
              <v-list-item-subtitle>{{ totalIvaRetenido }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title>Total Total Ventas</v-list-item-title>
              <v-list-item-subtitle>{{ totalTotalVentas }}</v-list-item-subtitle>
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

    // encabezados: Nº, Fecha, No. correlativo, NRC, Nombre del contribuyente, Exentas, No Sujetas, Gravadas locales, Débito fiscal, Iva retenido, total de ventas
    headers: [
      { text: 'Nº', value: 'numero' },
      { text: 'Fecha', value: 'fecha' },
      { text: 'No. correlativo', value: 'correlativo' },
      { text: 'NRC', value: 'nrc' },
      { text: 'Nombre del contribuyente', value: 'nombre' },
      { text: 'Exentas', value: 'exentas' },
      { text: 'No Sujetas', value: 'noSujetas' },
      { text: 'Gravadas locales', value: 'gravadasLocales' },
      { text: 'Débito fiscal', value: 'debitoFiscal' },
      { text: 'Iva retenido', value: 'ivaRetenido' },
      { text: 'Total de ventas', value: 'totalVentas' },
    ],

    items: [
      {
        numero: 1,
        fecha: '01/01/2023',
        correlativo: 'CORR001',
        nrc: 'NRC001',
        nombre: 'Contribuyente A',
        exentas: 100,
        noSujetas: 50,
        gravadasLocales: 200,
        debitoFiscal: 150,
        ivaRetenido: 20,
        totalVentas: 470,
      },
      {
        numero: 2,
        fecha: '05/01/2023',
        correlativo: 'CORR002',
        nrc: 'NRC002',
        nombre: 'Contribuyente B',
        exentas: 120,
        noSujetas: 30,
        gravadasLocales: 180,
        debitoFiscal: 100,
        ivaRetenido: 15,
        totalVentas: 445,
      },
      {
        numero: 3,
        fecha: '10/01/2023',
        correlativo: 'CORR003',
        nrc: 'NRC003',
        nombre: 'Contribuyente C',
        exentas: 80,
        noSujetas: 20,
        gravadasLocales: 150,
        debitoFiscal: 120,
        ivaRetenido: 25,
        totalVentas: 395,
      },
    ],
  }),

  computed: {
    totalExentas() {
      return this.items.reduce((total, item) => total + item.exentas, 0);
    },
    totalNoSujetas() {
      return this.items.reduce((total, item) => total + item.noSujetas, 0);
    },
    totalGravadasLocales() {
      return this.items.reduce((total, item) => total + item.gravadasLocales, 0);
    },
    totalDebitoFiscal() {
      return this.items.reduce((total, item) => total + item.debitoFiscal, 0);
    },
    totalIvaRetenido() {
      return this.items.reduce((total, item) => total + item.ivaRetenido, 0);
    },
    totalTotalVentas() {
      return this.items.reduce((total, item) => total + item.totalVentas, 0);
    },
  },
};
</script>
