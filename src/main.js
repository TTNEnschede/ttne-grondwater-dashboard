import Vue from 'vue'
import App from './App.vue'
import VueSpinners from 'vue-spinners'

Vue.config.productionTip = false

Vue.use(VueSpinners)

new Vue({
  render: h => h(App),
}).$mount('#app')
