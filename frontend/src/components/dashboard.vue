<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Welcome to the Main Page</h1>
    </div>
<<<<<<< Updated upstream
    <!-- <div>{{databasedata}}</div> -->
    <EventChart
=======
    <div>
      <BarChart
>>>>>>> Stashed changes
              v-if="!loading && !error"
              :label="labels"
              :chart-data="attendees"
              style="margin-left: 75px; margin-right: 75px; margin-bottom: 75px;"
<<<<<<< Updated upstream
    ></EventChart>
=======
            ></BarChart>
    </div>
    <div>{{databasedata}}</div>
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
import EventChart from "@/compenents/BarChart.vue";
=======
import BarChart from "@/components/BarChart.vue"
>>>>>>> Stashed changes
export default {
  components:{
    dashChart,
  },
    data() {
        return {
            databasedata: {},
            labels:[],
            attendees:[],
<<<<<<< Updated upstream
            loading: false,
            error: null,
=======
>>>>>>> Stashed changes
        };
    },
    methods: {
      async fetchData () {
        try {
          this.error = null;
          this.loading = null;
          const url ='http://localhost:3000/eventData/countall'
          const response = await axios.get(url);
          this.labels = response.data.map((item) => item.eventName);
          this.attendees = response.data.map((item) => item.mycount);
          this.databasedata = resp.data;
<<<<<<< Updated upstream
        } catch (err) {
          if (err.response){
          //client recieved an error
          this.error = {
            title: "Server Response",
            message: err.message,
          };
        } else if(err.request) {
          //cleint never received a response, or request never left
          this.error = {
            title: "Unable to Reach Server",
            message: err.message,
          };
        } else {
          this.error = {
            title: "Application Error",
            message: err.message,
          };
        }
        }
        this.loading = false;
      },
=======
          this.labels = response.data.map((item) => item.eventName);
          this.attendes = response.data.map((item) => item.attendees);
        });
>>>>>>> Stashed changes
    },
    mounted() {
      this.fetchData();
      console.log()
    },
  }
</script>  
      

