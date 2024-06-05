<template>
  <v-container class="pa-0 pa-sm-2 justify-center d-flex" fill-height fluid>
    <v-flex xs12 sm11 md11 lg10>
      <v-card class="pa-4" rounded="lg">
        <v-card-title
            primary-title
            class="d-flex justify-space-between blueGrayMinsal--text"
        >
          Rutas
          <div>
            <v-btn
                rounded
                color="blueMinsal"
                class="white--text ma-1"
                :to="{name:'pathsCreate'}"
                v-if="hasRole('ROLE_ADMIN_PATH_CREATE')">
              <v-icon left>mdi-plus</v-icon>
              Agregar
            </v-btn
            >
          </div>
        </v-card-title>
        <v-card-text>
          <v-skeleton-loader v-if="loading"></v-skeleton-loader>
          <v-data-table
              :headers="headers"
              :items="paths"
              item-key="id"
              class="elevation-0 border-1"
              no-data-text="No hay datos"
              no-results-text="No hay resultados"
              disable-pagination
              hide-default-footer
              v-else
          >
            <template v-slot:[`item.mostrar`]="{ item }">
              <v-chip class="ma-2 white--text" color="blueMinsal" small v-if="item.mostrar">
                Si
              </v-chip>
              <v-chip class="ma-2 white--text" color="red darken-1" v-else small>
                No
              </v-chip>
            </template>
            <template v-slot:[`item.icono`]="{ item }">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-on="on" v-bind="attrs">{{ item.icono }}</v-icon>
                </template>
                {{ item.icono }}
              </v-tooltip>
            </template>
            <template v-slot:[`item.publico`]="{ item }">
              <v-chip class="ma-2 white--text" color="blueMinsal" small v-if="item.publico">
                Si
              </v-chip>
              <v-chip class="ma-2 white--text" color="red darken-1" v-else small>
                No
              </v-chip>
            </template>
            <template v-slot:[`item.admin`]="{ item }">
              <v-chip class="ma-2 white--text" color="blueMinsal" small v-if="item.admin">
                Si
              </v-chip>
              <v-chip class="ma-2 white--text" color="red darken-1" v-else small>
                No
              </v-chip>
            </template>
            <template v-slot:[`item.accion`]="{ item }" v-if="hasRole('ROLE_ADMIN_PATH_UPDATE')">
              <v-btn icon small :to="{name:'pathsEdit', params:{id:item.id}}">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-data-table>
          <v-row class="mt-4">
            <v-col>
              <v-select :items="options"
                        v-model.number="per_page" label="Cantidad por página"></v-select>
            </v-col>
            <v-col class="d-flex justify-center align-center">
              <p>Total registros {{ total_rows }}</p>
            </v-col>
            <v-col>
              <v-pagination
                  v-model="page"
                  @input="getPaths"
                  :length="totalPages"
              ></v-pagination>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-container>
</template>
<script>
import {mapActions} from "vuex";

export default {
  data: () => ({
    paths: [],
    options: [{value: 10, text: '10'}, {value: 25, text: '25'}, {value: 50, text: '50'}],
    loading: false,
    headers: [
      {
        text: "Nombre",
        align: "start",
        value: "nombre",
      },
      {
        text: "URI",
        align: "start",
        value: "uri",
      },
      {
        text: "Nombre URI",
        align: "start",
        value: "nombre_uri",
      },
      {
        text: "Icono",
        align: "start",
        sortable: false,
        value: "icono",
      },
      {
        text: "Mostrar",
        align: "start",
        value: "mostrar",
      },
      {
        text: "Publico",
        align: "start",
        value: "publico",
      },
      {
        text: "Administrador",
        align: "start",
        value: "admin",
      },
      {text: "Accion", value: "accion", sortable: false, width: "100"},
    ],
    page: 1,
    per_page: 10,
    total_rows: 0,
  }),
  methods: {
    ...mapActions("utils", ["getMenu"]),
    async getPaths() {
      this.loading = true;
      const response = await this.services.paths.getPaths({
        page: this.page,
        per_page: this.per_page
      })
      const {page, per_page, total_rows} = this.getPaginationProperties(response)
      this.paths = response.data;
      this.page = page;
      this.per_page = per_page;
      this.total_rows = total_rows;
      this.loading = false;
    },
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total_rows / this.per_page)
    }
  },
  watch: {
    per_page() {
      this.page = 1;
      this.getPaths()
    }
  },
  async created() {
    this.getPaths()
  },
};
</script>
