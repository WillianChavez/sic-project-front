<template>
  <v-container class="pa-0 pa-sm-2 justify-center d-flex" fill-height fluid>
    <v-flex xs12 sm11 md10 lg9>
      <v-card class="pa-2 pa-sm-4" rounded="lg">
        <v-card-title primary-title class="d-flex justify-space-between blueGrayMinsal--text">
          Compra
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                offset-y min-width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="form.fecha_emision" label="Fecha de emisión" prepend-icon="mdi-calendar" readonly
                    v-bind="attrs" v-on="on" :error-messages="fechaEmisionErrors" @blur="$v.form.fecha_emision.$touch()"
                    required></v-text-field>
                </template>
                <v-date-picker v-model="form.fecha_emision" @input="menu = false" locale="es" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu = false">
                    Cancel
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.menu.save(form.fecha_emision)">
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>



              <v-text-field v-model="form.descripcion" label="Descripción" :error-messages="descripcionErrors"
                @blur="$v.form.descripcion.$touch()" required></v-text-field>
              <v-text-field v-model="form.numero_documento_cff" label="Número de documento"
                :error-messages="numeroDocumentoCffErrors" @blur="$v.form.numero_documento_cff.$touch()"
                required></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model="form.persona.nombre" label="Proveedor" :error-messages="nombreErrors"
                @blur="$v.form.persona.nombre.$touch()" required></v-text-field>
              <v-autocomplete v-model="form.id_cuenta_contable" :items="cuentasList" item-text="nombre" item-value="id"
                label="Cuenta contable" :error-messages="cuentaContableErrors" @blur="$v.form.id_cuenta_contable.$touch()"
                required></v-autocomplete>
              <v-text-field v-model="form.persona.nrc" label="NRC" @blur="$v.form.persona.nrc.$touch()"
                :rules="numericRules" ref="nrc" :error-messages="nrcErrors"></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-autocomplete v-model="form.id_tipo_contribuyente" :items="tipoContribuyentes" item-text="nombre"
                item-value="id" label="Tipo de contribuyente"></v-autocomplete>
              <v-autocomplete v-model="form.id_cuenta_contrapartida" :items="cuentasList" item-text="nombre"
                item-value="id" label="Cuenta contrapartida" :error-messages="cuentaContrapartidaErrors"
                @blur="$v.form.id_cuenta_contrapartida.$touch()" required></v-autocomplete>
              <v-text-field v-model="form.persona.nit" label="NIT" :error-messages="nitErrors"
                @blur="$v.form.persona.nit.$touch()" required></v-text-field>
            </v-col>

          </v-row>
        </v-card-text>

        <h1 class="text-h6 blueGrayMinsal--text">Detalle de compra</h1>
        <v-card-actions>
          <v-row class="pa-0 ma-0">
            <v-col class="pa-0" cols="12" md="8">
              <v-card class="pa-2 pa-sm-4" rounded="lg">
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="12">
                      <v-text-field v-model="form.detalleCompra.gravado_interno" label="Gravado interno"
                        :rules="numericRules" ref="gravado_interno"
                        @blur="$v.form.detalleCompra.gravado_interno.$touch()"></v-text-field>
                      <v-text-field v-model="form.detalleCompra.gravado_importacion" label="Gravado importación"
                        :rules="numericRules" ref="gravado_importacion"
                        @blur="$v.form.detalleCompra.gravado_importacion.$touch()"></v-text-field>
                      <v-text-field v-model="form.detalleCompra.exento_interno" label="Exento interno"
                        :rules="numericRules" ref="exento_interno"
                        @blur="$v.form.detalleCompra.exento_interno.$touch()"></v-text-field>
                      <v-text-field v-model="form.detalleCompra.exento_importacion" label="Exento importación"
                        :rules="numericRules" ref="exento_importacion"
                        @blur="$v.form.detalleCompra.exento_importacion.$touch()"></v-text-field>
                      <v-text-field v-model="form.detalleCompra.compras_sujeto_excluido" label="Compras sujeto excluido"
                        :rules="numericRules" ref="compras_sujeto_excluido"
                        @blur="$v.form.detalleCompra.compras_sujeto_excluido.$touch()"></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col class="pa-5 rounded bgMinsal px-5" cols="12" md="4">
              <v-text-field v-model="form.detalleCompra.anticipo_uno_porciento_retenido" label="Anticipo 1% percibido"
                readonly @blur="$v.form.detalleCompra.anticipo_uno_porciento_retenido.$touch()" required></v-text-field>

              <v-text-field label="IVA crédito fiscal" v-model="form.cuentas[0].haber" readonly></v-text-field>

              <v-text-field v-model="form.detalleCompra.total" label="Total"></v-text-field>
            </v-col>
          </v-row>
        </v-card-actions>

        <v-row>
          <v-col class="m-5" cols="12" md="12">
            <v-btn color="blueMinsal" class="white--text ma-1" rounded @click="savePath(true)"
              :small="$vuetify.breakpoint.xs" :loading="loading_navigate">
              <v-icon left>mdi-content-save</v-icon>
              {{ !$route.params.id ? 'Crear' : 'Editar' }}
            </v-btn>
            <v-btn :to="{ name: 'compras' }" rounded :small="$vuetify.breakpoint.xs">
              <v-icon left>mdi-arrow-left</v-icon>
              Regresar al listado
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-flex>
  </v-container>
</template>
<script>
import { mapActions } from "vuex";
import AppSearchList from "../../components/AppSearchList";
import { required, numeric } from "vuelidate/lib/validators";

export default {
  name: "pathForm",
  components: { AppSearchList },
  data: () => ({
    form: {
      fecha_emision: null,
      descripcion: null,
      numero_documento_cff: null,
      es_sujeto_excluido: false,
      id_tipo_contribuyente: null,
      id_cuenta_contable: null,
      id_cuenta_contrapartida: null,
      persona: {
        nit: null,
        nombre: null,
        nrc: null,
      },
      detalleCompra: {
        gravado_interno: 0,
        exento_interno: 0,
        exento_importacion: 0,
        compras_sujeto_excluido: 0,
        anticipo_uno_porciento_retenido: 0,
        gravado_importacion: 0,
      },
      cuentas: [
        { // iva credito fiscal
          id_cuenta: 6,
          debe: 0,
          haber: 0
        }
        // cuenta contable
      ],

    },

    // data: [{ "fecha": "21/11/2023", ee: "Inventario" ,"Persona": { "nombre": "Carlos Sánchez" }, "descripcion": "Compra de Velas", "numero_documento": "002", "Cuenta": { "nombre": "Banco" }, "gravadas_internas": 200, "gravadas_importacion": 0, "exentas_internas": 0, "exentas_internacion": 0, "exentas_importacion": 0, "sujeto_excluido": 200 }],
    datoShow: {
      fecha_emision: '21/11/2023',
      descripcion: 'Compra de velas',
      numero_documento_cff: '002',
      es_sujeto_excluido: false,
      id_tipo_contribuyente: 3,
      id_cuenta_contable: 2,
      id_cuenta_contrapartida: 33,
      persona: {
        nit: 2342342323,
        nombre: 'Carlos Sánchez',
        nrc: 23423423,
      },
      detalleCompra: {
        gravado_interno: 0,
        exento_interno: 0,
        exento_importacion: 0,
        compras_sujeto_excluido: 200,
        anticipo_uno_porciento_retenido: 0,
        gravado_importacion: 0,
        total: 200,
      },
      cuentas: [
        { // iva credito fiscal
          id_cuenta: 6,
          debe: 0,
          haber: 0
        }
        // cuenta contable
      ],
    },


    loading: false,
    loading_navigate: false,
    cuentasList: [],
    tipoContribuyentes: [],
    numericRules: [
      v => /^\d+(\.\d{1,2})?$/.test(v) || 'Este campo debe ser numérico',
    ],
  }),

  created() {
    this.getCuentas()
    this.getTipoContribuyentes()
    if(this.$route.query.show){
      this.form = this.datoShow
    }
  },

  computed: {
    fechaEmisionErrors() {
      const errors = []
      if (!this.$v.form.fecha_emision.$dirty) return errors
      !this.$v.form.fecha_emision.required && errors.push('Fecha de emisión es requerida')
      return errors
    },

    descripcionErrors() {
      const errors = []
      if (!this.$v.form.descripcion.$dirty) return errors
      !this.$v.form.descripcion.required && errors.push('Descripción es requerida')
      return errors
    },
    numeroDocumentoCffErrors() {
      const errors = []
      if (!this.$v.form.numero_documento_cff.$dirty) return errors
      !this.$v.form.numero_documento_cff.required && errors.push('Número de documento es requerido')
      !this.$v.form.numero_documento_cff.numeric && errors.push('Número de documento debe ser numérico')
      return errors
    },
    nitErrors() {
      const errors = []
      if (!this.$v.form.persona.nit.$dirty) return errors
      !this.$v.form.persona.nit.required && errors.push('NIT es requerido')
      !this.$v.form.persona.nit.numeric && errors.push('NIT debe ser numérico')
      return errors
    },
    nombreErrors() {
      const errors = []
      if (!this.$v.form.persona.nombre.$dirty) return errors
      !this.$v.form.persona.nombre.required && errors.push('Nombre es requerido')
      return errors
    },

    comprasSujetoExluidoErrors() {
      const errors = []
      if (!this.$v.form.detalleCompra.compras_sujeto_excluido.$dirty) return errors
      !this.$v.form.detalleCompra.compras_sujeto_excluido.required && errors.push('Compras sujeto excluido es requerido')
      return errors
    },

    cuentaContableErrors() {
      const errors = []
      if (!this.$v.form.id_cuenta_contable.$dirty) return errors
      !this.$v.form.id_cuenta_contable.required && errors.push('Cuenta contable es requerida')
      return errors
    },

    cuentaContrapartidaErrors() {
      const errors = []
      if (!this.$v.form.id_cuenta_contrapartida.$dirty) return errors
      !this.$v.form.id_cuenta_contrapartida.required && errors.push('Cuenta contrapartida es requerida')
      return errors
    },
    nrcErrors() {
      const errors = []
      if (!this.$v.form.persona.nrc.$dirty) return errors
      !this.$v.form.persona.nrc.numeric && errors.push('NRC debe ser numérico')
      return errors
    },
    totales() {

    }

  },


  validations: {
    form: {
      fecha_emision: {
        required
      },
      descripcion: {
        required
      },
      id_cuenta_contable: {
        required
      },
      id_cuenta_contrapartida: {
        required
      },
      numero_documento_cff: {
        required,
        numeric

      },
      persona: {
        nombre: {
          required
        },
        nit: {
          required,
          numeric

        },
        nrc: {
          numeric
        },
      },

      detalleCompra: {
        gravado_interno: {},
        exento_interno: {},
        exento_importacion: {},
        compras_sujeto_excluido: {
          required
        },
        anticipo_uno_porciento_retenido: {},
      },
      cuenta: {
        nombre: {
        },
        codigo: {
        },
        id_tipo_cuenta: {
        },
      },
    },
  },


  methods: {
    ...mapActions("utils", ["getMenu"]),
    formClean() {
      this.$v.$reset()
      this.form = {
        fecha_emision: null,
        descripcion: null,
        numero_documento_cff: null,
        es_sujeto_excluido: false,
        persona: {
          nit: null,
          nombre: null,
          nrc: null,
        },
        cuentas: [
          { // iva credito fiscal
            id_cuenta: 6,
            debe: 0,
            haber: 0,
          }
        ],
        detalleCompra: {
          gravado_interno: 0,
          exento_interno: 0,
          exento_importacion: 0,
          compras_sujeto_excluido: 0,
          anticipo_uno_porciento_retenido: 0,
        }
      }
    },

    async getCuentas() {
      const response = await this.services.cuenta.getCuentas({
        paginacion: false
      })
      this.cuentasList = response.data
    },

    async getTipoContribuyentes() {
      const response = await this.services.catalogo.getTipoContribuyentes({
        paginacion: false
      })
      this.tipoContribuyentes = response.data
    },

  },

  watch: {
    'form.id_tipo_contribuyente': function (val) {
      // si el valor es 3, deshabilitar el campo de gravado interno, gravado importacion, exento interno, exento importacion

      //resetear los errores

      if (val === 3) {
        this.form.detalleCompra.gravado_interno = 0
        this.form.detalleCompra.gravado_importacion = 0
        this.form.detalleCompra.exento_interno = 0
        this.form.detalleCompra.exento_importacion = 0
        // this.form.detalleCompra.compras_sujeto_excluido = 0
        this.form.persona.nrc = null
        // bloquear los campos
        this.$refs.gravado_interno.disabled = true
        this.$refs.gravado_importacion.disabled = true
        this.$refs.exento_interno.disabled = true
        this.$refs.exento_importacion.disabled = true
        this.$refs.nrc.disabled = true
        // quitamos validaciones
        this.$refs.nrc.resetValidation()
        this.$refs.compras_sujeto_excluido.disabled = false

      }

      if (val !== 3) {
        this.form.detalleCompra.compras_sujeto_excluido = 0

        this.$refs.gravado_interno.disabled = false
        this.$refs.gravado_importacion.disabled = false
        this.$refs.exento_interno.disabled = false
        this.$refs.exento_importacion.disabled = false
        this.$refs.compras_sujeto_excluido.disabled = true
        this.$refs.nrc.disabled = false
      }

    },

    'form.detalleCompra.gravado_interno': function (val) {
      this.form.detalleCompra.anticipo_uno_porciento_retenido = val * 0.01
      this.form.detalleCompra
    },

    'form.detalleCompra.gravado_importacion': function (val) {
      this.form.cuentas[0].haber = val
    },


  }
};
</script>
