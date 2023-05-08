<template>
  <main class="flex flex-row">
    <div id="_container" class="h-screen">
      <header class="w-full">
        <router-link to="/">
          <section class="text-center">
            <img style="width: 100px; height: 100px;" class="m-auto" src="@/assets/thuanlogo-removebg-preview.png" />
          </section>
        </router-link>
        <nav class="mt-10">
            <ul class="flex flex-col gap-4">
                <li>
                    <router-link to="/">
                        <span style="position: relative; top: 6px" class="material-icons">dashboard</span>
                        Home
                    </router-link>
                </li>
                <li>
                    <router-link to="/setAppointment">
                        <span style="position: relative; top: 6px" class="material-icons">edit_calendar</span>
                        Set Appointment
                    </router-link>
                </li>
                <!--
    <li>
      <a @click="scrollToaboutMe">
        <span style="position: relative; top: 6px" class="material-icons">badge</span>
        About Me
      </a>
    </li>
    <li>
      <a @click="scrollTohoursOperation">
        <span style="position: relative; top: 6px" class="material-icons">date_range</span>
        Hours
      </a>
    </li>
    <li>
      <a @click="scrollTocontactMe">
        <span style="position: relative; top: 6px" class="material-icons">contact_page</span>
        Contact Me
      </a>
    </li>
    <li>
      <a @click="scrollToservices">
        <span style="position: relative; top: 6px" class="material-icons">search</span>
        Services
      </a>
    </li>
    <li>
      <a @click="scrollTopayment">
        <span style="position: relative; top: 6px" class="material-icons">shopping_cart</span>
        Payment
      </a>
    </li>
    -->
                <li>
                    <router-link to="/cancelAppointment">
                        <span style="position: relative; top: 6px" class="material-icons">free_cancellation</span>
                        Cancel Appointment
                    </router-link>
                </li>
                <li>
                    <a href="https://account.venmo.com/u/Thuan-Vuong" target="_blank">
                        <span style="position: relative; top: 6px" class="material-icons">paid</span>
                        Make a Payment
                    </a>
                </li>
                <li v-if="isLoggedIn">
                    <router-link to="/schedule">
                        <span style="position: relative; top: 6px" class="material-icons">event</span>
                        Schedule
                    </router-link>
                </li>
                <li v-if="isLoggedIn">
                    <router-link to="/reports">
                        <span style="position: relative; top: 6px" class="material-icons">search</span>
                        Reports
                    </router-link>
                </li>
                <li v-if="isLoggedIn">
                    <router-link to="/changeAnnouncement">
                        <span style="position: relative; top: 6px" class="material-icons">settings</span>
                        Announcement
                    </router-link>
                </li>
            </ul>
        </nav>
      </header>
    </div>
    <div class="grow w-4/5">
      <section
        class="justify-end items-center h-24 flex"
        style="background: linear-gradient(250deg, #C8102E 70%, #efecec 50.6%);"
      > 
      <h1 class="mr-20 text-3xl text-white">Thuan's Barber Shop</h1>
      <ul style="padding-right: 10px;">
        <li v-if="isLoggedIn">
          <router-link to="/">
              <span @click="logout" style="position: relative; top: 6px">Logout</span>
          </router-link>
        </li>
        <li v-else>
          <router-link to="/login">
            <span style="position: relative; top: 6px" class="material-icons">login</span>
          </router-link>
        </li>
      </ul>
      </section>
      <div>
        <router-view></router-view>
      </div>
    </div>
  </main>
  <footer class="bg-gray-800 text-white text-center py-4">
      <p>&copy; 2023 Thuan's Barber Shop | Powered by Vue</p>
  </footer>
</template>

<script>

import { mapState } from 'vuex'
import store from '@/store';

export default {
  name: "App",
  computed: {
    ...mapState({
      isLoggedIn: state => state.isLoggedIn
    })
  },
  mounted() {
  const scrollTo = this.$route.query.scrollTo;
  if (scrollTo) {
    const element = document.getElementById(scrollTo);
    element.scrollIntoView({ behavior: 'smooth' });
  }
},
  methods: {
    logout() {
      store.commit('SET_LOGGED_IN', false);
      this.SET_LOGGED_IN(false)
      // Redirect to login page
      this.$router.push('/');
    },
    /*
    scrollToaboutMe() {
      const aboutMe = document.querySelector('#aboutMe');
      aboutMe.scrollIntoView({ behavior: 'smooth' });
    },
    scrollTohoursOperation() {
      const hoursOperation = document.querySelector('#hoursOperation');
      hoursOperation.scrollIntoView({ behavior: 'smooth' });
    },
    scrollTocontactMe() {
      const contactMe = document.querySelector('#contactMe');
      contactMe.scrollIntoView({ behavior: 'smooth' });
    },
    scrollToservices() {
      const services = document.querySelector('#services');
      services.scrollIntoView({ behavior: 'smooth' });
    },
    scrollTopayment() {
      const payment = document.querySelector('#payment');
      payment.scrollIntoView({ behavior: 'smooth' });
    },
    */
  },
};
</script>

<style>
   #_container {
        background-color: #c8102e;
        color: white;
        padding: 20px;
        height: auto;
        min-height: 100vh;
    }
    a:hover {
      cursor: pointer;
    }
</style>
