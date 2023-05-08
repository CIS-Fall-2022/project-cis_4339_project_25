<template>
  <div class="container">
    <div v-if="page === 'datepicker'">
    <h2 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Select a Date:</h2>
    <VueDatePicker v-model="selectedDate" :format="'yyyy-MM-dd'" :min-date="new Date()" :enable-time-picker="false" :disabledDates="disabledDates"></VueDatePicker>
    <button @click="getAvailableHours" :disabled="isDateNotSelected">Next</button>
  </div>
    <div v-if="page === 'form'">
      <button @click="goToDatepickerPage">Back to Datepicker</button>
      <h2 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Select a Time:</h2>
      <p>Selected Date: {{frontEndFormattedDate}}</p>
      <p>Available Hours:</p>
      <select v-model="selectedHour" required>
        <option disabled v-if="availableHours.length > 0" value="">Please select an hour</option>
        <option disabled v-else value="">All hours taken please select another date</option>
        <option v-for="hour in availableHours" :key="hour" :value="hour.time">{{ hour.formattedTime }}</option>
      </select>
      <p style="padding-top: 3px; padding-bottom: 3px; color: red;" v-if="selectedHour === null">Please select an available hour</p>
      <form @submit.prevent="submitForm">
        <div>
          <label for="name">Name:</label>
          <input type="text" id="name" v-model="name" pattern="[A-Za-z ]+" title="Please enter only letters (A-Z or a-z) and spaces" required>
        </div>
        <div>
          <label for="phone">Phone Number:</label>
          <input type="tel" id="phone" v-model="formattedPhone" pattern="\d{3}-\d{3}-\d{4}" title="Please enter only numbers (0 - 9)" minlength="10" maxlength="12" required>
        </div>
        <div>
          <label for="services">Services:</label>
          <div v-for="(service, index) in servicesAndPrice" :key="index">
            <input type="checkbox" :id="`service-${index}`" :value="service.id" v-model="selectedServiceIds">
            <label :for="`service-${index}`">{{ service.service_type }} - ${{ service.price }}</label>
          </div>
          <p style="padding-top: 3px; padding-bottom: 3px; color: red;" v-if="selectedServiceIds.length === 0">Please select at least one service</p>
        </div>
        <button type="submit" :disabled="isServiceNotSelected">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { defineComponent } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import moment from 'moment';

export default defineComponent({
  mounted() {
    window.scrollTo(0, 0);
  },
  components: { VueDatePicker },
  data() {
    return {
      page: 'datepicker',
      selectedDate: null,
      availableHours: [],
      selectedHour: null,
      servicesAndPrice: [],
      selectedServiceIds: [],
      name: '',
      phone: '',
      frontEndFormattedDate: null,
      backEndFormattedDate: null,
      email: '',
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
    isServiceNotSelected() {
      if (this.selectedServiceIds.length === 0) {
        return true;
      } else if (this.selectedHour === null) {
        return true;
      } 
      else {
        return false;
      }
    },
  },
  methods: {
    goToDatepickerPage() {
      this.page = 'datepicker';
      this.selectedHour = null;
      this.selectedServiceIds = [];
    },
    async getAvailableHours() {
      console.log(this.selectedDate);
      const date = new Date(this.selectedDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      this.backEndFormattedDate = `${year}${month}${day}`;
      this.frontEndFormattedDate = this.selectedDate.toDateString();
      let apiURL = import.meta.env.VITE_ROOT_API + `/availableHour/` + this.backEndFormattedDate;
      try {
        const response = await axios.get(apiURL);
        this.availableHours = response.data;
        //this.availableHours = this.availableHours.map(hour => moment(hour, "HH:mm:ss").format("h:mm A"));
        this.availableHours = this.availableHours.map(hour => {
          const formattedHour = moment(hour, "HH:mm:ss").format("h:mm A");
          return {
            time: hour,
            formattedTime: formattedHour
          };
        });
          let apiURL2 = import.meta.env.VITE_ROOT_API + `/allServices`;
        try {
          const response = await axios.get(apiURL2);
          this.servicesAndPrice = response.data;
        } catch (error) {
          console.error(error);
        }
        this.page = 'form';
      } catch (error) {
        console.error(error);
      }
    },
    async submitForm() {

      let apiURLsingle = import.meta.env.VITE_ROOT_API + `/addAppt1Service`;
      let apiURLmulti = import.meta.env.VITE_ROOT_API + `/addApptMultiService`;
      const date = new Date(this.selectedDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
      const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
      const formattedDate = `${year}-${month}-${day} 00:00:00`;
      const requestData = {
        client_name: this.name,
        contact_phone: this.formattedPhone,
        service_id: this.selectedServiceIds,
        contact_email: this.email,
        appt_date: formattedDate,
        start_time: (this.selectedHour).replace(/:/g, ''),
      };
      console.log(requestData);
      if (requestData.service_id.length === 1) {
      axios.post(apiURLsingle, requestData)
        .then(response => {
          const successDate = this.frontEndFormattedDate;
          const successTime = moment(this.selectedHour, "HH:mm:ss").format("h:mm A");
          console.log(response.data);
          alert(this.frontEndFormattedDate, successDate);
          alert(this.selectedHour, successTime);
          this.$router.push({ name: "success", params: { date: successDate, time: successTime} });
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      axios.post(apiURLmulti, requestData)
        .then(response => {
          console.log(response.data);
          this.$router.push({ name: "success", params: { date: this.frontEndFormattedDate, time: moment(this.selectedHour, "HH:mm:ss").format("h:mm A")} });
        })
        .catch(error => {
          console.log(error);
        });
    }
    },
  },
});
//);
</script>

<style>
  /* Style for the container div */
  .container {
    display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  }

  /* Style for the form */

  /* Style for the form inputs */
  label {
    margin-bottom: 10px;
  }

  input[type="text"],
  input[type="tel"],
  select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 400px;
  }


  /* Style for the submit button */
  button[type="submit"] {
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  /* Style for the datepicker container */
  .vdp-datepicker {
    margin-bottom: 20px;
  }

  /* Style for the button to change months */
  .vdp-header .vdp-btn {
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 0 5px;
    padding: 5px;
  }

  /* Style for the selected date */
  .vdp-datepicker .vdp-selected {
    background-color: #007bff;
    color: #fff;
    border-radius: 50%;
    padding: 5px;
    margin-right: 5px;
  }

  /* Style for the available hours list */
  button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}
</style>
