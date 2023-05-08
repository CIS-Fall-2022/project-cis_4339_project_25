<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Change Announcement</h1>
    </div>
    <div class="container mt-8 justify-center text-center">
      <label for="report-type">Please enter your new announcement:</label>
      <div class="flex flex-col">
          <label class="block">
            <input class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
             type="text" id="text" v-model="newAnnouncement" placeholder="Enter text here" required
             />
          </label>
        </div>
      <br>
      <button @click="changeAnnouncement">Run</button>
      <p> {{ result }}</p>
    </div>
  </main>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
    newAnnouncement: "",
    result: ""
    };
  },
    methods: {
      async changeAnnouncement() {
        const body = {
          newAnnouncement: this.newAnnouncement
        }
        let apiURL = import.meta.env.VITE_ROOT_API + `/changeAnnouncement`;
        const response = await axios.post(apiURL, body);
        response.data;
        this.result = "Please check the Home page for changes."
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
