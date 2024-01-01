<template>
  <v-main class="bg-grey-lighten-3">
    <v-container>
      <v-row>
        <v-col>
          <Bar
            id="events-chart"
            :data="chartData"
            :options="chartOptions"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import {chartOptions, data} from '@/config/chart'
import {CategoryScale, Legend, LinearScale, LineElement, PointElement, Title, Tooltip} from 'chart.js'
import {Chart} from 'chart.js/auto'
import {Bar} from 'vue-chartjs'
import axios from 'axios'

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default {
  name: 'DashboardView',
  components: {
    Bar
  },
  data() {
    return {
      chartData: data({crosspromo: 12, ads: 20, app: 100, liveops: 55}),
      chartOptions
    }
  },
  async created() {
    const {data: result} = await axios.get('v1/events/count')
    try {
      this.chartData =
        data({
          crosspromo: result['crosspromo'],
          ads: result['ads'],
          app: result['app'],
          liveops: result['liveops']
        })
    } catch (err) {
      console.log(err)
    }
  }
}
</script>
