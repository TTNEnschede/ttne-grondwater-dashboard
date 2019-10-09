<template>
  <div class="main container card">
    <Header />
    <div class="columns">
      <aside class="column is-one-quarter">
        <div class="content">
        <h1 class="has-text-left is-size-5">
          Sensoren
        </h1>
      </div>
        <DeviceList
          :devices="devices"
          :selected="selecteddevice"
          v-on:selected-device="onSelectDevice" />
      </aside>
      <Content class="column is-three-quarters"
        :deviceid="selecteddevice" />
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import Content from './Content.vue'
  import DeviceList from './DeviceList.vue'
  import Header from './Header.vue'

  const devicesUrl = process.env.VUE_APP_DEVICES_URL || 'http://localhost:3002/api/devices'

  export default {
    name: 'Main',
    components: {
      Header,
      Content,
      DeviceList
    },
    data () {
      return {
        devices: null,
        selecteddevice: ''
      }
    },
    mounted () {
      axios
        .get(devicesUrl)
        .then(response => {
          this.devices = response.data.devices.sort((a,b) => (a.device_id > b.device_id) ? 1 : ((b.device_id > a.device_id) ? -1 : 0))
        })
    },
    methods: {
      onSelectDevice: function (deviceid) {
        this.selecteddevice = deviceid
      }
    }
  }
</script>

<style scoped>
  .main {
    padding: 20px;
  }
  h1 {
    padding: 0 0 0 3px;
  }
</style>
