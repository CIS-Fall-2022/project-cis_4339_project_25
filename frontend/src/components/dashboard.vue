<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Welcome to the Main Page</h1>
    </div>
    <div>{{databasedata}}</div>
    <table>
      <thead class="bg-gray-50 text-xl">
            <tr>
              <th class="p-4 text-left">Event Name</th>
              <th class="p-4 text-left">Last 2 Months Signup</th>
            </tr>
      </thead>
      <tbody class="divide-y divide-gray-300">
        <tr v-for="item in databasedata" :key="item._id">
        <td class="p-2 text-left">{{ item.eventName}}</td>
        <td class="p-2 text-left">{{ item.mycount}}</td>
        </tr>
      </tbody>
    </table>
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

export default {
    data() {
        return {
            databasedata: {},
        };
    },
    async mounted() {
        let newnewapiURL = import.meta.env.VITE_ROOT_API + `/eventData/countall`;
        axios.get(newnewapiURL).then((resp) => {
          this.databasedata = resp.data;
        });
    },
    methods: {
        routePush(routeName) {
            this.$router.push({ name: routeName });
        },
    },
};
</script>
