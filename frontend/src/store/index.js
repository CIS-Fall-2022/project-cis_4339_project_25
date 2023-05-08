import { createStore } from 'vuex';

const store = createStore({
  state: {
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true'
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.isLoggedIn = value;
      localStorage.setItem('isLoggedIn', value);
    }
  }
});

export default store;
