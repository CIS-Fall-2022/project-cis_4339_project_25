<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Reports</h1>
    </div>
    <div class="container mt-8 justify-center text-center">
      <label for="report-type">Select report type:</label>
      <select v-model="selectedId" @change="resetDates">
        <option v-for="item in reportTypes" :key="item.id" :value="item.id">{{ item.value }}</option>
      </select>
      <div style="padding-top: 5px; padding-bottom: 5px;" v-if="[1, 8, 9, 10].includes(selectedId)">
        <VueDatePicker v-model="selectedDate" :format="'yyyy-MM-dd'" :enable-time-picker="false"></VueDatePicker>
      </div>
      <div v-if="[2, 6].includes(selectedId)">
        <label for="start-date">Start date:</label>
        <VueDatePicker v-model="startDate" :format="'yyyy-MM-dd'" :enable-time-picker="false"></VueDatePicker>
        <br>
        <label for="end-date">End date:</label>
        <VueDatePicker v-model="endDate" :format="'yyyy-MM-dd'" :enable-time-picker="false"></VueDatePicker>
      </div>
      <br>
      <button @click="runReport">Run</button>
    </div>
    <div v-if="reportRun" id="services" class="services mt-8 justify-center text-center">
      <h1 class="font-bold text-xl text-red-700 tracking-widest text-center mt-10">{{reportTitle}}</h1>
      <ReportTable :data="reportData" />
    </div>
  </main>
</template>
<script>
import axios from "axios";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import ReportTable from '@/components/reportTable.vue';

export default {
  components: { VueDatePicker, ReportTable},
  data() {
    return {
      reportData: [],
      reportRun: false,
      selectedId: '',
      reportTypes: [
      { id: 0, value: 'Customer Information Report' },
      { id: 1, value: 'Daily Appointment Report' },
      { id: 2, value: 'Appointment Report Between 2 Dates' },
      { id: 3, value: 'Canceled Appointment Report' },
      { id: 4, value: 'Traffic by Day Report' },
      { id: 5, value: 'Returning Customer Report' },
      { id: 6, value: 'Returning Customer Report Between 2 dates' },
      { id: 7, value: 'Serviced-Based Report' },
      { id: 8, value: 'Earnings per week Report' },
      { id: 9, value: 'Earnings per month report' },
      { id: 10, value: 'Earnings per year report' },
      { id: 11, value: 'Earning report (for all data)' },
      { id: 12, value: 'Earnings per customer lifetime Report' },
      { id: 13, value: 'Most and least common service lifetime Report' },
      { id: 14, value: 'Most and least profitable service lifetime Report' },
      { id: 15, value: 'Busiest day of the week Report' },
      { id: 16, value: 'Customers that most cancel appointments Report' }
    ],
    selectedDate: '',
    startDate: '',
    endDate: '',
    reportTitle: '',
    };
  },
    methods: {
      async runReport() {
        if (this.selectedId === 1 || this.selectedId === 8 || this.selectedId === 9 || this.selectedId === 10) {
        // Make API call for reports that require only one date
            console.log(this.selectedDate)
        //const currdate = this.selectedDate
         //const formattedDate = this.selectedDate.toISOString().substring(0, 10);
            const year = this.selectedDate.getFullYear();
            const month = this.selectedDate.getMonth() + 1;
            const day = this.selectedDate.getDate();
         const formattedDate = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
       // const formattedDate = currdate.toLocaleDateString("en-US", { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '');
        console.log(formattedDate)
        let apiURL = import.meta.env.VITE_ROOT_API + `/getReport/?id=` + this.selectedId + `&date=` + formattedDate;
        const response = await axios.get(apiURL);
        

        this.reportData = response.data;

        console.log(this.reportData)
        
        for (let i = 0; i < this.reportData.length; i++) {
          if (Object.prototype.hasOwnProperty.call(this.reportData[i], 'Earnings')) {
            this.reportData[i].Earnings = `$${this.reportData[i].Earnings}`;
          }
          if (Object.prototype.hasOwnProperty.call(this.reportData[i], 'Appointment Date')) {
            const dateStr = this.reportData[i]['Appointment Date'];
            const date = new Date(dateStr);
            const formattedDate = date.toISOString().slice(0,10);
            this.reportData[i]['Appointment Date'] = formattedDate;
          }
          if (Object.prototype.hasOwnProperty.call(this.reportData[i], 'Time')) {
          const Time = this.reportData[i].Time.toString();
          const hours = Time.slice(0, 2);
          const minutes = Time.slice(2, 4);
          const period = hours >= 12 ? 'PM' : 'AM';
          const formattedHours = hours % 12 || 12;
          this.reportData[i].Time = `${formattedHours}:${minutes} ${period}`;
        }
        }

        if (this.reportData.length === 0) {
            this.reportData = [{"Empty": "No Data"}]
        }

        console.log(this.reportData)
        this.reportTitle = this.reportTypes.find(item => item.id === this.selectedId)?.value;
        this.reportRun = true;

        //this.availableHours = this.availableHours.map(hour => moment(hour, "HH:mm:ss").format("h:mm A"));
      } else if (this.selectedId === 2 || this.selectedId === 6) {
        // Make API call for reports that require two dates
        const formattedStartDate = this.startDate.toISOString().substring(0, 10).replace(/-/g, '');
        const formattedEndDate = this.endDate.toISOString().substring(0, 10).replace(/-/g, '');
        let apiURL = import.meta.env.VITE_ROOT_API + `/getReport/?id=` + this.selectedId + `&date=` + formattedStartDate + '-' + formattedEndDate;
        const response = await axios.get(apiURL);
        this.reportData = response.data;

        for (let i = 0; i < this.reportData.length; i++) {
          if (Object.prototype.hasOwnProperty.call(this.reportData[i], 'Earnings')) {
            this.reportData[i].Earnings = `$${this.reportData[i].Earnings}`;
          }
          if (Object.prototype.hasOwnProperty.call(this.reportData[i], 'Appointment Date')) {
            const dateStr = this.reportData[i]['Appointment Date'];
            const date = new Date(dateStr);
            const formattedDate = date.toISOString().slice(0,10);
            this.reportData[i]['Appointment Date'] = formattedDate;
          }
          if (Object.prototype.hasOwnProperty.call(this.reportData[i], 'Time')) {
          const Time = this.reportData[i].Time.toString();
          const hours = Time.slice(0, 2);
          const minutes = Time.slice(2, 4);
          const period = hours >= 12 ? 'PM' : 'AM';
          const formattedHours = hours % 12 || 12;
          this.reportData[i].Time = `${formattedHours}:${minutes} ${period}`;
        }
        }

        if (this.reportData.length === 0) {
            this.reportData = [{"Empty": "No Data"}]
        }


        console.log(this.reportData)
        this.reportTitle = this.reportTypes.find(item => item.id === this.selectedId)?.value;
        this.reportRun = true;
      } else {
        let apiURL = import.meta.env.VITE_ROOT_API + `/getReport/?id=` + this.selectedId;
        const response = await axios.get(apiURL);
        
        this.reportData = response.data;
        console.log(this.reportData)

        for (let i = 0; i < this.reportData.length; i++) {
          if (Object.prototype.hasOwnProperty.call(this.reportData[i], 'Earnings')) {
            this.reportData[i].Earnings = `$${this.reportData[i].Earnings}`;
          }
          if (Object.prototype.hasOwnProperty.call(this.reportData[i], 'Appointment Date')) {
            const dateStr = this.reportData[i]['Appointment Date'];
            const date = new Date(dateStr);
            const formattedDate = date.toISOString().slice(0,10);
            this.reportData[i]['Appointment Date'] = formattedDate;
          }
          if (Object.prototype.hasOwnProperty.call(this.reportData[i], 'Time')) {
          const Time = this.reportData[i].Time.toString();
          const hours = Time.slice(0, 2);
          const minutes = Time.slice(2, 4);
          const period = hours >= 12 ? 'PM' : 'AM';
          const formattedHours = hours % 12 || 12;
          this.reportData[i].Time = `${formattedHours}:${minutes} ${period}`;
        }
        }

        if (this.reportData.length === 0) {
            this.reportData = [{"Empty": "No Data"}]
        }
      
        this.reportTitle = this.reportTypes.find(item => item.id === this.selectedId)?.value;
        this.reportRun = true;
        // Invalid ID, do nothing or show an error message
      }

    },
    resetDates() {
      this.selectedDate = '';
      this.startDate = '';
      this.endDate = '';
    },
  },
};
</script>

<style>
  button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}


  /* Style for the datepicker container */
  .vdp-datepicker {
    max-width: 200px;
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

  .container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  }
</style>
