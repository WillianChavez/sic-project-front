<template>
  <v-container class="pa-0 pa-sm-2 justify-center d-flex" fluid>
    <v-flex xs12 sm11 md11 lg10>
      <v-row class="pa-0 ma-0">
        <v-col cols="12" md="6" class="pt-0 px-0 px-sm-2">
          <v-card class="pa-4 pa-sm-8" elevation="3" rounded="lg">
            <p class="text-h5 text-center blueGrayMinsal--text">
              Datos de perfil
            </p>
            <v-row>
              <v-col>
                <p class="subtitle-2">Correo electrónico</p>
                <p class="body-1 grey--text">{{ userInfo.email }}</p>
              </v-col>
            </v-row>
            <v-divider class="mt-4"></v-divider>
            <div class="mt-4">
              <p class="title">Actualizar email</p>
              <v-text-field prepend-icon="mdi-email" name="email" v-model="form_email.email" label="Email " outlined
                            dense @blur="$v.form_email.email.$touch()" :error-messages="emailErrors">
              </v-text-field>
              <div class="text-center">
                <v-btn
                    color="blueMinsal white--text"
                    rounded @click="validateUserByChangeEmail()"
                >
                  <v-icon class="mr-1">mdi-content-save</v-icon>
                  Guardar
                </v-btn>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" class="pb-0 px-0 px-sm-2">
          <v-card class="pa-4 pa-sm-8" elevation="3" rounded="lg">
            <p class="text-h5 text-center blueGrayMinsal--text">
              Actualizar contraseña
            </p>
            <v-form @submit.prevent="changePassword()">
              <v-text-field
                  prepend-icon="mdi-lock"
                  name="password"
                  :type="showPassword?'text':'password'"
                  v-model="form_password.password"
                  label="Contraseña Actual" :error-messages="passwordErrors"
                  outlined @blur="$v.form_password.password.$touch()"
                  dense
              >
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
              <v-text-field prepend-icon="mdi-lock" name="newPassword"
                            :error-messages="newPasswordErrors" :type="showNewPassword?'text':'password'"
                            v-model="form_password.new_password"
                            label="Nueva Contraseña" outlined dense @blur="$v.form_password.new_password.$touch()">
                <template #append>
                  <v-icon v-if="!showNewPassword" @click="showNewPassword = !showNewPassword"
                          :color="newPasswordErrors.length>0 ? 'red' : ''" tabindex="-1">
                    mdi-eye
                  </v-icon>
                  <v-icon v-else @click="showNewPassword = !showNewPassword"
                          :color="newPasswordErrors.length>0 ? 'red' : ''" tabindex="-1">mdi-eye-off
                  </v-icon>
                </template>
              </v-text-field>
              <v-text-field prepend-icon="mdi-lock" name="confirmPassword" v-model="form_password.confirm_password"
                            label="Confirmar Contraseña" :error-messages="confirmPasswordErrors"
                            :type="showConfirmPassword?'text':'password'"
                            outlined dense @blur="$v.form_password.confirm_password.$touch()">
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
              <v-card-actions class="flex justify-center pa-0">
                <div class="text-center">
                  <v-btn color="blueMinsal white--text" rounded type="submit" :loading="loadin_change_password">
                    <v-icon class="mr-1">mdi-content-save</v-icon>
                    Guardar
                  </v-btn>
                </div>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-flex
    >
    <v-dialog
        v-model="show_change_email"
        scrollable
        max-width="500px"
        transition="dialog-transition"
    >
      <v-card rounded="lg">
        <v-card-title>Ingrese su contraseña</v-card-title>
        <v-card-text class="pt-2 pb-0">
          <v-text-field v-model="form_email.password" @blur="$v.form_email.password.$touch()"
                        :error-messages="passwordByChangeEmailErrors" :loading="loadin_change_password"
                        @keyup.enter="changeEmail()" label="Contraseña actual"
                        :type="showChangeEmailPassword?'text':'password'" outlined dense>
            <template #append>
              <v-icon v-if="!showChangeEmailPassword" @click="showChangeEmailPassword = !showChangeEmailPassword"
                      :color="passwordByChangeEmailErrors.length>0 ? 'red' : ''" tabindex="-1">
                mdi-eye
              </v-icon>
              <v-icon v-else @click="showChangeEmailPassword = !showChangeEmailPassword"
                      :color="passwordByChangeEmailErrors.length>0 ? 'red' : ''" tabindex="-1">mdi-eye-off
              </v-icon>
            </template>
          </v-text-field>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-btn
              rounded
              color="blueMinsal"
              class="white--text"
              :loading="loadin_change_email"
              @click="changeEmail()"
          >
            <v-icon left>mdi-content-save</v-icon>
            GUARDAR
          </v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import {required, email, sameAs, minLength, helpers} from "vuelidate/lib/validators";
const alpha=helpers.regex('alpha', /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@#$!%*?&-_.:])([A-Za-zd$@$!%*?&]|[^ d]){8,20}$/)
export default {
  name: "perfil",
  validations: {
    form_email: {
      email: {
        required, email,
      },
      password: {
        required
      }
    },
    form_password: {
      password: {
        required,
      },
      new_password: {
        required,
        minLength: minLength(8),
        alpha
      }, confirm_password: {
        required,
        sameAsPassword: sameAs('new_password')
      }
    }
  },
  data: () => ({
    show_change_email: false,
    loadin_change_email: false,
    loadin_change_password: false,
    form_email: {
      email: null,
      password: null
    },
    form_password: {
      password: null,
      new_password: null,
      confirm_password: null
    },
    showConfirmPassword: false,
    showNewPassword: false,
    showPassword: false,
    showChangeEmailPassword: false,
  }),
  methods: {
    ...mapActions(["getUserDetail", 'setAuth']),
    ...mapMutations(["setUserInfo", "setToken"]),
    async validateUserByChangeEmail() {
      this.$v.form_email.email.$touch()
      if (!this.$v.form_email.email.$invalid)
        this.show_change_email = true
    },
    async changeEmail() {
      this.$v.form_email.$touch()
      if (!this.$v.form_email.$invalid) {
        try {
          this.loadin_change_email = true
          const response = await this.services.auth.changeEmail({
            email: this.form_email.email,
            password: this.form_email.password,
          })
          this.setAuth(response.data)
          this.show_change_email = false
          this.$v.form_email.$reset()
          this.cleanForms(this.form_email)
          this.temporalAlert({
            show: true,
            message: "Se ha actualizado el correo electronico",
            type: "success",
          });
        } catch {

        } finally {
          this.loadin_change_email = false
        }
      }

    },
    cleanForms(form) {
      for (const property in form) {
        form[property] = null
      }
    },
    async changePassword() {
      this.$v.form_password.$touch()
      if (!this.$v.form_password.$invalid) {
        try {
          this.loadin_change_password = true
          const response = await this.services.auth.changePassword({
            password_actual: this.form_password.password,
            password: this.form_password.new_password,
            confirm_password: this.form_password.confirm_password
          })
          this.setAuth(response.data)
          this.$v.form_password.$reset()
          this.cleanForms(this.form_password)
          this.temporalAlert({
            show: true,
            message: "Se ha actualizado la contraseña",
            type: "success",
          });
        } catch {
        } finally {
          this.loadin_change_password = false
        }
      }
    },
  },
  computed: {
    ...mapState(["userInfo", "userDetail"]),
    emailErrors() {
      const errors = []
      if (!this.$v.form_email.email.$dirty) return errors
      !this.$v.form_email.email.required && errors.push('Correo es obligatorio')
      !this.$v.form_email.email.email && errors.push('Correo no es valido')
      return errors
    },
    passwordByChangeEmailErrors() {
      const errors = []
      if (!this.$v.form_email.password.$dirty) return errors
      !this.$v.form_email.password.required && errors.push('Contraseña es obligatoria')
      return errors
    },
    passwordErrors() {
      const errors = []
      if (!this.$v.form_password.password.$dirty) return errors
      !this.$v.form_password.password.required && errors.push('Contraseña es obligatoria')
      return errors
    },
    newPasswordErrors() {
      const errors = []
      if (!this.$v.form_password.new_password.$dirty) return errors
      !this.$v.form_password.new_password.required && errors.push('Nueva contraseña es obligatoria')
      !this.$v.form_password.new_password.minLength && errors.push('Minimo de caracteres 8')
      !this.$v.form_password.new_password.alpha && errors.push('Tiene que contener Mayuscula, minusculas y numeros')
      return errors
    },
    confirmPasswordErrors() {
      const errors = []
      if (!this.$v.form_password.confirm_password.$dirty) return errors
      !this.$v.form_password.confirm_password.required && errors.push('Confirmacion de la contraseña es obligatoria')
      !this.$v.form_password.confirm_password.sameAsPassword && errors.push('Las contraseñas no coinciden')
      return errors
    }
  },
};
</script>

<style scoped></style>
