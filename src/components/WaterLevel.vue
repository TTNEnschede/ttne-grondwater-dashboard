<script>
  import { Line, mixins } from 'vue-chartjs'

  export default {
    extends: Line,
    mixins: [mixins.reactiveProp],
    props: ['chartData', 'options'],
    mounted () {
      this.addPlugin({
        id: 'chart-area-background-color-plugin',
        beforeDraw: function (chart) {
          if (chart.data.datasets[0] && chart.data.datasets[0].chartAreaBackgroundColor) {
            var ctx = chart.chart.ctx;
            var chartArea = chart.chartArea;

            ctx.save();
            ctx.fillStyle = chart.data.datasets[0].chartAreaBackgroundColor
            ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
            ctx.restore();
          }
        }
      })
      this.renderChart(this.chartData, this.options)
    }
  }
</script>

<style>
</style>
