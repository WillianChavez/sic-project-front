
<template>
  <v-container class="pa-0 pa-sm-2 justify-center d-flex" fill-height fluid>
    <main>
      <h1>Reportes Financieros</h1>
      <h2>Libro compras</h2>

      <!-- // filtros de busqueda, por Fecha solo mes -->
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
          <template v-slot:item.numeroDocumento="{ item }">
            <v-chip color="primary" dark>{{ item.numeroDocumento }}</v-chip>
          </template>
          <template v-slot:item.nrc="{ item }">
            <v-chip color="primary" dark>{{ item.nrc }}</v-chip>
          </template>
          <template v-slot:item.nit="{ item }">
            <v-chip color="primary" dark>{{ item.nit }}</v-chip>
          </template>
          <template v-slot:item.proveedor="{ item }">
            <v-chip color="primary" dark>{{ item.proveedor }}</v-chip>
          </template>
          <template v-slot:item.exentasInternas="{ item }">
            <v-chip color="primary" dark>{{ item.exentasInternas }}</v-chip>
          </template>
          <template v-slot:item.exentasExportacion="{ item }">
            <v-chip color="primary" dark>{{ item.exentasExportacion }}</v-chip>
          </template>
          <template v-slot:item.gravaInternas="{ item }">
            <v-chip color="primary" dark>{{ item.gravaInternas }}</v-chip>
          </template>
          <template v-slot:item.gravaImportacion="{ item }">
            <v-chip color="primary" dark>{{ item.gravaImportacion }}</v-chip>
          </template>
          <template v-slot:item.creditoFiscal="{ item }">
            <v-chip color="primary" dark>{{ item.creditoFiscal }}</v-chip>
          </template>
          <template v-slot:item.anticipoCuentaIvaPercibido="{ item }">
            <v-chip color="primary" dark>{{ item.anticipoCuentaIvaPercibido }}</v-chip>
          </template>
          <template v-slot:item.comprasSujetoExcluido="{ item }">
            <v-chip color="primary" dark>{{ item.comprasSujetoExcluido }}</v-chip>
          </template>
          <template v-slot:item.totalCompras="{ item }">
            <v-chip color="primary" dark>{{ item.totalCompras }}</v-chip>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">No hay Información. Presione para recargar</v-btn>
          </template>
        </v-data-table>

        Resumen
        <div class="d-flex">
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title>Total Exentas Internas</v-list-item-title>
              <v-list-item-subtitle>{{ totalExentasInternas }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title>Total Exentas Exportación</v-list-item-title>
              <v-list-item-subtitle>{{ totalExentasExportacion }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title>Total Grava Internas</v-list-item-title>
              <v-list-item-subtitle>{{ totalGravaInternas }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title>Total Grava Importación</v-list-item-title>
              <v-list-item-subtitle>{{ totalGravaImportacion }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title>Total Credito Fiscal</v-list-item-title>
              <v-list-item-subtitle>{{ totalCreditoFiscal }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title>Total Anticipo Cuenta Iva Percibido</v-list-item-title>
              <v-list-item-subtitle>{{ totalAnticipoCuentaIvaPercibido }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title>Total Compras Sujeto Excluido</v-list-item-title>
              <v-list-item-subtitle>{{ totalComprasSujetoExcluido }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title>Total Total Compras</v-list-item-title>
              <v-list-item-subtitle>{{ totalTotalCompras }}</v-list-item-subtitle>
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

    // encabezados: Nº, Fecha, No. documento, NRC, NIT, Proveedor, exentas internas, exentas exportación, grava internas, grava importación,Credito fiscal, anticipio a cuenta Iva percibido, compras a sujeto excluido, total de compras
    headers: [
      { text: 'Nº', value: 'numero' },
      { text: 'Fecha', value: 'fecha' },
      { text: 'No. documento', value: 'numeroDocumento' },
      { text: 'NRC', value: 'nrc' },
      { text: 'NIT', value: 'nit' },
      { text: 'Proveedor', value: 'proveedor' },
      { text: 'exentas internas', value: 'exentasInternas' },
      { text: 'exentas exportación', value: 'exentasExportacion' },
      { text: 'grava internas', value: 'gravaInternas' },
      { text: 'grava importación', value: 'gravaImportacion' },
      { text: 'Credito fiscal', value: 'creditoFiscal' },
      { text: 'anticipio a cuenta Iva percibido', value: 'anticipoCuentaIvaPercibido' },
      { text: 'compras a sujeto excluido', value: 'comprasSujetoExcluido' },
      { text: 'total de compras', value: 'totalCompras' },
    ],

    items: [
      {
        numero: 1,
        fecha: '01/01/2023',
        numeroDocumento: 'DOC001',
        nrc: 'NRC001',
        nit: 'NIT001',
        proveedor: 'Proveedor A',
        exentasInternas: 100,
        exentasExportacion: 50,
        gravaInternas: 200,
        gravaImportacion: 150,
        creditoFiscal: 300,
        anticipoCuentaIvaPercibido: 20,
        comprasSujetoExcluido: 10,
        totalCompras: 830,
      },
      {
        numero: 2,
        fecha: '05/01/2023',
        numeroDocumento: 'DOC002',
        nrc: 'NRC002',
        nit: 'NIT002',
        proveedor: 'Proveedor B',
        exentasInternas: 120,
        exentasExportacion: 30,
        gravaInternas: 180,
        gravaImportacion: 90,
        creditoFiscal: 250,
        anticipoCuentaIvaPercibido: 15,
        comprasSujetoExcluido: 15,
        totalCompras: 710,
      },
      {
        numero: 3,
        fecha: '10/01/2023',
        numeroDocumento: 'DOC003',
        nrc: 'NRC003',
        nit: 'NIT003',
        proveedor: 'Proveedor C',
        exentasInternas: 80,
        exentasExportacion: 20,
        gravaInternas: 150,
        gravaImportacion: 120,
        creditoFiscal: 200,
        anticipoCuentaIvaPercibido: 25,
        comprasSujetoExcluido: 20,
        totalCompras: 615,
      },
    ],
  }),
  computed: {
    totalExentasInternas() {
      return this.items.reduce((acc, item) => acc + item.exentasInternas, 0)
    },
    totalExentasExportacion() {
      return this.items.reduce((acc, item) => acc + item.exentasExportacion, 0)
    },
    totalGravaInternas() {
      return this.items.reduce((acc, item) => acc + item.gravaInternas, 0)
    },
    totalGravaImportacion() {
      return this.items.reduce((acc, item) => acc + item.gravaImportacion, 0)
    },
    totalCreditoFiscal() {
      return this.items.reduce((acc, item) => acc + item.creditoFiscal, 0)
    },
    totalAnticipoCuentaIvaPercibido() {
      return this.items.reduce((acc, item) => acc + item.anticipoCuentaIvaPercibido, 0)
    },
    totalComprasSujetoExcluido() {
      return this.items.reduce((acc, item) => acc + item.comprasSujetoExcluido, 0)
    },
    totalTotalCompras() {
      return this.items.reduce((acc, item) => acc + item.totalCompras, 0)
    },
  },
};
</script>
