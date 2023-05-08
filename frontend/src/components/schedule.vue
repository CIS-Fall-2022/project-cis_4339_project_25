<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Schedule</h1>
    </div>
    <div id="services" class="services mt-8 justify-center text-center">
      <table class="w-1/2 mx-auto justify-center text-center">
        <thead>
          <tr>
            <th class="px-4 py-2" style="text-align: center;">Name</th>
            <th class="px-4 py-2" style="text-align: center;">Contact Phone</th>
            <th class="px-4 py-2" style="text-align: center;">Date</th>
            <th class="px-4 py-2" style="text-align: center;">Time</th>
            <th class="px-4 py-2" style="text-align: center;">Services</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in requestData" :key="item.id">
          <td class="border px-4 py-2">{{ item.client_name }}</td>
          <td class="border px-4 py-2">{{ item.contact_phone }}</td>
          <td class="border px-4 py-2">{{ item.appt_date.substring(0,10) }}</td>
          <td class="border px-4 py-2">{{ formatTime(item.start_time) }}</td>
          <td class="border px-4 py-2">{{ item.services }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>
<script>
import axios from "axios";

export default {
  props: ['data'],
  data() {
    return {
      requestData: [],
    };
  },
    methods: {
    formatTime(time) {
      const hours = parseInt(time.substring(0, 2));
      const minutes = parseInt(time.substring(2, 4));
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours > 12 ? hours - 12 : hours;
      const paddedMinutes = minutes < 10 ? '0' + minutes : minutes;
      return `${displayHours}:${paddedMinutes} ${ampm}`;
    },
    async fetchData() {
      try {
        axios.get(import.meta.env.VITE_ROOT_API + `/appointmentInfo`)
        .then((resp) => {
          console.log(resp.data[0])
        this.requestData = resp.data[0];
      });
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
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style>
td {
  white-space: nowrap;
}
</style>
