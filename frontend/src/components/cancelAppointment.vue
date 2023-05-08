<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Cancel Your Appointment</h1>
    </div>
    <div class="px-10 pt-20">
      <form @submit.prevent="handleSubmitForm">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        <h2 class="text-2xl font-bold">Search Appointment</h2>
        <!-- Displays Client Name search field -->

        <div class="flex flex-col">
          <label class="block">
            <input class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
             type="tel" id="phone" v-model="formattedPhone" minlength="10" maxlength="12" placeholder="Enter phone number" required
             />
          </label>
        </div>
        <div class="flex flex-col">
            <VueDatePicker v-model="selectedDate" :format="'yyyy-MM-dd'" :min-date="new Date()" :enable-time-picker="false" :disabledDates="disabledDates"></VueDatePicker>
        </div>
        <!-- Displays event date search field -->
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        <div></div>
        <div></div>
        <div class="mt-5 grid-cols-2">
          <button
            class="mr-10 border border-red-700 bg-white text-red-700 rounded"
            @click="clearSearch"
            type="submit"
          >Clear Search</button>
          <button
            class="bg-red-700 text-white rounded"
            type="submit"
          >Search Appointment</button>
        </div>
      </div>
    </form>
    </div>

    <hr class="mt-10 mb-10" />
    <!-- Display Found Data -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
      <div class="ml-10">
        <h2 class="text-2xl font-bold">Your Appointments</h2>
      </div>
      <div class="flex flex-col col-span-2">
        <table class="min-w-full shadow-md rounded">
          <thead class="bg-gray-50 text-xl">
            <tr>
              <th class="p-4 text-center">Appointment Date</th>
              <th class="p-4 text-center">Appointment Time</th>
              <th class="p-4 text-center">Appointment Services</th>
              <th class="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="appointment in queryData" :key="appointment.id">
              <td class="text-center">{{ formatDate(appointment.appt_date) }}</td>
              <td class="text-center">{{ formatTime(appointment.start_time) }}</td>
              <td class="text-center">{{ appointment.services }}</td>
              <td>
                <button class="cancel-button" @click="cancelAppointment(appointment.id)">Cancel</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>
<script>
import axios from "axios";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import moment from 'moment';

export default {
  components: { VueDatePicker },
  data() {
    return {
      queryData: [],
      //Parameter for search to occur
      phone: "",
      selectedDate: "",
      backEndFormattedDate: "",
    };
  },
  computed: {
    disabledDates() {
      const disabledDays = [0, 1]; // 0 = Sunday, 1 = Monday
      const today = new Date();
      const year = today.getFullYear();
      const startDate = new Date(year, 0, 1); // start from January 1st of the current year
      const endDate = new Date(year + 1, 0, 1); // end at January 1st of the next year
      const dates = [];
      for (let date = startDate; date < endDate; date.setDate(date.getDate() + 1)) {
        if (disabledDays.includes(date.getDay())) { // check if the day is disabled
          dates.push(new Date(date));
        }
      }
      return dates;
    },
    isDateNotSelected() {
      return !this.selectedDate;
    },
    formattedPhone: {
      get() {
        return this.phone;
      },
      set(value) {
        const cleaned = value.replace(/\D/g, "");
        const formatted = cleaned.replace(/^(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3");
        this.phone = formatted;
      },
    },
  },
  methods: {
    async handleSubmitForm() {
      console.log(this.selectedDate);
      const date = new Date(this.selectedDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      this.backEndFormattedDate = `${year}${month}${day}`;
      const params = {
        date: this.backEndFormattedDate,
        phone: this.phone
      }
      let apiURL = import.meta.env.VITE_ROOT_API + `/cancelSearch`;
      try {
        console.log(params);
        const response = await axios.get(apiURL, { params });
        this.queryData = response.data[0];
      } catch (error) {
        console.error(error);
      }
    },
    async cancelAppointment(appointmentId) {
      console.log(appointmentId)
      const reason = prompt('Reason for cancellation:');
      if (reason) {
        const confirmCancel = confirm('Are you sure you want to cancel this appointment?');
        if (confirmCancel) {
          const apiURL = `${import.meta.env.VITE_ROOT_API}/cancelAppointment`;
          const body = {
            cancellation_reason: reason,
            id: appointmentId
          }
          try {
            console.log(body)
            await axios.put(apiURL, body );
            this.queryData = this.queryData.filter(appointment => appointment._id !== appointmentId);
            alert('Appointment cancelled successfully!');
            this.handleSubmitForm();
          } catch (error) {
            console.error(error);
          }
        }
      }
    },
    clearSearch() {
      //Resets all the variables
      this.phone = "";
      this.selectedDate = "";
    },
    formatDate(date) {
      return moment(date).format('YYYY-MM-DD');
    },
    formatTime(time) {
      return moment(time, 'HH:mm:ss').format('h:mm A');
    }
  },
};
</script>

<style>
.cancel-button {
  background-color: #f44336; /* Red */
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cancel-button:hover {
  background-color: #d32f2f; /* Darker red */
}
</style>