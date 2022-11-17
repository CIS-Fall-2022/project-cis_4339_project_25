<template>
    <div>
      <!-- canvas element for chart -->
      <canvas id="planet-chart"></canvas>
    </div>
  </template>
  
  
  <script>
  import { Chart, registerables } from 'chart.js'
  import planetChartData from '../assets/planet-data.js'
  
  Chart.register(...registerables);
  export default {
    name: 'PlanetChart',
    data() {
      return {
        planetChartData: planetChartData
      }
    },
    //establish Chart object after mounting the component
    mounted() {
      const ctx = document.getElementById('planet-chart');
      new Chart(ctx, this.planetChartData);
    }
  }
  </script>