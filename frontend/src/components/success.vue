<template>
  <div class="success-container">
    <div class="success-message">
      <h1>Appointment Scheduled!</h1>
      <p>Your appointment has been scheduled for the following date and time:</p>
      <p class="appointment-info">{{ appointmentDate }} at {{ appointmentTime }}</p>
    </div>
    <button @click="$router.push('/')">Go Back Home</button>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  created() {
    console.log(this.$route.params.date);
    console.log(this.$route.params.time);

  this.appointmentDate = this.$route.params.date;
  //this.appointmentTime = this.$route.params.time;
  this.appointmentTime = moment(this.$route.params.time, "HHmmss").format("h:mm A")
  },
  data() {
    return {
      appointmentDate: null,
      appointmentTime: null
    }
  }
};
</script>

<style>
.success-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 50px;
  text-align: center;
}

.success-message {
  font-size: 2rem;
  color: green;
  margin-bottom: 20px;
}

.success-date-time {
  font-size: 1.5rem;
  margin-bottom: 50px;
}

.success-button {
  background-color: blue;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1.2rem;
  cursor: pointer;
}

.success-button:hover {
  background-color: darkblue;
}
</style>