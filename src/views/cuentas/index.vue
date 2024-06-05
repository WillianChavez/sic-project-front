<template>
  <v-container class="pa-0 pa-sm-2 justify-center d-flex" fill-height fluid>
    <v-flex xs12 sm11 md11 lg10>
      <v-card class="pa-4" rounded="lg">
        <v-card-title primary-title class="d-flex justify-space-between blueGrayMinsal--text">
          Cuentas
          <div>
            <v-btn rounded color="blueMinsal" class="white--text ma-1" @click="storeCuenta">
              <v-icon left>mdi-plus</v-icon>
              Agregar
            </v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <v-skeleton-loader v-if="loading"></v-skeleton-loader>
          <v-data-table :headers="headers" :items="cuentas" item-key="id" class="elevation-0 border-1"
            no-data-text="No hay datos" no-results-text="No hay resultados" disable-pagination hide-default-footer v-else>
            <template v-slot:[`item.mostrar`]="{ item }">
              <v-chip class="ma-2 white--text" color="blueMinsal" small v-if="item.mostrar">
                Si
              </v-chip>
              <v-chip class="ma-2 white--text" color="red darken-1" v-else small>
                No
              </v-chip>
            </template>
            <template v-slot:[`item.accion`]="{ item }">
              <v-btn icon small @click="editCuenta(item.id)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small @click="deleteCuenta(item.id)" v-if="!item.requerido">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
          <v-row class="mt-4">
            <v-col>
              <v-select :items="options" v-model.number="per_page" label="Cantidad por página"></v-select>
            </v-col>
            <v-col class="d-flex justify-center align-center">
              <p>Total registros {{ total_rows }}</p>
            </v-col>
            <v-col>
              <v-pagination v-model="page" @input="getCuentas" :length="totalPages"></v-pagination>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-flex>

    <!-- Modal para editar y crear -->
    <v-dialog v-model="modal" max-width="500px">
      <v-card>
        <v-card-title class="blueMinsal--text">
          <span class="text-h5">{{ modalTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveCuenta()">
            <v-text-field v-model="form.nombre" label="Nombre" :error-messages="nombreErrors"
              @blur="$v.form.nombre.$touch()" required></v-text-field>
            <v-text-field v-model="form.codigo" label="Código" :error-messages="codigoErrors"
              @blur="$v.form.codigo.$touch()"></v-text-field>
            <v-select v-model="form.id_tipo_cuenta" :items="tiposCuentas" label="Tipo de cuenta" item-text="nombre"
              :error-messages="tipoCuentaErrors" @blur="$v.form.id_tipo_cuenta.$touch()" item-value="id"></v-select>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blueMinsal" text @click="modal = false">Cancelar</v-btn>
              <v-btn color="blueMinsal" text @click="editMode ? updateCuenta() : saveCuenta()">{{ editMode ? 'Actualizar'
                : 'Guardar' }}</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>



  </v-container>
</template>
<script>
import { mapActions } from "vuex";
import { required } from "vuelidate/lib/validators";

export default {
  data: () => ({
    cuentas: [],
    tiposCuentas: [],
    options: [{ value: 10, text: '10' }, { value: 25, text: '25' }, { value: 50, text: '50' }],
    loading: false,
    headers: [
      {
        text: "Nombre",
        align: "start",
        value: "nombre",
      },
      {
        text: "Código",
        align: "start",
        value: "codigo",
      },
      {
        text: "Tipo de cuenta",
        align: "start",
        value: "TipoCuentum.nombre",
      },
      { text: "Accion", value: "accion", sortable: false, width: "100" },
    ],
    page: 1,
    per_page: 10,
    total_rows: 0,
    modal: false,
    editMode: false,
    modalTitle: "",
    form: {
      nombre: null,
      codigo: null,
      id_tipo_cuenta: null,
    },
  }),

  validations: {
    form: {
      nombre: {
        required
      },
      codigo: {
        required
      },
      id_tipo_cuenta: {
        required
      }
    }
  },

  methods: {
    ...mapActions("utils", ["getMenu"]),
    async getCuentas() {
      this.loading = true;
      const response = await this.services.cuenta.getCuentas({
        page: this.page,
        per_page: this.per_page
      })
      const { page, per_page, total_rows } = this.getPaginationProperties(response)
      this.cuentas = response.data;
      this.page = page;
      this.per_page = per_page;
      this.total_rows = total_rows;
      this.loading = false;
    },
    async deleteCuenta(id) {
      const response = await this.services.cuenta.deleteCuenta(id)
      if (response.status === 200) {
        this.temporalAlert({
          show: true,
          message: 'Cuenta eliminada con éxito',
          type: "success",
        });
        this.getCuentas()
      }
    },
    async getTiposCuentas() {
      const response = await this.services.catalogo.getTipoCuentas({
        paginacion: false
      })
      this.tiposCuentas = response.data
    },

    async storeCuenta() {
      this.modalTitle = "Agregar cuenta"
      this.modal = true
      this.editMode = false
      this.cleanForm()
    },

    cleanForm() {
      this.cleanErrors()
      this.form = {
        nombre: null,
        codigo: null,
        id_tipo_cuenta: null,
      }
    },

    cleanErrors() {
      this.$v.$reset()
    },

    async saveCuenta() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        const response = await this.services.cuenta.storeCuenta(this.form)
        if (response.status === 200) {
          this.temporalAlert({
            show: true,
            message: 'Cuenta creada con éxito',
            type: "success",
          });
          this.getCuentas()
          this.modal = false
        }
      }
    },

    async editCuenta(id) {
      this.modalTitle = "Editar cuenta"
      const response = await this.services.cuenta.getCuenta(id)
      this.form = response.data
      this.modal = true
      this.editMode = true
    },

    async updateCuenta() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        const response = await this.services.cuenta.updateCuenta(this.form.id, this.form)
        if (response.status === 200) {
          this.temporalAlert({
            show: true,
            message: 'Cuenta actualizada con éxito',
            type: "success",
          });
          this.getCuentas()
          this.modal = false
        }
      }
    }

  },
  computed: {
    totalPages() {
      return Math.ceil(this.total_rows / this.per_page)
    },
    nombreErrors() {
      const errors = []
      if (!this.$v.form.nombre.$dirty) return errors
      !this.$v.form.nombre.required && errors.push('Nombre es obligatorio')
      return errors
    },
    codigoErrors() {
      const errors = []
      if (!this.$v.form.codigo.$dirty) return errors
      !this.$v.form.codigo.required && errors.push('Código es obligatorio')
      return errors
    },
    tipoCuentaErrors() {
      const errors = []
      if (!this.$v.form.id_tipo_cuenta.$dirty) return errors
      !this.$v.form.id_tipo_cuenta.required && errors.push('Tipo de cuenta es obligatorio')
      return errors
    },

  },
  watch: {
    per_page() {
      this.page = 1;
      this.getCuentas()
    }
  },
  async created() {
    this.getCuentas()
    this.getTiposCuentas()
  },
};
</script>
