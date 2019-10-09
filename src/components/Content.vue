<template>
  <div class="content">
    <h1 v-if="deviceid === ''" class="has-text-left is-size-5">
      Selecteer een sensor uit de lijst
    </h1>
    <h1 v-else class="has-text-left is-size-5">
      Sensor: {{deviceid}}
    </h1>
    <div class="columns">
      <div class="column has-text-right">
        <p class="has-text-weight-light is-italic">Maximum: {{max_level}} mm, Minimum: {{min_level}} mm</p>
      </div>
    </div>

    <div class="columns">
      <div class="column">
        Selecteer start datum:
      </div>
      <div class="column">
        <datepicker class="datepicker"
          placeholder="Selecteer datum"
          v-model="startDate">
        </datepicker>
      </div>
      <div class="column no-padding has-text-right">
        <DateSelector
          :items=items
          v-on:selectedRange="onSelectedRange"/>
      </div>
    </div>

    <WaterLevel class="waterlevel"
      :chartData="chartdata"
      :options="options" />

    <div class="footnote">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <p class="has-text-left is-italic">Laatst gezien op {{last_seen}}</p>
          </div>
        </div>
        <div>
          <dropdown v-on:selectedChartType="onSelectedChartType">
          </dropdown>
        </div>
      </div>
    </div>


    <div class="notification is-info has-text-left">
      Uitleg grafieken.
      <ul>
        <li>
          <strong>Grondwater (maaiveld):</strong> geeft de waardes
          ten op zichte van maaiveld (de grond).
        </li><li>
          <strong>Grondwater (meting):</strong> geeft de ruwe waardes uit de
          sensor. Dit is de afstand tussen de oog van de sensor tot het
          wateroppervlak in de peilbuis.
        </li><li>
          <strong>Batterij:</strong> geeft de waardes van de batterij van de
          sensor (in Volts).
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import moment from 'moment'
  import Datepicker from 'vuejs-datepicker'
  import WaterLevel from './WaterLevel'
  import Dropdown from './Dropdown'
  import DateSelector from './DateSelector'

  const measurementsUrl = process.env.VUE_APP_MEASUREMENTS_URL || 'http://localhost:3003/api/measurements'

  export default {
    name: 'Content',
    components: {
      WaterLevel,
      DateSelector,
      Datepicker,
      Dropdown
    },
    props: {
      deviceid: String
    },
    data() {
      return {
        startDate: moment().subtract(1, "months").format(),
        range: '1 maand',
        items:[
          {
            text: '1 week',
            selected: false
          },
          {
            text: '2 weken',
            selected: false
          },
          {
            text: '1 maand',
            selected: true
          },
          {
            text: '2 maanden',
            selected: false
          }
        ],
        min_level: null,
        max_level: null,
        chartdata: null,
        last_seen: null,
        chart_type: 'grondwater (maaiveld)',
        // Hardcoded the chart options here.
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: false
          },
          tooltips: {
            callbacks: {
              label: (item) => " Grondwaterniveau: "+ item.yLabel + " mm",
            }
          },
          scales: {
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'day'
                }
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true,
                padding: 25
              },
              scaleLabel: {
                display: true,
                labelString: '(in millimeters)'
              }
            }]
          }
        },
        rain_level_chartdata: null,
        rain_level_options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: false
          },
          tooltips: {
            callbacks: {
              label: (item) => " Neerslag: "+ item.yLabel + " mm",
            }
          },
          scales: {
            xAxes: [{
              display: true,
              type: 'time',
              time: {
                  unit: 'day'
              }
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true,
                reverse: true,
                padding: 25
              },
              scaleLabel: {
                display: true,
                labelString: '(in millimeters)'
              }
            }]
          }
        }
      }
    },
    mounted () {
      this.fetchMeasurements(this.deviceid)
    },
    computed: {
      apiSource: function () {
        if (this.chart_type == 'batterij') {
          return 'batterylevel'
        }
        return 'level'
      },
      apiLimit: function () {
        var limit
        switch (this.range) {
          case '1 week':
            limit = 7 * 24
            break
          case '2 weken':
            limit = 2 * 7 * 24
            break
          case '1 maand':
            limit = 30 * 24
            break
          case '2 maanden':
            limit = 2 * 30 * 24
            break
          default:
            limit = 10
        }
        return limit
      },
      apiEndDate: function () {
        const num_days = this.apiLimit / 24
        return moment(this.startDate).add(num_days, "days")
      }
    },
    watch: {
      // eslint-disable-next-line
      deviceid: function (newValue, oldValue) {
        if (newValue) {
          this.fetchLastMeasurement(newValue)
          return this.fetchMeasurements(newValue)
        }
      },
      // eslint-disable-next-line
      startDate: function (newValue, oldValue) {
        this.fetchMeasurements(this.deviceid)
      }
    },
    methods: {
      fetchMeasurements: function (deviceid) {
        const start = moment(this.startDate).format('YYYYMMDD')
        const end = moment(this.apiEndDate).format('YYYYMMDD')
        const source = this.apiSource
        const limit = this.apiLimit
        const url = measurementsUrl.concat('?device_id=', deviceid, '&measurement_type=', source, '&start=', start, '&end=', end, '&limit=', limit)
        axios
          .get(url)
          .then(
            response => (
              this.chartdata = this.parseMeasurements(response.data.measurements)
            )
          )
      },
      parseMeasurements: function (measurements) {
        var labels = []
        var data = []
        // var rain_level_data = []
        var min, max;
        for (var i = 0; i < measurements.length; i++) {
          // Skip alle 0 waardes.
          if(measurements[i].measurement_value != 0) {
            labels.push(new Date(measurements[i].timestamp))
            let measurement = measurements[i].measurement_value
            if (this.chart_type === 'grondwater (maaiveld)') {
              measurement = -1 * measurement
            }
            data.push(measurement)
            // Cal min and max values
            if (min == null || min > measurement) {
              min = measurement
            }
            if (max == null || max < measurement) {
              max = measurement
            }
          }
        }
        // eslint-disable-next-line
        if (!! min) {
          this.min_level = min.toFixed(1)
        }
        // eslint-disable-next-line
        if (!! max) {
          this.max_level = max.toFixed(1)
        }
        let color = 'rgba(33, 155, 236, 0.5)'
        if (this.chart_type === 'batterij') {
          color = 'rgba(255, 0, 0, 0.5)'
        }
        // Set chart background
        let chartAreaBackgroundColor = 'rgba(255, 255, 255, 1.0)'
        if (this.chart_type === 'grondwater (maaiveld)') {
          chartAreaBackgroundColor = 'rgba(139, 69, 19, 0.2)'
        }

        const chartdata = {
          labels: labels,
          datasets: [
            {
              label: 'Grondwaterniveau',
              backgroundColor: color,
              chartAreaBackgroundColor: chartAreaBackgroundColor,
              borderWidth: 0,
              pointRadius: 2,
              fill: 'start',
              data: data
            }
          ]
        }
        return chartdata
      },
      fetchLastMeasurement: function (deviceid) {
        const token = 'Bearer '.concat(this.$keycloak.token)
        const url = measurementsUrl.concat('?device_id=', deviceid, '&measurement_type=level&limit=1')
        axios
          .get(url, { headers: { Authorization: token } })
          .then(
            response => (
              this.last_seen =
                moment(response.data.measurements[0].timestamp)
                  .format('DD-MM-YY (LT)')
            )
          )
      },
      onSelectedChartType(chart_type) {
        this.chart_type = chart_type.toLowerCase()
        this.fetchMeasurements(this.deviceid)
      },
      onSelectedRange(index) {
        this.range = this.items[index].text
        this.fetchMeasurements(this.deviceid)
      }
    }
  }
</script>

<style scoped>
  .waterlevel {
    padding: 2px;
  }
  .level-item {
    padding-right: 24px;
  }
  .footnote {
    padding: 10px 0 20px 90px;
    font-size: 0.8em;
  }
  .dropdown {
    padding-right: 16px;
  }
  .no-padding {
    padding: 0;
  }
  .has-text-right {
    margin-right: 20px;
  }
</style>
