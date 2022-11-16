<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Welcome to the Main Page</h1>
    </div>
    <div>
      <EventChart
              v-if="!loading && !error"
              :label="labels"
              :chart-data="attendees"
              style="margin-left: 75px; margin-right: 75px; margin-bottom: 75px;"
            ></EventChart>
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
  </main>
</template>
<script>
import axios from "axios";
import EventChart from "@/components/BarChart.vue";
export default {
    data() {
        return {
            databasedata: {},
            labels:[],
            attendees: [],
        };
    },
    async mounted() {
        let newnewapiURL = import.meta.env.VITE_ROOT_API + `/eventData/countall`;
        axios.get(newnewapiURL).then((resp) => {
          this.databasedata = resp.data;
          this.labels = resp.data.map((item) => item.eventName);
          this.atendees = resp.data/map((item) => item.mycount);
        });
    },
    methods: {
        routePush(routeName) {
            this.$router.push({ name: routeName });
        },
    },
};
</script>
