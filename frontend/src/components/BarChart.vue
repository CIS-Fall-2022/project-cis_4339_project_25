<template>
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
  </template>
  
  <script>
  import axios from "axios";
  import { Bar } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
  
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
  
  export default {
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
    },
    data() {
      return {
        chartData: {
              labels: [],
              datasets: [ { data: [] } ]
            },
            chartOptions: {
              responsive: true
            },
      }
    },
    mounted() {
        let apiURL = import.meta.env.VITE_ROOT_API + `/eventData/countall`;
        axios.get(apiURL).then((resp) => {
            resp.data.forEach(element => {
                let newapiURL = import.meta.env.VITE_ROOT_API + `/eventData/id/` + element._id;
                axios.get(newapiURL).then((resp) => {
                    this.Xaxis.push(resp.data[0].eventName);
                    this.Yaxis.push(element.mycount);
                });
            });
        });
        this.labels = this.Xaxis;
        this.datasets[0].data = this.Yaxis;
    },
  }
  </script>