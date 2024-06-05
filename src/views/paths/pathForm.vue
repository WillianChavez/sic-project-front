<template>
  <v-container class="pa-0 pa-sm-2 justify-center d-flex" fill-height fluid>
    <v-flex xs12 sm11 md10 lg9>
      <v-card class="pa-2 pa-sm-4" rounded="lg">
        <v-card-title
            primary-title
            class="d-flex justify-space-between blueGrayMinsal--text"
        >
          Rutas
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">

              <v-text-field
                  label="Nombre" @blur="$v.form.name.$touch()"
                  color="blueMinsal" :error-messages="nameErrors"
                  v-model="form.name"
              ></v-text-field>
              <v-text-field
                  label="URI" @blur="$v.form.url.$touch()"
                  color="blueMinsal" :error-messages="urlErrors"
                  v-model="form.url"
              ></v-text-field>
              <v-text-field
                  label="Nombre URI" @blur="$v.form.name_url.$touch()"
                  color="blueMinsal" :error-messages="urlNameErrors"
                  v-model="form.name_url"
              ></v-text-field>
              <v-text-field
                  label="Icono"
                  :append-icon="form.icon"
                  color="blueMinsal"
                  v-model="form.icon"
              ></v-text-field>
              <v-text-field
                  label="Orden"
                  color="blueMinsal"
                  v-model.number="form.order"
              ></v-text-field>
              <v-autocomplete v-model="form.id_ruta_padre" :items="paths" item-text="nombre" item-value="id"
                              label="Ruta Padre"></v-autocomplete>
              <v-checkbox
                  label="Mostrar"
                  v-model="form.show"
                  class="d-inline-flex"
                  color="blueMinsal"
              ></v-checkbox>
              <v-checkbox
                  label="Publico"
                  v-model="form.public"
                  class="d-inline-flex ml-2"
                  color="blueMinsal"
              ></v-checkbox>
              <v-checkbox
                  label="Admin"
                  v-model="form.admin"
                  class="d-inline-flex ml-2"
                  color="blueMinsal"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="6">
              <app-search-list :items="roles" v-model="form.roles" item-value="id" item-text="name"></app-search-list>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-row class="pa-0 ma-0">
            <v-col class="pa-0">
              <v-btn
                  color="blueMinsal"
                  class="white--text ma-1"
                  rounded
                  @click="savePath(true)"
                  :small="$vuetify.breakpoint.xs"
                  :loading="loading_navigate"
              >
                <v-icon left>mdi-content-save</v-icon>
                {{ !$route.params.id ? 'Crear' : 'Editar' }} y regresar al listado
              </v-btn
              >
              <v-btn v-if="!$route.params.id"
                     color="blueMinsal"
                     class="white--text ma-1"
                     :small="$vuetify.breakpoint.xs"
                     rounded :loading="loading"
                     @click="savePath()"
              >
                <v-icon left>mdi-content-save-all</v-icon>
                Crear y agregar otro
              </v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-flex
    >
  </v-container
  >
</template>
<script>
import {mapActions} from "vuex";
import AppSearchList from "../../components/AppSearchList";
import {required} from "vuelidate/lib/validators";

export default {
  name: "pathForm",
  components: {AppSearchList},
  validations: {
    form: {
      name: {
        required,
      },
      url: {
        required
      },
      name_url: {
        required
      }
    },
  },
  data: () => ({
    form: {
      name: null,
      url: null,
      name_url: null,
      icon: null,
      show: false,
      public: false,
      order: null,
      admin: false,
      id_ruta_padre: null,
      roles: []
    },
    roles: [],
    paths: [],
    loading: false,
    loading_navigate: false
  }),
  methods: {
    ...mapActions("utils", ["getMenu"]),
    formClean() {
      this.$v.$reset()
      this.form.public = false
      this.form.show = false
      this.form.icon = null
      this.form.order = null
      this.form.name = null
      this.form.admin = null
      this.form.url = null
      this.form.name_url = null
      this.form.id_ruta_padre = null
      this.form.roles = []
    },
    async getRoles() {
      const response = await this.services.roles.getRoles({
        paginacion:false
      })
      this.roles = response.data;
    },
    async getPath() {
      const response = await this.services.paths.getPath(this.$route.params.id)
      const {data} = response
      this.form.name = data.nombre
      this.form.url = data.uri
      this.form.name_url = data.nombre_uri
      this.form.icon = data.icono
      this.form.order = data.orden
      this.form.id_ruta_padre = data.id_ruta_padre
      this.form.show = data.mostrar
      this.form.public = data.publico
      this.form.admin = data.admin
      this.form.roles = data?.Rols?.map(rol => rol.id)
    },
    async savePath(navigate = false) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        try {
          this.stringEmptyToNull()
          if (navigate) this.loading_navigate = true
          else this.loading = true

          const body = {
            nombre: this.form.name,
            uri: this.form.url,
            nombre_uri: this.form.name_url,
            mostrar: this.form.show,
            icono: this.form.icon,
            orden: this.form.order,
            admin: this.form.admin,
            publico: this.form.public,
            id_ruta_padre: this.form.id_ruta_padre,
            roles: this.form.roles
          }

          if (this.$route.params.id)
            await this.services.paths.updatePath(this.$route.params.id, body)
          else
            await this.services.paths.storePath(body)
          this.temporalAlert({
            show: true,
            type: 'success',
            message: this.$route.params.id ? 'Actualizado' : 'Registrado'
          })
          this.formClean()
          if (navigate)
            await this.$router.push({name: 'paths'})
        } catch {
        } finally {
          this.loading = false
          this.loading_navigate = false
        }
      }
    },
    async getPaths() {
      const response = await this.services.paths.getPaths({
        paginacion:false
      })
      this.paths = response.data
    },
    stringEmptyToNull() {
      for (const properties in this.form) {
        if (typeof this.form[properties] === 'string' && this.form[properties] === '')
          this.form[properties] = null
      }
    }
  },
  computed: {
    nameErrors() {
      const errors = []
      if (!this.$v.form.name.$dirty) return errors
      !this.$v.form.name.required && errors.push('Nombre es obligatorio')
      return errors
    },
    urlErrors() {
      const errors = []
      if (!this.$v.form.url.$dirty) return errors
      !this.$v.form.url.required && errors.push('URI es obligatoria')
      return errors
    },
    urlNameErrors() {
      const errors = []
      if (!this.$v.form.name_url.$dirty) return errors
      !this.$v.form.name_url.required && errors.push('Nombre URI es obligatoria')
      return errors
    },
  },
  async created() {
    if (this.$route.params.id) {
      this.getPath()
    }
    await Promise.race([this.getPaths(), this.getRoles()])
  },
};
</script>
