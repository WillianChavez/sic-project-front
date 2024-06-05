<template>
  <v-container class="pa-0 pa-sm-2 justify-center d-flex" fill-height fluid>
    <v-flex xs12 sm11 md10 lg9>
      <v-card class="pa-4" rounded="lg">
        <v-card-title
            primary-title
            class="d-flex justify-space-between blueGrayMinsal--text"
        >
          Perfiles
          <div>
            <v-btn
                rounded
                color="blueMinsal"
                class="white--text ma-1"
                :to="{name:'profilesCreate'}"
                v-if="hasRole('ROLE_ADMIN_PROFILE_CREATE')"
            >
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
              :items="perfiles"
              hide-default-footer
              disable-pagination
              item-key="id"
              class="elevation-0 border-1"
              no-data-text="No hay datos"
              no-results-text="No hay resultados"
              v-else
          >
            <template v-slot:[`item.accion`]="{ item }">
              <v-btn icon small :to="{name:'profilesEdit', params:{id:item.id}}"  v-if="hasRole('ROLE_ADMIN_PROFILE_UPDATE')">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>

        <v-card-actions>
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
                  @input="getProfiles"
                  :length="totalPages"
              ></v-pagination>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-container>
</template>
<script>
import {mapMutations} from "vuex";

export default {
  data: () => ({
    perfiles: [],
    options: [{value: 10, text: '10'}, {value: 25, text: '25'}, {value: 50, text: '50'}],
    page: 1,
    total_rows: 0,
    per_page: 10,
    loading: false,
    headers: [
      {
        text: "Código",
        align: "start",
        value: "codigo",
      },
      {
        text: "Nombre",
        align: "start",
        value: "nombre",
      },
      {text: "Accion", value: "accion", sortable: false, width: "100"},
    ],
  }),
  methods: {
    ...mapMutations('utils', ['setLoader']),
    async getProfiles() {
      this.loading = true;
      const response = await this.services.profiles.getProfiles({
        page: this.page,
        per_page: this.per_page,
      });
      this.perfiles = response.data;
      const {page, per_page, total_rows} = this.getPaginationProperties(response)
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
      this.getProfiles()
    }
  },
  async created() {
    await this.getProfiles();
  },
};
</script>
