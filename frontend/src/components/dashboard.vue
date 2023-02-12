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
  components: {
    EventChart,
  },
  data() {
    return {
      databasedata: {},
      labels:[],
      attendees:[],
      loading: false,
      error: null,
    };
  },
    methods: {
    async fetchData() {
      try {
        this.error = null;
        this.loading = true;
        const url = `http://localhost:3001/eventData/countall`;
        const resp = await axios.get(url);
        //"re-organizing" - mapping json from the response
        this.databasedata = resp.data;
        this.labels = resp.data.map((item) => item.eventName);
        this.attendees = resp.data.map((item) => item.mycount);
      } catch (err) {
        if (err.response) {
          // client received an error response (5xx, 4xx)
          this.error = {
            title: "Server Response",
            message: err.message,
          };
        } else if (err.request) {
          // client never received a response, or request never left
          this.error = {
            title: "Unable to Reach Server",
            message: err.message,
          };
        } else {
          // There's probably an error in your code
          this.error = {
            title: "Application Error",
            message: err.message,
          };
        }
      }
      this.loading = false;
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>


