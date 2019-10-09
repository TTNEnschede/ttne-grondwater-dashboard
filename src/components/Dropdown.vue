<template>
  <div class="dropdown is-right"
    v-bind:class="{ 'is-active': isDropdownActive }"
    v-on-clickaway="away">
    <div class="dropdown-trigger"
      @click="isDropdownActive=!isDropdownActive">
      <a aria-haspopup="true"
        aria-controls="{ 'dropdown-menu'}">
        <span>Filter: {{ selection }} </span>
        <span class="icon is-small">
          <i class="fa fa-angle-down"
            aria-hidden="true"></i>
        </span>
      </a>
    </div>
    <div class="dropdown-menu"
      id="dropdown-menu"
      role="menu">
      <ul class="dropdown-content">
        <li v-for="(item, index) in items" :key="index">
          <a href="#"
            @click="setSelection(index)"
            class="dropdown-item has-text-centered">
            <span>{{ item }}</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mixin as clickaway } from 'vue-clickaway';
export default {
  props: ['id'],
  mixins: [ clickaway ],
  data() {
    return {
      selection: 'Grondwater (maaiveld)',
      isDropdownActive: false,
      items: [
        'Grondwater (maaiveld)', 'Grondwater (meting)', 'Batterij'
      ]
    }
  },
  methods: {
    away() {
      this.isDropdownActive = false;
    },
    setSelection(index) {
      this.selection = this.items[index]
      this.$emit('selectedChartType', this.selection)
      this.away()
    }
  }
};
</script>
<style scoped>
  .dropdown-content li {
    list-style: none;
  }
  .dropdown.is-right .dropdown-menu {
    right: 12px;
  }
</style>
