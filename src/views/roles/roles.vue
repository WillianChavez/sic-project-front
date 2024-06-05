<template>
  <v-container class="pa-0 pa-sm-2 justify-center d-flex" fill-height fluid>
    <v-flex xs12 sm11 md10 lg9>
      <v-card class="pa-4" rounded="lg">
        <v-card-title
            primary-title
        >
          <v-row>
            <v-col>
              <v-text-field label="Buscar" v-model="search"></v-text-field>
            </v-col>
            <v-col><h2 class="text-h5 text-center">Roles</h2></v-col>
            <v-col class="text-right">
              <v-btn v-if="hasRole('ROLE_ADMIN_ROLE_CREATE')"
                  rounded
                  color="blueMinsal"
                  class="white--text ma-1"
                  @click="formClean(); showModal=true"
              >
                <v-icon left>mdi-plus</v-icon>
                Agregar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-skeleton-loader v-if="loading"></v-skeleton-loader>
          <v-data-table
              :headers="headers"
              :items="roles"
              disable-pagination
              hide-default-footer
              item-key="id"
              class="elevation-0 border-1"
              no-data-text="No hay datos"
              no-results-text="No hay resultados"
              v-if="roles.length > 0 && !loading"
          >
            <template v-slot:[`item.accion`]="{ item }">
              <v-btn icon small @click="updateRole(item)" v-if="hasRole('ROLE_ADMIN_ROLE_UPDATE')">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small @click="deleteRole(item.id)" v-if="hasRole('ROLE_ADMIN_ROLE_DELETE')">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
          <v-alert
              color="blueMinsal"
              icon="mdi-information"
              prominent
              text
              v-else
          >
            No se encontraron datos
          </v-alert>
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
                  @input="getRoles"
                  :length="totalPages"
              ></v-pagination>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-dialog v-model="showModal" :max-width="360">
      <v-card>
        <v-card-title class="text-center">{{ form.id ? 'Editando ' : 'Registrando' }} Role</v-card-title>
        <v-card-text>
          <v-container>
            <div>
              <v-select label="Seleccione tipo rol" :error-messages="typeRoleErrors" v-model="form.id_tipo_rol"
                        :items="typeRoles" item-value="id"
                        item-text="name" @blur="$v.form.id_tipo_rol.$touch()"></v-select>
            </div>
            <div class="input-role">
              <v-text-field label="nombre" v-model.trim="form.name" :error-messages="nameErrors"
                            @blur="$v.form.name.$touch()" :readonly="!form.id_tipo_rol"></v-text-field>
            </div>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="blue darken-1"
              text
              @click="formClean;showModal = false"
          >
            Cancelar
          </v-btn>
          <v-btn
              color="blue darken-1"
              text
              @click="saveRole"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import {required} from "vuelidate/lib/validators";
import {mapMutations} from "vuex";

export default {
  validations: {
    form: {
      name: {
        required,
        isCorrectRole: function (value) {
          if (!value) return false;
          return value.trim().toUpperCase().startsWith(this.getPrefixRole?.prefijo.trim().toUpperCase())
        }
      },
      id_tipo_rol: {
        required
      }
    }
  },
  data: () => ({
    form: {
      id: null,
      id_tipo_rol: null,
      name: null
    },
    typeRoles: [],
    showModal: false,
    loading: false,
    roles: [],
    page: 1,
    per_page: 10,
    total_rows: 0,
    search: null,
    timer: null,
    headers: [
      {
        text: "Nombre",
        align: "start",
        value: "name",
      },
      {text: "Accion", value: "accion", sortable: false, width: "100"},
    ],
    options: [{value: 10, text: '10'}, {value: 25, text: '25'}, {value: 50, text: '50'}],
  }),
  methods: {
    ...mapMutations('utils', ['setLoader']),
    formClean() {
      this.$v.$reset()
      this.form.name = null;
      this.form.id = null;
      this.form.id_tipo_rol = null
    },
    async deleteRole(idRole) {
      try {
        this.setLoader(true)
        await this.services.roles.deleteRole(idRole)
        await this.getRoles()
        this.temporalAlert({
          show: true,
          type: 'success',
          message: 'Rol eliminado'
        })
      } catch {
      } finally {
        this.setLoader(false)
      }
    },
    async getTypeRoles() {
      const response = await this.services.typeRoles.getTypeRoles()
      this.typeRoles = response.data
    },
    async getRoles() {
      const response = await this.services.roles.getRoles({
        nombre: this.search,
        page: this.page,
        per_page: this.per_page,
      })
      this.roles = response.data;
      const {page, per_page, total_rows} = this.getPaginationProperties(response)
      this.page = page
      this.per_page = per_page
      this.total_rows = total_rows
    },
    async saveRole() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        try {
          this.loading = true
          const body = {
            name: this.form.name.trim().toUpperCase(),
            id_tipo_rol: this.form.id_tipo_rol
          }
          if (this.form.id)
            await this.services.roles.updateRole(this.form.id, body)
          else
            await this.services.roles.createRole(body)
          await this.getRoles()
          this.temporalAlert({
            show: true,
            type: 'success',
            message: this.form.id ? 'Role actualizado' : 'Role Registrado'
          })
          this.showModal = false
        } catch {
        } finally {
          this.loading = false
        }
      }
    },
    updateRole(item) {
      this.form.name = item.name;
      this.form.id = item.id;
      this.showModal = true
    }
  },
  computed: {
    nameErrors() {
      const errors = []
      if (!this.$v.form.name.$dirty) return errors
      !this.$v.form.name.required && errors.push('Rol es obligatorio')
      !this.$v.form.name.isCorrectRole && errors.push(`Rol tiene que iniciar ${this.getPrefixRole?.prefijo}`)
      return errors
    },
    typeRoleErrors() {
      const errors = []
      if (!this.$v.form.id_tipo_rol.$dirty) return errors
      !this.$v.form.id_tipo_rol.required && errors.push('Tipo de rol es obligatorio')
      return errors
    },
    getPrefixRole() {
      return this.typeRoles.find(type => type.id === this.form.id_tipo_rol)
    },
    totalPages() {
      return Math.ceil(this.total_rows / this.per_page)
    }
  },
  watch: {
    per_page() {
      this.page = 1;
      this.getRoles()
    },
    search() {
      if (this.timer)
        clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.getRoles()
      }, 500)
    }
  },
  async created() {
    this.getRoles()
    this.getTypeRoles()
  },
};
</script>
<style lang="scss">
.input-role input {
  text-transform: uppercase;
}

</style>
