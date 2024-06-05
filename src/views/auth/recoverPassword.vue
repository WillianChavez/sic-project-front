<template>
  <v-app>
    <v-main class="bgMinsal">
      <v-container fill-height justify-center fluid>
        <v-flex xs12 sm8 md6 lg4 xl3>
          <v-card class="rounded-lg px-2 px-sm-10 elevation-3">
            <v-card-title class="justify-center blueGrayMinsal--text"
            >Recuperar Contraseña
            </v-card-title
            >
            <v-card-text>
              <v-divider></v-divider>
              <div class="body-1 my-2">
                Ingrese su correo electrónico para restablecer su contraseña
              </div>
              <v-text-field
                  prepend-icon="mdi-email"
                  name="email"
                  label="Email"
                  type="text"
                  color="blueMinsal"
                  :error-messages="emailErrors"
                  @blur="$v.email.$touch()"
                  v-model="email"
                  v-if="!show"
              ></v-text-field>
              <v-alert
                  dense
                  text
                  type="success"
                  v-model="show"
                  transition="slide-x-transition"
              >
                Solicitud realizada, por favor revise su bandeja de entrada de
                su
                <strong> correo electrónico</strong>
              </v-alert>
            </v-card-text>
            <v-card-actions class="justify-space-around pb-5" width="100%">
              <v-btn
                  class="blueMinsal white--text"
                  rounded
                  :loading="loading"
                  @click="sendEmail"
              >{{show?'Reenviar': 'Solicitar'}}
              </v-btn
              >
              <v-divider vertical></v-divider>
              <v-btn
                  to="/login"
                  class="blueMinsal--text"
                  rounded
                  text
                  style="text-transform: none"
              >Ir al login
              </v-btn
              >
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
import {required, email} from 'vuelidate/lib/validators'

export default {
  validations: {
    email: {required, email}
  },
  data: () => ({
    email: null,
    loading: false,
    show: false
  }),
  methods: {
    async sendEmail() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        try {
          this.loading = true
          await this.services.auth.resetPassword({email: this.email});
          this.show = true
        } catch {
        } finally {
          this.loading = false
        }
      }
    },
  },
  computed: {
    emailErrors() {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.required && errors.push('Correo es obligatorio')
      !this.$v.email.email && errors.push('El correo no es valido')
      return errors
    }
  },
};
</script>
<style lang="scss" scoped></style>
