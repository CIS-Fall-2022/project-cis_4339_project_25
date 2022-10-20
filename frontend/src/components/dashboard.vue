<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Welcome to {{organizationinfo[0].organizationName}}'s Main Page</h1>
    </div>
  </main>
</template>
<script>
import axios from "axios";
export default {
  data () {
    return {
      organizationinfo: [],
    };
  },
  mounted() {
    let apiURL = import.meta.env.VITE_ROOT_API + `/organizationData/currentorg`;
    axios.get(apiURL).then((resp) => {
    this.organizationinfo = resp.data;
    });
  },
  methods: {
    routePush(routeName) {
      this.$router.push({ name: routeName });
    },
  },
};
</script>
