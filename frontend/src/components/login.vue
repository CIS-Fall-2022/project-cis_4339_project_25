<template>
  <main>
    <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="username" id="username" v-model="username" required>
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit">Login</button>
      <div v-if="showWarning" style="color: red;">
      Incorrect username or password.
      </div>
    </form>
  </div>
  </main>
</template>
<script>
import axios from 'axios';
import store from '@/store';

export default {
  data() {
    return {
      username: '',
      password: '',
      showWarning: false,
    };
  },
  methods: {
    login() {
      let apiURL = import.meta.env.VITE_ROOT_API + `/login/`;
      axios.post(apiURL, {
        username: this.username,
        password: this.password,
      })
      .then(response => {
        // Save the session token to local storage
        //localStorage.setItem('sessionToken', response.data.sessionToken);
        store.commit('SET_LOGGED_IN', true);
        // Redirect to the dashboard page
        this.$router.push('/');
      })
      .catch(error => {
        console.error(error);
        this.showWarning = true;
      });
    },
  },
};
</script>

<style>
.login-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="username"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
  
button[type="submit"] {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

button[type="submit"]:hover {
  background-color: #3e8e41;
}
</style>
