<template>
  <v-app>
    <app-loader v-if="loader"></app-loader>
    <v-main class="bgMinsal">
      <v-container fluid class="mb-5 mb-sm-16">
        <v-layout justify-center>
          <v-flex xs12 sm8 md6 lg4>
            <v-img
                class="mx-auto d-flex mb-2"
                src="@/assets/img/SIS-HAZUL.png"
                max-width="350"
            />
            <v-card
                class="pa-2 pa-sm-6"
                rounded="lg"
            >
              <v-card-title primary-title v-if="this.form.id_method===1">Correo electrónico</v-card-title>
              <v-card-title primary-title v-else-if="form.id_method===2"> Autenticación de código QR</v-card-title>
              <v-card-title primary-title v-else> Tipo de autenticación</v-card-title>
              <v-card-text>
                <p v-if="form.id_method===1">Se envió un código de seis digitos a su
                  <b>correo electrónico</b>, por favor ingrese el
                  código
                </p>
                <p v-else-if="form.id_method===2">
                  Ingrese el código que le proporciona la aplicación de
                  <b>Autenticador de Google</b> o
                  <b>Autenticador de Microsoft</b>
                </p>
                <p v-else>Se le proporcionará un <b>código temporal</b> para iniciar
                  sesión. Seleccione:</p>
                <v-list rounded flat v-if="!form.id_method">
                  <v-list-item
                      @click="selectMethod(item.id)"
                      v-for="(item, index) in methods"
                      :key="index"
                  >
                    <v-list-item-icon>
                      <v-icon>{{ item.icono }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>{{ item.nombre }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <div v-if="form.id_method">
                  <v-text-field
                      placeholder="ingrese el codigo"
                      label="Codigo"
                      v-model="form.code" :error-messages="codeErrors" @blur="$v.form.code.$touch()"
                      type="text"
                      color="blueMinsal"
                      v-mask="'######'"
                      @keypress.enter="VerifyCode2fa"
                  ></v-text-field>
                </div>
              </v-card-text>
              <v-card-actions class="py-0" v-if="form.id_method">
                <v-row class="my-2 my-xs-0">
                  <v-btn
                      color="blueMinsal white--text elevation-0 ma-1"
                      rounded
                      @click="VerifyCode2fa"
                  >
                    Ingresar
                  </v-btn>
                  <v-btn
                      class="d-xs-flex ma-1"
                      color="blueMinsal elevation-0 "
                      rounded
                      text
                      v-if="methods.length > 1"
                      @click="form.id_method = null; form.code = null;"
                  >
                    Probar otro método
                  </v-btn>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
    <v-footer class="text-center blueDarkMinsal pa-3 absolute">
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-img
              src="@/assets/img/escudo-white-minsal.png"
              width="200"
              class="mx-auto"
          />
        </v-col>
        <v-col
            class="text-center white--text font-weight-thin align-center"
            cols="12"
            sm="6"
            md="4"
        >
          <p class="ma-0">
            Ministerio de Salud <br/>
            República de El Salvador, C.A <br/>
            Calle Arce No. 827, San Salvador, El Salvador
          </p>
        </v-col>
        <v-col cols="12" sm="12" md="4">
          <v-img
              src="@/assets/img/SIS-HBLANCO.png"
              width="150"
              class="mx-auto"
          />
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>
<script>
import {mapActions, mapMutations, mapState} from "vuex";
import {required} from 'vuelidate/lib/validators'
import jwtDecode from "jwt-decode";
import AppLoader from "../../components/AppLoader";

export default {
  components: {AppLoader},
  validations: {
    form: {
      code: {required},
    }
  },
  data: () => ({
    methods: [],
    form: {
      id_method: null,
      code: null,
    },
    loader: false
  }),
  methods: {
    ...mapActions(['setAuth']),
    ...mapMutations(["setToken", "setUserInfo"]),
    cleanForm() {
      this.form.code = null
      this.$v.form.$reset()
    },
    async selectMethod(id) {
      this.cleanForm();
      this.form.id_method = id;
      await this.sendCodeEmail()
    },
    async sendCodeEmail() {
      if (this.form.id_method===1) {
        try {
          this.loader = true
          await this.services.auth.twoFactor()
          this.temporalAlert({
            show: true,
            message: "Revise su bandeja de entrada",
            type: "success",
          });
        } catch {
        } finally {
          this.loader = false
        }
      }
    },
    async VerifyCode2fa() {
      this.$v.form.$touch()
      if (!this.$v.form.$invalid) {
        try {
          this.loader = true;
          const response = await this.services.auth.verifyCode(this.form)
          this.setAuth(response?.data)
          this.$router.push({name: 'dashboard'})
        } catch {
        } finally {
          this.loader = false;
        }
      }
    },
  },
  computed: {
    ...mapState(['userInfo']),

    codeErrors() {
      const errors = []
      if (!this.$v.form.code.$dirty) return errors
      !this.$v.form.code.required && errors.push('El codigo es requerido')
      return errors
    }
  },
  async created() {
    const token = localStorage.getItem('token')
    if (token && this.userInfo.user) {
      await this.setUserInfo(jwtDecode(localStorage.getItem('token')))
      const aux = this.userInfo?.user?.auth_methods || [];
      this.methods=aux;
      this.form.id_method = (aux.find(item => item.is_primary))?.id;
      await this.sendCodeEmail()
    } else
      this.$router.go(-1);
  },
};
</script>
