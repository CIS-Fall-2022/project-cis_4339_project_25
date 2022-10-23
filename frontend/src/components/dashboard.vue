<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Welcome to the Main Page</h1>
    </div>
    <div></div>
    <Bar
      :chart-options="chartOptions"
      :chart-data="chartData"
      :chart-id="chartId"
      :dataset-id-key="datasetIdKey"
      :plugins="plugins"
      :css-classes="cssClasses"
      :styles="styles"
      :width="width"
      :height="height"
    />
  </main>
</template>
<script>
import axios from "axios";
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    data() {
        return {
            chartData: {
              labels: [],
              datasets: [ { data: [] } ]
            },
            chartOptions: {
              responsive: true
            },
        };
    },
    mounted() {
        let newnewapiURL = import.meta.env.VITE_ROOT_API + `/eventData/countall`;
        axios.get(newnewapiURL).then((resp) => {
            resp.data.forEach(element => {
            this.chartData.labels.push(element.eventName);
            this.chartData.datasets[0].data.push(element.mycount);

            });
        });
    },
    methods: {
        routePush(routeName) {
            this.$router.push({ name: routeName });
        },
    },
    name: 'BarChart',
    components: { Bar },
    props: {
      chartId: {
        type: String,
        default: 'bar-chart'
      },
      datasetIdKey: {
        type: String,
        default: 'label'
      },
      width: {
        type: Number,
        default: 25
      },
      height: {
        type: Number,
        default: 25
      },
      cssClasses: {
        default: '',
        type: String
      },
      styles: {
        type: Object,
        default: () => {}
      },
      plugins: {
        type: Object,
        default: () => {}
      }
    }
};
</script>
