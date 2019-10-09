<template>
  <div id="app">
    <BetaRibbon />
    <Main />
  </div>
</template>

<script>
  import Main from './components/Main.vue'
  import BetaRibbon from './components/BetaRibbon.vue'

  export default {
    name: 'app',
    components: {
      Main,
      BetaRibbon
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 30px;
  }

  body, html {
    height: 100%;
    background: #f2f1f0;
  }
</style>
