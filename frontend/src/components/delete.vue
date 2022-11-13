<template>
    <main>
      <div>
        <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Delete User/Event</h1>
      </div>
      <div class="px-10 pt-20">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <h2 class="text-2xl font-bold">Delete by</h2>
          <!-- Displays Client Name search field -->
          <div class="flex flex-col">
            <select
              class="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-model="searchBy"
            >
              <option value="Client _id">Client _id</option>
              <option value="Event _id">Event _id</option>
            </select>
          </div>
          <div class="flex flex-col" v-if="searchBy === 'Client _id'">
            <label class="block">
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="Userid"
                v-on:keyup.enter="handleSubmitForm"
                placeholder="Enter User _id"
              />
            </label>
          </div>
          <div class="flex flex-col" v-if="searchBy === 'Event _id'">
            <label class="block">
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="Eventid"
                v-on:keyup.enter="handleSubmitForm"
                placeholder="Enter Event _id"
              />
            </label>
          </div>
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
              @click="handleSubmitForm"
              type="submit"
            >Delete User/Event</button>
          </div>
        </div>
      </div>
  
      <hr class="mt-10 mb-10" />
      <!-- Display Found Data -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        <div class="ml-10">
          <h2 class="text-2xl font-bold">List of Users</h2>
        </div>
        <div class="flex flex-col col-span-2">
          <table class="min-w-full shadow-md rounded">
            <thead class="bg-gray-50 text-xl">
              <tr>
                <th class="p-4 text-left">_id</th>
                <th class="p-4 text-left">Name</th>
                <th class="p-4 text-left">Phone number</th>
                <th class="p-4 text-left">City</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-300">
              <tr v-for="client in queryData" :key="client._id">
                <td class="p-2 text-left">{{ client._id}}</td>
                <td class="p-2 text-left">{{ client.firstName + " " + client.lastName }}</td>
                <td class="p-2 text-left">{{ client.userContact.phoneNumber[0] }}</td>
                <td class="p-2 text-left">{{ client.userContact.address.city }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        <div class="ml-10">
          <h2 class="text-2xl font-bold">List of Events</h2>
        </div>
        <div class="flex flex-col col-span-2">
          <table class="min-w-full shadow-md rounded">
            <thead class="bg-gray-50 text-xl">
              <tr>
                <th class="p-4 text-left">_id</th>
                <th class="p-4 text-left">Event Name</th>
                <th class="p-4 text-left">Event Date</th>
                <th class="p-4 text-left">Event Info</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-300">
              <tr v-for="event in queryData2" :key="event._id">
                <td class="p-2 text-left">{{ event._id}}</td>
                <td class="p-2 text-left">{{ event.eventName}}</td>
                <td class="p-2 text-left">{{ event.eventDate}}</td>
                <td class="p-2 text-left">{{ event.eventInfo}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </template>
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        queryData: [],
        queryData2: [],
        //Parameter for search to occur
        searchBy: "",
        Userid: "",
        Eventid: "",
      };
    },
    mounted() {
      let apiURL = import.meta.env.VITE_ROOT_API + `/userData/`;
      axios.get(apiURL).then((resp) => {
        this.queryData = resp.data;
        console.log(this.queryData);
      });
      let apiURL2 = import.meta.env.VITE_ROOT_API + `/eventData/`;
      axios.get(apiURL2).then((resp) => {
        this.queryData2 = resp.data;
      });
      window.scrollTo(0, 0);
    },
    methods: {
      handleSubmitForm() {
        
        let apiURL = "";
        if (this.searchBy === "Client _id") {
            var count = 0;
            var count2 = 0;
            for (let i = 0; i < this.queryData.length; i++) { 
                if (this.queryData[i]._id == this.Userid)
                count = 1;
            }
            if (count == 1){
                apiURL = import.meta.env.VITE_ROOT_API + `/userData/${this.Userid}`;
            } else {
                alert("Please enter a matching User _id")
                return;
            }
        } else if (this.searchBy === "Event _id") {
            for (let i = 0; i < this.queryData2.length; i++) { 
                if (this.queryData2[i]._id == this.Eventid)
                count2 = 1;
            }
            if (count2 == 1){
                apiURL = import.meta.env.VITE_ROOT_API + `/eventData/${this.Eventid}`;
            } else {
                alert("Please enter a matching Event _id")
                return;
            }
        }
        if(confirm(`Please confirm that you would like to delete ${this.searchBy} of ${this.Userid}${this.Eventid}`))   {
            alert("Confirmed")
            axios.delete(apiURL).then((resp) => {
            this.$router.go();
            });
        }

        //axios.delete(apiURL).then((resp) => {
        //    this.$router.go();
        //});
      },
      clearSearch() {
        //Resets all the variables
        this.searchBy = "";
        this.Userid = "";
        this.Eventid = "";
  
        //get all entries
        let apiURL = import.meta.env.VITE_ROOT_API + `/userData/`;
        axios.get(apiURL).then((resp) => {
          this.queryData = resp.data;
        });
        let apiURL2 = import.meta.env.VITE_ROOT_API + `/eventData/`;
        axios.get(apiURL2).then((resp) => {
        this.queryData2 = resp.data;
      });
      },
    },
  };
  </script>