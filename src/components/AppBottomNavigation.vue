<template>
  <div>
    <v-spacer class="my-14"></v-spacer>
    <v-bottom-navigation background-color="blueDarkMinsal" fixed>
      <div class="d-inline-flex overflow-x-auto bottom">
        <v-btn
          value="recent"
          v-for="(item, index) in menu"
          :key="index"
          rounded
          :to="item.uri"
        >
          <span class="white--text">{{ item.nombre }}</span>

          <v-icon class="white--text">{{ item.icono }}</v-icon>
        </v-btn>
      </div>
    </v-bottom-navigation>
  </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
export default {
  props: {
    menu: {
      type: Array,
      default: () => {
        return [{ uri: "/", nombre: "Inicio", icono: "mdi-home" }];
      },
    },
  },
  data: () => ({}),
  methods: {
    ...mapMutations("utils", ["setSibeBar"]),
  },
  computed: {
    ...mapState("utils", ["sideBar"]),
    ...mapState(["userInfo", "userDetail"]),
  },
};
</script>
<style>
div.bottom::-webkit-scrollbar {
  -webkit-appearance: none;
}

div.bottom::-webkit-scrollbar:horizontal {
  height: 5px;
}

div.bottom::-webkit-scrollbar-thumb {
  background-color: rgb(241, 241, 241);
  border-radius: 10px;
}

div.bottom::-webkit-scrollbar-track {
  background-color: rgba(255, 255, 255, 0.267);
  border-radius: 10px;
}
</style>
