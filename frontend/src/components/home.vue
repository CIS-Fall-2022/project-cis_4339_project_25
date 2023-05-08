<template>
    <div>
        <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Welcome to the Home Page</h1>
        <p>{{ isLoggedIn }}</p>
    </div>
    <div>
        <div id="announcement" class="announcements justify-center mt-8 text-center" style="padding-bottom: 20px;">
            <h3 class="text-blue-500">Announcements: </h3>
            <p><strong><br>{{ announcement }}</strong></p>
    </div>
        <div class="slider">
            <img v-for="(image, index) in images"
                 :key="index"
                 :src="image.url"
                 :alt="image.alt"
                 :class="{'active': index === currentIndex}">
        </div>

        <div ref="aboutMe" id="aboutMe" class="about-me flex mt-8 justify-center text-center">
            <div class="w-1/2">
                <h3 style="padding-bottom: 10px;" class="text-blue-500">About Me:</h3>
                <img class="float-left mr-8 mb-8" src="src/assets/TVuong.png" alt="Profile picture">
                <p>
                    My name is Thuan Vuong, and I'm a professional barber based in Houston, TX. I've been cutting hair for six years, and I'm passionate about helping my clients look and feel their best.<br>
                    If you're looking for a new barber, I'd love to work with you. You can reach me by phone at (832) 462-3271 or email at thuanvuong111@yahoo.com. You can also follow me on Instagram at @thuan_thebarber to see my latest work and stay up-to-date on my availability.<br>
                    In the future, I hope to open my own barbershop and continue to grow my business. If you have any suggestions for a good name, I'd love to hear them!<br>
                    My hours are Tuesday to Friday from 11am to 7pm and Saturday from 10am to 4pm. I'm closed on Sundays and Mondays. Thank you for considering me as your barber!
                </p>
            </div>
        </div>

        <div id="hoursOperation" class="hoursOperation mt-8 justify-center text-center">
            <h3 style="padding-bottom: 10px;" class="text-blue-500">Hours of Operation:</h3>
            <table class="w-1/2 mx-auto justify-center text-center mb-8">
                <tbody>
                    <tr v-for="(allday, index) in hoursOperation" :key="index">
                        <td class="border px-4 py-2">{{ allday.day }}</td>
                        <td class="border px-4 py-2">{{ allday.hour }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div id="contactMe" class="contactMe mt-8 justify-center text-center">
            <h3 style="padding-bottom: 10px;" class="text-blue-500">Contact Me:</h3>
            <table class="w-1/2 mx-auto justify-center text-center">
                <tbody>
                    <tr v-for="(full, index) in contact" :key="index">
                        <td class="border px-4 py-2">{{ full.name }}</td>
                        <td class="border px-4 py-2">{{ full.info }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div id="services" class="services mt-8 justify-center text-center">
            <h3 class="text-blue-500">Services:</h3>
            <table class="w-1/2 mx-auto justify-center text-center">
                <thead>
                    <tr>
                        <th class="px-4 py-2">Service Type</th>
                        <th class="px-4 py-2">Price</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(service, index) in services" :key="index">
                        <td class="border px-4 py-2">{{ service.service_type }}</td>
                        <td class="border px-4 py-2">${{ service.price }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div><br /></div>
    </div>
    <button class="fixed bottom-4 right-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full" @click="scrollToTop">
        Top
    </button>
    <div class="floating-menu">
        <ul>
            <li>
                <a @click="scrollToSection('announcement')">Announcement</a>
            </li>
            <li>
                <a @click="scrollToSection('aboutMe')">About Me</a>
            </li>
            <li>
                <a @click="scrollToSection('hoursOperation')">Hours</a>
            </li>
            <li>
                <a @click="scrollToSection('contactMe')">Contact Me</a>
            </li>
            <li>
                <a @click="scrollToSection('services')">Services</a>
            </li>
        </ul>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import axios from "axios";

export default {
  name: "App",
  data() {
    return {
      images: [
        { url: 'src/assets/home-img1.jpg', alt: 'Image 1' },
        { url: 'src/assets/home-img2.jpg', alt: 'Image 2' },
        { url: 'src/assets/home-img3.jpg', alt: 'Image 3' },
      ],
      services: [],
      hoursOperation: [
      {day: "Monday", hour: "CLOSED"},
      {day: "Tuesday", hour: "11AM - 7PM"},
      {day: "Wednesday", hour: "11AM - 7PM"},
      {day: "Thursday", hour: "11AM - 7PM"},
      {day: "Friday", hour: "11AM - 7PM"},
      {day: "Saturday", hour: "11AM - 7PM"},
      {day: "Sunday", hour: "CLOSED"},
    ],
      currentIndex: 0,
      announcement: '',
      contact: [
      {name: "Phone", info: "(322) 444-3333"},
      {name: "Email", info: "email@email.com"},
      {name: "Address", info: "123 my street, usa town"},
      ],
    }
  },
  computed: {
    ...mapState({
      isLoggedIn: state => state.isLoggedIn
    })
  },
  mounted() {
    axios.get(import.meta.env.VITE_ROOT_API + `/getAnnouncement`)
      .then((resp) => {
        let data = resp.data[0];
        this.announcement = data.text_char;
      });
    axios.get(import.meta.env.VITE_ROOT_API + `/allServices`)
      .then((resp) => {
        this.services = resp.data;
        console.log(this.services)
      });
    //below for slider is working
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 5000);
    // Make an API call to fetch the announcement, phone, email, and address
    // Update the component data with the fetched values
  },
  methods: {
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    },
  scrollToSection(sectionId) {
    console.log(sectionId);
      const section = document.querySelector(`#${sectionId}`);
      section.scrollIntoView({ behavior: 'smooth' });
  },
  },
};
</script>

<style>
.slider {
  width: 50%;
  height: 500px;
  position: relative;
  margin: 0 auto;
}

.slider img {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}

.slider img.active {
  opacity: 1;
}

td {
  white-space: nowrap;
}

.floating-menu {
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
}

.floating-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.floating-menu li {
  margin-bottom: 10px;
}

.floating-menu a {
  display: block;
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: #333;
  font-weight: bold;
  transition: all 0.2s ease-in-out;
}

.floating-menu a:hover {
  background-color: #f5f5f5;
}


</style>