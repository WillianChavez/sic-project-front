<template>
  <v-app class="bgMinsal">
    <v-main>
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-flex xs12 sm8 md6 lg4 xl3>
            <v-img
                class="mx-auto d-flex mb-2"
                src="@/assets/img/banner.png"
                max-width="350"
            />
            <v-card class="pa-2 pa-sm-10 mt-5" rounded="lg" :elevation="5">
              <p class="text-h5 text-center pt-5 blueGrayMinsal--text">
                Inicie sesión para continuar
              </p>
              <v-form @submit.prevent="login()">
                <v-card-text>
                  <v-text-field
                      append-icon="mdi-account"
                      name="login"
                      label="Usuario / Correo Electronico *"
                      type="text"
                      @blur="$v.form.email.$touch()"
                      v-model="form.email"
                      :error-messages="emailErrors"
                  >
                  </v-text-field>
                  <v-text-field
                      id="password"
                      name="password"
                      v-model="form.password"
                      label="Contraseña *"
                      :type="showPassword ? 'text' : 'password'"
                      @blur="$v.form.password.$touch()"
                      :error-messages="passwordErrors"
                  >
                    <template #append>
                      <v-icon v-if="!showPassword" @click="showPassword = !showPassword"
                              :color="passwordErrors.length>0 ? 'red' : ''">
                        mdi-eye
                      </v-icon>
                      <v-icon v-else @click="showPassword = !showPassword"
                              :color="passwordErrors.length>0 ? 'red' : ''">mdi-eye-off
                      </v-icon>
                    </template>
                  </v-text-field>
                </v-card-text>
                <v-row class="pt-5">
                  <v-col
                      cols="12"
                      md="6"
                      class="flex justify-center text-center"
                  >
                    <v-btn
                        color="blueMinsal white--text px-sm-8"
                        rounded
                        :loading="loading"
                        type="submit">iniciar sesión
                    </v-btn
                    >
                  </v-col>
                </v-row>
                <v-row class="pa-0 ma-0">
                  <!-- <v-btn
                      text
                      style="text-transform: none"
                      color="blueMinsal"
                      class="mt-2 mx-auto"
                      rounded
                      :to="{name:'forgot-password'}"
                  >Olvidaste tu contraseña?
                  </v-btn -->
                </v-row>
              </v-form>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
    <v-spacer class="my-10"></v-spacer>
    <v-footer class="text-center blueDarkMinsal py-3">
      <v-row>
        <v-col cols="12" sm="6" md="4">
        </v-col>
        <v-col
            class="text-center white--text font-weight-bold align-center"
            cols="12"
            sm="6"
            md="4"
        >
          <p class="ma-0 font-weight-thin">
            <br/>
            República de El Salvador, C.A <br/>
            Cabañas, Ilobasco
            
          </p>
        </v-col>
        <v-col cols="12" sm="12" md="4">
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import {mapActions, mapMutations} from "vuex";
import {required, email} from 'vuelidate/lib/validators'
import jwtDecode from "jwt-decode";

export default {
  name: "login",
  validations: {
    form: {
      email: {
        required, email
      },
      password: {
        required
      }
    }
  },
  data: () => ({
    form: {
      email: null,
      password: null,
    },
    showPassword: false,
    loading: false,
  }),
  methods: {
    ...mapActions(['setAuth']),
    ...mapMutations(["setToken", "setUserInfo"]),
    ...mapMutations('utils', ['setRutas']),
    async login() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.loading = true;
        try {
          const response = await this.services.auth.login(this.form)
          const {user}=jwtDecode(response.data.token);
          this.setAuth(response?.data)
          if(user?.two_factor_status){
            this.$router.push({name: "2fa"});
          } else {
            this.$router.push({name: 'dashboard'});
          }
        } catch (e) {
        } finally {
          this.loading = false
        }
      }
    },
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
      !this.$v.form.password.required && errors.push('Contraseña es obligatoria')
      return errors
    }
  },
  created() {
    this.setRutas([]);
    localStorage.clear();
  },
};
</script>

<style scoped></style>
