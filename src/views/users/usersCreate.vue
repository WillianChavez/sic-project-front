<template>
  <v-container class="pa-0 pa-sm-2 justify-center d-flex" fill-height fluid>
    <v-flex xs12 sm11 md10 lg9>
      <v-card class="pa-2 pa-sm-4" rounded="lg">
        <v-card-title primary-title class="d-flex justify-space-between blueGrayMinsal--text">
          Usuarios
        </v-card-title>
        <v-card-text>
          <div class="mb-6">
            <v-text-field label="Correo" type="search" autocomplete="username" color="blueMinsal"
                          v-model="form.email" :error-messages="emailErrors" @blur="$v.form.email.$touch()">
            </v-text-field>
            <v-text-field label="Contraseña" color="blueMinsal" :type="showPassword?'text':'password'"
                          autocomplete="new-password"
                          v-model="form.password" :error-messages="passwordErrors" placeholder="******"
                          @blur="$v.form.password.$touch()">
              <template #append>
                <v-icon v-if="!showPassword" @click="showPassword = !showPassword"
                        :color="passwordErrors.length>0 ? 'red' : ''" tabindex="-1">
                  mdi-eye
                </v-icon>
                <v-icon v-else @click="showPassword = !showPassword"
                        :color="passwordErrors.length>0 ? 'red' : ''" tabindex="-1">mdi-eye-off
                </v-icon>
              </template>
            </v-text-field>
            <v-text-field label="Confirmar contraseña" color="blueMinsal" :type="showConfirmPassword?'text':'password'"
                          autocomplete="new-password"
                          @blur="$v.form.confirm_password.$touch()"
                          v-model="form.confirm_password" :error-messages="confirmPasswordErrors"
                          placeholder="******">
              <template #append>
                <v-icon v-if="!showConfirmPassword" @click="showConfirmPassword = !showConfirmPassword"
                        :color="confirmPasswordErrors.length>0 ? 'red' : ''" tabindex="-1">
                  mdi-eye
                </v-icon>
                <v-icon v-else @click="showConfirmPassword = !showConfirmPassword"
                        :color="confirmPasswordErrors.length>0 ? 'red' : ''" tabindex="-1">mdi-eye-off
                </v-icon>
              </template>
            </v-text-field>
          </div>
          <v-row>
            <v-col cols="12" md="6">
              <app-search-list :error-messages="profilesErrors" placeholder="Buscar Perfiles"
                               item-text="nombre"
                               item-value="id"
                               :items="profiles" v-model="form.perfiles">
              </app-search-list>
            </v-col>
            <v-col cols="12" md="6">
              <app-search-list :error-messages="rolesErrors" placeholder="Buscar Perfiles"
                               item-text="name"
                               item-value="id"
                               :items="roles" v-model="form.roles">
              </app-search-list>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-row class="pa-0 ma-0">
            <v-col class="pa-0">
              <v-btn color="blueMinsal" class="white--text ma-1" :loading="loading" rounded @click="createUser(true)"
                     :small="$vuetify.breakpoint.xs">
                <v-icon left>mdi-content-save</v-icon>
                Crear y regresar al listado
              </v-btn>
              <v-btn color="blueMinsal" class="white--text ma-1" :small="$vuetify.breakpoint.xs" rounded
                     @click="createUser()" :loading="loadingAnother">
                <v-icon left>mdi-content-save-all</v-icon>
                Crear y agregar otro
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-container>
</template>
<script>

import {email, required, minLength, sameAs, requiredIf, helpers} from "vuelidate/lib/validators";
const alpha=helpers.regex('alpha', /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@#$!%*?&-_.:])([A-Za-zd$@$!%*?&]|[^ d]){8,20}$/)
export default {
  name: "usuariosCreate",
  validations: {
    form: {
      email: {
        required, email
      },
      password: {
        required,
        minLength: minLength(8),
        alpha,
      },
      confirm_password: {
        required,
        minLength: minLength(6),
        sameAsPassword: sameAs('password')
      },
      perfiles: {
        required: requiredIf(function () {
          return this.form.roles.length === 0
        })
      },
      roles: {
        required: requiredIf(function () {
          return this.form.perfiles.length === 0
        })
      }
    }
  },
  data: () => ({
    form: {
      email: null,
      password: null,
      confirm_password: null,
      roles: [],
      perfiles: []
    },
    roles: [],
    profiles: [],
    showPassword: false,
    showConfirmPassword: false,
    loading: false,
    loadingAnother: false
  }),
  methods: {
    async getRoles() {
      const response = await this.services.roles.getRoles({
        paginacion:false
      })
      this.roles = response.data
    },
    async getProfiles() {
      const response = await this.services.profiles.getProfiles({
        paginacion:false
      })
      this.profiles = response.data
    },
    async createUser(navigate = false) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        try {
          if (navigate) this.loading = true
          else this.loadingAnother = true
          await this.services.users.createUser(this.form)
          this.temporalAlert({
            show: true,
            message: "Se ha creado el usuario",
            type: "success",
          });
          this.cleanForm()
          if (navigate)
            await this.$router.push({name: 'users'});
          else
            this.$v.$reset()
        } catch {
        } finally {
          this.loading = false
          this.loadingAnother = false
        }

      }
    },
    cleanForm() {
      this.form.email = null
      this.form.password = null
      this.form.confirm_password = null
      this.form.roles = []
      this.form.perfiles = []
    }
  },
  computed: {
    emailErrors() {
      const errors = []
      if (!this.$v.form.email.$dirty) return errors
      !this.$v.form.email.required && errors.push('Correo es obligatorio')
      !this.$v.form.email.email && errors.push('El correo no es valido')
      return errors
    },
    passwordErrors() {
      const errors = []
      if (!this.$v.form.password.$dirty) return errors
      !this.$v.form.password.required && errors.push('Contraseña es obligatorio')
      !this.$v.form.password.minLength && errors.push('Minimo de caracteres 8')
      !this.$v.form.password.alpha && errors.push('Tiene que tener mayusculas, minusculas y numeros')
      return errors
    }, confirmPasswordErrors() {
      const errors = []
      if (!this.$v.form.confirm_password.$dirty) return errors
      !this.$v.form.confirm_password.required && errors.push('Contraseña es obligatorio')
      !this.$v.form.confirm_password.minLength && errors.push('Minimo de caracteres 6')
      !this.$v.form.confirm_password.sameAsPassword && errors.push('Las contraseñas no coinciden')
      return errors
    },
    profilesErrors() {
      const errors = []
      if (!this.$v.form.perfiles.$dirty) return errors
      !this.$v.form.perfiles.required && errors.push('Perfil son requeridos si no hay roles')
      return errors
    }, rolesErrors() {
      const errors = []
      if (!this.$v.form.roles.$dirty) return errors
      !this.$v.form.roles.required && errors.push('Roles son requeridos si no hay profiles')
      return errors
    },
  },
  async created() {
    await Promise.all[this.getRoles(), this.getProfiles()]
  }
}
</script>

