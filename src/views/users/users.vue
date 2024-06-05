<template>
  <v-container class="pa-0 pa-sm-2 justify-center d-flex" fill-height fluid>
    <v-flex xs12 sm11 md10 lg9>
      <v-card class="pa-4" rounded="lg">
        <v-card-title
            primary-title
            class="d-flex justify-space-between blueGrayMinsal--text"
        >
          Usuarios
          <div>
            <v-btn v-if="hasRole('ROLE_ADMIN_USER_CREATE')"
                rounded
                color="blueMinsal"
                class="white--text ma-1"
                :to="{name:'usersCreate'}"
            >
              <v-icon left>mdi-plus</v-icon>
              Agregar
            </v-btn
            >
          </div>
        </v-card-title>
        <v-card-text>
          <v-skeleton-loader v-if="loading"></v-skeleton-loader>
          <v-data-table hide-default-footer disable-pagination
                        :headers="headers"
                        :items="usuarios"
                        item-key="id"
                        class="elevation-0 border-1"
                        no-data-text="No hay datos"
                        no-results-text="No hay resultados"
                        v-if="usuarios.length > 0">
            <template #item.numero="{ index }">
              {{ ((page - 1) * per_page) + index + 1 }}
            </template>
            <template #item.last_login="{ item }">
              {{ item.last_login | moment("DD/MM/YYYY") }}
            </template>
            <template #item.is_suspended="{ item }">
              <v-chip class="ma-2 white--text" color="red darken-1" small v-if="item.is_suspended">No</v-chip>
              <v-chip class="ma-2 white--text" color="blueMinsal" v-else small>Si</v-chip>
            </template>
            <template v-slot:[`item.accion`]="{ item }">
              <v-btn icon small @click="showUsuarioData(item)">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
              <v-btn icon small v-if="hasRole('ROLE_ADMIN_USER_UPDATE')" :to="{name:'usersEdit', params:{id:item.id}}">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small @click="deleteUsuarios(item.id)" v-if="hasRole('ROLE_ADMIN_USER_DELETE')">
                <v-icon>{{ item.is_suspended ? 'mdi-check' : 'mdi-delete' }}</v-icon>
              </v-btn>
            </template>
          </v-data-table>

          <v-row class="mt-4">
            <v-col>
              <v-select :items="options"
                        v-model.number="per_page" label="Cantidad por página"></v-select>
            </v-col>
            <v-col class="d-flex justify-center align-center">
              <p>Total registros {{total_rows}}</p>
            </v-col>
            <v-col >
              <v-pagination
                  v-model="page"
                  @input="getUsuarios"
                  :length="totalPages"
              ></v-pagination>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-dialog v-model="usuarioModal" scrollable max-width="500px" transition="dialog-transition">
      <v-card rounded="lg" max-height="700px">
        <v-card-title primary-title> Detalle:</v-card-title>
        <v-card-text>
          <span class="font-weight-bold">Correo electrónico</span>
          <v-spacer></v-spacer>
          {{ usuarioData ? usuarioData.email : null }}
          <v-spacer></v-spacer>
          <span class="font-weight-bold">Deshabilitado</span>
          <v-spacer></v-spacer>
          <v-chip class="ma-2 white--text" color="blueMinsal" small
                  v-if="usuarioData ? usuarioData.is_suspended : false">Si
          </v-chip>
          <v-chip class="ma-2 white--text" color="red" v-else small>No</v-chip>
          <v-spacer></v-spacer>
          <span class="font-weight-bold" v-if="usuarioData ? usuarioData.last_login : false">Ultima conexión</span>
          <v-spacer></v-spacer>
          {{ usuarioData ? usuarioData.last_login : "2000-01-01" | moment("DD/MM/YYYY") }}
          <v-spacer></v-spacer>
          <span class="font-weight-bold" v-if="usuarioData ? usuarioData.Rols && usuarioData.Rols.length > 0 : false">Roles</span>
          <ul>
            <li v-for="(rol, i) in usuarioData ? usuarioData.Rols : []" :key="i">
              {{ rol.name }}
            </li>
          </ul>
          <v-spacer></v-spacer>
          <span class="font-weight-bold"
                v-if="usuarioData ? usuarioData.Perfils && usuarioData.Perfils.length > 0 : false">Perfiles</span>
          <v-spacer></v-spacer>
          <ul>
            <li
                v-for="(perfil, i) in usuarioData ? usuarioData.Perfils : []"
                :key="i"
            >
              {{ perfil.nombre }}
            </li>
          </ul>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    usuarios: [],
    options: [{value: 10, text: '10'}, {value: 25, text: '25'}, {value: 50, text: '50'}],
    page: 1,
    per_page: 10,
    total_rows: 0,
    loading: false,
    usuarioModal: false,
    usuarioData: null,
    headers: [
      {
        text: "N",
        align: "start",
        value: "numero",
      }, {
        text: "Correo electrónico",
        align: "start",
        value: "email",
      },
      {
        text: "Ultima conexión",
        align: "start",
        value: "last_login",
      },
      {
        text: "Habilitado",
        align: "start",
        value: "is_suspended",
      },
      {text: "Accion", value: "accion", sortable: false, width: "150"},
    ],
  }),
  methods: {
    async getUsuarios() {
      this.loading = true;
      const response = await this.services.users.getUsers({
        per_page: this.per_page,
        page: this.page
      })
      this.usuarios = response?.data;
      const {page, per_page, total_rows}=this.getPaginationProperties(response)
      this.per_page = per_page;
      this.page = page;
      this.total_rows = total_rows;
      this.loading = false;
    },
    showUsuarioData(item) {
      this.usuarioModal = true;
      this.usuarioData = item;
    },
    async deleteUsuarios(idUser) {
      const response=await this.services.users.deleteUser(idUser)
      this.temporalAlert({
        show: true,
        message: response?.data?.message || 'Exitoso',
        type: "success",
      });
      await this.getUsuarios();
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
      this.getUsuarios()
    }
  },
  async created() {
    await this.getUsuarios();
  },
};
</script>
