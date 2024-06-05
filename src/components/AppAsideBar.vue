<template>
  <v-navigation-drawer
      :value="sideBar"
      fixed
      app
      @input="setSideBar($event)"
  >
    <template v-slot:prepend>
      <v-card elevation="2" class="ma-4 py-0" v-if="!sideBar">
        <v-card-title>
          <img
              :src="require(`@/assets/img/banner.png`)"
              width="95%"
              height="auto"
          />
        </v-card-title>
      </v-card>
      <v-list-item v-else style="height: 10rem; display: flex; justify-content: center;">
        <v-btn text icon x-large color="blueMinsal"
        >

          <img
              :src="require(`@/assets/img/banner.png`)"
              width="150px"
              height="auto"
          />
        </v-btn
        >
      </v-list-item>
    </template>

    <v-list dense nav>
      <span v-for="(item, i) in menu"
            :key="i">

        <v-list-group active-class="blueMinsal--text" v-if="item.childrens && item.childrens.length">
        <template v-slot:activator>
          <v-list-item-title class="text-capitalize">
            {{ item.nombre }}
          </v-list-item-title>
        </template>
        <template #prependIcon>
          <v-icon color="blueMinsal">{{ item.icono }}</v-icon>
        </template>
          <div>
            <v-list-item v-for="(child, j) in item.childrens" :key="j" :to="child.uri" active-class="blueMinsal--text">
              <v-list-item-icon>
                <v-icon>{{ child.icono }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title class="text-capitalize">
                <span>{{ child.nombre }}</span>
              </v-list-item-title>
            </v-list-item>
          </div>
      </v-list-group>
        <v-list-item v-else :to="item.uri"
                     active-class=" blueMinsal--text">
          <v-tooltip right :disabled="!sideBar" color="blueMinsal">
            <template v-slot:activator="{ on, attrs }">
              <v-list-item-icon v-bind="attrs" v-on="on">
                <v-icon>{{ item.icono }}</v-icon>
              </v-list-item-icon>
            </template>
            <span>{{ item.nombre }}</span>
          </v-tooltip>

        <v-list-item-title class="text-capitalize">
          {{ item.nombre }}
        </v-list-item-title>
        </v-list-item>
      </span>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import {mapMutations, mapState} from "vuex";

export default {
  name: "AppAsideBar",
  props: {
    menu: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  methods: {
    ...mapMutations("utils", ["setSideBar"]),
  },
  computed: {
    ...mapState("utils", ["sideBar"]),
  },
};
</script>

<style scoped></style>
