<template>
  <v-app>
    <v-main class="bgMinsal">
      <v-container fill-height justify-center fluid>
        <v-flex xs12 sm8 md6 lg4 xl3>
          <v-card class="rounded-lg px-2 px-sm-12 elevation-2">
            <v-card-title class="justify-center" primary-title
            >Reestablecer Contraseña
            </v-card-title
            >
            <v-card-text>
              <v-divider></v-divider>
              <v-row class="mt-6">
                <v-col class="pa-0 ma-0 cols-12">
                  <v-text-field
                      id="new_pass"
                      prepend-icon="mdi-lock"
                      name="new_pass"
                      v-model="form.password"
                      @blur="$v.form.password.$touch()"
                      label="Contraseña nueva"
                      :type="password_show ? 'text' : 'password'"
                      :error-messages="passwordErrors"
                  >
                    <template #append>
                      <v-icon
                          v-if="password_show === false"
                          @click="password_show = !password_show"
                      >mdi-eye-outline
                      </v-icon
                      >
                      <v-icon v-else @click="password_show = !password_show"
                      >mdi-eye-off-outline
                      </v-icon
                      >
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" class="pa-0 ma-0">
                  <v-text-field
                      id="repeat_pass"
                      prepend-icon="mdi-lock-check"
                      name="repeat_pass"
                      v-model="form.confirm_password"
                      @blur="$v.form.confirm_password.$touch()"
                      label="Repita la contraseña"
                      :type="confirm_show ? 'text' : 'password'"
                      :error-messages="confirmPasswordErrors"
                  >
                    <template #append>
                      <v-icon
                          v-if="confirm_show === false"
                          @click="confirm_show = !confirm_show"
                      >mdi-eye-outline
                      </v-icon
                      >
                      <v-icon
                          v-else
                          @click="confirm_show = !confirm_show"
                      >mdi-eye-off-outline
                      </v-icon
                      >
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="justify-space-around pb-5" width="100%">
              <v-btn
                  color="blueMinsal white--text"
                  :loading="loading"
                  @click="changePassword"
                  rounded
              >
                <v-icon left>mdi-content-save</v-icon>
                actualizar
              </v-btn>
              <v-divider vertical></v-divider>
              <router-link :to="{name:'login'}" class="blueMinsal--text"
              >Ir al login
              </router-link
              >
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
import {required, minLength, sameAs, helpers} from "vuelidate/lib/validators";

const alpha = helpers.regex('alpha', /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@#$!%*?&-_.:])([A-Za-zd$@$!%*?&]|[^ d]){8,20}$/)
export default {
  validations: {
    form: {
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
    }
  },
  data: () => ({
    password_show: false,
    confirm_show: false,
    loading: false,
    form: {
      password: null,
      confirm_password: null
    }
  }),
  methods: {
    async changePassword() {
      if (!this.$v.$invalid) {
        try {
          this.loading = true
          const token = this.$route.params.id;
          await this.services.auth.newPassword(this.form, token)
          this.temporalAlert({
            show: true,
            message: "Contraseña actualizada con éxito",
            type: "success",
          });
          await this.$router.push({name: 'login'});
        } catch {

        } finally {
          this.loading = false
        }
      }
    },
  },
  computed: {
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
  },
};
</script>
<style lang="scss" scoped></style>
