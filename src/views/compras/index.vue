<template>
  <v-container class="pa-0 pa-sm-2 justify-center d-flex" fill-height fluid>
    <v-flex xs12 sm11 md11 lg10>
      <v-card class="pa-4" rounded="lg">
        <v-card-title primary-title class="d-flex justify-space-between blueGrayMinsal--text">
          Compras
          <div>
            <v-btn rounded color="blueMinsal" class="white--text ma-1" :to="{ name: 'compras-crear' }">
              <v-icon left>mdi-plus</v-icon>
              Agregar
            </v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <v-skeleton-loader v-if="loading"></v-skeleton-loader>
          <v-data-table :headers="headers" :items="data" item-key="id" class="elevation-0 border-1"
            no-data-text="No hay datos" no-results-text="No hay resultados" disable-pagination hide-default-footer v-else>
            <template v-slot:[`item.mostrar`]="{ item }">
              <v-chip class="ma-2 white--text" color="blueMinsal" small v-if="item.mostrar">
                Si
              </v-chip>
              <v-chip class="ma-2 white--text" color="red darken-1" v-else small>
                No
              </v-chip>
            </template>
            <template v-slot:[`item.accion`]="{ item }">

              <v-btn icon small :to="`/compras/crear?show=true`">
                <v-icon>mdi-eye</v-icon>
              </v-btn>

              <v-btn icon small @click="deleteCompra(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
          <v-row class="mt-4">
            <v-col>
              <v-select :items="options" v-model.number="per_page" label="Cantidad por página"></v-select>
            </v-col>
            <v-col class="d-flex justify-center align-center">
              <p>Total registros {{ total_rows }}</p>
            </v-col>
            <v-col>
              <v-pagination v-model="page" @input="getCompras" :length="totalPages"></v-pagination>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-container>
</template>
<script>
import { mapActions } from "vuex";

export default {
  data: () => ({
    compras: [],
    options: [{ value: 10, text: '10' }, { value: 25, text: '25' }, { value: 50, text: '50' }],
    loading: false,
    headers: [
      {
        text: "Fecha de emisión",
        align: "start",
        value: "fecha",
      },
      {
        text: "Proveedor",
        align: "start",
        value: "Persona.nombre",
      },
      {
        text: "Descripción",
        align: "start",
        value: "descripcion",
      },
      {
        text: "N° de documento",
        align: "start",
        value: "numero_documento",
      },
      {
        text: "Cuenta contable",
        align: "start",
        value: "Cuenta.nombre",
      },
      {
        text: "Cuenta contrapartida",
        align: "start",
        value: "ee",
      },
      {
        text: "Gravadas internas",
        align: "start",
        value: "gravadas_internas",
      },
      {
        text: "Gravadas de importación",
        align: "start",
        value: "gravadas_importacion",
      },
      {
        text: "Exentas internas",
        align: "start",
        value: "exentas_internas",
      },
      {
        text: "Exentas de internación",
        align: "start",
        value: "exentas_internacion",
      },
      {
        text: "Exentas de importación",
        align: "start",
        value: "exentas_importacion",
      },
      {
        text: "Compras sujeto exluido",
        align: "start",
        value: "sujeto_excluido",
      },

      { text: "Accion", value: "accion", sortable: false, width: "100" },
    ],
    data: [{ "fecha": "21/11/2023", ee: "Mantenimiento de equipos" ,"Persona": { "nombre": "Carlos Sánchez" }, "descripcion": "Compra de Velas", "numero_documento": "002", "Cuenta": { "nombre": "Banco" }, "gravadas_internas": 200, "gravadas_importacion": 0, "exentas_internas": 0, "exentas_internacion": 0, "exentas_importacion": 0, "sujeto_excluido": 200 }],
    page: 1,
    per_page: 10,
    total_rows: 0,
    form: {
      nombre: null,
      codigo: null,
      id_tipo_cuenta: null,
    },
  }),


  methods: {
    ...mapActions("utils", ["getMenu"]),
    async getCompras() {
      this.loading = true;
      const response = await this.services.compra.getCompras({
        page: this.page,
        per_page: this.per_page
      })
      const { page, per_page, total_rows } = this.getPaginationProperties(response)
      this.compras = response.data;
      this.page = page;
      this.per_page = per_page;
      this.total_rows = total_rows;
      this.loading = false;
    },
    async deleteCompra(id) {
      const response = await this.services.compra.deleteCompra(id)
      if (response.status === 200) {
        this.temporalAlert({
          show: true,
          message: 'Compra eliminada con éxito',
          type: "success",
        });
        this.getCompras()
      }
    },
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total_rows / this.per_page)
    },
  },
  watch: {
    per_page() {
      this.page = 1;
      this.getCompras()
    }
  },
  async created() {
    this.getCompras()
  },
};
</script>
