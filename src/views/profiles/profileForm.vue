<template>
  <v-container class="pa-0 pa-sm-2 justify-center d-flex" fill-height fluid>
    <v-flex xs12 sm11 md10 lg9>
      <v-card class="pa-2 pa-sm-4" rounded="lg">
        <v-card-title
            primary-title
            class="d-flex justify-space-between blueGrayMinsal--text"
        >
          Perfiles
        </v-card-title>
        <v-row>
          <v-col sm="12" lg="6">
            <v-card-text>
              <v-text-field
                  label="Nombre" :error-messages="nameErrors"
                  color="blueMinsal"
                  @blur="$v.form.name.$touch()"
                  v-model="form.name"
              ></v-text-field>
              <v-text-field
                  label="Código"
                  color="blueMinsal"
                  v-model="form.code"
              ></v-text-field>
            </v-card-text>
          </v-col>
          <v-col sm="12" lg="6">
            <app-search-list :error-messages="rolesErrors" v-model="form.roles" :items="roles" item-text="name"
                             item-value="id"></app-search-list>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-row class="pa-0 ma-0">
            <v-col class="pa-0">
              <v-btn color="blueMinsal" class="white--text ma-1" rounded @click="saveProfile(true)">
                <v-icon left>mdi-content-save</v-icon>
                {{!$route.params.id?'Crear':'Editar'}} y regresar al listado
              </v-btn
              >
              <v-btn color="blueMinsal" class="white--text ma-1" :small="$vuetify.breakpoint.xs" rounded
                     @click="saveProfile()" v-if="!$route.params.id">
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
import AppSearchList from "../../components/AppSearchList";
import {required} from "vuelidate/lib/validators";

export default {
  name: "profileForm",
  components: {AppSearchList},
  validations: {
    form: {
      name: {
        required,
      },
      roles: {
        required
      }
    },
  },
  data: () => ({
    loading: false,
    form: {
      name: null,
      code: null,
      roles: []
    },
    roles: []
  }),
  methods: {
    async getRoles() {
      const response = await this.services.roles.getRoles({
        paginacion:false
      })
      this.roles = response.data;
    },
    async getPorfile() {
      const response = await this.services.profiles.showPorfile(this.$route.params.id)
      const {roles, nombre, codigo} = response.data
      this.form.roles = roles.map(role => role.id)
      this.form.name = nombre
      this.form.code = codigo
    },
    async saveProfile(navigate = false) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        try {
          this.loading = true
          let body = {
            nombre: this.form.name,
            codigo: this.form.code,
            roles: this.form.roles
          }
          if (this.$route.params.id)
            await this.services.profiles.updateProfile(this.$route.params.id, body)
          else
            await this.services.profiles.createProfile(body)
          this.temporalAlert({
            show: true,
            message: this.$route.params.id ? 'Perfil actualizado' : 'Perfil creado',
            type: "success",
          });
          if (navigate) await this.$router.push({name: 'profiles'})
        } catch {
        } finally {
          this.loading = false
        }
      }
    },
  },
  computed: {
    nameErrors() {
      const errors = []
      if (!this.$v.form.name.$dirty) return errors
      !this.$v.form.name.required && errors.push('Nombre es obligatorio')
      return errors
    },
    rolesErrors() {
      const errors = []
      if (!this.$v.form.roles.$dirty) return errors
      !this.$v.form.roles.required && errors.push('Roles son obligatorios')
      return errors
    }
  },
  created() {
    if (this.$route.params.id) {
      this.getPorfile()
    }
    this.getRoles();
  },
};
</script>
