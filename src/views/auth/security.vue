<template>
  <div>
    <app-loader v-if="loading"></app-loader>
    <v-container class="pa-0 pa-sm-2 justify-center d-flex" fluid>
      <v-flex xs12 sm10 lg7 xl6>
        <v-card class="pa-0 pa-sm-8 pb-sm-0" elevation="3" rounded="lg">
          <v-card-title
              primary-title
              class="text-h5 text-center blueGrayMinsal--text d-block"
          >Metodos de autenticación
          </v-card-title
          >
          <v-divider></v-divider>
          <v-card-text>
            <v-list subheader two-line>
              <v-subheader inset>Métodos disponibles</v-subheader>

              <v-list-item
                  link
                  v-for="(item, index) in methods"
                  :key="index"
                  :disabled="item.id === 1"
                  @click="store2FAMethods(item.id)"
              >
                <v-list-item-avatar>
                  <v-icon :class=" item.is_primary == true || item.is_primary == false ? 'blueMinsal' : 'grey'" dark>
                    {{ item.icono }}
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ item.nombre }}</v-list-item-title>

                  <v-list-item-subtitle>{{
                      item.descripcion
                    }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-text>
            <v-subheader inset>Método preferido</v-subheader>
            <v-select
                :items="configuredMethods"
                item-text="nombre"
                item-value="id"
                v-model="method"
                flat
                filled
                solo
                dense
                @change="changePrimaryMethod()"
            >
            </v-select>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-dialog
          v-model="dialog"
          scrollable
          max-width="500px"
          transition="dialog-transition"
      >
        <div>
          <v-stepper alt-labels :value="step" rounded="lg">
            <v-stepper-header class="elevation-0">
              <v-stepper-step
                  step="1"
                  :complete="step > 1"
                  color="blueMinsal"
                  class="text-center"
              >
                Escanee el codigo QR
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step step="2" color="blueMinsal">
                Ingrese el codigo
              </v-stepper-step>
            </v-stepper-header>
            <v-stepper-content step="1">
              <p class="body-1 grey--text text--darken-1">
                A continuación se le muestra un código QR, puede utilizar las
                siguientes aplicaciones para escanearlo:

                <v-row class="d-flex justify-space-between px-7 mt-3">
                  <b>Autenticador de Google</b>
                  <span>
                  <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=es_SV&gl=US"
                     target="_blank" style="text-decoration: none">
                    <v-icon class="green--text">mdi-android</v-icon>
                  </a>
                  <a
                      href="https://apps.apple.com/es/app/google-authenticator/id388497605"
                      target="_blank"
                      style="text-decoration: none"
                  ><v-icon class="black--text">mdi-apple</v-icon></a
                  >
                </span>
                </v-row>
                <v-row class="d-flex justify-space-between px-7 mt-3">
                  <b>Autenticador de Microsoft</b>
                  <span>
                  <a
                      href="https://play.google.com/store/apps/details?id=com.azure.authenticator&hl=es_SV&gl=US"
                      target="_blank"
                      style="text-decoration: none"
                  >
                    <v-icon class="green--text">mdi-android</v-icon></a
                  >
                  <a
                      href="https://apps.apple.com/es/app/microsoft-authenticator/id983156458"
                      target="_blank"
                      style="text-decoration: none"
                  >
                    <v-icon class="black--text">mdi-apple</v-icon></a
                  >
                </span>
                </v-row>
              </p>
              <v-sheet color="grey lighten-3" v-if="loadingQr === true">
                <v-skeleton-loader
                    type="image"
                    class="mx-auto my-2"
                ></v-skeleton-loader>
              </v-sheet>
              <div class="d-flex justify-center" v-else>
                <v-img :src="qr" max-width="300"></v-img>
              </div>
              <v-btn
                  color="primary"
                  rounded
                  class="blueMinsal white--text"
                  @click="step = 2"
              >
                Continuar
              </v-btn>
            </v-stepper-content>
            <v-stepper-content step="2">
              <v-text-field
                  placeholder="Codigo"
                  label="Ingrese Codigo"
                  v-model="code"
                  color="blueMinsal"
                  :error-messages="codeErrors"
                  @blur="$v.code.$touch()"
                  @keypress.enter="authMethodVerification()"
                  v-mask="'######'"
              ></v-text-field>
              <v-btn
                  color="mr-3 elevation-0"
                  rounded
                  @click="
                step = 1;
                code = null;
              ">
                Regresar
              </v-btn>
              <v-btn
                  color="blueMinsal white--text elevation-0"
                  rounded
                  @click="authMethodVerification()"
              >
                Ingresar
              </v-btn>
            </v-stepper-content>
          </v-stepper>
        </div>
      </v-dialog>
    </v-container>
  </div>
</template>
<script>
import AppLoader from "../../components/AppLoader";
import {required} from 'vuelidate/lib/validators'

export default {
  validations: {
    code: {required}
  },
  components: {AppLoader},
  data: () => ({
    loading: false,
    dialog: false,
    qr: null,
    step: 1,
    code: null,
    methods: [],
    method: null,
    loadingQr: null,
  }),
  methods: {
    seletcPrimaryMethod() {
      this.method = (this.methods.find(row => row.is_primary))?.id || null;
    },
    async getMethods() {
      try {
        this.loading = true;
        const response = await this.services.auth.get2FAMethods()
        this.methods = response.data;
        this.seletcPrimaryMethod()
      } catch {
      } finally {
        this.loading = false
      }
    },
    async store2FAMethods(id) {
      this.method = id;
      this.dialog = true;
      this.step = 1;
      this.code = null;
      try {
        this.loadingQr = true;
        const response = await this.services.auth.store2FAMethods({
          id_method: id
        }, 'post')
        this.qr = response.data.codigoQr;
      } catch (e) {
      } finally {
        this.loadingQr = false;
      }
    },
    async changePrimaryMethod() {
      try {
        this.loading = true
        await this.services.auth.changePrimaryMethod(
            this.method,
            "post"
        );
        await this.getMethods();
        this.temporalAlert({
          message: "Se ha actualizado la información",
          show: true,
          type: "success",
        });
      } catch {
      } finally {
        this.loading = false
      }
    },
    async authMethodVerification() {
      this.$v.$touch();
      if (this.$v.invalid) {
        try {
          this.loading = true;
          await this.services.auth.authMethodVerification({
            id_method: this.method,
            code: this.code
          })
          this.dialog = false;
          await this.getMethods();
          this.temporalAlert({
            show: true,
            message: "Se ha actualizado la información",
            type: "success",
          });
        } catch {

        } finally {
          this.loading = false;
        }
      }
    },
  },
  computed: {
    configuredMethods() {
      return this.methods.filter((method) => method?.configured && method?.verified)
    },
    codeErrors() {
      const errors = []
      if (!this.$v.code.$dirty) return errors
      !this.$v.code.required && errors.push('El codigo es requerido')
      return errors
    }
  },
  created() {
    this.getMethods();
  },
};
</script>
