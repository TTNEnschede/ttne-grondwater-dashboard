<template>
  <div class="devicelist">
    <div v-if="devices === null || devices.length == 0">
      Geen sensoren bekend!
    </div>
    <ul class="panel">
      <li v-for="(device, index) in devices" :key="device.device_id">
        <div class="panel-block"
          :class="(!selected && index == 0) || (selected && selected == device.device_id) ? 'is-active' : ''">
          <span class="panel-icon">
            <i class="fa fa-sellsy" aria-hidden="true"></i>
          </span>
          <a :class="(selected && selected != device.device_id) ? 'device-link' :''" v-on:click="$emit('selected-device', device.device_id)">
            {{ device.device_id }}
          </a>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'DeviceList',
    props: {
      devices: Array,
      selected: String
    }
  }
</script>

<style scoped>
  a,
  .panel-block.is-active .panel-icon {
    color: #219bec;
  }
  .panel-block.is-active {
    border-left-color: #219bec;
  }
  .device-link {
    color: grey;
  }
</style>
