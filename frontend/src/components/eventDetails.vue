<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Update Event</h1>
    </div>
    <div class="px-10 py-20">
      <form @submit.prevent="handleSubmitForm">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <h2 class="text-2xl font-bold">Event Details</h2>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Event Name</span>
              <span style="color:#ff0000">*</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="event.eventName"
              />
              <span class="text-black" v-if="v$.event.eventName.$error">
                <p
                  class="text-red-700"
                  v-for="error of v$.event.eventName.$errors"
                  :key="error.$uid"
                >{{ error.$message }}!</p>
              </span>
            </label>
          </div>

          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Date</span>
              <span style="color:#ff0000">*</span>
              <input
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="event.eventDate"
                type="date"
              />
              <span class="text-black" v-if="v$.event.eventDate.$error">
                <p
                  class="text-red-700"
                  v-for="error of v$.event.eventDate.$errors"
                  :key="error.$uid"
                >{{ error.$message }}!</p>
              </span>
            </label>
          </div>

          <div></div>
          <div></div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Description</span>
              <textarea
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="event.eventInfo"
                rows="2"
              ></textarea>
            </label>
          </div>

          <div></div>
          <div></div>
          <div></div>
          <!-- form field -->
          
        </div>

        <!-- grid container -->
        <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <h2 class="text-2xl font-bold">Address</h2>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Address Line 1</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder
                v-model="event.eventAddress.line1"
              />
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Address Line 2</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder
                v-model="event.eventAddress.line2"
              />
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">City</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder
                v-model="event.eventAddress.city"
              />
            </label>
          </div>
          <div></div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">County</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder
                v-model="event.eventAddress.county"
              />
            </label>
          </div>
          <!-- form field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Zip Code</span>
              <input
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder
                v-model="event.eventAddress.zip"
              />
            </label>
          </div>
        </div>

        <!-- grid container -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <div class="flex justify-between mt-10 mr-20">
            <button
              @click="handleEventUpdate"
              type="submit"
              class="bg-red-700 text-white rounded"
            >Update Event</button>
          </div>
          <div class="flex justify-between mt-10 mr-20">
            <button
              type="reset"
              class="border border-red-700 bg-white text-red-700 rounded"
              @click="$router.go(-1)"
            >Go back</button>
          </div>
        </div>

        <hr class="mt-10 mb-10" />

        <!-- grid container -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <div>
            <h2 class="text-2xl font-bold">List of Attendees</h2>
            <h3 class="italic">Click table row to edit/display an entry</h3>
          </div>
          <div class="flex flex-col col-span-2">
            <table class="min-w-full shadow-md rounded">
              <thead class="bg-gray-50 text-xl">
                <tr>
                  <th class="p-4 text-left">Name</th>
                  <th class="p-4 text-left">City</th>
                  <th class="p-4 text-left">Phone Number</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-300">
                <tr
                  @click="editClient(client._id)"
                  v-for="client in userData"
                  :key="client._id"
                >
                  <td
                    class="p-2 text-left"
                  >{{ client.firstName + " " + client.lastName }}</td> 
                  <td class="p-2 text-left">{{ client.city }}</td>
                  <td class="p-2 text-left">{{ client.phoneNumber }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </div>
  </main>
</template>
<script>
import useVuelidate from "@vuelidate/core";
import { required, email, alpha, numeric } from "@vuelidate/validators";
import axios from "axios";
import { DateTime } from "luxon";

export default {
  props: ["id"],
  setup() {
    return { v$: useVuelidate({ $autoDirty: true }) };
  },
  data() {
    return {
      // userIDs: [],
      queryData:[],
      userData: [{
        _id:"",
        firstName:"",
        lastName:"",
          phoneNumber:"",
          city:"",
      }],
      event: {
        eventName: "",
        eventDate: "",
        eventInfo: "",
        eventAddress: {
          line1: "",
          line2: "",
          city: "",
          county: "", 
          zip: "",
        },
        eventAttendees:[
        ]
      }
    };
  },
  beforeMount() {
    axios
      .get(
        import.meta.env.VITE_ROOT_API + `/eventData/id/${this.$route.params.id}`
      )
      .then((resp) => {
        let data = resp.data[0];
        this.event.eventName = data.eventName;
        console.log(data.date);
        this.event.eventDate = DateTime.fromISO(data.date).plus({ days: 1 }).toISODate();
        this.event.eventInfo = data.eventInfo;
        this.event.eventAddress = data.eventAddress;
        this.event.eventAttendees = data.eventAttendees;
        // this.event.user_id = data.eventAttendees.user_id;
        for (let i = 0; i < this.event.eventAttendees.length; i++) { 
          axios
            .get(
              import.meta.env.VITE_ROOT_API +
                `/userData/id/${this.event.eventAttendees[i].userid}`
            )
            .then((resp) => {
              let data = resp.data[0];
              console.log(data)
              this.userData.push({
                _id: this.event.eventAttendees[i].userid,   ///[I]. OR .[]
                firstName: data.firstName,
                lastName: data.lastName,
                city: data.userContact.address.city,
                phoneNumber: data.userContact.phoneNumber[0],
              });
            });
        }
      });
  },
  methods: {
    formattedDate(datetimeDB) {
      return DateTime.fromISO(datetimeDB).plus({ days: 1 }).toLocaleString();
    },
    handleEventUpdate() {
      this.event.services = this.checkedServices;
      let apiURL = import.meta.env.VITE_ROOT_API + `/eventdata/${this.id}`;
      axios.put(apiURL, this.event).then(() => {
        alert("Update has been saved.");
        this.$router.back().catch((error) => {
          console.log(error);
        });
      });
    },
    editClient(clientID) {
      this.$router.push({ name: "updateclient", params: { id: clientID } });
    },
  },
  // sets validations for the various data properties
  validations() {
    return {
      event: {
        eventName: { required },
        eventDate: { required },
      },
    };
  },
};
</script>