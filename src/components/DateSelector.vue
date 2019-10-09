<template>
  <div class="dateselector">
    <div class="tabs is-toggle">
      <ul>
        <li v-for="(item, index) in items" v-bind:key="index"
          v-bind:class="{ 'is-active': item.selected }">
          <a v-on:click="onItemClick(index)">
            <span>{{ item.text }}</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Dateselector',
    props: {
      items: Array
    },
    methods: {
      onItemClick(index) {
        for (var i = 0; i < this.items.length; i++) {
          if (index == i) {
            this.items[i].selected = true
          } else {
            this.items[i].selected = false
          }
        }
        this.$emit('selectedRange', index)
      }
    }
  }
</script>

<style scoped>
  .tabs {
    padding-top: 0;
  }
  .tabs > ul {
      margin-top: 0;
  }
  .tabs > ul > li:first-child {
    margin-top: 4px;
  }

</style>
