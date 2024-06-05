<template>
  <v-app>
    <v-main class="about">
      <v-container fluid fill-height>
        <v-row class="text-center">
          <v-col cols="12">
            <img src="../../assets/img/SIS-HAZUL.png"  style="max-width: 350px; width: 75%"/>
          </v-col>
          <v-col cols="12">
            <p :class="{
              'text-h6': breakpoint==='xs',
              'text-h6': breakpoint==='sm',
              'text-h4': breakpoint==='md',
              'text-h3': breakpoint==='lg',
              'text-h3': breakpoint==='lx',
              'text-h3': breakpoint==='2xl',
              'red--text':!verify
            }">
              {{ message }}
            </p>
            <v-progress-circular
              v-if="loading"
              indeterminate
              color="blueMinsal"
              class="d-flex mx-auto"
            ></v-progress-circular>
            <v-btn
              color="blueMinsal"
              class="mt-8"
              rounded
              :to="{name:'login'}"
              text
              id="botomAction"
              style="text-transform: none"
              large
            >
              Regresar al login
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
export default {
  name: "verifyMail",
  data: () => ({
    loading:false,
    interval: null,
    message: "",
    verify:null,
  }),
  methods: {
    async checkVerify() {
      try{
        this.loading=true
        const token = this.$route.params.token;
        const response=await this.services.auth.verifyAccount(token)
        this.message = response?.data.message || "Ha ocurrido un problema";
        this.verify=true
      }catch{
        this.verify=false;
        this.message="No se pudo verificar la cuenta del usuario";
      }finally {
        this.loading=false
      }
    },
  },
  computed: {
    breakpoint(){
      return this.$vuetify.breakpoint.name
    },
  },
  created() {
    this.checkVerify();
  },
};
</script>
