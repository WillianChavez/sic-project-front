<template>
  <div>
    <div class="search-filters-container px-3 py-4 elevation-1">
      <v-text-field v-model="search" :placeholder="placeholder"></v-text-field>
      <div class="search-auto-filters">
        <div v-for="row in results" :key="row[itemValue]">
          <v-checkbox dense v-model="row.value" :label="row[itemText]" @click="select(row)"></v-checkbox>
        </div>
      </div>
    </div>
    <span v-if="errorMessages.length>0" class="red--text"> {{ errorMessages[0] }}</span>
  </div>
</template>

<script>
export default {
  name: "AppSearchList",
  props: {
    items: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    },
    itemText: {
      type: String,
      default: () => 'text'
    },
    itemValue: {
      type: String,
      default: () => 'value'
    },
    placeholder: {
      type: String,
      default: 'Buscar'
    },
    errorMessages: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    search: null,
  }),
  methods: {
    select(row) {
      const result = this.value
      const index = result.findIndex(element => element === row[this.itemValue])
      if (index >= 0) {
        result.splice(index, 1)
        this.$emit('deleteItem', row[this.itemValue])
      } else {
        result.push(row.id)
        this.$emit('addItem', row[this.itemValue])
      }
      this.$emit('input', result)
    }
  },
  computed: {
    rows() {
      return this.items.map(item => {
        item.value = this.value.includes(item.id)
        return item
      })
    },
    results() {
      if (this.search === null || this.search === '') return this.rows
      return this.rows.filter(item => {
        return item[this.itemText]?.toLowerCase()?.includes(this.search?.toLowerCase())
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.search-auto-filters {
  max-height: 200px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: .5rem;
  }

  &::-webkit-scrollbar-track {
    background: #CACACA;
  }

  &::-webkit-scrollbar-thumb {
    background: #1542a4;
    border-radius: .25rem;

    &:active {
      background: #2E75EA;
    }
  }
}

</style>